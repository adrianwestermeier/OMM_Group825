import React from "react";
import Meme from "../Meme/meme";
import {IoIosThumbsDown, IoIosThumbsUp} from "react-icons/io";
import Comments from "./comments";

import "./OverviewElem.css"

/**
 * this class returns nothing if the user did not vote the meme yet
 * if the user already voted the meme ist returns the symbol for up or down vote based on the users vote
 * */
class YourVote extends React.Component{
    render(){
        const vote = this.props.vote

        if(vote === 'notVoted'){
            return(
                <div/>
            )
        } else if(vote === 'downVote'){
            return (
                <p>your Vote: <IoIosThumbsDown/></p>
            )
        } else if(vote === "upVote"){
            return (
                <p>your Vote: <IoIosThumbsUp/></p>
            )
        } else{
            return(
                <div>ERROR</div>
            )
        }

    }
}

export default class OverviewElem extends React.Component {

    /**
     * at first this function checks, if the user logged in hase already voted this meme
     * if its already voted it sends an alert
     * if the meme was not voted yet it adds the username to the corresponding list (up or down Votes) depending on which button was pressed.
     * after that the updated information s send to the backend and saved on th db
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

    render() {

        const meme = this.props.meme
        const upVotes = meme.upVotes
        const downVotes = meme.downVotes

        let user = this.props.user

        let yourVote

        /**
         * this part checks, if the user already up ot down voted the meme
         * */
        if(upVotes.includes(user)){
            yourVote = 'upVote'
        } else if(downVotes.includes(user)){
            yourVote = 'downVote'
        } else {
            yourVote = 'notVoted'
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

                <div>
                    <div className="vote-buttons">
                        <button className="UpDownVoteButton" onClick={() => this.vote(meme, true)}><IoIosThumbsUp/></button>
                        <button className="UpDownVoteButton" onClick={() => this.vote(meme, false)}><IoIosThumbsDown/></button>
                        <div className="votes">
                            <p className="UpVoteElem"><IoIosThumbsUp/>: {upVotes.length}</p>
                            <p className="DownVoteElem"><IoIosThumbsDown/>: {downVotes.length}</p>
                        </div>
                        <YourVote
                            vote={yourVote}
                        />
                    </div>

                    <Comments className="comments"
                              user={this.props.user}
                              meme={meme}
                              getMemes={() => {this.getMemesFromDb()}}
                    />

                </div>


            </div>
        )
    }
}
