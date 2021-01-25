import React from 'react';
import arrowBack from './img/arrow_back-black-18dp.svg';
import arrowForward from './img/arrow_forward-black-18dp.svg';
import './memeGenerator.css';
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import * as htmlToImage from 'html-to-image';


// Meme template with top and bottom caption
class Meme extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div className="image-wrapper" id="image-wrapper">
                <img src={this.props.url} id="actual-image"/>
                <div className="topOut">{this.props.topText}</div>
                <div className="bottomOut">{this.props.bottomText}</div>   
            </div>
        )
    }
}

// slide show for existing meme templates
export default class SlideShow extends React.Component {
    constructor(props){
        super(props);
        this.componentRef = React.createRef();
        this.state = {
            pictures: [],
            currentIndex: 0,
            showPng: false,
            png: "",
         };
    }

    // get the meme templates from the express server
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
 
     // go to next meme template
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
 
     // go to previous meme template
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
 
     // save current meme template to the express server
     saveOnServer() {
         console.log("image gets saved to server");
 
         let index = this.state.currentIndex;
         let image = this.state.pictures[index];
         const topText = this.props.topText;
         const bottomText = this.props.bottomText;
 
         console.log("topCaption: " + topText);
         console.log("image: " + bottomText);
 
         const payload = {
             name: image.name,
             url: image.url,
             width: image.width,
             height: image.height,
             top_caption: topText,
             middle_caption: null,
             bottom_caption: bottomText
         };
 
         fetch(`/generatedMemes/uploadGeneratedMeme`, 
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

     // render the current meme template as an image on the website (does not get saved automatically on server)
     showImage = (() => {
        var node = document.getElementById('image-wrapper');
        var that = this

        htmlToImage.toPng(node)
          .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            that.setState({
                showPng: true,
                png: dataUrl,
            })
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });
     })
 
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

         let createdImage;
         if(this.state.showPng) {
            createdImage = this.state.png;
         }
 
         return (
             <div className="main">
                 <div className="navigation-buttons">
                   <img src={arrowBack} className="backButton" onClick={() => this.onClickPrevious()}></img>
                   <img src={arrowForward} className="nextButton" onClick={() => this.onClickNext()}></img>
                 </div>
 
                 <div><p>current Index: {currentIndex}</p></div>
 
                 <React.Fragment>
                   <Meme url={url} topText={topText} bottomText={bottomText} ref={this.componentRef} />
                 </React.Fragment>
 
                 <button className="saveButton" onClick={() => {this.saveOnServer()}}>
                   Save Meme on server
                 </button>
                 <button onClick={() => exportComponentAsJPEG(this.componentRef)}>
                     Export As JPEG
                 </button>
                 <button onClick={() => exportComponentAsPNG(this.componentRef)}>
                     Export As PNG
                 </button>
                 <button onClick={this.showImage}>Show current status</button>
                 <div>
                    <h2>What your meme currently looks like</h2>
                    <img src={createdImage} />
                 </div>
                 
             </div>
         );
     }
 }