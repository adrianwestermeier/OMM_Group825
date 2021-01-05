import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import arrowBack from './img/arrow_back-black-18dp.svg';
import arrowForward from './img/arrow_forward-black-18dp.svg';
import './index.css';


// Inputs for the top and bottom texts
class InputsText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topText: "",
            bottomText: "",
        };
    }

    handleTopClick = (event) => {
        event.preventDefault();
        let nam = event.target.value;
        this.setState({topText: nam});
    }

    handleBottomClick = (event) => {
        event.preventDefault();
        let nam = event.target.value;
        this.setState({bottomText: nam});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let top = this.state.topText;
        
        let bottom = this.state.bottomText;
        
        this.props.textSubmitHandle(top, bottom);
    }

    render() {
        return(
            <div className="inputs-text">
                <h2 className="form-header">Write top and bottom caption</h2>
                <form id="topForm" onSubmit={this.handleSubmit}>
                  <input type="text" placeholder="top caption" name="topText" onChange={this.handleTopClick}/>
                  <button type="submit">Submit</button>
                </form>    
                <form id="bottomForm" onSubmit={this.handleSubmit}>
                  <input type="text" placeholder="bootom caption" name="bottomText" onChange={this.handleBottomClick}/>
                  <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

// inputs for the url post feature
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

            console.log('sending data ' + JSON.stringify( payload ));

            fetch(`/images/handle`, 
            {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify( payload ),
            })
              .then(jsonResponse => jsonResponse.json()
              .then(responseObject => {
                  console.log('recieved answer for post request: ' + JSON.stringify( responseObject ));
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
                <h2 className="form-header">Post a new picture by existing url</h2>
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


// slide show for existing memes
class SlideShow extends React.Component {
   constructor(props){
       super(props);
       this.state = {
           pictures: [],
           currentIndex: 0,
        };
   }
   componentDidMount() {
        fetch('/images')
            .then(res => {
                console.log(res);
                return res.json()
             })
            .then(images => { 
                console.log(images);
                this.setState({ 
                    pictures: images.images,  // image array is wrapped in image json
                    currentIndex: 0,
                    topText: "",
                    bottomText: "",
                })
             });
    }

    onClickNext() {
        const nextIndex = this.state.currentIndex + 1;
        if(nextIndex === this.state.pictures.length) {
            this.setState({ 
                pictures: this.state.pictures,
                currentIndex: 0 })    
        } else {
            this.setState({
                pictures: this.state.pictures,
                currentIndex: nextIndex 
            })
        }
    }

    onClickPrevious() {
        const previousIndex = this.state.currentIndex - 1;
        if(previousIndex < 0) {
            this.setState({ 
                pictures: this.state.pictures,
                currentIndex: this.state.pictures.length - 1 })    
        } else {
            this.setState({
                pictures: this.state.pictures,
                currentIndex: previousIndex
            })
        }
    }

    render() {
        const currentIndex = this.state.currentIndex;
        const topText = this.props.topText;
        const bottomText = this.props.bottomText;
        let url;
        if(this.state.pictures.length > 0) {
            url = this.state.pictures[currentIndex].url;
        } else {
            url = ""
        }
        return (
            <div className="main">
                <div className="navigation-buttons">
                  <img src={arrowBack} className="backButton" onClick={() => this.onClickPrevious()}></img>
                  <img src={arrowForward} className="nextButton" onClick={() => this.onClickNext()}></img>
                </div>

                <div><p>current Index: {currentIndex}</p></div>

                <div className="image-wrapper">
                    <img src={url} />
                    <div className="topOut">{topText}</div>
                    <div className="bottomOut">{bottomText}</div>   
                </div>

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

    onChangeHandler = (event) => {
        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
          })
    }

    onClickHandler = () => {
        const file = this.state.selectedFile;
        const formData = new FormData();
        formData.append("userUploadFile", file);
      
        axios.post("http://localhost:3000/images/upload", formData,{headers:{"Content-Type" : 'multipart/form-data'}})
        .then((res) => {
            alert(res.data.message);
          })
          .catch((err) => alert("File Upload Error"));
      
          }

    render() {
        return(   
            <div className="file-upload">
                <h2>Upload a file</h2>
                <input type="file" name="sampleFile" onChange={this.onChangeHandler}/>
                <button type="button" onClick={this.onClickHandler}>Upload</button>
            </div>
        )
    }
    
}

// ========================================
// overall class to handle everything
class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            topText: "",
            bottomText: "",
         };
    }

    handleTextSubmit = (top, bottom) => {
        console.log(top);
        console.log(bottom);
        this.setState({
            topText: top,
            bottomText: bottom
        });
    }

    render() {
      return (
        <div className="home">
            <div className="input-section">
                <InputsText textSubmitHandle={this.handleTextSubmit}/>
                <InputsPost/>
                <FileUpload/>
            </div>
            <div className="slide-show-section">
                <h2>Pictures</h2>
                <SlideShow topText={this.state.topText} bottomText={this.state.bottomText}/>
            </div>
        </div>
      );
    }
}

  
ReactDOM.render(
  <Home />,
  document.getElementById('root')
);