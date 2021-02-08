import React from 'react';

import './meme.css'

export default class Meme extends React.Component{
    render(){
        return(
            <div className="meme">
            <figure>
                <figcaption>{this.props.title}</figcaption>
                <div className="top-and-bottom-wrapper">
                    <img src={this.props.url} alt={'Meme'}/>
                </div>
            </figure>
            </div>
        )
    }
}