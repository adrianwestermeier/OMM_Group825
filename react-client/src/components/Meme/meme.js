import React from 'react';

import './meme.css'

export default class Meme extends React.Component{
    render(){
        return(
            <div className="meme-overview-wrapper">
                <img src={this.props.url} alt={'Meme'}/>
                <div className="topOut">{this.props.topText}</div>
                <div className="bottomOut">{this.props.bottomText}</div>
            </div>
        )
    }
}