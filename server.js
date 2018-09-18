var express = require('express');
var app = express();
const path = require('path');

var cors = require('cors');
app.use(cors());

app.use( express.static( `${__dirname}/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(3000);