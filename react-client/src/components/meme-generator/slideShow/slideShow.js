import React from 'react';
import axios from 'axios';
import arrowBack from '../../img/arrow_back-black-18dp.svg';
import arrowForward from '../../img/arrow_forward-black-18dp.svg';
import './../memeGenerator.css';
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import * as htmlToImage from 'html-to-image';
import './slideShow.css';
import DrawApp from './drawMeme';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import TemplateMeme from './templateMeme/templateMeme';

/**
* class which renders the meme template and handles all the user-driven updates on it
*/
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
            icon: <BsChevronRight/>,
            expanded: false,
         };
    }

    /**
    * first get all the names of the templates 
    * then get the meme templates from the express server by the names
    */
    componentDidMount() {
        fetch('http://localhost:3005/images/getTemplateNames')
             .then(res => {
                 return res.json()
              })
             .then(templates => { 
                 console.log("[slideShow]" + templates);
                 this.setState({ 
                     localPictureNames: templates.templates,  // image array is wrapped in image json
                 })
                 this.state.localPictureNames.forEach(element => {
                     let url = 'http://localhost:3005/templates/' + element.name;
                     console.log("[slideShow]" + url)
                     axios.get(url, { responseType: 'arraybuffer' },
                     ).then(response => {
                         // image data is base64 encoded
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

     // choose a template out of the template overview
     onClickChooseTemplate(index){

        document.getElementById('draw-panel').style.display = "none";
        document.getElementById('meme-wrapper').style.display = "block";
        document.getElementById('arrows').style.display = "block";

         this.setState({
             currentIndex: index,
             heading: "Choose a template",
             headingButton: "DRAW",
             drawMode: false,

         })
     }

    onMemeCreated(memeCreated) {
        this.props.onMemeCreated(memeCreated);
    }

     // render the current meme template as an image on the website (does not get saved automatically on server)
     showImage = (() => {
        if(this.state.createMode) {
            let node;
            if(this.state.drawMode) {
                node = document.getElementById('draw-panel-canvas');
                node.style.border = "none";
                // inside htmlToImage we have to reference this as that
                const that = this;
             
                // convert html section as image
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
                       document.getElementById('template-overview').style.display= "none";
                       node.style.border = "1px solid black";
                       that.onMemeCreated(true);
                   })
                   .catch(function (error) {
                       console.error('oops, something went wrong!', error);
                   });
            } else {
                node = document.getElementById('image-wrapper');
                const that = this
             
                // convert html section as image
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
                       document.getElementById('template-overview').style.display= "none";
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
                document.getElementById('template-overview').style.display= "block";
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
                document.getElementById('template-overview').style.display= "none";
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
            document.getElementById('template-overview-wrapper').style.display= "none";
            
            this.setState({
                heading: "Draw",
                headingButton: "choose template",
                drawMode: true,
            })
        } else {
            document.getElementById('draw-panel').style.display = "none";
            document.getElementById('meme-wrapper').style.display = "block";
            document.getElementById('arrows').style.display = "block";
            document.getElementById('template-overview-wrapper').style.display= "block";
            
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
         });
     })

     // save the created meme onto the express server
     saveMemeOnServer = () => {
        const image = this.state.png;
        const name = this.state.memeName;
        const title = this.props.title;
        const user = this.props.user

        if(!name || !title) {
            alert("please enter a meme name and a title!");
            return;
        }

        fetch(`http://localhost:3005/images/saveCreatedMeme`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              img: image,
              name: name,
              title: title,
              user: user,
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
        }
    
    changeMemeName = (event) => {
        event.preventDefault();
        this.setState({
            memeName: event.target.value,
        })
    }

    expand = () => {
        if(!this.state.expanded) {
          document.getElementById("template-overview").style.display = "inline";
          this.setState({
            icon: <BsChevronDown/>,
            expanded: true,
          })
        } else {
          document.getElementById("template-overview").style.display = "none";
          this.setState({
            icon: <BsChevronRight/>,
            expanded: false,
          })
        }
      }
 
     render() {
        console.log(this.props.user)
        const currentIndex = this.state.currentIndex;

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

        // define html section for overview
        const templates = this.state.pictures
        const allTemplates = templates.map(
            (t, index) => <img src={t.url} className="flex-img" onClick={() => this.onClickChooseTemplate(index)}></img>
            )
 
         return (
             <div className="main">
                 <div className="slide-show-heading">
                    <h2>{this.state.heading} or </h2>
                    <button className="draw-button" onClick={this.changeToDraw}>{this.state.headingButton}</button>
                 </div>

                <div className="template-overview-wrapper" id="template-overview-wrapper">
                    <div className="header-button-group">
                      <h2>Choose from all templates</h2>
                      <button onClick={this.expand}>{this.state.icon}</button>
                    </div>
                    <div className="template-overview" id="template-overview">
                        <p>Click template to edit:</p>
                        <div className="flex-overview">
                            {allTemplates}  
                        </div>
                    </div>
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
 
                <React.Fragment>
                    <div className="draw-panel" id="draw-panel">
                        <DrawApp title={this.props.title} />
                    </div>
                    <div className="meme-wrapper" id="meme-wrapper">
                        <TemplateMeme 
                        url={url} 
                        isImageFlip={isImageFlip}
                        title={this.props.title}
                        texts={this.props.texts}
                        />
                    </div>
                </React.Fragment>

                <div className="button-group" id="button-group">
                    <div>
                        <p className="warning">Make sure you have added a title and a meme name before you share ;)</p>
                    </div>
                   <input type="text" placeholder="enter a unique meme name" onChange={this.changeMemeName}></input>
                   <button className="saveButton" onClick={() => {this.saveMemeOnServer()}}>
                     Share
                   </button>
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