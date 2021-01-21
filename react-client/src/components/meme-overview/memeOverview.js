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

  render() {

      const items = [];
      let memes = this.state.memes
      for (let i = 0; i < memes.length; i++) {
          let url = this.state.memes[i].url
          let id= this.state.memes[i]._id
          items.push(<img key={id} src={url} />)

      }
    return (
      <div >


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