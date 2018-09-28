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
            showInput: false,
            backgroundColor: this.props.backgroundColor

        };

        this.onCanvasClick = this.onCanvasClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onCanvasClickUp = this.onCanvasClickUp.bind(this);
        this.updateCanvase = this.updateCanvase.bind(this);
        this.getMouseCoords = this.getMouseCoords.bind(this);
        this.onDrawingRecievied = this.onDrawingRecievied.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.initCanvas = this.initCanvas.bind(this);
        this.containerClick = this.containerClick.bind(this);
        this.createDrawing = this.createDrawing.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.createText = this.createText.bind(this);
        this.onClearCanvas = this.onClearCanvas.bind(this);
        this.onBckColorRecievied = this.onBckColorRecievied.bind(this);


        //event triggered when user changes browser window size
        window.addEventListener('resize', this.resizeCanvas);




        //callback when socket recieves a new drawing
        //adds it to drawings then re-renders canvas
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


        this.onClearCanvas((err,data) => {
            if (err) {

                return;
            }

            const context = this.refs.canvas.getContext('2d');
            var canvas = document.getElementById("drawing-canvas");

            context.clearRect(0,0,canvas.width,canvas.height);
            this.setState({drawings: []}, () => {
                this.updateCanvase(this.state.drawings);
            })

        });


        this.onBckColorRecievied((err,data) => {
            if (err) {

                return;
            }
            this.props.backgroundColorDidChange(data.color);
            const context = this.refs.canvas.getContext('2d');
            var canvas = document.getElementById("drawing-canvas");

            this.setState({backgroundColor: data.color});
            this.updateCanvase(this.state.drawings);
        });


    }


    //on mount set size of canvas to windwo size
    componentDidMount() {
        this.initCanvas();
    }


    //detect when background color and brush color props change
    componentWillReceiveProps(nextProps) {

        //update background color
        if (nextProps.backgroundColor) {
            if (this.refs.canvas) {
                const context = this.refs.canvas.getContext('2d');
                var canvas = document.getElementById("drawing-canvas");

                canvas.style.backgroundColor = nextProps.backgroundColor;
                this.updateCanvase(this.state.drawings);
            }
        }
    }


    //callbacl on socket to listen for clear canvas event
    onClearCanvas(callback) {
        this.props.socket.on('clear_canvas', data => callback(null,data));
    }


    //callback on socket to listen for background-color changes
    //socket listens for drawings
    onBckColorRecievied(callback) {
        var self = this;
        this.props.socket.on('bck_change', data => {
            callback(null, data);

        });
    }


    //resizes canvas when the window size changes
    resizeCanvas() {

        var winWidth = window.innerWidth;
        var canvas = this.refs.canvas;

        canvas.width = winWidth * 0.65;

        this.updateCanvase(this.state.drawings);
    }


    //socket listens for drawings
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

        var mouseCoords = this.getMouseCoords(e);

        if (this.props.brush != Brushes.TEXT) {
            this.createDrawing(mouseCoords);
        }



        this.setState({mouseIsDown:false});
    }



    /*
    Converts screen coordinates to coordinates relative
    to the canvas
     */
    getMouseCoords(event) {

        var canvas = this.refs.canvas;
        var rect = canvas.getBoundingClientRect();

        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        x/= canvas.width;
        y /= canvas.height;

        return {
            x: x,
            y: y
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


        if (this.state.mouseIsDown && this.props.brush != Brushes.TEXT) {
            this.createDrawing(mouseCoords);
        }


        this.updateCanvase(this.state.drawings);

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



        const context = this.refs.canvas.getContext('2d');
        var canvas = document.getElementById("drawing-canvas");
        var rect = canvas.getBoundingClientRect();



        console.log('in render');
        for (var i = 0; i < drawingCoords.length;i++) {

            context.lineWidth = 10;


            var coords = drawingCoords[i].coord;
            var x = Math.floor(coords.x * canvas.width);
            var y = Math.floor(coords.y * canvas.height);

            var color = drawingCoords[i].color;
            if(drawingCoords[i].brush == Brushes.ERASER) {
                color = this.state.backgroundColor;
            }



            switch (drawingCoords[i].brush) {
                case Brushes.SQUARE:
                    context.fillStyle = color;
                    context.fillRect(x,y,drawingCoords[i].size,drawingCoords[i].size);
                    context.fill();
                    break;
                case Brushes.TEXT:
                    context.fillStyle = color;
                    context.font = drawingCoords[i].fontSize + "px Arial";
                    context.fillText(drawingCoords[i].text,x,y);
                    context.fill();
                    break;
                case Brushes.ERASER:
                    context.beginPath();
                    context.arc(x,y,drawingCoords[i].size,0,2 * Math.PI);
                    context.fillStyle = color;
                    context.fill();
                    context.lineWidth = 5;
                    context.strokeStyle = color;
                    context.stroke();



                    break;
                default:
                    context.beginPath();
                    context.fillStyle = color;
                    context.arc(x,y,drawingCoords[i].size,0,2 * Math.PI);
                    context.fill();
                    context.closePath();
            }

        }

    }


    //initialized canvases original size
    //by getting window size
    initCanvas() {
        if (!this.refs.canvas) {
            return;
        }

        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        const context = this.refs.canvas.getContext('2d');
        var canvas = this.refs.canvas;

        canvas.width = Math.floor(winWidth * 0.65);
        canvas.height = Math.floor(winHeight * 0.7);
        canvas.backgroundColor = this.props.backgroundColor;
    }


    createDrawing(mouseCoords) {

        var drawings = this.state.drawings;
        var newDrawing = {
            coord: mouseCoords,
            size: this.props.brushSize,
            brush: this.props.brush,
            color: this.props.brushColor
        };
        console.log('in create drawing brush = ' + newDrawing.brush);
        drawings.push(newDrawing);

        var data = {
            room: this.props.roomId,
            drawing: newDrawing
        };
        this.props.socket.emit('drawing', data);

        this.setState({drawings: drawings},() => {
            this.updateCanvase(drawings);
        });





    }


    createText(mouseCoords,text) {

        var drawings = this.state.drawings;
        var newDrawing = {
            coord: mouseCoords,
            size: this.props.brushSize,
            brush: Brushes.TEXT,
            text: text,
            fontSize: this.props.fontSize,
            color: '#000000'
        };
        drawings.push(newDrawing);
        this.setState({drawings: drawings});

        var data = {
            room: this.props.roomId,
            drawing: newDrawing
        };
        this.props.socket.emit('drawing', data);

    }



    containerClick(e) {
        if (this.props.brush == Brushes.TEXT) {
            var canvas = this.refs.canvas;
            var rect = canvas.getBoundingClientRect();
            var input = document.getElementById("textInput");


            var x = e.clientX;
            var y = e.clientY - rect.top;


            input.style.left = x + 'px';
            input.style.top = y + 'px';

            input.style.display = 'block';

            input.focus();

            var data = {
                x:x,
                y:y,
                username: this.props.username
            };


        }
    }


    onInputBlur(event) {
        console.log('in blue');
        var input = document.getElementById("textInput");
        var canvas = this.refs.canvas;
        var rect = canvas.getBoundingClientRect();

        //convert screen coords to canvas coords
        var left = parseInt(input.style.left.substring(0,input.style.left.length - 2));
        var top = parseInt(input.style.top.substring(0,input.style.top.length - 2));

        var x = left - rect.left;
        var y = top;

        x /= canvas.width;
        y /= canvas.height;

        var coords = {
            x: x,
            y: y
        };
        //render new text
        this.createText(coords,input.value);

        //hide input
        input.value = "";
        input.style.display = 'none';


    }


    render() {



        return (
            <div onClick={this.containerClick} id="canvas">
                <input onBlur={this.onInputBlur} ref="input" type="text" id="textInput" />
                <canvas  ref="canvas" onMouseUp={this.onCanvasClickUp} onMouseMove={this.onHover} onMouseDown={this.onCanvasClick} id="drawing-canvas"></canvas>
            </div>
        );
    }
}

export default DrawableCanvas;


//npm run build
//npm start