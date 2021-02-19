import React from 'react';
import axios from "axios";

export default class MyMemes extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            users: [],
            myMemes: [],
        }
    }

    getMyMemes(){
        console.log(this.state.memes)

    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    getMemesFromDb() {
        console.log('getMemesFromDb')
        // get the memes from the express server
        fetch('/generatedMemes/getMemeData')
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
            }).then(
            () => {this.getMyMemes()}
        );
    }

    render(){
        return(
            <div>
                <h1>My Memes</h1>
                <button onClick={()=>{this.getMyMemes()}}>getMyMemes</button>
            </div>
        )
    }
}