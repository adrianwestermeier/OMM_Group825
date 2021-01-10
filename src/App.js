import logo from './logo.svg';
import './App.css';
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { About} from './pages/About';
import { Home } from './pages/home';
import { MemeGenerator } from './pages/MemeGenerator'

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/generator" component={MemeGenerator} />
          
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
