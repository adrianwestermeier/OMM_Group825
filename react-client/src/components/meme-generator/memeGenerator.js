import React from 'react';
import './memeGenerator.css';
import SlideShow from "./slideShow";
import { BsFillCaretDownFill, BsFillCaretLeftFill, BsFillCaretRightFill, BsFillCaretUpFill } from "react-icons/bs";


// Inputs for the top and bottom texts
class InputsText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
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
        this.props.textSubmitHandle(this.props.captionType, text);
    }

    increaseVerticalPosition = (event) => {
      this.props.increaseVerticalPosition(this.props.captionType);
    }

    increaseHorizontalPosition = (event) => {
      this.props.increaseHorizontalPosition(this.props.captionType);
    }

    decreaseVerticalPosition = (event) => {
      this.props.decreaseVerticalPosition(this.props.captionType);
    }

    decreaseHorizontalPosition = (event) => {
      this.props.decreaseHorizontalPosition(this.props.captionType);
    }

    render() {
        return(
            <div className="inputs-text">
              <h3 className="form-header">{this.props.heading} (only available for templates)</h3>
                <div className="inputs-text-button-group">
                  <form className="input-form" onSubmit={this.handleSubmit}>
                    <textarea placeholder={this.props.placeholder} name="topText" onChange={this.handleClick} rows="2" cols="50"></textarea>
                    <button type="submit">Submit</button>
                  </form>
                  <div className="position-wrapper-whole">
                    <div className="position-wrapper">
                      <p className="position-text">Position (text should stay within in frame.)</p>
                      <div className="buttons">
                        <button className="position-button" onClick={this.decreaseHorizontalPosition}><BsFillCaretLeftFill/></button>
                        <div class="up-down-buttons">
                          <button className="position-button" onClick={this.increaseVerticalPosition}><BsFillCaretUpFill/></button>
                          <button className="position-button" onClick={this.decreaseVerticalPosition}><BsFillCaretDownFill/></button>
                        </div>
                        <button className="position-button" onClick={this.increaseHorizontalPosition}><BsFillCaretRightFill/></button>
                      </div>
                    </div> 
                  </div>
                </div>
            </div>
        )
    }
}

// class that renders all the meme generation functions
export default class Generator extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            topText: "",
            bottomText: "",
            topTextVerticalPosition: 0,
            topTextHorizontalPosition: 100,
            bottomTextVerticalPosition: 0,
            bottomTextHorizontalPosition: 100,
         };
    }

    // create top and bottom text for a meme template
    handleTextSubmit = (captionType, text) => {
        if(captionType==="top") {
          this.setState({
            topText: text,
          });
        } else {
          this.setState({
            bottomText: text,
          });
        }
        
    }


    // update text positionss
    increaseHorizontalPosition = (pos) => {
      if(pos==="top") {
        let newPositionValue = this.state.topTextHorizontalPosition
        newPositionValue += 5;
        
          this.setState({
            topTextHorizontalPosition: newPositionValue,
          })
        
      } else {
        let newPositionValue = this.state.bottomTextHorizontalPosition
        newPositionValue += 5;
        
          this.setState({
            bottomTextHorizontalPosition: newPositionValue,
          })
        
      }
    }

    decreaseHorizontalPosition = (pos) => {
      if(pos==="top") {
        let newPositionValue = this.state.topTextHorizontalPosition
        newPositionValue -= 5;
        
          this.setState({
            topTextHorizontalPosition: newPositionValue,
          })
        
      } else {
        let newPositionValue = this.state.bottomTextHorizontalPosition
        newPositionValue -= 5;
        
          this.setState({
            bottomTextHorizontalPosition: newPositionValue,
          })
        
      }
    }

    increaseVerticalPosition = (pos) => {
      if(pos==="top") {
        let newPositionValue = this.state.topTextVerticalPosition
        newPositionValue -= 5;
        
          this.setState({
            topTextVerticalPosition: newPositionValue,
          })
        
      } else {
        let newPositionValue = this.state.bottomTextVerticalPosition
        newPositionValue += 5;
        
          this.setState({
            bottomTextVerticalPosition: newPositionValue,
          })
        
      }
    }

    decreaseVerticalPosition = (pos) => {
      if(pos==="top") {
        let newPositionValue = this.state.topTextVerticalPosition
        newPositionValue += 5;
        
          this.setState({
            topTextVerticalPosition: newPositionValue,
          })
        
      } else {
        let newPositionValue = this.state.bottomTextVerticalPosition
        newPositionValue -= 5;
        
          this.setState({
            bottomTextVerticalPosition: newPositionValue,
          })
        
      }
    }

    handleTitleSubmit = (event) => {
      event.preventDefault();
      let submitTitle = this.state.title;
      this.setState({submitTitle: submitTitle});
    }

    handleTitleChange = (event) => {
      event.preventDefault();
      console.log(event.target.name);
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({[nam]: val});
    }

    render() {
      return (
        <div className="home">
          <div className="meme-generator-wrapper">
            <div className="slide-show-section">              
                <SlideShow 
                  title={this.state.submitTitle}
                  topText={this.state.topText} 
                  bottomText={this.state.bottomText}
                  topTextVerticalPosition={this.state.topTextVerticalPosition}
                  topTextHorizontalPosition={this.state.topTextHorizontalPosition}
                  bottomTextVerticalPosition={this.state.bottomTextVerticalPosition}
                  bottomTextHorizontalPosition={this.state.bottomTextHorizontalPosition}
                />  
            </div>
            <div className="input-section">
              <h2>Add and style text</h2>
                <div className="inputs-text">
                  <h3>Add title</h3>
                  <div>

                  <form className="input-form" onSubmit={this.handleTitleSubmit}>
                      <input type="text" placeholder="meme title" name="title" onChange={this.handleTitleChange}></input>
                      <button className="title-submit" type="submit">Submit</button>
                  </form>
                  </div>
                </div>
                <InputsText 
                  captionType="top"
                  heading="Style top text"
                  placeholder="top caption"
                  textSubmitHandle={this.handleTextSubmit}
                  increaseHorizontalPosition={this.increaseHorizontalPosition}
                  decreaseHorizontalPosition={this.decreaseHorizontalPosition}
                  increaseVerticalPosition={this.increaseVerticalPosition}
                  decreaseVerticalPosition={this.decreaseVerticalPosition}
                />
                <InputsText 
                  captionType="bottom"
                  heading="Style bottom text"
                  placeholder="bottom caption"
                  textSubmitHandle={this.handleTextSubmit}
                  increaseHorizontalPosition={this.increaseHorizontalPosition}
                  decreaseHorizontalPosition={this.decreaseHorizontalPosition}
                  increaseVerticalPosition={this.increaseVerticalPosition}
                  decreaseVerticalPosition={this.decreaseVerticalPosition}
                />
            </div>
          </div>
        </div>
      );
    }
}