import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Generator from '../meme-generator/memeGenerator';
import Overview from '../meme-overview/memeOverview';
import Test from "../Test/test";

import React from 'react';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <nav>
          <ul>
            <li><Link to="/overview">Overview of generated memes</Link></li>
            <li><Link to="/">Generate new memes</Link></li>
            <li><Link to="/test">Test</Link></li>

          </ul>
        </nav>
        <Switch>
          <Route path="/overview">
            <Overview />
          </Route>
          <Route path="/test">
            <Test />
          </Route>
          <Route path="/">
            <Generator />
          </Route>

        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;