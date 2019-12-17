require('dotenv').config()
var express = require('express');
var compression = require('compression');
var router = require('./routers/router')
var bodyParser = require('body-parser');
var app = express();
app.use(compression())

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.send("Welcome to Nodejs Api")
})

app.use(express.static(__dirname + '/'));
app.use('/api', router)

app.listen(3000);