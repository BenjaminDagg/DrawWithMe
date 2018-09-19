import React, { Component } from 'react';
import "./DrawableCanvas.css";

const mouseYOffset = 100;

export class DrawableCanvas extends Component {


    constructor(props) {
        super(props);

        this.state = {
            mouse: {
                x: 0,
                y: 0
            },
            mouseIsDown: false,
            drawingCoords: []   //holds all positions that have been clicked
        };

        this.onCanvasClick = this.onCanvasClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onCanvasClickUp = this.onCanvasClickUp.bind(this);
        this.updateCanvase = this.updateCanvase.bind(this);
        this.getMouseCoords = this.getMouseCoords.bind(this);
    }


    /*
    Event triggered when mouse clicked over canvas
    Updates state to say mouse is currently down
    parameter: e (event of mouse click)
     */
    onCanvasClick(e) {
        e.persist();

        this.setState({mouseIsDown:true});

    }


    /*
    Event triggered when mouse click finishes on canvas
    update state to say mouse is down
     */
    onCanvasClickUp(e) {
        e.persist();

        this.setState({mouseIsDown:false});
    }



    /*
    Converts screen coordinates to coordinates relative
    to the canvas
     */
    getMouseCoords(event) {

        const context = this.refs.canvas.getContext('2d');
        var canvas = document.getElementById("drawing-canvas");
        var rect = canvas.getBoundingClientRect();

        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        var mouseX = (event.clientX - rect.left) * scaleX;
        var mouseY = (event.clientY - rect.top) * scaleY;

        return {
            x: mouseX,
            y: mouseY
        };
    }



    /*
    Event triggered when mouse is over the canvas
    Checks if mouse is held down. If it is it adds
    a new brush to the array
     */
    onHover(e) {
        e.persist();


        //gets mouse coordinates relative to the canvas
        var mouseCoords = this.getMouseCoords(e);

        //if mouse down when moving add new brush
        var drawingCoords = this.state.drawingCoords;
        if (this.state.mouseIsDown) {
            drawingCoords.push(mouseCoords);
            this.setState({drawingCoords: drawingCoords});
            this.updateCanvase(drawingCoords);
        }

        //update mouse coordinates
        this.setState({mouse:mouseCoords});
    }



    /*
    Takes in array of coordinates where the canvas has been
    clicked and draws the brush on each coordinate
     */
    updateCanvase(drawingCoords) {
        const context = this.refs.canvas.getContext('2d');
        var canvas = document.getElementById("drawing-canvas");
        var rect = canvas.getBoundingClientRect();

        for (var i = 0; i < drawingCoords.length;i++) {
            var coords = drawingCoords[i];
            context.fillRect(coords.x,coords.y,10,10);
        }
    }


    render() {

        return (
            <div className="canvas">
                <h1>{this.state.mouse.x + " " + this.state.mouse.y}</h1>
                {this.state.mouseIsDown == true && <h1>true</h1>}
                {this.state.mouseIsDown == false && <h1>false</h1>}
                <canvas ref="canvas" onMouseUp={this.onCanvasClickUp} onMouseMove={this.onHover} onMouseDown={this.onCanvasClick} id="drawing-canvas"></canvas>
            </div>
        );
    }
}

export default DrawableCanvas;


//npm run build
//npm start