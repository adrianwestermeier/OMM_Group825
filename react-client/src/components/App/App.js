import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Generator from '../meme-generator/memeGenerator';
import Overview from '../meme-overview/memeOverview';

import React from 'react';

function App() {
  return (
    <div className="wrapper">
      <h1>This is start</h1>
      <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/overview">Overview of generated memes</Link></li>
            <li><Link to="/">Generate new memes</Link></li>
        </ul>
      </nav>
        <Switch>
           <Route path="/overview">
            <Overview />
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