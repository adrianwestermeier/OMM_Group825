import React from 'react';
import './memeGenerator.css';
import SlideShow from "./slideShow/slideShow";
import InputsText from "./textEditor/textEditor";


// class that renders all the meme generation functions
export default class Generator extends React.Component {
    constructor(props){
        super(props);
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
  
        this.state = {
          texts: newTexts,
            // topText: "",
            // bottomText: "",
            // topTextVerticalPosition: 0,
            // topTextHorizontalPosition: 100,
            // bottomTextVerticalPosition: 0,
            // bottomTextHorizontalPosition: 100,
            // topSize: 18,
            // bottomSize: 18,
            // topColor: "black",
            // bottomColor: "black",

        };
    }

    // create top and bottom text for a meme template
    handleTextSubmit = (index, text) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated text to it
      newTexts[index] = {...newTexts[index], text: text};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });  
    }


    // update text positionss
    increaseHorizontalPosition = (index) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated horizontal position to it
      newTexts[index] = {...newTexts[index], horizontalPosition: newTexts[index].horizontalPosition + 2};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });
    }

    decreaseHorizontalPosition = (index) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated horizontal position to it
      newTexts[index] = {...newTexts[index], horizontalPosition: newTexts[index].horizontalPosition - 2};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });
    }

    increaseVerticalPosition = (index) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated vertical position to it
      newTexts[index] = {...newTexts[index], verticalPosition: newTexts[index].verticalPosition - 2};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });
      // if(pos==="top") {
      //   let newPositionValue = this.state.topTextVerticalPosition
      //   newPositionValue -= 5;
        
      //     this.setState({
      //       topTextVerticalPosition: newPositionValue,
      //     })
        
      // } else {
      //   let newPositionValue = this.state.bottomTextVerticalPosition
      //   newPositionValue += 5;
        
      //     this.setState({
      //       bottomTextVerticalPosition: newPositionValue,
      //     })
        
      // }
    }

    decreaseVerticalPosition = (index) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated vertical position to it
      newTexts[index] = {...newTexts[index], verticalPosition: newTexts[index].verticalPosition + 2};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });
      // if(pos==="top") {
      //   let newPositionValue = this.state.topTextVerticalPosition
      //   newPositionValue += 5;
        
      //     this.setState({
      //       topTextVerticalPosition: newPositionValue,
      //     })
        
      // } else {
      //   let newPositionValue = this.state.bottomTextVerticalPosition
      //   newPositionValue -= 5;
        
      //     this.setState({
      //       bottomTextVerticalPosition: newPositionValue,
      //     })
        
      // }
    }

    clickedItalic = (index, val) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated italic to it
      newTexts[index] = {...newTexts[index], italic: val};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      });  
      // if(captionType==="top") {
      //   this.setState({
      //     topItalic: val,
      //   });
      // } else {
      //   this.setState({
      //     bottomItalic: val,
      //   });
      // }
    }

    clickedBold = (index, val) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated bold to it
      newTexts[index] = {...newTexts[index], bold: val};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      }); 
      // if(captionType==="top") {
      //   this.setState({
      //     topBold: val,
      //   });
      // } else {
      //   this.setState({
      //     bottomBold: val,
      //   });
      // }
    }

    changedSize = (index, val) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated size to it
      newTexts[index] = {...newTexts[index], size: val};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      }); 
      // if(captionType==="top") {
      //   this.setState({
      //     topSize: val,
      //   });
      // } else {
      //   this.setState({
      //     bottomSize: val,
      //   });
      // }
    }

    changedColor = (index, val) => {
      // copy state to omit changing state directly
      let newTexts = [...this.state.texts];
      // get element at index and assign a new object with updated color to it
      newTexts[index] = {...newTexts[index], color: val};
      console.log('[memeGenerator] updated texts: ');
      console.log(newTexts);
      // set state to updated text array
      this.setState({
        texts: newTexts,
      }); 
      // if(captionType==="top") {
      //   this.setState({
      //     topColor: val,
      //   });
      // } else {
      //   this.setState({
      //     bottomColor: val,
      //   });
      // }
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

    addNewText = () => {
      let newTexts = [...this.state.texts];
      // create a new text field with default properties
      const newText = {
        index: newTexts.length,
        captionType: "top",
        heading: "Style text",
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
        console.log(this.props.user)
      const inputTexts = <div>
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
          />
        ))}
      </div>
      

      return (
        <div className="home">
          <div className="meme-generator-wrapper">
            <div className="slide-show-section">              
                {/* <SlideShow 
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
                />   */}
                <SlideShow 
                  title={this.state.submitTitle}
                  texts={this.state.texts}
                  onMemeCreated={this.onMemeCreated}
                  user={this.props.user}
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
                {inputTexts}
                <button onClick={this.addNewText}>Add new text</button>
            </div>
          </div>
        </div>
      );
    }
}