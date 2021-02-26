import React from 'react';
import axios from "axios";
import MyMemesElem from "./MyMemesElem";

export default class MyMemes extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            user: this.props.user,
            users: [],
            myMemes: [],
        }
    }

    /*
    * This function filter for all memes owned by the user logged in
    * */
    getMyMemes(){
        const memes = [...this.state.memes];
        const user = this.state.user
        let meme = null
        let myMemes = []

        for(let i=0; i<memes.length; i++){

            if(memes[i].user === user){
                meme = memes[i]
                myMemes.push(meme)
                this.setState({
                    myMemes: myMemes
                })
            }
        }

    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    getMemesFromDb() {

        // get the memes from the express server
        fetch('http://localhost:3005/generatedMemes/getMemeData')
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
                        that.getMyMemes()
                        
                    });
                }, memesCopy); // use memesCopy as this
            })
    }

    render(){
        const items = [];       //this array later will contain all the elements to be shown in the overview
        let memes = this.state.myMemes
        for (let i = 0; i < memes.length; i++) {
            items.push(<MyMemesElem
                className="gridItem"
                meme={memes[i]}
                getMemes={() => {this.getMemesFromDb()}}
            />)
        }
        return(
            <div>
                <h1>My Memes</h1>
                <div>
                    {items}
                </div>
            </div>
        )
    }
}