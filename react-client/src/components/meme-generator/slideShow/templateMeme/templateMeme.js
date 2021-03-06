import React from 'react';
import './templateMeme.css'

/**
* Meme template class that renders the template together with the texts on it
*/
export default class TemplateMeme extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        let textsWithStyle = [];

        // define the css styles for all the texts on the template
        for (const text of this.props.texts) {
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

        const pictureTexts = <div>
        {textsWithStyle.map(textWithStyle => (
            <div className="topOut" style={textWithStyle.style}>
                {textWithStyle.text}
            </div>     
        ))}
      </div>

        return(
            <div className="image-wrapper" id="image-wrapper">
                <figure>
                    <figcaption>{this.props.title}</figcaption>
                    <div className="top-and-bottom-wrapper">
                        <img src={this.props.url} alt="current Meme Template" id="actual-image"/>
                        {pictureTexts}
                    </div>
                </figure>
            </div>
        )
    }
}