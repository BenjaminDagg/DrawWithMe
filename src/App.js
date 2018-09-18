import React, { Component } from 'react';
import  openSocket  from 'socket.io-client';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: openSocket('https://draw-with-me-dagg.herokuapp.com:5000'),
      message: ""
    };



    this.subscribeToMessage = this.subscribeToMessage.bind(this);
    this.subscribeToMessage((err,msg) => {
      console.log(msg);
    })
  }

  componentDidMount() {
    this.state.socket.emit('message', 'this is a message');
  }

  subscribeToMessage(cb) {
    this.state.socket.on('message', msg => cb(null, msg));
  }



  render() {



    return (
      <div className="App">
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;


//npm run build
//npm start