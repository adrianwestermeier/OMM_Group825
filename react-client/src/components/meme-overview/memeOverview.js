import React from 'react';
import axios from 'axios';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './memeOverview.css';
import SwitchView from "./SwitchView";


class MemeOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            isSingleView: true,
            user: this.props.user,
            filterPrivate: [],
            comments: []
        };
    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    /*
    * this function filters out all memes marked as private
    * */
    filterPrivateMemes(){
        const memes = [...this.state.memes];
        let meme = null
        let filterPrivate = []

        for(let i=0; i<memes.length; i++){

            if(!memes[i].isPrivate){
                meme = memes[i]
                filterPrivate.push(meme)
                this.setState({
                    filterPrivate: filterPrivate
                })
            }
        }
    }

    /**
     * this function creates a list of all comments from all memes and safes it in this.state.comments
     * */
    getComments(){
        let comment
        let comments = []
        const memes = [...this.state.memes];
        for(let i=0; i<memes.length; i++){
            comment = memes[i].comments
            comments = comments.concat(comment)
            this.setState({
                comments: comments
            })
        }
    }

    /**
    * this function fetches all memes from the Database every time it's called
    * */
    getMemesFromDb() {
        // get the memes from the express server
        fetch('http://localhost:3005/generatedMemes/getMemeData')
            .then(res => {

                return res.json()
            })
            .then(memes => {
                this.setState({ 
                    memes: memes.memes,
                })

                const that = this;

                // Make a shallow copy of the memes
                let memesCopy = [...this.state.memes];
                let newMemes = this.state.memes;

                memesCopy.forEach(function(part, index) {
                    // Make a shallow copy of the item to mutate, this refers to memesCopy here
                    let meme = {...this[index]};
                    
                    let url = 'http://localhost:3005/memes/' + meme.name;
                    axios.get(url, { responseType: 'arraybuffer' },
                    ).then(response => {
                        // process image data
                        const base64 = btoa(
                            new Uint8Array(response.data).reduce(
                                (data, byte) => data + String.fromCharCode(byte),
                                '',
                            ),
                        );

                        // Replace url
                        meme.url = "data:;base64," + base64;
                        // Put it back into our array
                        newMemes[index] = meme;
                        // Update state
                        that.setState({memes: newMemes});
                        that.filterPrivateMemes()     //filter memes marked as private
                        that.getComments()            //create comments list
                    });      
                }, memesCopy); // use memesCopy as this
            });
    }

    render(){
        let setChecked = this.state.isSingleView

        const toggleChecked = () => {
            setChecked = !setChecked
            this.setState({
                isSingleView: setChecked
            })
        };

        return(
            <div>
                <p className={'switch'} style={{marginRight: "20px"}}>Grid Overview</p>
                <FormControlLabel className={'switch'}
                    control={<Switch checked={this.state.isSingleView} onChange={toggleChecked} />}
                    // label="Single View"
                />
                <p style={{display: "inline-block"}}>Single View</p>
                <SwitchView
                    isSingleView={this.state.isSingleView}
                    memes={this.state.filterPrivate}
                    getMemes={() => {this.getMemesFromDb()}}
                    user={this.props.user}
                    comments={this.props.comments}
                />
            </div>
        )
    }



}

// ========================================
// overall class to handle everything
export default class Overview extends React.Component {

    render() {
        return (
            <div className="meme-overview">
                <MemeOverview
                    user={this.props.user}
                />
            </div>
        );
    }
}