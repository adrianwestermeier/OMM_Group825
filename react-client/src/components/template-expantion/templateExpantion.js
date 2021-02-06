import React from 'react';
import axios from 'axios';
import './templateExpansion.css';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";

// inputs for user-posted urls
class InputsPost extends React.Component {
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
        // const name = this.state.name;
        // const url = this.state.url;
       
        console.log(this.state)
        const payload = {
            name: event.target.elements.name.value,
            url: event.target.elements.url.value,
        }
        console.log('[template expantion] sending data ' + JSON.stringify( payload ))
        fetch(`/images/createByUrl`,
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
                  <button type="submit" className="postSubmit">Submit</button>
                </form>
            </div>
        );
      }
}


// user upload, file gets saved on local file system
class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            icon: <BsChevronRight/>,
            expanded: false,
        }
    }

    onFileChangeHandler = (event) => {
        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
          })
    }

    onClickHandler = () => {
        const file = this.state.selectedFile;
        const name = this.state.selectedFile.name;
        console.log("[template expantion] name = " + name);
        if(!name) {
          alert("Please specify a template name!")
          return;
        }
        const formData = new FormData();
        formData.append("userUploadFile", file);
        // formData.append("fileName", name);
      
        axios.post(
          "http://localhost:3000/images/uploadTemplate", 
          formData,
          {headers:{"Content-Type" : 'multipart/form-data'}}
        ).then((res) => {
            alert(res.data.message);
          })
          .catch((err) => alert("File Upload Error"));
    }

    expand = () => {
      if(!this.state.expanded) {

        document.getElementById("file-upload-inputs").style.display = "inline";
        this.setState({
          icon: <BsChevronDown/>,
          expanded: true,
        })
      } else {
        document.getElementById("file-upload-inputs").style.display = "none";
        this.setState({
          icon: <BsChevronRight/>,
          expanded: false,
        })
      }
    }

    render() {
        return(   
            <div className="file-upload">
              <div className="header-button-group">
                <h2>Upload a custom image template</h2>
                <button onClick={this.expand}>{this.state.icon}</button>
              </div>
                <div className="file-upload-inputs" id="file-upload-inputs">
                  <input type="file" name="sampleFile" onChange={this.onFileChangeHandler}/>
                  <button className="upload-button" type="button" onClick={this.onClickHandler}>Upload</button>
                </div>
            </div>
        )
    }
    
}


// class that renders all the meme generation functions
export default class Expander extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      return (
        <div className="template-expansion">
            <InputsPost/>
            <FileUpload/>
        </div>
      );
    }
}