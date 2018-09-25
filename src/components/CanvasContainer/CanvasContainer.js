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
            //socket: openSocket(),

            //for dev
            socket: openSocket('http://localhost:5000'),
            roomId: null,
            username: null,
            brush: Brushes.SQUARE,
            brushSize: 25,
            backgroundColor: '#ffffff',
            brushColor: '#000000'
        };

        this.onBrushColorChange = this.onBrushColorChange.bind(this);
        this.onBckColorRecievied = this.onBckColorRecievied.bind(this);
        this.onBrushSelected = this.onBrushSelected.bind(this);
        this.onBrushSizeSelected = this.onBrushSizeSelected.bind(this);
        this.onBackgroundColorChange = this.onBackgroundColorChange.bind(this);
        this.textButtonWasClicked = this.textButtonWasClicked.bind(this);

        this.onBckColorRecievied((err,data) => {
            if (err) {

                return;
            }

            this.setState({backgroundColor: data.color});

        });
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

        this.setState({brushSize: newSize});
    }


    //callback in ToolBar to change the backgrounColor state
    //and emit the new color to the room
    onBackgroundColorChange(newColor) {

        //send message to socket that background changed
        var data = {
            room: this.state.roomId,
            color: newColor
        };
        this.state.socket.emit('bck_change', data);

        this.setState({backgroundColor: newColor});
    }


    //callback on socket to listen for background-color changes
    //socket listens for drawings
    onBckColorRecievied(callback) {

        this.state.socket.on('bck_change', data => callback(null, data));
    }


    onBrushColorChange(newColor) {
        this.setState({brushColor: newColor});
    }


    textButtonWasClicked() {
        console.log('in parent changed brush');
        this.setState({brush: Brushes.TEXT});
    }


    render() {

        return (
            <div id="canvas-container">
                <div id="toolbar-container">
                    <ToolBar brushColor={this.state.brushColor}
                             backgroundColor={this.state.backgroundColor}
                             onBackgroundColorChange={this.onBackgroundColorChange}
                             onBrushSizeSelected={this.onBrushSizeSelected}
                             brushSize={this.state.brushSize} brush={this.state.brush}
                             onBrushSelected={this.onBrushSelected}
                             onBrushColorChange={this.onBrushColorChange}
                             textButtonWasClicked={this.textButtonWasClicked}
                    />
                </div>
                <div id="canvas-target">
                    <DrawableCanvas brushColor={this.state.brushColor}
                                    backgroundColor={this.state.backgroundColor}
                                    brushSize={this.state.brushSize}
                                    brush={this.state.brush}
                                    roomId={this.state.roomId}
                                    socket={this.state.socket}
                                    onBrushSelected={this.onBrushSelected}/>

                </div>
                <Chat username={this.state.username}
                      roomId={this.state.roomId}
                      socket={this.state.socket}/>
            </div>
        );
    }
}

export default CanvasContainer;


//npm run build
//npm start