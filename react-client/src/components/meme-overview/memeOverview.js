import React from 'react';
import {IoIosThumbsUp, IoIosThumbsDown} from 'react-icons/io';

import './memeOverview.css';
import Meme from "../Meme/meme";

class OverviewElem extends React.Component {

    vote(meme, isUpvote) {
        let upVotes = meme.upVotes
        let downVotes = meme.downVotes

        if (isUpvote) {
            console.log('upVote')
            upVotes = upVotes + 1
        } else if (!isUpvote) {
            console.log('downVote')
            downVotes = downVotes + 1
        } else {
            console.log('Fehler: weder up noch downvote')
        }

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
        const id = meme.id
        const url = meme.url
        const topCaption = meme.top_caption
        const bottomCaption = meme.bottom_caption
        const upVotes = meme.upVotes
        const downVotes = meme.downVotes


        return (
            <div>
                <Meme
                    key={id}
                    url={url}
                    topText={topCaption}
                    bottomText={bottomCaption}
                />
                <button onClick={() => this.vote(meme, true)}><IoIosThumbsUp/></button>
                <button onClick={() => this.vote(meme, false)}><IoIosThumbsDown/></button>
                <p><IoIosThumbsUp/>: {upVotes}</p>
                <p><IoIosThumbsDown/>: {downVotes}</p>
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
                key={id}
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
        console.log('nächstes Bild')
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
                key={id}
                meme={memes[i]}
                getMemes={() => {this.getMemesFromDb()}}
                testPrint={() => {this.testPrint()}}
            />)


        }






        return(
            <div>
                <h1>Die coolste Single View aller Zeiten</h1>
                <div>
                    <button onClick={() => this.previous()}>previous</button>
                    {items[this.state.i]}
                    <button onClick={() => this.next()}>next</button>
                </div>
            </div>
        )
    }
}

class MemeOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memes: []
        };
    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    getMemesFromDb() {

        fetch('/generatedMemes/getMemes')
            .then(res => {
                return res.json()
            })
            .then(memes => {

                this.setState({
                    memes: memes.memes,  // meme array is wrapped in meme json
                })

            });
    }

    render(){
        return(
            <div>
                <Grid
                    memes={this.state.memes}
                    getMemes={() => {this.getMemesFromDb()}}
                />
                <SingleView
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
            <div>
                <MemeOverview/>
            </div>
        );
    }
}