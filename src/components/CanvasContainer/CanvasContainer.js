import React, { Component } from 'react';
import { DrawableCanvas } from "../DrawableCanvas/DrawableCanvas";
import "./CanvasContainer.css"
import openSocket from "socket.io-client";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Chat } from "../Chat/Chat";
import { ToolBar } from "../ToolBar/ToolBar";
import { Brushes } from "../../models/Brushes";

const mouseYOffset = 100;

const PORT = process.env.PORT || 8080;

export class CanvasContainer extends Component {


    constructor(props) {
        super(props);

        this.state = {
            //for heroku deployment
            socket: openSocket(),

            //for dev
            //socket: openSocket('http://localhost:5000'),
            roomId: null,
            username: null,
            brush: Brushes.SQUARE,
            brushSize: 25
        };

        this.onBrushSelected = this.onBrushSelected.bind(this);
        this.onBrushSizeSelected = this.onBrushSizeSelected.bind(this);

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


    onBrushSelected(brushType) {

        switch(brushType) {
            case Brushes.SQUARE:
                this.setState({brush:Brushes.SQUARE});
                break;
            case Brushes.CIRCLE:
                this.setState({brush: Brushes.CIRCLE});
                break;
            default:
                this.setState({brush:Brushes.SQUARE});

        }
    }

    onBrushSizeSelected(newSize) {

        console.log('in parent');
        this.setState({brushSize: newSize});
    }


    render() {

        return (
            <div id="canvas-container">
                <div id="toolbar-container">
                    <ToolBar onBrushSizeSelected={this.onBrushSizeSelected} brushSize={this.state.brushSize} brush={this.state.brush} onBrushSelected={this.onBrushSelected}/>
                </div>
                <div id="canvas-target">
                    <DrawableCanvas brushSize={this.state.brushSize} brush={this.state.brush} roomId={this.state.roomId} socket={this.state.socket} />

                </div>
                <Chat username={this.state.username} roomId={this.state.roomId} socket={this.state.socket}/>
            </div>
        );
    }
}

export default CanvasContainer;


//npm run build
//npm start