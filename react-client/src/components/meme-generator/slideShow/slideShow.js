import React from 'react';
import axios from 'axios';
import arrowBack from '../../img/arrow_back-black-18dp.svg';
import arrowForward from '../../img/arrow_forward-black-18dp.svg';
import './../memeGenerator.css';
import {exportComponentAsPNG } from 'react-component-export-image';
import * as htmlToImage from 'html-to-image';
import './slideShow.css';
import DrawApp from './drawMeme';
import GifEditor from './editGif';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import TemplateMeme from './templateMeme/templateMeme';
import {Checkbox, FormControlLabel} from "@material-ui/core";

/**
* class which renders the meme template and handles all the user-driven updates on it
*/
export default class SlideShow extends React.Component {
    constructor(props){
        super(props);
        // console.log(props)
        this.componentRef = React.createRef();
        this.gifChild = React.createRef();
        this.state = {
            localPictureNames: [],
            pictures: [],
            currentIndex: 0,
            heading: "Choose a template",
            headingButton: "Draw a Meme",
            gifButton: "Edit GIF Template",
            buttonText: "Create Meme",
            createMode: true,
            drawMode: false,
            gifMode: false,
            showPng: false,
            png: "",
            gotImageFlipPictures: false,
            icon: <BsChevronRight/>,
            expanded: false,
            iconCanvasOptions: <BsChevronRight/>,
            expandedcanvasOptions: false,
            maxWidth: Math.floor(window.innerWidth/2-(window.innerWidth*0.05)),
            canvasWidth: Math.min(600, Math.floor(window.innerWidth/2-(window.innerWidth*0.05))),
            canvasHeight: 600,
            insertWidth: 200,
            insertHeight: 200,
            isPrivate: false
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
                 console.log("[slideShow] after get template names")
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
                                     template: element.name.slice(0,-4),
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
         let picture = this.state.pictures[nextIndex];
         if(nextIndex === this.state.pictures.length) {
             this.setState({ 
                 pictures: this.state.pictures,
                 currentIndex: 0 }) 
             picture = this.state.pictures[0];   
         } else {
             this.setState({
                 pictures: this.state.pictures,
                 currentIndex: nextIndex 
             })
             
         }
         this.gifChild.current.draw(picture);
     }
 
     // go to previous meme template
     onClickPrevious() {
         const previousIndex = this.state.currentIndex - 1;
         let picture = this.state.pictures[previousIndex];
         if(previousIndex < 0) {
             this.setState({ 
                 pictures: this.state.pictures,
                 currentIndex: this.state.pictures.length - 1 })
             picture = this.state.pictures[this.state.pictures.length - 1]   
         } else {
             this.setState({
                 pictures: this.state.pictures,
                 currentIndex: previousIndex
             })
         }
         this.gifChild.current.draw(picture);
     }

     // choose a template out of the template overview
     onClickChooseTemplate(index){
         this.setState({
             currentIndex: index,
             heading: "Choose a template",
             headingButton: "Draw a Meme",
             drawMode: false,

         })

         if(this.state.gifMode) {
            let picture = this.state.pictures[index];
            this.gifChild.current.draw(picture);
         }
     }

     onClickInsertNewTemplate(index){
            let picture = this.state.pictures[index];
            this.gifChild.current.setNewInsertPicture(picture);
     }
 
     // save current meme template to the express server
     saveOnServer() {
         console.log("[slideShow] image gets saved to server");
 
         let index = this.state.currentIndex;
         let image = this.state.pictures[index];
         const topText = this.props.topText;
         const bottomText = this.props.bottomText;
 
         console.log("[slideShow] topCaption: " + topText);
         console.log("[slideShow] image: " + bottomText);
 
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
                   console.log("[slideShow] recieved answer for post request: " + JSON.stringify( responseObject ));
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
        this.props.onMemeCreated(memeCreated);
    }

     // render the current meme template as an image on the website (does not get saved automatically on server)
     showImage = (() => {
         // switch from editing to "save meme"
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
                       that.setGenerateMemeView()
                       node.style.border = "1px solid black";
                       that.onMemeCreated(true);
                   })
                   .catch(function (error) {
                       console.error('oops, something went wrong!', error);
                   });
            } else {
                if (this.state.gifMode) {
                    node = document.getElementById('edit-gif-panel');
                } else {
                    node = document.getElementById('image-wrapper');
                }
                
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
                    that.setGenerateMemeView()
                       that.onMemeCreated(true);
                   })
                   .catch(function (error) {
                       console.error('oops, something went wrong!', error);
                   });
            }  
        // switch back to editing the meme 
        } else {
            if(!this.state.gotImageFlipPictures) {
                document.getElementById('get-imgflip-button').style.display = "inline-block";
            }
            if(this.state.drawMode){
                this.setDrawView()
                this.setState({
                    showPng: false,
                    png: "",
                    buttonText:"Create Meme",
                    createMode: true,
                });
                this.onMemeCreated(false);
            } else if (!this.state.gifMode){
                this.setEditPngView()
                this.setState({
                    showPng: false,
                    png: "",
                    buttonText:"Create Meme",
                    createMode: true,
                });
                this.onMemeCreated(false);
            } else {
                this.setEditGifView()
                // TODO: Switch to Edith GIF State prüfen
                this.setState({
                    heading: "Choose a template",
                    headingButton: "Draw a Meme",
                    gifButton: "Edit PNG Template",
                    buttonText:"Create Meme",
                    drawMode: false,
                    gifMode: true,
                    createMode: true,
                }) 
                let picture = this.state.pictures[this.state.currentIndex];
                this.gifChild.current.draw(picture);
            }
        }
     })

     // switch the template creation mode to drawing (drawing canvas will be shown)
     changeToDraw = (() => {
         if(!this.state.createMode) {
             alert("First switch to editing again!");
             return;
         }
        if(!this.state.drawMode){
            this.setDrawView()
            this.setState({
                heading: "Draw",
                headingButton: "Choose Template",
                drawMode: true,
            })
        // switch from drawing mode to template editing
        } else if (!this.state.gifMode){
            this.setEditPngView()
            this.setState({
                heading: "Choose a template",
                headingButton: "Draw a Meme",
                drawMode: false,
                gifButton: "Edit GIF Template",
                gifMode:false,
            }) 
        } else {
            this.setEditGifView()
            // TODO: Switch to Edith GIF State prüfen
            this.setState({
                heading: "Choose a template",
                headingButton: "Draw a Meme",
                gifButton: "Edit PNG Template",
                drawMode: false,
                gifMode: true
            }) 
            let picture = this.state.pictures[this.state.currentIndex];
            this.gifChild.current.draw(picture);
        }
     })
     // switch from png template to gif template
     changeToGif = (() => {
        if(!this.state.createMode) {
            alert("First switch to editing again!");
            return;
        }
       if(this.state.drawMode){
            alert("First switch to template selection!");
            return;
       } else {
           // switch from template to gif editing
           if(!this.state.gifMode){
                this.setEditGifView()
            this.setState({
                heading: "Choose a template",
                headingButton: "Draw a Meme",
                gifButton: "Edit PNG Template",
                drawMode: false,
                gifMode: true
            }) 
            let picture = this.state.pictures[this.state.currentIndex];
            this.gifChild.current.draw(picture);


            // switch from gif to template editing
           } else {
               this.setEditPngView()
               this.setState({
                   heading: "Choose a template",
                   headingButton: "Draw a Meme",
                   gifButton: "Edit GIF Template",
                   drawMode: false,
                   gifMode: false
               }) 
           }  
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
                    template: element.name,
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
        const isPrivate = this.state.isPrivate
        let index = this.state.currentIndex;
        let template;
        if(this.state.drawMode === false){
            template = this.state.pictures[index].template;
        }else{
            template = 'drawing';
        }

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
              isPrivate: isPrivate,
              template: template,
              comments: []
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

    expandCanvasOptions = () => {
        if(!this.state.expandedCanvasOptions) {
            document.getElementById("adjust-canvas-size").style.display = "inline";
            this.setState({
              iconCanvasOptions: <BsChevronDown/>,
              expandedCanvasOptions: true,
            })
          } else {
            document.getElementById("adjust-canvas-size").style.display = "none";
            this.setState({
              iconCanvasOptions: <BsChevronRight/>,
              expandedCanvasOptions: false,
            })
          }
    }

    setDrawView = () => {
        console.log("Changed to Draw View")
        document.getElementById('button-group').style.display = "none";
        document.getElementById('template-overview').style.display= "block";
        document.getElementById('draw-panel').style.display = "inline-block";
        document.getElementById('edit-gif-panel').style.display = "none";
        document.getElementById('reset-gif-canvas').style.display= "none";
        document.getElementById('custom-canvas').style.display = "none";
        document.getElementById('insert-additional-image').style.display= "none";
        document.getElementById('meme-wrapper').style.display = "none";
        document.getElementById('arrows').style.display = "none";
        document.getElementById('template-overview-wrapper').style.display= "none";
        document.getElementById('gif-button').style.display= "none";
        document.getElementById('refresh-gif-canvas').style.display= "none";
        document.getElementById('undo-last-insert').style.display= "none";
        document.getElementById('choose-template-heading').style.display= "inline";
        document.getElementById('draw-button').style.display= "block";
    }

    setEditPngView = () => {
        console.log("Changed to Edit PNG View")
        document.getElementById('button-group').style.display = "none";
        document.getElementById('template-overview').style.display= "none";
        document.getElementById('draw-panel').style.display = "none";
        document.getElementById('edit-gif-panel').style.display = "none";
        document.getElementById('reset-gif-canvas').style.display= "none";
        document.getElementById('custom-canvas').style.display = "none";
        document.getElementById('insert-additional-image').style.display= "none";
        document.getElementById('meme-wrapper').style.display = "block";
        document.getElementById('arrows').style.display = "block";
        document.getElementById('template-overview-wrapper').style.display= "block";
        document.getElementById('gif-button').style.display= "block";
        document.getElementById('draw-button').style.display= "block";
        document.getElementById('input-section-template').style.display="block";
        document.getElementById('refresh-gif-canvas').style.display= "none";
        document.getElementById('undo-last-insert').style.display= "none";
        document.getElementById('choose-template-heading').style.display= "inline";
    }

    setEditGifView = () => {
        console.log("Changed to Edit GIF View")
        document.getElementById('draw-panel').style.display = "none";
        document.getElementById('edit-gif-panel').style.display = "block";
        document.getElementById('reset-gif-canvas').style.display= "inline";
        document.getElementById('custom-canvas').style.display = "inline";
        document.getElementById('insert-additional-image').style.display= "block";
        document.getElementById('meme-wrapper').style.display = "none";
        document.getElementById('arrows').style.display = "block";
        document.getElementById('template-overview-wrapper').style.display= "block";
        document.getElementById('input-section-template').style.display="block";
        document.getElementById('refresh-gif-canvas').style.display= "inline";
        document.getElementById('undo-last-insert').style.display= "inline";
        document.getElementById('gif-button').style.display= "block";
        document.getElementById('draw-button').style.display= "block";
        document.getElementById('choose-template-heading').style.display= "inline";
    }

    setGenerateMemeView = () => {
        console.log("Changed to Generate Meme View")
        document.getElementById('draw-panel').style.display = "none";
        document.getElementById('edit-gif-panel').style.display = "none";
        document.getElementById('reset-gif-canvas').style.display= "none";
        document.getElementById('custom-canvas').style.display = "none";
        document.getElementById('insert-additional-image').style.display= "none";
        document.getElementById('get-imgflip-button').style.display = "none";
        document.getElementById('button-group').style.display = "inline";
        document.getElementById('template-overview').style.display= "none";
        document.getElementById('meme-wrapper').style.display = "none";
        document.getElementById('arrows').style.display = "none";
        document.getElementById('refresh-gif-canvas').style.display= "none";
        document.getElementById('undo-last-insert').style.display= "none";
        document.getElementById('gif-button').style.display= "none";
        document.getElementById('draw-button').style.display= "none";
        document.getElementById('template-overview-wrapper').style.display= "none";
        document.getElementById('choose-template-heading').style.display= "none";
    }

    handleWidthChange = (event) => {
        event.preventDefault();
        let val = event.target.value;
        console.log(val)
        this.setState({
            canvasWidth: val
        });
    }

    handleHeightChange = (event) => {
        event.preventDefault();
        this.setState({
            canvasHeight: event.target.value
        });
    }

    adjustCanvasWidth = (event) => {
        event.preventDefault();
        this.gifChild.current.adjustCanvasWidth(this.state.canvasWidth);
    }

    adjustCanvasHeight = (event) => {
        event.preventDefault();
        this.gifChild.current.adjustCanvasHeight(this.state.canvasHeight);
    }

    handleInsertWidthChange = (event) => {
        event.preventDefault();
        this.setState({
            insertWidth: event.target.value
        });
        this.gifChild.current.adjustInsertWidth(event.target.value)
    }

    handleInsertHeightChange = (event) => {
        event.preventDefault();
        this.setState({
            insertHeight: event.target.value
        });
        this.gifChild.current.adjustInsertHeight(event.target.value)
    }

    resetGifCanvas = () => {
        this.gifChild.current.reset()
        this.gifChild.current.resetElements()
    }

    refreshGifCanvas = () => {
        this.gifChild.current.update()
    }

    updateTexts = () => {
        this.gifChild.current.update()
        this.gifChild.current.update()
    }

    undoLastInsert = () => {
        this.gifChild.current.undoLastInsert()
        this.gifChild.current.update()
    }
 
    handleMarkPrivate(){
        this.setState({
            isPrivate: !this.state.isPrivate
        })
        console.log(this.state.isPrivate)
    }

     render() {
        const currentIndex = this.state.currentIndex;

        let url;
        let template;
        let isImageFlip;
        if(this.state.pictures.length > currentIndex) {
            url = this.state.pictures[currentIndex].url;
            isImageFlip = this.state.pictures[currentIndex].imgflip;
            template = this.state.pictures[currentIndex].template;
        } else {
            url = ""
        }

        let createdImage;
        if(this.state.showPng) {
           createdImage = this.state.png;
        }

        // let counter;
        // if(!this.state.drawMode){
        //    counter = <div><p>Template {currentIndex+1} of {this.state.pictures.length}</p></div>
        // }

        // define html section for overview
        const templates = this.state.pictures
        const allTemplates = templates.map(
            (t, index) => <img src={t.url} alt="Meme Template that can be edited" className="flex-img" onClick={() => this.onClickChooseTemplate(index)}></img>
            )
        
        const allTemplatesToAdd = templates.map(
            (t, index) => <img src={t.url} alt="Meme Template that can be edited" className="flex-img" onClick={() => this.onClickInsertNewTemplate(index)}></img>
        )
 
         return (
             <div className="main">
                 <div className="slide-show-heading">
                    <h2 id="choose-template-heading">{this.state.heading} or </h2>
                    <button className="draw-button" id="draw-button" onClick={this.changeToDraw}>{this.state.headingButton}</button>
                    <button className="gif-button" id ="gif-button" onClick={this.changeToGif}>{this.state.gifButton}</button>
                 </div>

                <div className="template-overview-wrapper" id="template-overview-wrapper">
                    <div className="header-button-group">
                      <h2>Choose from all templates</h2>
                      <button onClick={this.expand}>{this.state.icon}</button>
                    </div>
                    <div className="template-overview" id="template-overview">
                    <button className="create-meme-button" id="get-imgflip-button" onClick={this.getImgFlip}>
                        Get ImgFlip Meme Templates
                    </button>
                        <p>Click template to edit:</p>
                        <div className="flex-overview">
                            {allTemplates}  
                        </div>
                    </div>
                </div>

                 <div className="navigation-buttons">
                    <div className="arrows" id="arrows">
                        <img src={arrowBack} alt="Arrow pointing to the left" className="backButton" onClick={() => this.onClickPrevious()}></img>
                        <img src={arrowForward} alt="Arrow pointing to the right" className="nextButton" onClick={() => this.onClickNext()}></img>
                    </div>
                    <button className="create-meme-button" onClick={this.showImage}>{this.state.buttonText}</button>
                    <button className="reset-gif-canvas" id="reset-gif-canvas" onClick={() => this.resetGifCanvas()}>Reset</button>
                    <button className="refresh-gif-canvas" id="refresh-gif-canvas" onClick={() => this.refreshGifCanvas()}>Refresh</button>
                    <button className="undo-last-insert" id="undo-last-insert" onClick={() => this.undoLastInsert()} >Undo last insert</button>
                 </div>

                 <div className="custom-canvas" id="custom-canvas">
                     <div className="custom-canvas-heading">
                        <h2>Enter custom canvas size</h2>
                        <button className="toggle-canvas-options" id="toggle-canvas-options" onClick={this.expandCanvasOptions}>{this.state.iconCanvasOptions}</button>
                     </div>
                    <div className="adjust-canvas-size" id="adjust-canvas-size">
                        <form className="input-form-width" onSubmit={this.adjustCanvasWidth}>
                            <p>Width :</p>
                            <input type="number" min="10" max={this.state.maxWidth} defaultValue={this.state.canvasWidth} name="custom-canvas-width" onChange={this.handleWidthChange}></input>
                            <button className="set-canvas-width" type="submit">Submit</button>
                        </form>
                        <form className="input-form-height" onSubmit={this.adjustCanvasHeight}>
                            <p>Height: </p>
                            <input type="number" min="10" max="1000" defaultValue={this.state.canvasHeight} name="custom-canvas-height" onChange={this.handleHeightChange}></input>
                            <button className="set-canvas-height" type="submit">Submit</button>
                        </form>
                    </div>
                 </div>

                 

 
                <React.Fragment>
                    <div className="draw-panel" id="draw-panel">
                        <DrawApp title={this.props.title} />
                    </div>
                    <div className="edit-gif-panel" id="edit-gif-panel">
                        <GifEditor ref={this.gifChild}
                            title={this.props.title}
                            currentIndex={this.state.currentIndex}
                            picture={this.state.pictures[this.state.currentIndex]}
                            texts={this.props.texts}/>
                    </div>
                    <div className="insert-additional-image" id="insert-additional-image">
                        <h2>Choose additional Template to insert:</h2>
                        <div className="size-inserted-image" id="size-inserted-image">
                            <span>Maximum size of inserted image: </span>
                            <input type="number" min="10" max={this.state.canvasWidth} defaultValue={this.state.insertWidth} name="insert-width" onChange={this.handleInsertWidthChange}></input>
                            <span> x </span>
                            <input type="number" min="10" max={this.state.canvasHeight} defaultValue={this.state.insertHeight} name="insert-height" onChange={this.handleInsertHeightChange}></input>
                            <span> px</span>
                        </div>
                        <div className="flex-overview">
                            {allTemplatesToAdd}  
                        </div>
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
                    <FormControlLabel
                        control={<Checkbox onChange={() => {this.handleMarkPrivate()}} name="checkedA" />}
                        label="mark private"
                    />

                </div>
                <div>
                    {/* eslint-disable-next-line */}
                   <img src={createdImage} ref={this.componentRef}/>
                </div>
             </div>
         );
     }
 }