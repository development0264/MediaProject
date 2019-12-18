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
    if (!req.body.name) {
        res.status(404).send({ auth: false, message: "name not provided" })
    } else if (!validator.isLength(req.body.name, { min: 6, max: undefined })) {
        res.status(404).send({ auth: false, message: "name is shorter than minimum length" })
    } else if (!validator.isLength(req.body.name, { min: undefined, max: 20 })) {
        res.status(404).send({ auth: false, message: "name is shorter than maximum length" })
    } else if (!req.body.email) {
        res.status(404).send({ auth: false, message: "email not provided" })
    } else if (!validator.isEmail(req.body.email)) {
        res.status(404).send({ auth: false, message: "email is	invalid,	wrong	format" })
    } else if (!validator.isLength(req.body.email, { min: 6, max: undefined })) {
        res.status(404).send({ auth: false, message: "email is	shorted	than minimum length" })
    } else if (!validator.isLength(req.body.email, { min: undefined, max: 50 })) {
        res.status(404).send({ auth: false, message: "email is longer than maximum length" })
    } else if (!req.body.password) {
        res.status(404).send({ auth: false, message: "password not provided" })
    } else if (!validator.isLength(req.body.password, { min: 8, max: undefined })) {
        res.status(404).send({ auth: false, message: "password is shorter than minimum length" })
    } else if (!validator.isLength(req.body.password, { min: undefined, max: 20 })) {
        res.status(404).send({ auth: false, message: "password is longer than minimum length" })
    } else if (!strongRegex.test(req.body.password)) {
        res.status(404).send({ auth: false, message: "password invalid criteria" })
    } else if (!req.body.confirmpassword) {
        res.status(404).send({ auth: false, message: "confirmpassword not provided" })
    } else if (req.body.confirmpassword != req.body.password) {
        res.status(404).send({ auth: false, message: "confirmpassword did not match password" })
    } else {
        await userTransaction.signup(req, res);
    }
})

router.get('/verify', async (req, res) => {
    tokenhandler.verify(req.query.token)
        .then(function (decoded) {
            userTransaction.verify(req, res, decoded)
        }).catch((error) => console.log('error: ', error));
})

router.post('/login', async (req, res) => {
    try {
        await userTransaction.login(req, res)
    } catch (err) {
        res.status(500).end();
    }
})

router.get('/forgotpassword', async (req, res) => {
    await userTransaction.forgotpassword(req, res);
});

router.get('/resetverification', isAuthorized, async (req, res, next) => {
    await userTransaction.resetverification(req, res);
});

router.post('/request', async (req, res) => {
    await tokenhandler.verify(req.body.token)
        .then(function (decoded) {
            userTransaction.request(req, res, decoded);
        }).catch((error) => req.send('error: ', error));

});

router.post('/confirm', async (req, res) => {
    if (!req.body.password) {
        res.status(404).send({ auth: false, message: "password not provided" })
    } else if (!validator.isLength(req.body.password, { min: 8, max: undefined })) {
        res.status(404).send({ auth: false, message: "password is shorter than minimum length" })
    } else if (!validator.isLength(req.body.password, { min: undefined, max: 20 })) {
        res.status(404).send({ auth: false, message: "password is longer than minimum length" })
    } else if (!strongRegex.test(req.body.password)) {
        res.status(404).send({ auth: false, message: "password invalid criteria" })
    } else if (!req.body.confirmpassword) {
        res.status(404).send({ auth: false, message: "confirmpassword not provided" })
    } else if (req.body.confirmpassword != req.body.password) {
        res.status(404).send({ auth: false, message: "confirmpassword did not match password" })
    } else {
        await tokenhandler.verify(req.body.token)
            .then(function (decoded) {
                console.log(decoded)
                userTransaction.confirm(req, res, decoded);
            }).catch((error) => req.send('error: ', error));
    }

});

module.exports = router