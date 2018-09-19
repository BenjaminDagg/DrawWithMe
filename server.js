
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);

var cors = require('cors');
app.use(cors());


const io = require('socket.io')(http);

io.on('connection', (client) => {
    client.on('join_room', (newUser) => {
        console.log(newUser.username + ' joined ' + newUser.roomId);
        client.join(newUser.roomId);
    });
    client.on('drawing', data => {

        io.sockets.in(data.room).emit('drawing', data.drawing);
    });
});

app.use( express.static( __dirname + `/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});





http.listen(process.env.PORT || 8080 ,() => console.log('server listening'));