import React,{Component} from "react";
import ReactDOM from "react-dom";

import './home.css';
import logo from './grumpycat.jpg'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            topCaption: '',
            bottomCaption: ''
        };
        this.myChangeHandlerTop = this.myChangeHandlerTop.bind(this);
        this.myChangeHandlerBottom = this.myChangeHandlerBottom.bind(this);
      }

    myChangeHandlerTop = (event) => {
        this.setState({topCaption: event.target.value});
    }

    myChangeHandlerBottom = (event) => {
        this.setState({bottomCaption: event.target.value});
    }

    render() {

   
  return (
    <div class="home-wrapper">
        <div class="left">
            <form id="topForm" ref="form">
            <label>Top Caption </label>
              <input type="text" placeholder="top caption" name="top" onChange={this.myChangeHandlerTop}></input>
            </form> 
            <form id="bottomForm">
            <label>Bottom Caption </label>
                  <input type="text" placeholder="bootom caption" name="bottom" onChange={this.myChangeHandlerBottom}></input>
            </form>   
        </div>
    
        <div class="main" ref={el => (this.div = el)}>
            <figure>
              <figcaption>
                <h1 id="topOut">{this.state.topCaption}</h1>
              </figcaption>
              <img src={logo} alt="Grumpy Cat"></img>
              <figcaption>
                <h2 id="bottomOut">{this.state.bottomCaption}</h2>
              </figcaption>
            </figure>
        </div>
    </div>
  );
    }
}


export default Home;