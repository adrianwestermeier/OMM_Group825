import React from "react";
import Meme from "../Meme/meme";
import {IoIosThumbsDown, IoIosThumbsUp} from "react-icons/io";
import Comments from "./comments";

import "./OverviewElem.css"

export default class OverviewElem extends React.Component {

    /*
    * depending on which button was pressed this function performs an up- or downVote, that means updating the corresponding value locally
    * after that ist sends an update request to the sever to save the corresponding values on the db
    * after that it reloads all memes to get and render the new information
    * */
    vote(meme, isUpvote) {
        let upVotes = meme.upVotes
        let downVotes = meme.downVotes
        let upMinusDown = meme.upMinusDownVotes
        let user = this.props.user

        if(upVotes.includes(user) || downVotes.includes(user)){
            alert('You already voted this meme')
            return
        }
        if (isUpvote) {
            upVotes = upVotes.concat(user)
        } else if (!isUpvote) {
            downVotes = downVotes.concat(user)
        } else {
            console.log('error: neither up nor down vote')
        }

        let upDown = upVotes.length - downVotes.length

        upMinusDown = upMinusDown.concat(upDown)

        const payload = {
            id: meme._id,
            name: meme.name,
            title: meme.title,
            user: meme.user,
            template: meme.template,
            upVotes: upVotes,
            downVotes: downVotes,
            upMinusDownVotes: upMinusDown,
            comments: meme.comments

        };

        fetch(`http://localhost:3005/generatedMemes/updateMeme`,
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

    getMyVote(){

    }

    render() {





        const meme = this.props.meme
        const upVotes = meme.upVotes
        const downVotes = meme.downVotes

        let upMinusDown = meme.upMinusDownVotes
        let user = this.props.user

        let yourVote = null

        if(upVotes.includes(user)){
            yourVote = 'upVote'
        } else if(downVotes.includes(user)){
            yourVote = 'downVote'
        } else {
            yourVote = 'not voted'
        }

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
                    <p><IoIosThumbsUp/>: {upVotes.length}</p>
                    <p><IoIosThumbsDown/>: {downVotes.length}</p>
                    <p>your Vote: {yourVote}</p>
                </div>

                <Comments className="comments"
                    user={this.props.user}
                    meme={meme}
                    getMemes={() => {this.getMemesFromDb()}}
                />

            </div>
        )
    }
}
