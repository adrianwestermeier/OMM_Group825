import React from 'react';
import axios from 'axios';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import '../templateExpansion.css';

/**
* create a template from a screenshot of a user provided url
*/
export default class Screenshot extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          url: null,
          icon: <BsChevronRight/>,
          expanded: false,
      }
    }
  
    expand = () => {
      if(!this.state.expanded) {
        document.getElementById("screenshot-group").style.display = "inline";
        this.setState({
          icon: <BsChevronDown/>,
          expanded: true,
        })
      } else {
        document.getElementById("screenshot-group").style.display = "none";
        this.setState({
          icon: <BsChevronRight/>,
          expanded: false,
        })
      }
    }
  
    changeName = (event) => {
      event.preventDefault();
      this.setState({
          url: event.target.value,
      })
    }
  
    onSubmit = () => {
      if(!this.state.url) {
        alert('please enter an url');
        return;
      }
  
      const url = this.state.url;
      const name = this.state.name;
  
      // screenshot is taken in the backend, just provide url and template name
      fetch(`http://localhost:3005/screenshot/create`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: url,
            name: name,
          })
        }).then(jsonResponse => jsonResponse.json()
            .then(responseObject => {
              console.log('[TemplateExpantion] recieved answer for post request: ' + JSON.stringify( responseObject ));
              alert(JSON.stringify( responseObject.message ))
            })
            .catch(jsonParseError => {
              console.error(jsonParseError);
            })
          ).catch(requestError => {
              console.error(requestError);
            });
    }
  
    render() {
      return(
        <div>
          <div className="header-button-group">
            <h2>Create a template from a website screenshot</h2>
            <button onClick={this.expand}>{this.state.icon}</button>
          </div>
          <div className="screenshot-group" id="screenshot-group">
            <input type="text" placeholder="enter your website url" name="name" id="name-input" onChange={this.changeName}/>
            <button id="submit-button" onClick={this.onSubmit}>create screenshot & save as template</button>
            <p>(this may take a few seconds)</p>
          </div>
        </div>
         
        
      )
    }
  }