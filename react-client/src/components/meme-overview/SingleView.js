import React from "react";
import OverviewElem from "./OverviewElem";
import arrowBack from "../img/arrow_back-black-18dp.svg";
import arrowForward from "../img/arrow_forward-black-18dp.svg";
import VoteChart from "./VoteChart";

export default class SingleView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            i: 0,                       // index which meme is to be rendered
            autoPlayOrdered: false,     // is autoPlayOrdered activated or not
            autoPlayRandom: false       //is autoPlayRandom activated or not
        };
        this.makeTimer()
    }

    getMemesFromDb = () => {
        this.props.getMemes();
    }

    /*when clicking the 'previous' button this functions redefines the index this.state.i to render the previous image
    * when the index gets smaller than 0 the index is redefined to the length of the memes list -1
    * */
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

    /*when clicking the 'next' button this functions redefines the index this.state.i to render the next image
    * when the index gets larger than the length of the memes list ist redefines the index to 0
    * */
    next(){
        let memes = this.props.memes
        let i = this.state.i
        if( i < memes.length-1){
            i = i+1
        } else {
            i = 0
        }

        this.setState({
            i: i
        })
    }

    // generates a random Number between 0 and memes.length to show a random Meme
    randomMeme(){
        let memes = this.props.memes
        const i = Math.floor(Math.random() * Math.floor(memes.length));
        this.setState({
            i: i
        })
    }

    // when the button is clicked it redefines this.state.autoPlayOrdered to true or false depending on which value ist had before
    autoPlayMemes(isOrdered){
        if(isOrdered){
            this.setState({
                autoPlayOrdered: !this.state.autoPlayOrdered
            })
        }else if(!isOrdered){
            this.setState({
                autoPlayRandom: !this.state.autoPlayRandom
            })
        }else{
            console.log('error: neither ordered nor random')
        }

    }

    // This function creates the timer for the auto play method. It sets a new i every five seconds and if this.state.autoPlayOrdered == true it redefines this.state.i to render the next meme
    makeTimer(){
        setInterval(() => {
            let memes = this.props.memes
            let i = this.state.i
            if( i < memes.length-1){
                i = i+1
            } else {
                i = 0
            }
            if(this.state.autoPlayOrdered){
                this.setState({i: i})
            }
            if(this.state.autoPlayRandom){
                i = Math.floor(Math.random() * Math.floor(memes.length));
                this.setState({
                    i: i
                })
            }

        }, 5000)
    }

    render(){

        const items = [];           //this array later will contain all the elements to be shown in the single view
        let memes = this.props.memes
        let autoPlayOrderedLabel
        let autoPlayRandomLabel
        if(!this.state.autoPlayOrdered){
            autoPlayOrderedLabel = 'start auto play'
        }else{
            autoPlayOrderedLabel = 'stop auto play'
        }

        if(!this.state.autoPlayRandom){
            autoPlayRandomLabel = 'start auto play'
        }else{
            autoPlayRandomLabel = 'stop auto play'
        }

        for (let i = 0; i < memes.length; i++) {
            let id = memes[i]._id

            items.push(<OverviewElem
                key={id}
                className="gridItem"
                meme={memes[i]}
                getMemes={() => {this.getMemesFromDb()}}
                testPrint={() => {this.testPrint()}}
            />)
        }

        return(
            <div>
                <button onClick={() => {this.randomMeme()}}>Random</button>
                <button disabled={this.state.autoPlayRandom} onClick={() => {this.autoPlayMemes(true)}}>{autoPlayOrderedLabel} ordered</button>
                <button disabled={this.state.autoPlayOrdered} onClick={() => {this.autoPlayMemes(false)}}>{autoPlayRandomLabel} random</button>
                <div>
                    <div className="arrows" id="arrows">
                        <img src={arrowBack} className="backButton"  alt="" onClick={() => this.previous()}/>
                        <img src={arrowForward} className="nextButton" alt="" onClick={() => this.next()}/>
                    </div>
                    {items[this.state.i]}
                </div>
                <VoteChart
                    memes={memes}
                    i={this.state.i}
                />
            </div>
        )
    }
}
