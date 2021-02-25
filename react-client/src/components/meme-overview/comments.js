import React from "react";
import OverviewElem from "./OverviewElem";

class ListElem extends React.Component{
    render(){
        return(
            <div>
                <p>{this.props.user}: {this.props.text}</p>

            </div>
        )
    }
}

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

        console.log(this.props.meme.comments)

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
                <form>
                    <label>
                        Comment:
                        <textarea
                            onChange={e => {this.setState({comment: e.target.value})}}
                        />
                    </label>
                </form>
                <button onClick={() => {this.comment()}}>Comment</button>
                <div>{items}</div>
            </div>
        )
    }
}
