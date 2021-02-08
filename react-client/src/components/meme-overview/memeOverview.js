import React from 'react';
import axios from 'axios';
import arrowBack from '../img/arrow_back-black-18dp.svg';
import arrowForward from '../img/arrow_forward-black-18dp.svg';
import {IoIosThumbsUp, IoIosThumbsDown} from 'react-icons/io';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './memeOverview.css';
import Meme from "../Meme/meme";

class OverviewElem extends React.Component {

    vote(meme, isUpvote) {
        let upVotes = meme.upVotes
        let downVotes = meme.downVotes

        if (isUpvote) {
            upVotes = upVotes + 1
        } else if (!isUpvote) {
            downVotes = downVotes + 1
        } else {
            console.log('Fehler: weder up noch downvote')
        }

        // TODO: change this to new meme
        const payload = {
            id: meme._id,
            name: meme.name,
            url: meme.url,
            width: meme.width,
            height: meme.height,
            top_caption: meme.top_caption,
            middle_caption: null,
            bottom_caption: meme.bottom_caption,
            upVotes: upVotes,
            downVotes: downVotes
        };

        fetch(`/generatedMemes/updateMeme`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            })
            .then(() => {
                this.getMemesFromDb()
            })


    }

    getMemesFromDb = () => {
        this.props.getMemes();
    }


    render() {

        const meme = this.props.meme
        const upVotes = meme.upVotes
        const downVotes = meme.downVotes

        return (
            <div className="overview-element">
                <div className="meme-wrapper">
                    <Meme
                        name={meme.name}
                        url={meme.url}
                        title={meme.title}
                    />
                </div>
                <div className="vote-buttons">
                    <button onClick={() => this.vote(meme, true)}><IoIosThumbsUp/></button>
                    <button onClick={() => this.vote(meme, false)}><IoIosThumbsDown/></button>
                    <p><IoIosThumbsUp/>: {upVotes}</p>
                    <p><IoIosThumbsDown/>: {downVotes}</p>
                </div>
            </div>
        )
    }
}

class Grid extends React.Component{

    getMemesFromDb = () => {
        this.props.getMemes();
    }

    render() {
        const items = [];
        let memes = this.props.memes
        for (let i = 0; i < memes.length; i++) {
            let id = memes[i]._id

            items.push(<OverviewElem
                className="gridItem"
                meme={memes[i]}
                getMemes={() => {this.getMemesFromDb()}}
                testPrint={() => {this.testPrint()}}
            />)
        }

        return (
            <div>
                <div className="MemeOverview">
                    {items}
                </div>
            </div>
        )
    }
}

class SingleView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            i: 0
        };
    }

    getMemesFromDb = () => {
        this.props.getMemes();
    }

    previous(){
        let memes = this.props.memes
        let i = this.state.i
        if(i > 0){
            i = i-1
        } else {
            i = memes.length-1
        }

        this.setState({
            i: i
        })

    }

    next(){
        let memes = this.props.memes
        let i = this.state.i
        if( i < memes.length-1){
            i = i+1
        } else {
            i = 0
        }

        this.setState({
            i: i
        })
    }

    render(){
        const items = [];
        let memes = this.props.memes
        for (let i = 0; i < memes.length; i++) {
            let id = memes[i]._id

            items.push(<OverviewElem
                className="gridItem"
                meme={memes[i]}
                getMemes={() => {this.getMemesFromDb()}}
                testPrint={() => {this.testPrint()}}
            />)


        }

        return(
            <div>
                <div>
                    <div className="arrows" id="arrows">
                        <img src={arrowBack} className="backButton" onClick={() => this.previous()}></img>
                        <img src={arrowForward} className="nextButton" onClick={() => this.next()}></img>
                    </div>
                    {/* <button onClick={() => this.previous()}>previous</button> */}
                    {items[this.state.i]}
                    {/* <button onClick={() => this.next()}>next</button> */}
                </div>
            </div>
        )
    }
}

class SwitchView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let view;
        if (this.props.isSingleView) {
            view = <SingleView
                memes={this.props.memes}
                getMemes={() => {this.props.getMemes()}}
            />
        } else {
            view = <Grid
            memes={this.props.memes}
            getMemes={() => {this.props.getMemes()}}
            />;
        }
        return(
            <div>{view}</div>
        ) 
    }
}

class MemeOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            isSingleView: true
        };
    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    getMemesFromDb() {
        // get the memes from the express server
        fetch('/generatedMemes/getMemeData')
            .then(res => {
                console.log("[memeOverview]" + res);
                return res.json()
            })
            .then(memes => {
                console.log("[memeOverview]" + memes);
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
        const checked = true
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
                <MemeOverview/>
            </div>
        );
    }
}