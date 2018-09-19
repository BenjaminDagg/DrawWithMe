
var express = require('express');
var app = require('express')();


var cors = require('cors');
app.use(cors());


const io = require('socket.io')();

io.on('connection', (client) => {
    console.log('user connected');
    client.on('message', (msg) => {
        console.log(msg);

        io.emit('message', msg);
    });
});

app.use( express.static( __dirname + `/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});



io.listen(5000);

app.listen(process.env.PORT || 8080 ,() => console.log('server listening'));