import React, { Component } from 'react';
import "./Chat.css";


export class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            message: ""
        };

        this.displayMessages = this.displayMessages.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageRecievied = this.onMessageRecievied.bind(this);
        this.onMessageRecievied((err,message) => {
            if (err) {
                return;
            }
            var messages = this.state.messages;
            messages.push(message);
            this.setState({messages:messages});

        });
    }


    componentDidMount() {

        var newUserWelcomeMessage = {
            username: 'Server',
            message: this.props.username + ' has joined the room',
            time: new Date().toISOString(),
            room: this.props.roomId
        };
        this.props.socket.emit('chat_message', newUserWelcomeMessage);
    }


    onMessageRecievied(callback) {
        this.props.socket.on('chat_message', message => callback(null, message));


    }


    sendMessage() {
        if (!this.state.message) {
            return;
        }

        var newMessage = {
            username: this.props.username,
            message: this.state.message,
            time: new Date().toISOString(),
            room: this.props.roomId
        };
        this.props.socket.emit('chat_message', newMessage);
    }


    onMessageChange(event) {
        this.setState({message:event.target.value});
    }


    displayMessages() {
        var list = this.state.messages.map((message) => {
            return (
                <div class="message-container">
                    <span>{message.username + ": " + message.message}</span>
                </div>
            )
        });

        return list;
    }

    render() {

        var messages = this.displayMessages();

        //scroll div down
        var messageDiv = document.getElementById("chat-messages");
        if (messageDiv) {
            messageDiv.scrollTop = messageDiv.scrollHeight - 100;
            messageDiv.scrollIntoView(false);
        }


        return (
            <div id="chat">
                <div id="chat-messages">
                    {messages}
                </div>
                <div id="chat-input-container">
                    <input onChange={this.onMessageChange} value={this.state.message} id="chat-input" type="text" /><button onClick={this.sendMessage} id="send-btn">Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;

