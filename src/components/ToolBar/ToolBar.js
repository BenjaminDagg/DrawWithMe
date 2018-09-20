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

    render() {

        return (
            <div id="toolBar">

                <div class="dropdown" id="brush-dropdown" class="toolbar-item">
                    <button onClick={this.toggleBrush}  class="dropdown-btn" id="brush-btn">Brush</button>
                    {this.state.brushOpen &&
                        <div className="dropdown-content" id="brush-content">
                            <button value={Brushes.SQUARE} onClick={this.filterClicked}>Square</button>
                            <button value={Brushes.CIRCLE} onClick={this.filterClicked}>Circle</button>
                        </div>
                    }
                </div>
                <div id="brush-size" class="toolbar-item">
                    <span>Brush Size</span><input onChange={this.brushSizeChanged} value={this.props.brushSize} id="brush-size-input" type="number" />
                </div>

            </div>
        );
    }
}

export default ToolBar;

