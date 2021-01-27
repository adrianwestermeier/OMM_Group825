import React from 'react';
import './memeGenerator.css';
import SlideShow from "./slideShow";


// Inputs for the top and bottom texts
class InputsText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topText: "",
            bottomText: "",
        };
    }

    handleTopClick = (event) => {
        event.preventDefault();
        let nam = event.target.value;
        this.setState({topText: nam});
    }

    handleBottomClick = (event) => {
        event.preventDefault();
        let nam = event.target.value;
        this.setState({bottomText: nam});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let top = this.state.topText;
        
        let bottom = this.state.bottomText;
        
        this.props.textSubmitHandle(top, bottom);
    }

    increaseVerticalPositionTop = (event) => {
      this.props.increaseVerticalPosition("top");
    }

    increaseVerticalPositionBottom = (event) => {
      this.props.increaseVerticalPosition("bottom");
    }

    increaseHorizontalPositionTop = (event) => {
      this.props.increaseHorizontalPosition("top");
    }

    increaseHorizontalPositionBottom = (event) => {
      this.props.increaseHorizontalPosition("bottom");
    }

    decreaseVerticalPositionTop = (event) => {
      this.props.decreaseVerticalPosition("top");
    }

    decreaseVerticalPositionBottom = (event) => {
      this.props.decreaseVerticalPosition("bottom");
    }

    decreaseHorizontalPositionTop = (event) => {
      this.props.decreaseHorizontalPosition("top");
    }

    decreaseHorizontalPositionBottom = (event) => {
      this.props.decreaseHorizontalPosition("bottom");
    }

    render() {
        return(
            <div className="inputs-text">
                <div className="inputs-text-button-group">
                  <h2 className="form-header">Write top caption</h2>
                  <form id="topForm" onSubmit={this.handleSubmit}>
                    {/* <input type="text" placeholder="top caption" name="topText" onChange={this.handleTopClick}/> */}
                    <textarea placeholder="top caption" name="topText" onChange={this.handleTopClick} rows="2" cols="50"></textarea>
                    <button type="submit">Submit</button>
                  </form>   
                  <p className="position-text">vertical Position</p>
                  <div className="buttons">
                    <button type="button" onClick={this.increaseVerticalPositionTop}>+</button> 
                    <button type="button" onClick={this.decreaseVerticalPositionTop}>-</button>
                  </div>
                  <p className="position-text">horizontal Position</p>
                  <div className="buttons">
                    <button type="button" onClick={this.increaseHorizontalPositionTop}>+</button> 
                    <button type="button" onClick={this.decreaseHorizontalPositionTop}>-</button>
                  </div>
                </div>
                <div className="inputs-text-button-group">
                  <h3 className="form-header">Write bottom caption</h3>
                  <form id="bottomForm" onSubmit={this.handleSubmit}>
                    {/* <input type="text" placeholder="bootom caption" name="bottomText" onChange={this.handleBottomClick}/> */}
                    <textarea placeholder="bottom caption" name="bottomText" onChange={this.handleTopClick} rows="2" cols="50"></textarea>
                    <button type="submit">Submit</button>
                  </form>
                  <h3 className="form-header">Position text</h3>
                  <p className="position-text">vertical Position</p>
                  <div className="buttons">
                    <button type="button" onClick={this.increaseVerticalPositionBottom}>+</button> 
                    <button type="button" onClick={this.decreaseVerticalPositionBottom}>-</button>
                  </div>
                  <p className="position-text">horizontal Position</p>
                  <div className="buttons">
                    <button type="button" onClick={this.increaseHorizontalPositionBottom}>+</button> 
                    <button type="button" onClick={this.decreaseHorizontalPositionBottom}>-</button>
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
            topTextVerticalPosition: 5,
            topTextHorizontalPosition: 100,
            bottomTextVerticalPosition: 0,
            bottomTextHorizontalPosition: 100,
         };
    }

    // create top and bottom text for a meme template
    handleTextSubmit = (top, bottom) => {
        console.log(top);
        console.log(bottom);
        this.setState({
            topText: top,
            bottomText: bottom
        });
    }


    // TODO: calculate if text is inside frame
    increaseHorizontalPosition = (pos) => {
      if(pos=="top") {
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
      if(pos=="top") {
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
      if(pos=="top") {
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
      if(pos=="top") {
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

    render() {
      return (
        <div className="home">
          <h2>Create new meme from template</h2>
          <div className="meme-generator-wrapper">
            <div className="slide-show-section">              
                <SlideShow 
                  topText={this.state.topText} 
                  bottomText={this.state.bottomText}
                  topTextVerticalPosition={this.state.topTextVerticalPosition}
                  topTextHorizontalPosition={this.state.topTextHorizontalPosition}
                  bottomTextVerticalPosition={this.state.bottomTextVerticalPosition}
                  bottomTextHorizontalPosition={this.state.bottomTextHorizontalPosition}
                />  
            </div>
            <div className="input-section">
                <InputsText 
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