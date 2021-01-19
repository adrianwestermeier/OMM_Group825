import React from 'react';

import './memeOverview.css';

class MemeOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memes: []
    };
  }


  loadMemes = () => {
    console.log('load Memes');
    fetch('/generatedMemes/getMemes')
            .then(res => {
                console.log(res);
                return res.json()
             })
            .then(memes => {
                console.log(memes);
             });
  }


  render() {
    return (
      <div >
        <button onClick={this.loadMemes}>Load</button>

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