import React from 'react';
import { walkUpBindingElementsAndPatterns } from 'typescript';
import './editGif.css';


const styles = {
    canvas : {
        margin:'2px'
    },

    maindiv : {
        //padding:'10px',
        margin:'auto',
        width:'600px'
    },

    button : {
        border:'0px',
        margin:'1px',
        height:'50px',
        minWidth:'75px'
    },

}

//simple draw component made in react
export default class GifEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPicture: this.props.picture,
            pictureToAdd: this.props.picture,
            insertWidth: 200, 
            insertHeight: 200,
            standardWidth: undefined, 
            standardHeight:undefined, 
            allPictures: [[this.props.picture]],
            allPicturesPositions: [[0, 0]],
            allPicturesSize: [[600, 600]],
        }
        
    }

    draw(p) { 
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        this.reset();
        this.resetElements();

        let picture = p;

        this.setState({
            currentPicture: p
        })

        const img = new Image()
        img.src = picture.url;

        let scalingFactorWidth = canvas.offsetWidth/img.width
        let scalingFactorHeight = canvas.offsetHeight/img.height

        let scalingFactor = Math.min(scalingFactorWidth, scalingFactorHeight)

        let width = img.width*scalingFactor
        let height = img.height*scalingFactor

        let pictureSizes = this.state.allPicturesSize
        let size = [width, height]
        pictureSizes[0] = size

        let pictures = this.state.allPictures
        pictures[0] = p
  
        this.setState({
            allPicturesSize: pictureSizes,
            allPictures: pictures,
            standardWidth: width,
            standardHeight: height
        })    

        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, width, height)
            this.updateTexts()
        }
        console.log(this.state.allPictures.length,
                    this.state.allPicturesPositions.length,
                    this.state.allPicturesSize.length)
    }

    insertImageHere(e) { // insert Image at the position of the mouse
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        let x = e.nativeEvent.offsetX
        let y = e.nativeEvent.offsetY

        const img = new Image()
        if (!this.state.pictureToAdd) {
            window.alert("Please first select the image you want to insert!")
        } else {
            img.src = this.state.pictureToAdd.url;

            let scalingFactorWidth = this.state.insertWidth/img.width
            let scalingFactorHeight = this.state.insertHeight/img.height
    
            let scalingFactor = Math.min(scalingFactorWidth, scalingFactorHeight)
    
            let width = img.width*scalingFactor
            let height = img.height*scalingFactor
            
            img.onload = () => {
                this.ctx.drawImage(img, x, y, width, height)
                this.updateTexts()
            }
    
            this.setState({
                allPictures: this.state.allPictures.concat(this.state.pictureToAdd),
                allPicturesPositions: this.state.allPicturesPositions.concat([[x, y]]),
                allPicturesSize: this.state.allPicturesSize.concat([[width, height]]),
            })
        }
        console.log(this.state.allPictures.length,
            this.state.allPicturesPositions.length,
            this.state.allPicturesSize.length)
    }

    setNewInsertPicture(picture) {
        this.setState({
            pictureToAdd: picture
        })
    }

    updateTexts() {
        let texts = this.props.texts
        console.log(texts)
        let width = this.state.allPicturesSize[0][0]
        let height = this.state.allPicturesSize[0][1]

        texts.forEach(text => this.addText(text, width, height))
        
    }

    addText(text, w, h) {
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        let width = w
        let height = h

        let textWidth = this.ctx.measureText(text.text).width
        let textHeight = text.size

        let x = (text.horizontalPosition/100*width)
        let y = (text.verticalPosition/100*height)

        if (x > width) {
            x = width
        } else if (x < textWidth/2) {
            x = textWidth/2
        }

        if (y > height) {
            x = height
        } else if (y < textHeight) {
            y = textHeight
        }

        // get Text Style
        this.ctx.font = text.bold + ' ' +
                        text.italic + ' ' +
                        text.size +
                        'px Times New Roman';
        this.ctx.fillStyle = text.color;
        this.ctx.fillText(text.text, x-textWidth/2, y-textHeight/2);
    
    }

    redrawAllImages() {
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        this.reset();

        console.log(this.state.allPictures, this.state.allPicturesPositions, this.state.allPicturesSize)

        for (let i =0; i < this.state.allPictures.length; i++) {
            console.log(i)
            const img = new Image()
            
            img.src = this.state.allPictures[i].url;

            let x = this.state.allPicturesPositions[i][0]
            let y = this.state.allPicturesPositions[i][1]

            let width = this.state.allPicturesSize[i][0]
            let height = this.state.allPicturesSize[i][1]
            
            img.onload = () => {
                this.ctx.drawImage(img, x, y, width, height)
                this.updateTexts()
            }
            
        }
            
    }

    undoLastInsert() {
        let pictures = this.state.allPictures
        let allPositions = this.state.allPicturesPositions
        let allSizes = this.state.allPicturesSize
        
        if (pictures.length > 1) {
            pictures.pop()
            allPositions.pop()
            allSizes.pop()

            this.setState({
                allPictures: pictures,
                allPicturesPositions: allPositions,
                allPicturesSize: allSizes
            })
        } else {
            window.alert("Could not remove an element")
        }
    }

    update() {
        this.redrawAllImages()
    }

    reset() { //clears it to all white
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context
        this.ctx.fillStyle="white"
        this.ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    }

    resetElements() {
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.setState({
            allPictures: [this.state.currentPicture],
            allPicturesPositions: [[0, 0]],
            allPicturesSize: [[this.state.standardWidth, this.state.standardHeight]],
        })
    }

    adjustCanvasWidth(width) {
        console.log(width)
        const canvas = document.getElementById('canvas')
        canvas.width = width
        this.draw(this.state.currentPicture)
    }

    adjustCanvasHeight(height) {
        console.log(height)
        const canvas = document.getElementById('canvas')
        canvas.height = height
        this.draw(this.state.currentPicture)
    }

    adjustInsertWidth(width) {
        this.setState({
            insertWidth: width
        })
        console.log(width)
    }

    adjustInsertHeight(height) {
        this.setState({
            insertHeight: height
        })
        console.log(height)
    }
    

    render() {
        return (
            <div style={styles.maindiv}>
                <div className="edit-gif-canvas" id="edit-gif-canvas">
                    <figure>
                    <figcaption position="center">{this.props.title}</figcaption>
                        <canvas ref="canvas" id="canvas" width="600px" height="600px" style={styles.canvas} ref={this.componentRef}
                            onMouseDown={(e) => this.insertImageHere(e)}>
                        </canvas>
                    </figure>
                </div>
            </div>
        )
    }
}