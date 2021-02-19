import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Generator from '../meme-generator/memeGenerator';
import Overview from '../meme-overview/memeOverview';
import LogInForm from "../LogInForm/LogInForm";


import React from 'react';
import Expander from '../template-expantion/templateExpantion';

class LogInPage extends React.Component{
  logIn = (user) => {
    this.props.logIn(user);
  }

  render() {
    return(
        <div>
          <LogInForm
              logIn={(user) => {
                this.logIn(user)
              }}
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
            {/* <li><Link to="/local" className="menu-link">local image</Link></li> */}
          </ul>
        </nav>
          <Switch>
            {/* <Route path="/local">
              <Imago />
            </Route> */}
            <Route path="/overview">
              <Overview
                  user={this.props.user}
              />
            </Route>
            <Route path="/expand">
              <Expander />
            </Route>
            <Route path="/">
              <Generator
                  user={this.props.user}
              />
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
      loggedIn: false,
      user: null
    };
  }

  /*
  * TODO: der user wird in LogInFrom in Zeile 21 noch ausgegeben und dann in Zeile 22 übergeben.
  *  allerdings kommt er hier leider nicht an. Warum?
  * */
  logIn(user){
    this.setState({
      loggedIn: true,
      user: user
    })

  }

  render(){
    if(!this.state.loggedIn){
      return (
          <LogInPage
              logIn={(user) => {
                this.logIn(user)
              }}
          />
      )
    } else if(this.state.loggedIn && this.state.user !== null){
      return (
          <App
              user={this.state.user}
          />
      )
    }else {
      return(
          <div>Something went wrong</div>
      )
    }
  }


}

export default Application;