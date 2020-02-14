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
app.use('/media', require('./controller/MediaController'))
app.use('/auth', require('./controller/AuthController'))

// for Socket
var http = require('http').createServer(app);
global.io = require('socket.io')(http);

http.listen(process.env.APIPort, function () {
    console.log('listening on *:' + process.env.APIPort);
});