import React, { Component } from 'react';
import axios from 'axios';

class Imago extends Component {
    constructor(props){
        super(props);
        this.componentRef = React.createRef();
        this.state = {
            sources: [],
            names: ['horse.jpg', 'guy.jpg', 'dog.jpg']
         };
    }


  componentDidMount() {
      this.state.names.forEach(element => {
          let url = 'http://localhost:3005/images/' + element;
          console.log(url)
          axios
          .get(
              url,
              { responseType: 'arraybuffer' },
              )
              .then(response => {
                    const base64 = btoa(
                      new Uint8Array(response.data).reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          '',
                          ),
                    );
                    let newSourceArray = this.state.sources;
                    newSourceArray = newSourceArray.concat("data:;base64," + base64)
                    this.setState({ sources: newSourceArray });
                    console.log("data:;base64," + base64);
                    });
        });
  }

  render() {
    return(
        <div>
            {this.state.sources.map((source) =>
                <img src={source} alt={''}/>)
            } 
        </div>
    )
   /*  <img src={this.state.source} />; */
    
  }
}

export default Imago;
