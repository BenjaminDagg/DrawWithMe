
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cors = require('cors');
app.use(cors());

app.use( express.static( `${__dirname}/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});