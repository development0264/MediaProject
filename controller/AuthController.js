var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var tokenhandler = require('../Utils/tokenhandler');
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var validator = require('validator');
const isAuthorized = require('./requestAuthenticator')
var userTransaction = require('../services/userservices');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/signup', async (req, res) => {
    var response = await userTransaction.signup(req, res);
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
})

router.get('/verify', async (req, res) => {
    var response = await userTransaction.verify(req, res, req.query.decoded);
    if (response.success) {
        res.writeHead(301,
            { Location: response.Location }
        );
        res.end()
    }
    else {
        res.status(200).send(response).end();
    }
})

router.post('/login', async (req, res) => {
    await userTransaction.login(req, res);
})

router.get('/forgotpassword', async (req, res) => {
    var response = await userTransaction.forgotpassword(req, res);
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.get('/resetverification', async (req, res) => {
    var response = await userTransaction.resetverification(req, res);
    if (response.success) {
        res.writeHead(301,
            { Location: response.Location }
        );
        res.end()
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/request', async (req, res) => {

    var response = await userTransaction.request(req, res);
    console.log(response)
    if (response.success) {
        res.writeHead(301,
            { Location: response.Location }
        );
        res.end()
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/confirm', async (req, res) => {

    var response = await userTransaction.confirm(req, res);
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

module.exports = router