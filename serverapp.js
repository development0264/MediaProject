require('dotenv').config()
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();
app.use(compression())

app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '100mb',
    extended: true
}));

app.get('/', (req, res) => {
    res.send("Welcome to Nodejs Api")
})

app.use(express.static(__dirname + '/'));
app.use('/upload', require('./controller/MediaController'))
app.use('/auth', require('./controller/AuthController'))

// for Socket
var http = require('http').createServer(app);
global.io = require('socket.io')(http);

// var socket = require('socket.io-client')('http://localhost:3000');

app.listen(3001);