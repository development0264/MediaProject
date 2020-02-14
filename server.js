require('dotenv').config()
var express = require('express');
var compression = require('compression');
var router = require('./routers/router')
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
app.use(compression())

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

app.use(passport.initialize());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization, Access-Control-Allow-Headers");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    };
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.use(express.static(__dirname + '/'));
app.use('/api', router)

// for Socket
var http = require('http').createServer(app);
global.io = require('socket.io')(http);


console.log(process.env.GatewayPort)
http.listen(process.env.GatewayPort, function () {
    console.log('listening on *:' + process.env.GatewayPort);
});

module.exports = app;
