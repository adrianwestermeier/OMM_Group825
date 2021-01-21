import React from 'react';

import './memeOverview.css';
import Meme from "../Meme/meme";

class MemeOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memes: []
    };
  }

    componentDidMount(){
      this.getMemesFromDb(this.state)
    }

    getMemesFromDb(state){
      console.log('getMemes');
      console.log('State: ' + this.state)
        fetch('/generatedMemes/getMemes')
            .then(res => {
                return res.json()
            })
            .then(memes => {
                console.log(this.state);
                this.setState({
                    memes: memes.memes,  // meme array is wrapped in meme json
                })
                console.log(this.state);
            });
    }



  render() {

      const items = [];
      let memes = this.state.memes
      for (let i = 0; i < memes.length; i++) {
          let url = memes[i].url
          let id= memes[i]._id
          let topCaption = memes[i].top_caption
          let bottomCaption = memes[i].bottom_caption
          //items.push(<img key={id} src={url} />)
          items.push(<Meme
              key={id}
              url={url}
              topText={topCaption}
              bottomText={bottomCaption}
          />)



      }


    return (
      <div >
          <button onClick={() => this.getMemesFromDb()}>get new Memes</button>
          <div>
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