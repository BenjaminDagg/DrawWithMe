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
                <div id="form-container">
                    <span class="input-label">Give yourself a nickname:</span><input class="home-input" onChange={this.onNicknameChanged}  value={this.state.nickname} type="text" />
                    <br />
                    <div class="form">
                        <h3 class="title">Create Room</h3>
                        <span class="input-label">Name your room:</span><input class="home-input" onChange={this.onCreateRoomChanged} value={this.state.createRoomName} type="text" />

                        {this.state.createRoomName && this.state.nickname &&
                        <Link to={"/room/" + this.state.createRoomName + "/user/" + this.state.nickname}>
                            <button  class="sbmt">Create</button>
                        </Link>
                        }
                    </div>
                    <div class="form">
                        <h3 class="title">Join Room</h3>
                        <span class="input-label">Name of room:</span><input class="home-input" onChange={this.onRoomChanged} value={this.state.roomName} type="text" />

                        {this.state.roomName && this.state.nickname &&
                        <Link to={"/room/" + this.state.roomName + "/user/" + this.state.nickname}>
                            <button class="sbmt">Join</button>
                        </Link>
                        }
                    </div>

                </div>

            </div>
        );
    }
}

export default Home;

