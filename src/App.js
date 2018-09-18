import React, { Component } from 'react';
import { openSocket } from 'socket.io-client';
import './App.css';

class App extends Component {

  componentDidMount() {
    var socket = openSocket('https://draw-with-me-dagg.herokuapp.com:8080')
  }
  render() {



    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
