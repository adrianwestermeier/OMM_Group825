import React from 'react';
import axios from 'axios';
import arrowBack from '../img/arrow_back-black-18dp.svg';
import arrowForward from '../img/arrow_forward-black-18dp.svg';
import {IoIosThumbsUp, IoIosThumbsDown} from 'react-icons/io';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chart from "react-google-charts";

import './memeOverview.css';
import Meme from "../Meme/meme";

class OverviewElem extends React.Component {

    /*
    * depending on which button was pressed this function performs an up- or downVote, that means updating the corresponding value locally
    * after that ist sends an update request to the sever to save the corresponding values on the db
    * after that it reloads all memes to get and render the new information
    * */
    vote(meme, isUpvote) {
        let upVotes = meme.upVotes
        let downVotes = meme.downVotes
        let upMinusDown = meme.upMinusDownVotes

        if (isUpvote) {
            upVotes = upVotes + 1
        } else if (!isUpvote) {
            downVotes = downVotes + 1
        } else {
            console.log('Fehler: weder up noch downvote')
        }

        let upDown = upVotes - downVotes

        upMinusDown = upMinusDown.concat(upDown)

        // TODO: change this to new meme
        const payload = {
            id: meme._id,
            name: meme.name,
            title: meme.title,
            upVotes: upVotes,
            downVotes: downVotes,
            upMinusDownVotes: upMinusDown

        };

        fetch(`/generatedMemes/updateMeme`,
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
                    <p><IoIosThumbsUp/>: {upVotes}</p>
                    <p><IoIosThumbsDown/>: {downVotes}</p>
                </div>
            </div>
        )
    }
}

class Grid extends React.Component{

    getMemesFromDb = () => {
        this.props.getMemes();
    }

    render() {
        const items = [];
        let memes = this.props.memes
        for (let i = 0; i < memes.length; i++) {


            items.push(<OverviewElem
                className="gridItem"
                meme={memes[i]}
                getMemes={() => {this.getMemesFromDb()}}
                testPrint={() => {this.testPrint()}}
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


// ich würde das VoteChart gerne noch extra machen, wenn ich nicht immer undefined memes bekommen würde
/*class VoteChart extends React.Component{

    render(){
        const memes = this.props.memes

        let data = [
            ['x', 'votes'],
            [0,0]
        ]

        let elem = []

        if(this.props.i){
            if(memes[this.props.i]){
                let upAndDown = memes[this.state.i].upMinusDownVotes
                for(let i=1; i<upAndDown.length; i++){
                    elem = [i, upAndDown[i]]
                    data.push(elem)

                }

            }
        }


        return(
            <div>
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={{
                        hAxis: {
                            title: 'Time',
                        },
                        vAxis: {
                            title: 'Up- minus DownVotes',
                        },
                    }}

                />
            </div>
        )
    }
}*/



class SingleView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            i: 0,               // index which meme is to be rendered
            autoPlayOrdered: false,    // is autoPlayOrdered activated or not
            autoPlayRandom: false   //is autoPlayRandom activated or not
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

    // when the button is clicked it redefines this.state.autoPlayOrdered to true or false depending on which value ist hade before
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
            console.log('error: weder ordered noch random')
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


        const items = [];
        let memes = this.props.memes
        let autoPlayOrderedLabel = ''
        let autoPlayRandomLabel = ''
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

        let data = [
            ['x', 'votes'],
            [0,0]
        ]

        let elem = []

        if(memes[this.state.i]){
            let upAndDown = memes[this.state.i].upMinusDownVotes
            for(let i=1; i<upAndDown.length; i++){
                elem = [i, upAndDown[i]]
                data.push(elem)

            }

        }

        return(
            <div>
                <button onClick={() => {this.randomMeme()}}>Random</button>
                <button disabled={this.state.autoPlayRandom} onClick={() => {this.autoPlayMemes(true)}}>{autoPlayOrderedLabel} ordered</button>
                <button disabled={this.state.autoPlayOrdered} onClick={() => {this.autoPlayMemes(false)}}>{autoPlayRandomLabel} random</button>
                <div>
                    <div className="arrows" id="arrows">
                        <img src={arrowBack} alt="Arrow pointing to the left" className="backButton"  onClick={() => this.previous()}></img>
                        <img src={arrowForward} alt="Arrow pointing to the right" className="nextButton" onClick={() => this.next()}></img>
                    </div>
                    {items[this.state.i]}
                </div>
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={{
                        hAxis: {
                            title: 'Time',
                        },
                        vAxis: {
                            title: 'Up- minus DownVotes',
                        },
                    }}

                />
            </div>
        )
    }
}

class SwitchView extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    render() {
        let view;
        if (this.props.isSingleView) {
            view = <SingleView
                memes={this.props.memes}
                getMemes={() => {this.props.getMemes()}}
            />
        } else {
            view = <Grid
            memes={this.props.memes}
            getMemes={() => {this.props.getMemes()}}
            />;
        }
        return(
            <div>{view}</div>
        ) 
    }
}

class MemeOverview extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            isSingleView: true
        };
    }

    componentDidMount() {
        this.getMemesFromDb()
    }

    /*
    * this function fetches all memes from the Database every time it's called
    * */
    getMemesFromDb() {
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
            });
    }

    render(){
        let setChecked = this.state.isSingleView

        const toggleChecked = () => {
            setChecked = !setChecked
            this.setState({
                isSingleView: setChecked
            })
        };

        return(
            <div>
                <p className={'switch'}>Grid Overview</p>
                <FormControlLabel className={'switch'}
                    control={<Switch checked={this.state.isSingleView} onChange={toggleChecked} />}
                    label="Single View"
                />
                <SwitchView
                    isSingleView={this.state.isSingleView}
                    memes={this.state.memes}
                    getMemes={() => {this.getMemesFromDb()}}
                />
            </div>
        )
    }



}

// ========================================
// overall class to handle everything
export default class Overview extends React.Component {

    render() {
        return (
            <div className="meme-overview">
                <MemeOverview/>
            </div>
        );
    }
}