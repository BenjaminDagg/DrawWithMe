import React, { Component } from 'react';
import  openSocket  from 'socket.io-client';
import './App.css';

class App extends Component {

  componentDidMount() {
    var socket = openSocket('https://draw-with-me-dagg.herokuapp.com:5000');
  }

  render() {



    return (
      <div className="App">
        <h1>hello</h1>
      </div>
    );
  }
}

export default App;


//npm run build
//npm start