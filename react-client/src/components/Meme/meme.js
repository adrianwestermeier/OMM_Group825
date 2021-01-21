import React from 'react';

import './meme.css'

export default class Meme extends React.Component{
    render(){
        return(
            <div className="image-wrapper">
                <img src={this.props.url}/>
                <div className="topOut">{this.props.topText}</div>
                <div className="bottomOut">{this.props.bottomText}</div>
            </div>
        )
    }
}