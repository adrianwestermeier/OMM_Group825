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
            user: this.props.user
        };
    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    /*
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
                <p className={'switch'}>Grid Overview</p>
                <FormControlLabel className={'switch'}
                    control={<Switch checked={this.state.isSingleView} onChange={toggleChecked} />}
                    label="Single View"
                />
                <SwitchView
                    isSingleView={this.state.isSingleView}
                    memes={this.state.memes}
                    getMemes={() => {this.getMemesFromDb()}}
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