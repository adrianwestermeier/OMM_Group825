import React, { Component } from "react";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import {TextField} from "@material-ui/core";

class SpokenCaption extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            caption: this.props.text,
            text: ''
        }
    }

    test(){
        console.log(this.props.text)
    }

    render(){
        return(
            <div>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="username"
                    type="string"
                    width="200"
                    variant="outlined"
                    value={this.props.text}
                    onChange={e => {this.setState({text: e.target.value})}}
                />
                <button onClick={() => {this.test()}}>print</button>
                {this.props.text}
            </div>
        )
    }
}

const SpeechToText = () => {

        const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
        let caption = ''

        if (!browserSupportsSpeechRecognition) {
            return(
                <div>
                    <p>your browser does not support speech recognition, please use e.g. Google Chrome</p>
                </div>
            )
        }

        return(
            <div>
                <button onClick={SpeechRecognition.startListening}>Start</button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                {/* <SpokenCaption
                    text={transcript}
                /> */}
                <p>You said:</p>
                <p id="transcript">
                {transcript}
                </p>
            </div>
        )

}

export default SpeechToText;