import React, { Component } from 'react';
import { NavBar } from "./components/NavBar/NavBar";
import './App.css';
import { CanvasContainer } from "./components/CanvasContainer/CanvasContainer";
import { Home } from "./components/Home/Home";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


class App extends Component {


  render() {



    return (
      <div className="App">
        <NavBar/>
          <hr />
        <Router>
          <div>
            <Route exact={true} path={"/"} render={() => <Home/>} />
            <Route path="/room/:id/user/:username" component={CanvasContainer} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;


//npm run build
//npm start