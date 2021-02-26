import React from 'react';
import Meme from "../Meme/meme";
import {IoIosThumbsDown, IoIosThumbsUp} from "react-icons/io";

export default class MyMemesElem extends React.Component{

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
                    <p><IoIosThumbsUp/>: {upVotes.length}</p>
                    <p><IoIosThumbsDown/>: {downVotes.length}</p>
                </div>
            </div>
        )
    }

}