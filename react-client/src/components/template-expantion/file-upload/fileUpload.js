import React from 'react';
import axios from 'axios';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import '../templateExpansion.css';

/**
* create a template from file uploaded by the user
*/
export default class FileUpload extends React.Component {
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
        // define a formData for sending actual images
        const formData = new FormData();
        formData.append("userUploadFile", file);
      
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
                <h2>Upload an image template from your computer</h2>
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