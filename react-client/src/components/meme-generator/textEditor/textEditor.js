import React from 'react';
import { BsFillCaretDownFill, BsFillCaretLeftFill, BsFillCaretRightFill, BsFillCaretUpFill } from "react-icons/bs";
import { SketchPicker, CompactPicker } from 'react-color';
import './textEditor.css';
import SpeechToText from "../../speechToText/speechToText";

/**
* class that handles all the text editing on the templates
*/
class InputsText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            italic: false,
            bold: false,
            textSize: 18,
            textColor: "black",
            background: '#fff',
        };
    }

    handleClick = (event) => {
        event.preventDefault();
        let nam = event.target.value;
        this.setState({text: nam});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let text = this.state.text;
        this.props.textSubmitHandle(this.props.index, text);
    }

    increaseVerticalPosition = (event) => {
      this.props.increaseVerticalPosition(this.props.index);
    }

    increaseHorizontalPosition = (event) => {
      this.props.increaseHorizontalPosition(this.props.index);
    }

    decreaseVerticalPosition = (event) => {
      this.props.decreaseVerticalPosition(this.props.index);
    }

    decreaseHorizontalPosition = (event) => {
      this.props.decreaseHorizontalPosition(this.props.index);
    }

    colorSelectEvent = (event) => {
      console.log(event.target.value);
    }

    changedSize = (event) => {
      event.preventDefault();
      this.props.changedSize(this.props.index, event.target.value);
    }

    clickItalicEvent = (event) => {
      event.preventDefault();
      if(this.state.italic) {
        this.props.clickedItalic(this.props.index, "normal");
        this.setState({
          italic: false
        })
      } else {
        this.props.clickedItalic(this.props.index, "italic");
        this.setState({
          italic: true
        })
      }
    }

    clickBoldEvent = (event) => {
      event.preventDefault();
      if(this.state.bold) {
        this.props.clickedBold(this.props.index, "normal");
        this.setState({
          bold: false
        })
      } else {
        this.props.clickedBold(this.props.index, "bold");
        this.setState({
          bold: true
        })
      }
    }

    handleChangeComplete = (color) => {
      this.props.changedColor(this.props.index, color.hex);
    };

    /**
    * get the text, which was spoken via the speech-to-text module;
    * must be accessed with DOM as it is not possible to create speechToText as class
    */
    getSpeechInput = () => {
      let speechInput = document.getElementById("transcript").textContent;
      console.log("[texteditor] speechInput: " + speechInput);
      this.props.submitSpeechInput(this.props.index, speechInput);
    }

    render() {
        return(
            <div className="inputs-text">
              <h3 className="form-header">{this.props.heading}</h3>
                <div className="inputs-text-button-group">
                    {this.props.text}
                  <form className="input-form" onSubmit={this.handleSubmit}>
                      <textarea
                        className="input-text"
                        placeholder={this.props.placeholder}
                        name="topText"
                        onChange={this.handleClick}
                        rows="2"
                        cols="50">
                      </textarea>
                      <button type="submit" className="secondary-button" style={{height: "40px", marginLeft:"20px"}}>Submit</button>
                  </form>
                  <p>OR use speech input:</p>
                  <SpeechToText/>
                  <button className="secondary-button" style={{height: "40px"}} onClick={this.getSpeechInput}>submit spoken text</button>
                  <div className="text-styling-wrapper">
                    <form>
                      <input style={{height:"30px"}} type="number" id="quantity" name="quantity" min="1" max="50" defaultValue="18" onChange={this.changedSize}/>
                    </form>
                    <button className="small-button" onClick={this.clickBoldEvent}>bold</button>
                    <button className="small-button" onClick={this.clickItalicEvent}>italic</button>
                  </div>
                  <div className="color-pos-group">
                  <CompactPicker onChangeComplete={this.handleChangeComplete}/>
                  <div className="position-wrapper-whole">
                    <div className="position-wrapper">
                      <div className="buttons">
                        <button className="position-button" onMouseDown={this.decreaseHorizontalPosition}><BsFillCaretLeftFill/></button>
                        <div className="up-down-buttons">
                          <button className="position-button" onMouseDown={this.increaseVerticalPosition}><BsFillCaretUpFill/></button>
                          <button className="position-button" onMouseDown={this.decreaseVerticalPosition}><BsFillCaretDownFill/></button>
                        </div>
                        <button className="position-button" onMouseDown={this.increaseHorizontalPosition}><BsFillCaretRightFill/></button>
                      </div>
                    </div> 
                  </div>
                </div>
                </div>
            </div>
        )
    }
}

export default InputsText;
