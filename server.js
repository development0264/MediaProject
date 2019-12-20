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
    res.send("Welcome to Nodejs Api")
})

app.use(express.static(__dirname + '/'));
app.use('/api', router)

var http = require('http');
http.createServer(app).listen(3000);

// app.listen(3000);