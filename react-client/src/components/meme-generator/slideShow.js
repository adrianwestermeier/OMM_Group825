import React from 'react';
import arrowBack from './img/arrow_back-black-18dp.svg';
import arrowForward from './img/arrow_forward-black-18dp.svg';
import './memeGenerator.css';
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import * as htmlToImage from 'html-to-image';
import './slideShow.css';
import DrawApp from './drawMeme';


// Meme template with top and bottom caption
class Meme extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const topStyle = {
            top: this.props.topTextVerticalPosition + "%", 
            left: this.props.topTextHorizontalPosition + "%"
        };
        const bottomStyle = {
            bottom: this.props.bottomTextVerticalPosition + "%", 
            left: this.props.bottomTextHorizontalPosition + "%"
        };
        return(
            <div className="image-wrapper" id="image-wrapper">
                <figure>
                    <figcaption>{this.props.title}</figcaption>
                    <div className="top-and-bottom-wrapper">
                        <img src={this.props.url} id="actual-image"/>
                        <div className="topOut" style={topStyle}>
                            {this.props.topText}
                        </div>
                        <div className="bottomOut" style={bottomStyle}>
                            {this.props.bottomText}
                        </div>   
                    </div>
                </figure>
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
            heading: "Choose a template",
            headingButton: "DRAW",
            buttonText: "Create Meme",
            createMode: true,
            drawMode: false,
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
         if(this.state.createMode) {
            let node;
            if(this.state.drawMode) {
                node = document.getElementById('draw-panel-canvas');
                node.style.border = "none";
                const that = this
             
                htmlToImage.toPng(node)
                .then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    that.setState({
                        showPng: true,
                        png: dataUrl,
                        buttonText: "Edit Again",
                        createMode: false,
                       })
                       document.getElementById('draw-panel').style.display = "none";
                       document.getElementById('button-group').style.display = "inline";
                       node.style.border = "1px solid black";

                   })
                   .catch(function (error) {
                       console.error('oops, something went wrong!', error);
                   });
            } else {
                node = document.getElementById('image-wrapper');
                const that = this
             
                htmlToImage.toPng(node)
                .then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    that.setState({
                        showPng: true,
                        png: dataUrl,
                        buttonText: "Edit Again",
                        createMode: false,
                       })
                       document.getElementById('meme-wrapper').style.display = "none";
                       document.getElementById('arrows').style.display = "none";
                       document.getElementById('button-group').style.display = "inline";

                   })
                   .catch(function (error) {
                       console.error('oops, something went wrong!', error);
                   });
            }   
        } else {
            if(this.state.drawMode){
                document.getElementById('draw-panel').style.display = "inline-block";
                document.getElementById('button-group').style.display = "none";
                this.setState({
                    showPng: false,
                    png: "",
                    buttonText:"Create Meme",
                    createMode: true,
                })
            } else {
                document.getElementById('meme-wrapper').style.display = "block";
                document.getElementById('arrows').style.display = "block";
                document.getElementById('button-group').style.display = "none";
                this.setState({
                    showPng: false,
                    png: "",
                    buttonText:"Create Meme",
                    createMode: true,
                })
            }
        }
     })

     changeToDraw = (() => {
         if(!this.state.createMode) {
             alert("first switch to editing again!");
             return;
         }
        if(!this.state.drawMode){
            document.getElementById('draw-panel').style.display = "inline-block";
            document.getElementById('meme-wrapper').style.display = "none";
            document.getElementById('arrows').style.display = "none";
            
            this.setState({
                heading: "Draw",
                headingButton: "choose template",
                drawMode: true,
            })
        } else {
            document.getElementById('draw-panel').style.display = "none";
            document.getElementById('meme-wrapper').style.display = "block";
            document.getElementById('arrows').style.display = "block";
            
            this.setState({
                heading: "Choose a template",
                headingButton: "DRAW",
                drawMode: false,
            }) 
        }
     })
 
     render() {
         const currentIndex = this.state.currentIndex;
         const topText = this.props.topText;
         const bottomText = this.props.bottomText;
         const topTextVerticalPosition= this.props.topTextVerticalPosition
         const topTextHorizontalPosition= this.props.topTextHorizontalPosition
         const bottomTextVerticalPosition= this.props.bottomTextVerticalPosition
         const bottomTextHorizontalPosition= this.props.bottomTextHorizontalPosition
 
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
                 <div className="slide-show-heading">
                    <h2>{this.state.heading} or </h2>
                    <button className="draw-button" onClick={this.changeToDraw}>{this.state.headingButton}</button>
                 </div>
                 <div className="navigation-buttons">
                    <div className="arrows" id="arrows">
                        <img src={arrowBack} className="backButton" onClick={() => this.onClickPrevious()}></img>
                        <img src={arrowForward} className="nextButton" onClick={() => this.onClickNext()}></img>
                    </div>
                   <button className="create-meme-button" onClick={this.showImage}>{this.state.buttonText}</button>
                 </div>
 
                 {/* <div><p>current Index: {currentIndex}</p></div> */}
 
                <React.Fragment>
                    <div className="draw-panel" id="draw-panel">
                        <DrawApp title={this.props.title} />
                    </div>
                    <div className="meme-wrapper" id="meme-wrapper">
                       <Meme 
                        url={url} 
                        title={this.props.title}
                        topText={topText} 
                        bottomText={bottomText} 
                        topTextHorizontalPosition={topTextHorizontalPosition}
                        topTextVerticalPosition={topTextVerticalPosition}
                        bottomTextHorizontalPosition={bottomTextHorizontalPosition}
                        bottomTextVerticalPosition={bottomTextVerticalPosition}
                         />
                    </div>
                </React.Fragment>
                <div className="button-group" id="button-group">
                   <button className="saveButton" onClick={() => {this.saveOnServer()}}>
                     Save Meme on server
                   </button>
                   <button onClick={() => exportComponentAsJPEG(this.componentRef)}>
                       Export As JPEG
                   </button>
                   <button onClick={() => exportComponentAsPNG(this.componentRef)}>
                       Export As PNG
                   </button>
                </div>
                <div>
                   <img src={createdImage} ref={this.componentRef}/>
                </div>
             </div>
         );
     }
 }