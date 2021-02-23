import React, { Component } from "react";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'

class SpokenCaption extends React.Component{
    render(){
        return(
            <div>
                {this.props.text}
            </div>
        )
    }
}

const SpeechToText = () => {

        const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
        let caption = ''

        if (!browserSupportsSpeechRecognition) {
            return null
        }

        const startListening = () => {
            SpeechRecognition.startListening()
        };

        const stopListening = () => {
            caption = transcript
            SpeechRecognition.stopListening()
            console.log(caption)
        }

        return(
            <div>
                    <button onClick={startListening}>Start</button>
                    <button onClick={stopListening}>Stop</button>
                    <button onClick={resetTranscript}>Reset</button>
                    <p>{transcript}</p>
                <SpokenCaption
                    text={transcript}
                />
            </div>
        )

}

export default SpeechToText;