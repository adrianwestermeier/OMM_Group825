import React from 'react';
import axios from 'axios';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import '../templateExpansion.css';

/**
* create a template with an existing user provided image url
*/
export default class UserProvidedUrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: null,
          url: null,
          icon: <BsChevronRight/>,
          expanded: false,
        };
      }

      mySubmitHandler = (event) => {
        event.preventDefault();
        if ( !this.state.name || !this.state.url) {
            alert("Please enter an existing url and a template name!");
            return;
        }
       
        console.log(this.state)
        const payload = {
            name: event.target.elements.name.value,
            url: event.target.elements.url.value,
        }
        console.log('[template expantion] sending data ' + JSON.stringify( payload ))
        fetch(`http://localhost:3005/images/createByUrl`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify( payload ),
        })
        .then(jsonResponse => jsonResponse.json()
        .then(responseObject => {
            console.log('[template expantion] recieved answer for post request: ' + JSON.stringify( responseObject ));
            alert(JSON.stringify( responseObject.message ))
          })
          .catch(jsonParseError => {
            console.error(jsonParseError);
          })
        ).catch(requestError => {
          console.error(requestError);
        });           
        
      }

      myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
      }

      expand = () => {
        if(!this.state.expanded) {
  
          document.getElementById("post-form").style.display = "inline";
          this.setState({
            icon: <BsChevronDown/>,
            expanded: true,
          })
        } else {
          document.getElementById("post-form").style.display = "none";
          this.setState({
            icon: <BsChevronRight/>,
            expanded: false,
          })
        }
      }

    render() {
        return (
            <div className="inputs-post"> 
              <div className="header-button-group">
                <h2>Add a new template by an existing image URL</h2>
                <button onClick={this.expand}>{this.state.icon}</button>
              </div>
                <form className="post-form" id="post-form" onSubmit={this.mySubmitHandler}>
                  <input type="text" placeholder="name" name="name" onChange={this.myChangeHandler}/> <br/>
                  <input type="text" placeholder="url" name="url" onChange={this.myChangeHandler}/> <br/>
                  <button type="submit" className="secondary-button">Submit</button>
                </form>
            </div>
        );
      }
}