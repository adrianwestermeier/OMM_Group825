import React from 'react';
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
        
    }

    draw(i, p) { 

        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        this.reset();

        let picture = p;

        const img = new Image()
        img.src = picture.url;

        let scalingFactorWidth = canvas.offsetWidth/img.width
        let scalingFactorHeight = canvas.offsetHeight/img.height

        let scalingFactor = Math.min(scalingFactorWidth, scalingFactorHeight)

        let width = img.width*scalingFactor
        let height = img.height*scalingFactor
        
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, width, height)
            this.updateTexts()
        }
    }

    updateTexts() {
        let texts = this.props.texts
        console.log(texts)

        texts.forEach(text => this.addText(text))
       
    }

    addText(text) {
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.ctx = context

        // this.ctx.font = "Arial";
        this.ctx.font = text.bold + ' ' +
                        text.italic + ' ' +
                        text.size +
                        'px Arial';
        this.ctx.fillStyle = text.color;
        this.ctx.fillText(text.text,
                          text.horizontalPosition,
                          text.verticalPosition);
    
    }

    reset() { //clears it to all white, resets state to original

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