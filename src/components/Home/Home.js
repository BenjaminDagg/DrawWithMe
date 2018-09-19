import React, { Component } from 'react';
import "./Home.css";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

export class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roomName: "",
            createRoomName: "",
            nickname: "",
            navigate: false
        };

        this.onNicknameChanged = this.onNicknameChanged.bind(this);
        this.onRoomChanged = this.onRoomChanged.bind(this);
        this.onCreateRoomChanged = this.onCreateRoomChanged.bind(this);
        this.createRoom = this.createRoom.bind(this);
    }


    onNicknameChanged(event) {
        this.setState({nickname: event.target.value});
    }

    onRoomChanged(event) {
        this.setState({roomName: event.target.value});
    }

    onCreateRoomChanged(event) {
        this.setState({createRoomName: event.target.value});
    }

    createRoom(event) {
        if (!this.state.createRoomName) {
            console.log('out');
            return;
        }

    }

    render() {


        return (
            <div id="home">
                <span>Give yourself a nickname:</span><input onChange={this.onNicknameChanged}  value={this.state.nickname} type="text" />
                <br />
                <h1>Create Room</h1>
                <span>Name your room:</span><input onChange={this.onCreateRoomChanged} value={this.state.createRoomName} type="text" />
                <br />
                {this.state.createRoomName && this.state.nickname &&
                    <Link to={"/room/" + this.state.createRoomName + "/user/" + this.state.nickname}>
                        <button>Create</button>
                    </Link>
                }
                <br />

                <br />
                <h1>Join Room</h1>
                <span>Name of room:</span><input onChange={this.onRoomChanged} value={this.state.roomName} type="text" />
                <br />

                <br />
                {this.state.roomName && this.state.nickname &&
                <Link to={"/room/" + this.state.roomName + "/user/" + this.state.nickname}>
                    <button>Join</button>
                </Link>
                }

            </div>
        );
    }
}

export default Home;

