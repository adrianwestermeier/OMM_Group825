import React from 'react';
import './templateMeme.css'

// Meme template with top and bottom caption
export default class TemplateMeme extends React.Component {
    constructor(props){
        super(props);

        

        // this.state = {
        //     textsWithStyle: textsWithStyle,
        // }
    }
    render() {
        // const topStyle = {
        //     top: this.props.topTextVerticalPosition + "%", 
        //     left: this.props.topTextHorizontalPosition + "%",
        //     fontStyle: this.props.topItalic,
        //     fontWeight: this.props.topBold,
        //     fontSize: this.props.topSize + "px",
        //     color: this.props.topColor,
        // };
        // const bottomStyle = {
        //     bottom: this.props.bottomTextVerticalPosition + "%", 
        //     left: this.props.bottomTextHorizontalPosition + "%",
        //     fontStyle: this.props.bottomItalic,
        //     fontWeight: this.props.bottomBold,
        //     fontSize: this.props.bottomSize + "px",
        //     color: this.props.bottomColor,
        // };

        let textsWithStyle = [];

        for (const text of this.props.texts) {
            // const topText = {
            //     index: 0,
            //     captionType: "top",
            //     heading: "Style top text",
            //     placeholder: "top caption",
            //     text: "",
            //     verticalPosition: 0,
            //     horizontalPosition: 100,
            //     size: 18,
            //     color: "black",
            //     italic: "normal",
            //     bold: "normal",
            //   };
            let textWithStyle = {
                text: "",
                style: {},
            };
            textWithStyle.text = text.text;
            const style = {
                    top: text.verticalPosition + "%", 
                    left: text.horizontalPosition + "%",
                    fontStyle: text.italic,
                    fontWeight: text.bold,
                    fontSize: text.size + "px",
                    color: text.color,
                };
            textWithStyle.style = style;
            textsWithStyle.push(textWithStyle);
        }

        // console.log(topStyle.fontSize);
        const pictureTexts = <div>
        {textsWithStyle.map(textWithStyle => (
        //   <InputsText 
        //   index={text.index}
        //   captionType={text.captionType}
        //   heading={text.heading}
        //   placeholder={text.placeholder}
        //   textSubmitHandle={this.handleTextSubmit}
        //   increaseHorizontalPosition={this.increaseHorizontalPosition}
        //   decreaseHorizontalPosition={this.decreaseHorizontalPosition}
        //   increaseVerticalPosition={this.increaseVerticalPosition}
        //   decreaseVerticalPosition={this.decreaseVerticalPosition}
        //   clickedItalic={this.clickedItalic}
        //   clickedBold={this.clickedBold}
        //   changedSize={this.changedSize}
        //   changedColor={this.changedColor}
        //   />
        
                        <div className="topOut" style={textWithStyle.style}>
                            {textWithStyle.text}
                        {/* <div className="bottomOut" style={bottomStyle}>
                            {this.props.bottomText}
                        </div>    */}
                        </div>
                    
        ))}
      </div>

        return(
            <div className="image-wrapper" id="image-wrapper">
                <figure>
                    <figcaption>{this.props.title}</figcaption>
                    <div className="top-and-bottom-wrapper">
                        <img src={this.props.url} id="actual-image"/>
                        {/* <div className="topOut" style={topStyle}>
                            {this.props.topText}
                        </div>
                        <div className="bottomOut" style={bottomStyle}>
                            {this.props.bottomText}
                        </div>    */}
                        {pictureTexts}
                    </div>
                </figure>
            </div>
        )
    }
}