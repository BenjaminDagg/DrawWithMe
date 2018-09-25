
var express = require('express');
var app = require('express')();

//for deployment
//var http = require('http').Server(app);

var cors = require('cors');
app.use(cors());

//for deployment
//const io = require('socket.io')(http);

//for dev
const io = require('socket.io')();

//new socket connected to server
io.on('connection', (client) => {

    //client joined a specified room
    client.on('join_room', (newUser) => {
        console.log(newUser.username + ' joined ' + newUser.roomId);
        client.join(newUser.roomId);
    });
    //client sent a new drawnig coordinate
    client.on('drawing', data => {

        io.sockets.in(data.room).emit('drawing', data.drawing);
    });
    //client sent new chat message
    client.on('chat_message', (message) => {
        io.sockets.in(message.room).emit('chat_message',message);
    })
    //client changed background color of screen
    client.on('bck_change', (data) => {
        console.log('on server got bck color');
        io.sockets.in(data.room).emit('bck_change',data);
    });
    client.on('clear_canvas', (data) => {

        io.sockets.in(data.roomId).emit('clear_canvas',data);
    });

});

app.use( express.static( __dirname + `/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});


//for dev
io.listen(5000);
app.listen(process.env.PORT || 8080 ,() => console.log('server listening'));

//for deployment
//http.listen(process.env.PORT || 8080 ,() => console.log('server listening'));