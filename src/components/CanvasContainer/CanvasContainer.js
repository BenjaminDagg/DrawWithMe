import React, { Component } from 'react';
import { DrawableCanvas } from "../DrawableCanvas/DrawableCanvas";
import "./CanvasContainer.css"
import openSocket from "socket.io-client";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Chat } from "../Chat/Chat";

const mouseYOffset = 100;

const PORT = process.env.PORT || 8080;

export class CanvasContainer extends Component {


    constructor(props) {
        super(props);

        this.state = {
            //for heroku deployment
            //socket: openSocket(),

            //for dev
            socket: openSocket('http://localhost:5000'),
            roomId: null,
            username: null
        };




    }


    componentDidMount() {
        var id = this.props.match.params.id;
        var username = this.props.match.params.username;
        this.setState({username: username});
        this.setState({roomId: id}, () => {
            var newUser = {
                username: username,
                roomId: id
            };
            this.state.socket.emit('join_room', newUser);
        })

    }



    render() {

        return (
            <div id="canvas-container">
                <div id="canvas-target">
                    <DrawableCanvas roomId={this.state.roomId} socket={this.state.socket} />

                </div>
                <Chat username={this.state.username} roomId={this.state.roomId} socket={this.state.socket}/>
            </div>
        );
    }
}

export default CanvasContainer;


//npm run build
//npm start