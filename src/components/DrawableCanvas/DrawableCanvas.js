import React, { Component } from 'react';
import "./DrawableCanvas.css";
import { Brushes } from "../../models/Brushes";

const screenScaleX = 0.65;
const screenScaleY = 0.7;

export class DrawableCanvas extends Component {


    constructor(props) {
        super(props);

        this.state = {
            mouse: {
                x: 0,
                y: 0
            },
            mouseIsDown: false, //holds all positions that have been clicked,
            drawings: [],
            window: {
                width: window.innerWidth,
                height:window.innerHeight
            },
            context: null
        };

        this.onCanvasClick = this.onCanvasClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onCanvasClickUp = this.onCanvasClickUp.bind(this);
        this.updateCanvase = this.updateCanvase.bind(this);
        this.getMouseCoords = this.getMouseCoords.bind(this);
        this.onDrawingRecievied = this.onDrawingRecievied.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.initCanvas = this.initCanvas.bind(this);

        var self = this;
        var t = -1;

        window.onresize = function(){
            clearTimeout(t);
            t = setTimeout(self.resizeCanvas, 1000);
        };


        this.onDrawingRecievied((err,drawing) => {
           if (err) {
               return;
           }
           var drawings = this.state.drawings;
           drawings.push(drawing);
           this.setState({drawings:drawings}, () => {
               this.updateCanvase(this.state.drawings);
           });

        });
    }


    componentDidMount() {
        this.initCanvas();
        this.setState({context: this.refs.canvas.getContext('2d')});
    }


    resizeCanvas() {
        if (!this.refs.canvas) {
            return;
        }

        var context = this.state.context;
        var canvas = document.getElementById("drawing-canvas");

       //get new window dimentions
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        //scale canvas
        canvas.width = Math.floor(winWidth * 0.65);
        canvas.height = Math.floor(winHeight * 0.7);

        //find percent that the screen was changed
        var scaleX = (winWidth / this.state.window.width);
        var scaleY = (winHeight / this.state.window.height);

        context.scale(scaleX,scaleY);
        this.updateCanvase(this.state.drawings);
        this.setState({window: {
            width: winWidth,
                height:winHeight
            }});
        context.scale(-scaleX,-scaleY);

        this.setState({context:context});



    }



    onDrawingRecievied(callback) {
        this.props.socket.on('drawing', drawing => callback(null, drawing));
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

        const context = this.state.context;
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

        var drawings = this.state.drawings;
        if (this.state.mouseIsDown) {

            var newDrawing = {
                coord: mouseCoords,
                size: this.props.brushSize,
                brush: this.props.brush
            };
            drawings.push(newDrawing);
            this.setState({drawings: drawings});

            this.updateCanvase(this.state.drawings);

            var data = {
                room: this.props.roomId,
                drawing: newDrawing
            };
            this.props.socket.emit('drawing', data);

        }

        //update mouse coordinates
        this.setState({mouse:mouseCoords});
    }



    /*
    Takes in array of coordinates where the canvas has been
    clicked and draws the brush on each coordinate
     */
    updateCanvase(drawingCoords) {

        if (!this.refs.canvas) {
            return;
        }



        const context = this.state.context;
        var canvas = document.getElementById("drawing-canvas");
        var rect = canvas.getBoundingClientRect();

        for (var i = 0; i < drawingCoords.length;i++) {
            /*


            var coords = drawingCoords[i].coord;
            context.fillRect(coords.x,coords.y,10,10);
            */
            var coords = drawingCoords[i].coord;
            switch (drawingCoords[i].brush) {
                case Brushes.SQUARE:
                    context.fillRect(coords.x,coords.y,drawingCoords[i].size,drawingCoords[i].size);
                    break;
                default:
                    context.beginPath();
                    context.arc(coords.x,coords.y,drawingCoords[i].size,0,2 * Math.PI);
                    context.fill();

            }
        }
        this.setState({context: context});
    }


    initCanvas() {
        if (!this.refs.canvas) {
            return;
        }
        console.log('in init canvas');
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        const context = this.state.context;
        var canvas = this.refs.canvas;

        canvas.width = Math.floor(winWidth * 0.65);
        canvas.height = Math.floor(winHeight * 0.7);
    }


    render() {



        return (
            <div id="canvas">
                <h1>{this.state.mouse.x + " " + this.state.mouse.y}</h1>
                <canvas  ref="canvas" onMouseUp={this.onCanvasClickUp} onMouseMove={this.onHover} onMouseDown={this.onCanvasClick} id="drawing-canvas"></canvas>
            </div>
        );
    }
}

export default DrawableCanvas;


//npm run build
//npm start