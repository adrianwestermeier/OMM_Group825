import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Generator from '../meme-generator/memeGenerator';
import Overview from '../meme-overview/memeOverview';
import LogInForm from "../LogInForm/LogInForm";


import React from 'react';
import Expander from '../template-expantion/templateExpantion';

class LogInPage extends React.Component{
  logIn = () => {
    this.props.logIn();
  }

  render() {
    return(
        <div>
          <LogInForm
              logIn={() => {this.logIn()}}
          />

        </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <h1 className="heading">Group825</h1>
        <BrowserRouter>
        <nav>
          <ul>
            <li><Link to="/overview">Overview of generated memes</Link></li>
            <li><Link to="/" className="menu-link">Generate new memes</Link></li>
            <li><Link to="/expand" className="menu-link">Add new templates</Link></li>
            <li><Link to="/register" className="menu-link">register</Link></li>
            {/* <li><Link to="/local" className="menu-link">local image</Link></li> */}
          </ul>
        </nav>
          <Switch>
            {/* <Route path="/local">
              <Imago />
            </Route> */}
            <Route path="/overview">
              <Overview />
            </Route>
            <Route path="/expand">
              <Expander />
            </Route>
            <Route path="/">
              <Generator />
            </Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

class Application extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  logIn(){
    this.setState({
      loggedIn: true,
    })
  }

  render(){
    if(!this.state.loggedIn){
      return (
          <LogInPage
              logIn={() => {this.logIn()}}
          />
      )
    } else if(this.state.loggedIn){
      return (
          <App/>
      )
    }else {
      return(
          <div>Das hat nicht geklappt</div>
      )
    }


  }
}

export default Application;