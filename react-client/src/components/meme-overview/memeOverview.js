import React from 'react';

import './memeOverview.css';

class MemeOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memes: []
    };
  }

    componentDidMount(){
      console.log("Anwendung gestartet");
        fetch('/generatedMemes/getMemes')
            .then(res => {
                console.log(res);
                return res.json()
            })
            .then(memes => {
                console.log(memes.memes[1]);
                this.setState({
                    memes: memes.memes,  // meme array is wrapped in meme json
                })
            });
    }


  loadMemes = () => {
      const memes = this.state.memes
    console.log('load Memes');
      for (var i = 0; i < memes.length; i++) {
          console.log(this.state.memes[i].url)
      }

  }


  render() {

      const items = [];
      let memes = this.state.memes
      for (var i = 0; i < memes.length; i++) {
          console.log(this.state.memes[i].url)
          let url = this.state.memes[i].url
          items.push(<img src={url} />)

      }
    return (
      <div >
        <button onClick={this.loadMemes}>Load</button>
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