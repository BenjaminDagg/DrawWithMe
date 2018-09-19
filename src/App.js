import React, { Component } from 'react';
import  openSocket  from 'socket.io-client';
import { DrawableCanvas } from "./components/DrawableCanvas/DrawableCanvas";
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: openSocket('http://localhost:5000'),
      message: ""
    };



    this.subscribeToMessage = this.subscribeToMessage.bind(this);
    this.subscribeToMessage((err,msg) => {
      console.log(msg);
      this.setState({message:msg});
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
        <DrawableCanvas/>
      </div>
    );
  }
}

export default App;


//npm run build
//npm start