
var express = require('express');
var app = require('express')();

//for deployment
var http = require('http').Server(app);

var cors = require('cors');
app.use(cors());

//for deployment
const io = require('socket.io')(http);

//for dev
//const io = require('socket.io')();

io.on('connection', (client) => {
    client.on('join_room', (newUser) => {
        console.log(newUser.username + ' joined ' + newUser.roomId);
        client.join(newUser.roomId);
    });
    client.on('drawing', data => {

        io.sockets.in(data.room).emit('drawing', data.drawing);
    });
    client.on('chat_message', (message) => {
        io.sockets.in(message.room).emit('chat_message',message);
    })
});

app.use( express.static( __dirname + `/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});


//for dev
//io.listen(5000);
//app.listen(process.env.PORT || 8080 ,() => console.log('server listening'));

//for deployment
http.listen(process.env.PORT || 8080 ,() => console.log('server listening'));