import React from 'react';
import './memeGenerator.css';
import SlideShow from "./slideShow/slideShow";
import InputsText from "./textEditor/textEditor";
// import SpeechToText from "./textEditor/textEditor";

/**
* class that renders all the template generation functions
*/
export default class Generator extends React.Component {
    constructor(props){
        super(props);

        // define the default top and bottom text attributes
        const topText = {
          index: 0,
          captionType: "top",
          heading: "Style top text",
          placeholder: "top caption",
          text: "",
          verticalPosition: 3,
          horizontalPosition: 50,
          size: 18,
          color: "black",
          italic: "normal",
          bold: "normal",
        };
  
        const bottomText = {
          index: 1,
          captionType: "bottom",
          heading: "Style bottom text",
          placeholder: "bottom caption",
          text: "",
          verticalPosition: 90,
          horizontalPosition: 50,
          size: 18,
          color: "black",
          italic: "normal",
          bold: "normal",
        };
  
        const newTexts = [topText, bottomText]

        this.slideShowChild = React.createRef();
  
        this.state = {
          texts: newTexts,
        };
    }

    /**
    * create top and bottom text for a meme template
    */
    handleTextSubmit = (index, text) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated text to it
      newTexts[index] = {...newTexts[index], text: text};
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });  
      this.slideShowChild.current.updateTexts()
    }

    /**
    * update text positions
    */
    increaseHorizontalPosition = (index) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], horizontalPosition: newTexts[index].horizontalPosition + 2};
      this.setState({
        texts: newTexts,
      });
      this.slideShowChild.current.updateTexts()
    }

    /**
    * update text positions
    */
    decreaseHorizontalPosition = (index) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], horizontalPosition: newTexts[index].horizontalPosition - 2};
      this.setState({
        texts: newTexts,
      });
      this.slideShowChild.current.updateTexts()
    }

    /**
    * update text positions
    */
    increaseVerticalPosition = (index) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], verticalPosition: newTexts[index].verticalPosition - 2};
      this.setState({
        texts: newTexts,
      });
      this.slideShowChild.current.updateTexts()
    }

    /**
    * update text positions
    */
    decreaseVerticalPosition = (index) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], verticalPosition: newTexts[index].verticalPosition + 2};
      this.setState({
        texts: newTexts,
      });
      this.slideShowChild.current.updateTexts()
    }

    /**
    * change font-style to italic
    */
    clickedItalic = (index, val) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], italic: val};
      this.setState({
        texts: newTexts,
      });  
      this.slideShowChild.current.updateTexts()
    }

    /**
    * change font-weight to bold
    */
    clickedBold = (index, val) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], bold: val};
      this.setState({
        texts: newTexts,
      }); 
      this.slideShowChild.current.updateTexts()
    }

    /**
    * change font-size
    */
    changedSize = (index, val) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], size: val};
      this.setState({
        texts: newTexts,
      }); 
      this.slideShowChild.current.updateTexts()
    }

    /**
    * change color
    */
    changedColor = (index, val) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], color: val};
      this.setState({
        texts: newTexts,
      }); 
      this.slideShowChild.current.updateTexts()
    }

    /**
    * set the text, which was spoken via the speech-to-text module
    */
    speechInput = (index, inputText) => {
      let newTexts = [...this.state.texts];
      newTexts[index] = {...newTexts[index], text: inputText};
      this.setState({
        texts: newTexts,
      });
      this.slideShowChild.current.updateTexts()
    }

    handleTitleSubmit = (event) => {
      event.preventDefault();
      let submitTitle = this.state.title;
      this.setState({submitTitle: submitTitle});
    }

    handleTitleChange = (event) => {
      event.preventDefault();
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({[nam]: val});
    }

    onMemeCreated = (memeWasCreated) => {
      if(memeWasCreated) {
        console.log("[memeGenerator] meme was created");
        document.getElementById("input-section-template").style.display = "none";
      } else {
        document.getElementById("input-section-template").style.display = "block";
      }
    }


    /**
    * function which adds a new text component to the layout
    */
    addNewText = () => {
      let newTexts = [...this.state.texts];
      // create a new text field with default properties
      const newText = {
        index: newTexts.length,
        captionType: "top",
        heading: "Style new text",
        placeholder: "text",
        text: "",
        verticalPosition: 50,
        horizontalPosition: 50,
        size: 18,
        color: "black",
        italic: "normal",
        bold: "normal",
      };
      newTexts.push(newText);
      this.setState({
        texts: newTexts,
      })
    }

    render() {
        const inputTexts = <div id="inputs-text-wrapper">
        {this.state.texts.map((text, i) => (
            <InputsText 
          key={i}
          index={text.index}
          captionType={text.captionType}
          heading={text.heading}
          placeholder={text.placeholder}
          textSubmitHandle={this.handleTextSubmit}
          increaseHorizontalPosition={this.increaseHorizontalPosition}
          decreaseHorizontalPosition={this.decreaseHorizontalPosition}
          increaseVerticalPosition={this.increaseVerticalPosition}
          decreaseVerticalPosition={this.decreaseVerticalPosition}
          clickedItalic={this.clickedItalic}
          clickedBold={this.clickedBold}
          changedSize={this.changedSize}
          changedColor={this.changedColor}
          submitSpeechInput={this.speechInput}
          />
        ))}
      </div>
      
      return (
        <div className="home">
          <div className="meme-generator-wrapper">
            <div className="slide-show-section" id="slide-show-section">              
                <SlideShow ref={this.slideShowChild}
                  title={this.state.submitTitle}
                  texts={this.state.texts}
                  onMemeCreated={this.onMemeCreated}
                  user={this.props.user}
                />  
            </div>
            <div className="input-section-template" id="input-section-template">
              <h2>Add and style text</h2>
                <div className="inputs-text">
                  <h3>Add title</h3>
                  <div>
                    <form className="input-form" onSubmit={this.handleTitleSubmit}>
                        <input type="text" placeholder="meme title" name="title" onChange={this.handleTitleChange}></input>
                        <button className="secondary-button" style={{height:"40px", marginLeft:"20px"}} type="submit">Submit</button>
                    </form>
                  </div>
                </div>
                {inputTexts}
                <button className="secondary-button" style={{marginTop:"30px"}} onClick={this.addNewText}>Add new text</button>
            </div>
          </div>
        </div>
      );
    }
}