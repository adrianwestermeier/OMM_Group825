import React from 'react';
import './memeGenerator.css';
import SlideShow from "./slideShow";
import { BsFillCaretDownFill, BsFillCaretLeftFill, BsFillCaretRightFill, BsFillCaretUpFill } from "react-icons/bs";
import { SketchPicker, CompactPicker } from 'react-color';

// Inputs for the top and bottom texts
class InputsText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            italic: false,
            bold: false,
            textSize: 12,
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

    colorSelectEvent = (event) => {
      console.log(event.target.value);
    }

    changedSize = (event) => {
      event.preventDefault();
      this.props.changedSize(this.props.captionType, event.target.value);
    }

    clickItalicEvent = (event) => {
      event.preventDefault();
      if(this.state.italic) {
        this.props.clickedItalic(this.props.captionType, "normal");
        this.setState({
          italic: false
        })
      } else {
        this.props.clickedItalic(this.props.captionType, "italic");
        this.setState({
          italic: true
        })
      }
    }

    clickBoldEvent = (event) => {
      event.preventDefault();
      if(this.state.bold) {
        this.props.clickedBold(this.props.captionType, "normal");
        this.setState({
          bold: false
        })
      } else {
        this.props.clickedBold(this.props.captionType, "bold");
        this.setState({
          bold: true
        })
      }
    }

    handleChangeComplete = (color) => {
      // this.setState({ background: color.hex });
      console.log(color.hex);
      this.props.changedColor(this.props.captionType, color.hex);
    };

    render() {
        return(
            <div className="inputs-text">
              <h3 className="form-header">{this.props.heading} (only available for templates)</h3>
                <div className="inputs-text-button-group">
                  <form className="input-form" onSubmit={this.handleSubmit}>
                    <textarea placeholder={this.props.placeholder} name="topText" onChange={this.handleClick} rows="2" cols="50"></textarea>
                    <button type="submit">Submit</button>
                  </form>
                  <div className="text-styling-wrapper">
                    <form>
                      <input type="number" id="quantity" name="quantity" min="1" max="50" defaultValue="18" onChange={this.changedSize}/>
                    </form>
                    <button onClick={this.clickBoldEvent}>bold</button>
                    <button onClick={this.clickItalicEvent}>italic</button>
                  </div>
                  <div className="color-pos-group">
                  <CompactPicker onChangeComplete={this.handleChangeComplete}/>
                  <div className="position-wrapper-whole">
                    <div className="position-wrapper">
                      <div className="buttons">
                        <button className="position-button" onClick={this.decreaseHorizontalPosition}><BsFillCaretLeftFill/></button>
                        <div className="up-down-buttons">
                          <button className="position-button" onClick={this.increaseVerticalPosition}><BsFillCaretUpFill/></button>
                          <button className="position-button" onClick={this.decreaseVerticalPosition}><BsFillCaretDownFill/></button>
                        </div>
                        <button className="position-button" onClick={this.increaseHorizontalPosition}><BsFillCaretRightFill/></button>
                      </div>
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
            topSize: 18,
            bottomSize: 18,
            topColor: "black",
            bottomColor: "black",
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

    clickedItalic = (captionType, val) => {
      if(captionType==="top") {
        this.setState({
          topItalic: val,
        });
      } else {
        this.setState({
          bottomItalic: val,
        });
      }
    }

    clickedBold = (captionType, val) => {
      if(captionType==="top") {
        this.setState({
          topBold: val,
        });
      } else {
        this.setState({
          bottomBold: val,
        });
      }
    }

    changedSize = (captionType, val) => {
      if(captionType==="top") {
        this.setState({
          topSize: val,
        });
      } else {
        this.setState({
          bottomSize: val,
        });
      }
    }

    changedColor = (captionType, val) => {
      if(captionType==="top") {
        this.setState({
          topColor: val,
        });
      } else {
        this.setState({
          bottomColor: val,
        });
      }
    }

    handleTitleSubmit = (event) => {
      event.preventDefault();
      let submitTitle = this.state.title;
      this.setState({submitTitle: submitTitle});
    }

    handleTitleChange = (event) => {
      event.preventDefault();
      console.log("[memeGenerator]" + event.target.name);
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({[nam]: val});
    }

    onMemeCreated = (memeWasCreated) => {
      if(memeWasCreated) {
        console.log("[memeGenerator] meme was created");
        document.getElementById("input-section").style.display = "none";
      } else {
        document.getElementById("input-section").style.display = "block";
      }
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
                  topItalic={this.state.topItalic}
                  bottomItalic={this.state.bottomItalic}
                  topBold={this.state.topBold}
                  bottomBold={this.state.bottomBold}
                  topSize={this.state.topSize}
                  bottomSize={this.state.bottomSize}
                  topColor={this.state.topColor}
                  bottomColor={this.state.bottomColor}
                  topTextVerticalPosition={this.state.topTextVerticalPosition}
                  topTextHorizontalPosition={this.state.topTextHorizontalPosition}
                  bottomTextVerticalPosition={this.state.bottomTextVerticalPosition}
                  bottomTextHorizontalPosition={this.state.bottomTextHorizontalPosition}
                  onMemeCreated={this.onMemeCreated}
                />  
            </div>
            <div className="input-section" id="input-section">
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
                  clickedItalic={this.clickedItalic}
                  clickedBold={this.clickedBold}
                  changedSize={this.changedSize}
                  changedColor={this.changedColor}
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
                  clickedItalic={this.clickedItalic}
                  clickedBold={this.clickedBold}
                  changedSize={this.changedSize}
                  changedColor={this.changedColor}
                />
            </div>
          </div>
        </div>
      );
    }
}