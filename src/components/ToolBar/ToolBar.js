import React, { Component } from 'react';
import "./ToolBar.css";
import { Brushes } from "../../models/Brushes";


export class ToolBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            brushOpen:false
        };

        this.toggleBrush = this.toggleBrush.bind(this);
        this.filterClicked = this.filterClicked.bind(this);
        this.brushSizeChanged = this.brushSizeChanged.bind(this);
        this.onBckColorChange = this.onBckColorChange.bind(this);
        this.onBrushColorChange = this.onBrushColorChange.bind(this);
        this.textBtnClick = this.textBtnClick.bind(this);
    };

    componentDidMount() {


    }


    toggleBrush() {

        this.setState({brushOpen:!this.state.brushOpen});
    }


    filterClicked(event) {
        this.props.onBrushSelected(event.target.value);
        this.toggleBrush();
    }


    brushSizeChanged(event) {
        console.log('in event');
        this.props.onBrushSizeSelected(event.target.value);
    }

    onBckColorChange(event) {

        this.props.onBackgroundColorChange(event.target.value);
    }

    onBrushColorChange(event) {
        this.props.onBrushColorChange(event.target.value);
    }


    textBtnClick() {
        console.log('in child');
        this.props.textButtonWasClicked();
    }

    render() {

        return (
            <div id="toolBar">

                <div class="dropdown" id="brush-dropdown" class="toolbar-item">
                    <button onClick={this.toggleBrush}  class="dropdown-btn" id="brush-btn">Brush</button>
                    {this.state.brushOpen &&
                        <div class="dropdown-content" id="brush-content">
                            <button value={Brushes.SQUARE} onClick={this.filterClicked}>Square</button>
                            <button value={Brushes.CIRCLE} onClick={this.filterClicked}>Circle</button>
                        </div>
                    }
                </div>
                <div id="brush-size" class="toolbar-item">
                    <span>Brush Size</span><input onChange={this.brushSizeChanged} value={this.props.brushSize} id="brush-size-input" type="number" />
                </div>
                <div class="toolbar-item" id="bckPicker">
                    <span>Background Color</span><input value={this.props.backgroundColor} id="bckInput" type="color" onChange={this.onBckColorChange} />
                </div>
                <div class="toolbar-item" id="brushColorPicker">
                    <span>Brush Color</span><input value={this.props.brushColor} id="brushColorInput" type="color"
                                                        onChange={this.onBrushColorChange}/>
                </div>
                <div className="toolbar-item" id="textContainer">
                    <button onClick={this.textBtnClick}> Text</button>
                </div>


            </div>
        );
    }
}

export default ToolBar;

