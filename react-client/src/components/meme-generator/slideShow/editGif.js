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
        // this.componentRef = React.createRef();
        console.log(props)
        this.state = {
            currentPicture: this.props.picture,
        } 
        
    }

    draw(p) { 

        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        this.reset();

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
        
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, width, height)
            this.updateTexts(width, height)
        }
    }

    updateTexts(width, height) {
        let texts = this.props.texts
        console.log(texts)

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

        console.log(textWidth, textHeight)

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

    reset() { //clears it to all white

        //const canvasRef = useRef(null)
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context
        this.ctx.fillStyle="white"
        this.ctx.fillRect(0,0,canvas.offsetWidth, canvas.offsetHeight)
        this.ctx.lineWidth = 10
    }

    insertImageHere(e) { // insert Image at the position of the mouse
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        let x = e.nativeEvent.offsetX
        let y = e.nativeEvent.offsetY

        this.ctx.fillStyle="green"
        this.ctx.fillRect(x-25, y-25, 50, 50)
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