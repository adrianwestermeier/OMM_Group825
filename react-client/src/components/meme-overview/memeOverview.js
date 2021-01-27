import React from 'react';

import './memeOverview.css';
import Meme from "../Meme/meme";

class OverviewElem extends React.Component{

  upVote(meme){
    console.log('UpVote')

    const payload = {
      id: meme._id,
      name: meme.name,
      url: meme.url,
      width: meme.width,
      height: meme.height,
      top_caption: meme.top_caption,
      middle_caption: null,
      bottom_caption: meme.bottom_caption,
      upVotes: meme.upVotes + 1,
      downVotes: meme.downVotes
    };

    fetch(`/generatedMemes/updateMeme`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
  }

  downVote(){
    console.log('DownVote')
  }

  render() {

    const meme = this.props.meme
    const id = meme.id
    const url = meme.url
    const topCaption = meme.top_caption
    const bottomCaption = meme.bottom_caption



    return(
        <div>
          <Meme
              key={id}
              url={url}
              topText={topCaption}
              bottomText={bottomCaption}
          />
          <button onClick={() => this.upVote(meme)}>UpVote</button>
          <button onClick={() => this.downVote(meme)}>DownVote</button>
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
      let id = memes[i]._id

      items.push(<OverviewElem className="gridItem"
        key={id}
        meme={memes[i]}
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