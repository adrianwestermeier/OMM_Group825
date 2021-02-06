import React from 'react';
import axios from 'axios';

// inputs for user-posted urls
class InputsPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: null,
          url: null,
          width: null,
          height: null,
          boxCount: null,
        };
      }

      mySubmitHandler = (event) => {
        event.preventDefault();
        if ( !this.state.name || !this.state.url || !this.state.width || !this.state.height || !this.state.boxCount ) {
            alert("You must enter every field in the inputs!");
            return;
        }
        const name = this.state.name;
        const url = this.state.url;
        const inputWidth = this.state.width;
        const inputHeight = this.state.height;
        const inputBoxCount = this.state.boxCount;
        if ( !Number(inputWidth) || !Number(inputHeight) || !Number(inputBoxCount) ) {
          alert("You must enter numbers for width, height and box count!");
        } else {
            console.log(this.state)
            const payload = {
                name: event.target.elements.name.value,
                url: event.target.elements.url.value,
                width: event.target.elements.width.value,
                height: event.target.elements.height.value,
                boxCount: event.target.elements.boxCount.value
            };

            console.log('[template expantion] sending data ' + JSON.stringify( payload ));

            fetch(`/images/handle`, 
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
      }

      myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
      }

    render() {
        return (
            <div className="inputs-post"> 
                <h2 className="form-header">Post a new picture by an existing image URL</h2>
                <form className="postForm" onSubmit={this.mySubmitHandler}>
                  <input type="text" placeholder="name" name="name" onChange={this.myChangeHandler}/> <br/>
                  <input type="text" placeholder="url" name="url" onChange={this.myChangeHandler}/> <br/>
                  <input type="text" placeholder="width" name="width" onChange={this.myChangeHandler}/> <br/>
                  <input type="text" placeholder="height" name="height" onChange={this.myChangeHandler}/> <br/>
                  <input type="text" placeholder="box count" name="boxCount" onChange={this.myChangeHandler}/>
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

    render() {
        return(   
            <div className="file-upload">
                <h2>Upload an image template</h2>
                <input type="file" name="sampleFile" onChange={this.onFileChangeHandler}/>
                <button className="upload-button" type="button" onClick={this.onClickHandler}>Upload</button>
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
        <div className="template-expantion">
            <InputsPost/>
            <FileUpload/>
        </div>
      );
    }
}