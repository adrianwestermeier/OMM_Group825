import React from 'react';
import axios from 'axios';
import arrowBack from '../img/arrow_back-black-18dp.svg';
import arrowForward from '../img/arrow_forward-black-18dp.svg';
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
            left: this.props.topTextHorizontalPosition + "%",
            fontStyle: this.props.topItalic,
            fontWeight: this.props.topBold,
            fontSize: this.props.topSize + "px",
            color: this.props.topColor,
        };
        const bottomStyle = {
            bottom: this.props.bottomTextVerticalPosition + "%", 
            left: this.props.bottomTextHorizontalPosition + "%",
            fontStyle: this.props.bottomItalic,
            fontWeight: this.props.bottomBold,
            fontSize: this.props.bottomSize + "px",
            color: this.props.bottomColor,
        };

        console.log(topStyle.fontSize);
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
            localPictureNames: [],
            pictures: [],
            currentIndex: 0,
            heading: "Choose a template",
            headingButton: "DRAW",
            buttonText: "Create Meme",
            createMode: true,
            drawMode: false,
            showPng: false,
            png: "",
            gotImageFlipPictures: false,
         };
    }

    getTemplateNames() {
         fetch('/getTemplateNames')
             .then(res => {
                 console.log("[slideShow]" + res);
                 return res.json()
              })
             .then(images => { 
                 console.log("[slideShow]" + images);
                 this.setState({ 
                     localPictureNames: images.images,  // image array is wrapped in image json
                 })
              });
    }

    // get the meme templates from the express server
    componentDidMount() {
        //  fetch('/images')
        //      .then(res => {
        //          console.log(res);
        //          return res.json()
        //       })
        //      .then(images => { 
        //          console.log(images);
        //          this.setState({ 
        //              pictures: images.images,  // image array is wrapped in image json
        //              currentIndex: 0,
        //              topText: "",
        //              bottomText: "",
        //          })
        //       });

        fetch('/images/getTemplateNames')
             .then(res => {
                 console.log("[slideShow]" + res);
                 return res.json()
              })
             .then(templates => { 
                 console.log("[slideShow]" + templates);
                 this.setState({ 
                     localPictureNames: templates.templates,  // image array is wrapped in image json
                 })
                 console.log("[slideShow]" + "after get template names")
                 this.state.localPictureNames.forEach(element => {
                     let url = 'http://localhost:3005/templates/' + element;
                     console.log("[slideShow]" + url)
                     axios.get(url, { responseType: 'arraybuffer' },
                     ).then(response => {
                         const base64 = btoa(
                             new Uint8Array(response.data).reduce(
                                 (data, byte) => data + String.fromCharCode(byte),
                                 '',
                                 ),
                                 );
                                 
                                 let newPictures = this.state.pictures;
                                 const newImage = {
                                     url: "data:;base64," + base64,
                                     imgflip: false,
                                     topText: "",
                                     bottomText: "",
                                     title: "",
                                    };
                                    newPictures = newPictures.concat(newImage);
                                    this.setState({
                                        pictures: newPictures,
                                    });
                                    
                                    /* let newSourceArray = this.state.sources;
                                    newSourceArray = newSourceArray.concat("data:;base64," + base64)
                                    this.setState({ sources: newSourceArray });
                                    console.log("data:;base64," + base64);
                                }); */
                            });
                        });
                    })
            
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
         console.log("[slideShow]" + "image gets saved to server");
 
         let index = this.state.currentIndex;
         let image = this.state.pictures[index];
         const topText = this.props.topText;
         const bottomText = this.props.bottomText;
 
         console.log("[slideShow]" + "topCaption: " + topText);
         console.log("[slideShow]" + "image: " + bottomText);
 
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
                   console.log("[slideShow]" + 'recieved answer for post request: ' + JSON.stringify( responseObject ));
                   alert(JSON.stringify( responseObject.message ))
                 })
                 .catch(jsonParseError => {
                   console.error(jsonParseError);
                 })
               ).catch(requestError => {
                 console.error(requestError);
               });
     }

    onMemeCreated(memeCreated) {
        console.log("[slideShow] return showpng: " + memeCreated);
        this.props.onMemeCreated(memeCreated);
    }

     // render the current meme template as an image on the website (does not get saved automatically on server)
     showImage = (() => {
        if(this.state.createMode) {
            let node;
            if(this.state.drawMode) {
                node = document.getElementById('draw-panel-canvas');
                node.style.border = "none";
                const that = this;
             
                htmlToImage.toPng(node)
                .then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    console.log("[slideShow]" + img);
                    that.setState({
                        showPng: true,
                        png: dataUrl,
                        buttonText: "Edit Again",
                        createMode: false,
                        createdImage: img,
                       })
                       document.getElementById('draw-panel').style.display = "none";
                       document.getElementById('get-imgflip-button').style.display = "none";
                       document.getElementById('button-group').style.display = "inline";
                       node.style.border = "1px solid black";
                       that.onMemeCreated(true);
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
                    console.log("[slideShow]" + img);
                    that.setState({
                        showPng: true,
                        png: dataUrl,
                        buttonText: "Edit Again",
                        createMode: false,
                        createdImage: img,
                       })
                       document.getElementById('meme-wrapper').style.display = "none";
                       document.getElementById('get-imgflip-button').style.display = "none";
                       document.getElementById('arrows').style.display = "none";
                       document.getElementById('button-group').style.display = "inline";
                       that.onMemeCreated(true);
                   })
                   .catch(function (error) {
                       console.error('oops, something went wrong!', error);
                   });
            }   
        } else {
            if(!this.state.gotImageFlipPictures) {
                document.getElementById('get-imgflip-button').style.display = "inline-block";
            }
            if(this.state.drawMode){
                document.getElementById('draw-panel').style.display = "inline-block";
                document.getElementById('button-group').style.display = "none";
                this.setState({
                    showPng: false,
                    png: "",
                    buttonText:"Create Meme",
                    createMode: true,
                });
                this.onMemeCreated(false);
            } else {
                document.getElementById('meme-wrapper').style.display = "block";
                document.getElementById('arrows').style.display = "block";
                document.getElementById('button-group').style.display = "none";
                this.setState({
                    showPng: false,
                    png: "",
                    buttonText:"Create Meme",
                    createMode: true,
                });
                this.onMemeCreated(false);
            }
        }
     })

     // switch the template creation mode to drawing (drawing canvas will be shown)
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

     // get memes from the ImgFlip url as templates
     getImgFlip = (() => {
        fetch('https://api.imgflip.com/get_memes')
        .then(res => {
            return res.json()
         })
        .then(memeData => { 
            console.log("[slideShow]" + memeData.data.memes.length);
            memeData.data.memes.forEach(element => {
                let newPictures = this.state.pictures;
                const newImage = {
                    url: element.url,
                    imgflip: true,
                    topText: "",
                    bottomText: "",
                    title: "",
                };
                newPictures = newPictures.concat(newImage);
                this.setState({
                    pictures: newPictures,
                    gotImageFlipPictures: true,
                });
                document.getElementById('get-imgflip-button').style.display = "none";
            });
            /* this.setState({ 
                pictures: images.images,  // image array is wrapped in image json
                currentIndex: 0,
                topText: "",
                bottomText: "",
            }) */
         });
     })

     saveMemeOnServer = () => {
        const image = this.state.png;
        const name = this.state.memeName;
        const title = this.props.title;

        if(!name || !title) {
            alert("please enter a meme name and a title!");
            return;
        }

        fetch(`/images/saveCreatedMeme`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              img: image,
              name: name,
              title: title,
            })
          }).then(jsonResponse => jsonResponse.json()
                .then(responseObject => {
                    console.log('[slideShow] recieved answer for post request: ' + JSON.stringify( responseObject ));
                    alert(JSON.stringify( responseObject.message ))
                  })
                  .catch(jsonParseError => {
                    console.error(jsonParseError);
                  })
                ).catch(requestError => {
                  console.error(requestError);
                });
        // fetch(`/upload`, 
        //     {
        //       method: 'POST',
        //       headers: {'Content-Type': 'application/json'},
        //       body: JSON.stringify( payload ),
        //     })
        //     .then(jsonResponse => jsonResponse.json()
        //       .then(responseObject => {
        //           console.log('recieved answer for post request: ' + JSON.stringify( responseObject ));
        //           alert(JSON.stringify( responseObject.message ))
        //         })
        //         .catch(jsonParseError => {
        //           console.error(jsonParseError);
        //         })
        //       ).catch(requestError => {
        //         console.error(requestError);
        //       });
        }
    
    changeMemeName = (event) => {
        event.preventDefault();
        this.setState({
            memeName: event.target.value,
        })
    }
 
     render() {
        const currentIndex = this.state.currentIndex;
        const topText = this.props.topText;
        const bottomText = this.props.bottomText;
        const topTextVerticalPosition= this.props.topTextVerticalPosition
        const topTextHorizontalPosition= this.props.topTextHorizontalPosition
        const bottomTextVerticalPosition= this.props.bottomTextVerticalPosition
        const bottomTextHorizontalPosition= this.props.bottomTextHorizontalPosition
        const topItalic = this.props.topItalic
        const bottomItalic = this.props.bottomItalic
        const topBold = this.props.topBold
        const bottomBold = this.props.bottomBold
        const topSize = this.props.topSize
        const bottomSize = this.props.bottomSize
        const topColor = this.props.topColor
        const bottomColor = this.props.bottomColor

        let url;
        let isImageFlip;
        if(this.state.pictures.length > currentIndex) {
            url = this.state.pictures[currentIndex].url;
            isImageFlip = this.state.pictures[currentIndex].imgflip;
        } else {
            url = ""
        }

        let createdImage;
        if(this.state.showPng) {
           createdImage = this.state.png;
        }

        let counter;
        if(!this.state.drawMode){
           counter = <div><p>Template {currentIndex+1} of {this.state.pictures.length}</p></div>
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
                    <button className="create-meme-button" id="get-imgflip-button" onClick={this.getImgFlip}>
                        Get ImgFlip Meme Templates
                    </button>
                    <button className="create-meme-button" onClick={this.showImage}>{this.state.buttonText}</button>
                 </div>
 
                {/* {counter} */}
 
                <React.Fragment>
                    <div className="draw-panel" id="draw-panel">
                        <DrawApp title={this.props.title} />
                    </div>
                    <div className="meme-wrapper" id="meme-wrapper">
                       <Meme 
                        url={url} 
                        isImageFlip={isImageFlip}
                        title={this.props.title}
                        topText={topText} 
                        bottomText={bottomText} 
                        topTextHorizontalPosition={topTextHorizontalPosition}
                        topTextVerticalPosition={topTextVerticalPosition}
                        bottomTextHorizontalPosition={bottomTextHorizontalPosition}
                        bottomTextVerticalPosition={bottomTextVerticalPosition}
                        topItalic={topItalic}
                        bottomItalic={bottomItalic}
                        topBold={topBold}
                        bottomBold={bottomBold}
                        topSize={topSize}
                        bottomSize={bottomSize}
                        topColor={topColor} 
                        bottomColor={bottomColor}
                         />
                    </div>
                </React.Fragment>
                <div className="button-group" id="button-group">
                    <div>
                        <p className="warning">Make sure you have added a title and a meme name before you share ;)</p>
                    </div>
                   {/* <button className="saveButton" onClick={() => {this.saveOnServer()}}>
                     Save Meme on server
                   </button> */}
                   <input type="text" placeholder="enter a unique meme name" onChange={this.changeMemeName}></input>
                   <button className="saveButton" onClick={() => {this.saveMemeOnServer()}}>
                     Share
                   </button>
{/*                    <button onClick={() => exportComponentAsJPEG(this.componentRef)}>
                       Download As JPEG
                   </button> */}
                   <button onClick={() => exportComponentAsPNG(this.componentRef)}>
                       Download As PNG
                   </button>
                </div>
                <div>
                   <img src={createdImage} ref={this.componentRef}/>
                </div>
             </div>
         );
     }
 }