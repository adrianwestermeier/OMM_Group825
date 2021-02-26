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

        const items = [];
        let meme = this.props.meme
        if(meme){
            let comments = meme.comments
            if(comments){
                for (let i = 0; i < comments.length; i++) {
                    const id = this.props.meme._id
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
                <button className="commentButton" onClick={() => {this.comment()}}>Comment</button>
                <div className="comments">{items}</div>
            </div>
        )
    }
}
