import React, { Component } from 'react';
import  openSocket  from 'socket.io-client';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: openSocket('https://draw-with-me-dagg.herokuapp.com:5000')
    };



    this.subscribeToMessag = this.subscribeToMessag.bind(this);
    this.subscribeToMessag((err,msg) => {
      console.log(msg);
    })
  }

  componentDidMount() {
    this.state.socket.emit('message', 'hello');
  }

  subscribeToMessage(cb) {
    this.state.socket.on('message', msg => cb(null, msg));
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