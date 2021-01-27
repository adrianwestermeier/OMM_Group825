import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Generator from '../meme-generator/memeGenerator';
import Overview from '../meme-overview/memeOverview';


import React from 'react';
import Expander from '../template-expantion/templateExpantion';

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
          </ul>
        </nav>
          <Switch>
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

export default App;