import React from 'react';

import './memeOverview.css';
import Meme from "../Meme/meme";

class OverviewElem extends React.Component {

    upVote(meme) {
        console.log('UpVote')

        const payload = {
            id: meme._id,
            name: meme.name,
            url: meme.url,
            width: meme.width,
            height: meme.height,
            top_caption: meme.top_caption,
            middle_caption: null,
            bottom_caption: meme.bottom_caption,
            upVotes: meme.upVotes + 1,
            downVotes: meme.downVotes
        };

        fetch(`/generatedMemes/updateMeme`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            })
            .then(() => {
                console.log('THEN')
                this.getMemesFromDb()
            })


    }


    downVote() {
        console.log('DownVote')
        this.testPrint()
        this.getMemesFromDb()

    }

    testPrint = () => {
        this.props.testPrint();
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
                <button onClick={() => this.upVote(meme)}>UpVote</button>
                <button onClick={() => this.downVote(meme)}>DownVote</button>
                <p>Upvotes: {upVotes}</p>
                <p>Downvotes: {downVotes}</p>
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

        this.getMemesFromDb(this.state)
    }

    testPrint() {
        console.log('TestPrint');
        console.log(this.state)
    }

    getMemesFromDb(state) {
        console.log('get memes from db')

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


    render() {

        const items = [];
        let memes = this.state.memes
        for (let i = 0; i < memes.length; i++) {
            let id = memes[i]._id

            items.push(<OverviewElem className="gridItem"
                                     key={id}
                                     meme={memes[i]}
                                     getMemes={() => {
                                         this.getMemesFromDb()
                                     }}
                                     testPrint={() => {
                                         this.testPrint()
                                     }}
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