require('dotenv').config()
var express = require('express');
var compression = require('compression');
var router = require('./routers/router')
var bodyParser = require('body-parser');
var app = express();
app.use(compression())

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.use(express.static(__dirname + '/'));
app.use('/api', router)

// for Socket
var http = require('http').createServer(app);
global.io = require('socket.io')(http);


http.listen(process.env.APIPort, function () {
    console.log('listening on *:' + process.env.APIPort);
});

io.sockets.on('connection', function (socket) {
    console.log('connection...');
})

// app.listen(3000);