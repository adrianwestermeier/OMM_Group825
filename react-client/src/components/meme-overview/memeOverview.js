import React from 'react';

import './memeOverview.css';
import Meme from "../Meme/meme";

class OverviewElem extends React.Component{

  upVote(){
    console.log('UpVote')
  }

  downVote(){
    console.log('DownVote')
  }

  render() {

    const id = this.props.id
    const url = this.props.url
    const topCaption = this.props.topText
    const bottomCaption = this.props.bottomText


    return(
        <div>
          <Meme
              key={id}
              url={url}
              topText={topCaption}
              bottomText={bottomCaption}
          />
          <button onClick={this.upVote}>UpVote</button>
          <button onClick={this.downVote}>DownVote</button>
        </div>
    )
  }
}

class MemeOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memes: []
    };
  }

  componentDidMount() {

    this.getMemesFromDb(this.state)
  }

  getMemesFromDb(state) {


    fetch('/generatedMemes/getMemes')
      .then(res => {
        return res.json()
      })
      .then(memes => {

        this.setState({
          memes: memes.memes,  // meme array is wrapped in meme json
        })

      });
  }



  render() {

    const items = [];
    let memes = this.state.memes
    for (let i = 0; i < memes.length; i++) {
      let url = memes[i].url
      let id = memes[i]._id
      let topCaption = memes[i].top_caption
      let bottomCaption = memes[i].bottom_caption
      //items.push(<img key={id} src={url} />)
      items.push(<OverviewElem className="gridItem"
        key={id} // jedes Listenenlement braucht einen eindeutigen key
        id={id}  // auf den key kann nicht über props.key zugegriffen werden
        url={url}
        topText={topCaption}
        bottomText={bottomCaption}
      />)



    }


    return (
      <div >
        <div className="MemeOverview">
          {items}
        </div>
      </div>
    )
  }
}




// ========================================
// overall class to handle everything
export default class Overview extends React.Component {

  render() {
    return (
      <div>
        <MemeOverview />
      </div>
    );
  }
}