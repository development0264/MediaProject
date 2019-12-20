var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
const isAuthorized = require('../controller/requestAuthenticator')
var tokenhandler = require('../Utils/tokenhandler');
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var validator = require('validator');
var config = require('../config.js')

const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

router.post('/auth/signup', async (req, res) => {
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
        api.post(req.path, req.body, {
        }).then((responseFromServer2) => {
            res.send(responseFromServer2.data)
        }).catch((err) => {
            res.send(err)
        })
    }
})

router.get('/auth/verify', async (req, res) => {
    tokenhandler.verify(req.query.token)
        .then(function (decoded) {
            console.log("decoded", decoded)
            api.get(req.path, {
                params: {
                    decoded: decoded
                }
            }).then((responseFromServer2) => {
                res.send(responseFromServer2.data)
            }).catch((err) => {
                console.log(err)
                res.send(err)
            })
        }).catch((error) => console.log('error: ', error));
})

router.post('/auth/login', async (req, res) => {
    try {
        api.post(req.path, req.body, {
        }).then((responseFromServer2) => {
            res.send(responseFromServer2.data)
        }).catch((err) => {
            res.send(err)
        })
    } catch (err) {
        res.status(500).end();
    }
})

router.get('/auth/forgotpassword', async (req, res) => {
    api.get(req.path, {
        params: {
            email: req.query.email
        }
    }).then((responseFromServer2) => {
        res.send(responseFromServer2.data)
    }).catch((err) => {
        res.send(err)
    })
});

router.get('/auth/resetverification', isAuthorized, async (req, res, next) => {
    api.get(req.path, {
        params: {
            email: req.decoded.email
        }
    }).then((responseFromServer2) => {
        res.send(responseFromServer2.data)
    }).catch((err) => {
        res.send(err)
    })
});

router.post('/auth/request', async (req, res) => {
    tokenhandler.verify(req.body.token)
        .then(function (decoded) {
            api.post(req.path, decoded).then((responseFromServer2) => {
                res.send(responseFromServer2.data)
            }).catch((err) => {
                res.send(err)
            })
        }).catch((error) => req.send('error: ', error));


});

router.post('/auth/confirm', isAuthorized, async (req, res) => {
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
        // await tokenhandler.verify(req.body.token)
        //     .then(function (decoded) {
        console.log(req.decoded.email)
        console.log(req.body)
        api.post(req.path, req.body, {
            params: {
                email: req.decoded.email
            }
        }).then((responseFromServer2) => {
            res.send(responseFromServer2.data)
        }).catch((err) => {
            res.send(err)
        })
        // }).catch((error) => req.send('error: ', error));
    }

});

module.exports = router