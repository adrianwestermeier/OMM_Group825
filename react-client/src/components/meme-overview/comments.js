import React from "react";
import './comments.css'

export default class Comments extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            memes: null,
            comment: '',
            comments: this.props.meme.comments
        }
    }

    getMemesFromDb = () => {
        this.props.getMemes();
    }

    /**
     * this function handles the creation if a new comment.
     * at first the new comment is created out of the username who crated the comment and the text entered in the textarea.
     * after that the new comment is added to the list of already existing comments.
     * after that the newly crated list is sent to the backend and saved on the db
     * */
    comment(){

        let meme = this.props.meme

        let comment = {user: this.props.user, comment: this.state.comment}

        let comments = this.state.comments.concat(comment)
        this.setState({
            comments: comments
        })

        const payload = {
            id: meme._id,
            name: meme.name,
            title: meme.title,
            user: meme.user,
            template: meme.template,
            upVotes: meme.upVotes,
            downVotes: meme.downVotes,
            upMinusDownVotes: meme.upMinusDownVotes,
            comments: comments

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

    render(){

        const items = [];       //ths list will later contain all comments to be shown
        let meme = this.props.meme
        if(meme){
            let comments = meme.comments
            if(comments){
                for (let i = 0; i < comments.length; i++) {
                    let user = comments[i].user
                    let text = comments[i].comment

                    items.push(
                        <p>{user}: {text}</p>
                        )
                }
            }

        }

        return(
            <div>
                <form className="editComment">
                    <label>
                        <textarea
                            onChange={e => {this.setState({comment: e.target.value})}}
                            placeholder="Comment"
                        />
                    </label>
                </form>
                <button className="secondary-button" onClick={() => {this.comment()}}>Comment</button>
                <div className="comments">{items}</div>
            </div>
        )
    }
}
