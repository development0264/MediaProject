var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
const isAuthorized = require('../Utils/tokenhandler').isAuthorized;
var tokenhandler = require('../Utils/tokenhandler');
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var validator = require('validator');
var config = require('../config.js')
var User = require('../data_accesss/user');

const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

router.post('/auth/signup', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ success: false, message: "name not provided" })
    } else if (!validator.isLength(req.body.name, { min: 6, max: undefined })) {
        res.status(400).send({ success: false, message: "name is shorter than minimum length" })
    } else if (!validator.isLength(req.body.name, { min: undefined, max: 20 })) {
        res.status(400).send({ success: false, message: "name is longer than maximum length" })
    } else if (!req.body.email) {
        res.status(400).send({ success: false, message: "email not provided" })
    } else if (!validator.isEmail(req.body.email)) {
        res.status(400).send({ success: false, message: "email is invalid, wrong format" })
    } else if (!validator.isLength(req.body.email, { min: 6, max: undefined })) {
        res.status(400).send({ success: false, message: "email is shorted than minimum length" })
    } else if (!validator.isLength(req.body.email, { min: undefined, max: 50 })) {
        res.status(400).send({ success: false, message: "email is longer than maximum length" })
    } else if (!req.body.password) {
        res.status(400).send({ success: false, message: "password not provided" })
    } else if (!validator.isLength(req.body.password, { min: 8, max: undefined })) {
        res.status(400).send({ success: false, message: "password is shorter than minimum length" })
    } else if (!validator.isLength(req.body.password, { min: undefined, max: 20 })) {
        res.status(400).send({ success: false, message: "password is longer than maximum length" })
    } else if (!strongRegex.test(req.body.password)) {
        res.status(400).send({ success: false, message: "password invalid criteria" })
    } else if (!req.body.confirmpassword) {
        res.status(400).send({ success: false, message: "confirmpassword not provided" })
    } else if (req.body.confirmpassword != req.body.password) {
        res.status(400).send({ success: false, message: "confirmpassword did not match password" })
    } else {
        api.post(req.path, req.body, {
        }).then((responseFromServer2) => {
            if (responseFromServer2.data.success) {
                res.status(200).send(responseFromServer2.data)
            } else {
                res.status(409).send(responseFromServer2.data)
            }
        }).catch((err) => {
            res.status(417).send(err)
        })
    }
})

router.get('/auth/verify', async (req, res) => {
    tokenhandler.verify(req.query.token).then(function (response) {
        api.get(req.path, {
            params: {
                decoded: response
            }
        }).then((responseFromServer2) => {
            if (responseFromServer2.data.success) {
                res.writeHead(301,
                    { Location: responseFromServer2.data.Location }
                );
                res.end()
            } else {
                res.status(422).send(responseFromServer2.data)
            }
        })
    }).catch((error) => res.status(409).send(error));
})

router.post('/auth/login', async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(400).send({ success: false, message: "email not provided" })
        }
        else if (!validator.isEmail(req.body.email)) {
            res.status(400).send({ success: false, message: "email is invalid, wrong format" })
        } else if (!validator.isLength(req.body.email, { min: 6, max: undefined })) {
            res.status(400).send({ success: false, message: "email is shorted than minimum length" })
        } else if (!validator.isLength(req.body.email, { min: undefined, max: 50 })) {
            res.status(400).send({ success: false, message: "email is longer than maximum length" })
        } else if (!req.body.password) {
            res.status(400).send({ success: false, message: "password not provided" })
        } else if (!validator.isLength(req.body.password, { min: 8, max: undefined })) {
            res.status(400).send({ success: false, message: "password is shorter than minimum length" })
        } else if (!strongRegex.test(req.body.password)) {
            res.status(400).send({ success: false, message: "password invalid criteria" })
        }
        else {
            api.post(req.path, req.body, {
            }).then((responseFromServer2) => {
                if (responseFromServer2.data.success) {
                    res.status(200).send(responseFromServer2.data)
                } else {
                    res.status(422).send(responseFromServer2.data)
                }
            }).catch((err) => {
                res.status(417).send(err)
            })
        }
    } catch (err) {
        res.status(500).end();
    }
})

router.get('/auth/forgotpassword', async (req, res) => {
    try {
        if (!req.query.email) {
            res.status(400).send({ success: false, message: "email not provided" })
        }
        else if (!validator.isEmail(req.query.email)) {
            res.status(400).send({ success: false, message: "email is invalid, wrong format" })
        } else if (!validator.isLength(req.query.email, { min: 6, max: undefined })) {
            res.status(400).send({ success: false, message: "email is shorted than minimum length" })
        } else if (!validator.isLength(req.query.email, { min: undefined, max: 50 })) {
            res.status(400).send({ success: false, message: "email is longer than maximum length" })
        } else {
            api.get(req.path, {
                params: {
                    email: req.query.email
                }
            }).then((responseFromServer2) => {
                if (responseFromServer2.data.success) {
                    res.status(200).send(responseFromServer2.data)
                } else {
                    res.status(401).send(responseFromServer2.data)
                }
            }).catch((err) => {
                res.status(417).send(err)
            })
        }
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/auth/resetverification', isAuthorized, async (req, res, next) => {
    api.get(req.path, {
        params: {
            email: req.decoded.email
        }
    }).then((responseFromServer2) => {
        if (responseFromServer2.data.success) {
            res.status(200).send(responseFromServer2.data)
        } else {
            res.status(401).send(responseFromServer2.data)
        }
    }).catch((err) => {
        res.status(417).send(err)
    })
});

router.post('/auth/request', async (req, res) => {
    console.log(req.body.token)
    tokenhandler.tokenverify(req.body.token)
        .then(function (decoded) {
            console.log("decoded", decoded)
            api.post(req.path, decoded).then((responseFromServer2) => {
                if (responseFromServer2.data.success) {
                    res.status(200).send(responseFromServer2.data)
                } else {
                    res.status(401).send(responseFromServer2.data)
                }
            }).catch((err) => {
                res.status(417).send(err)
            })
        }).catch((error) => res.status(417).send(error));


});

router.post('/auth/confirm', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ auth: false, message: "token not provided" })
    }
    else if (!req.body.password) {
        res.status(400).send({ auth: false, message: "password not provided" })
    } else if (!validator.isLength(req.body.password, { min: 8, max: undefined })) {
        res.status(400).send({ auth: false, message: "password is shorter than minimum length" })
    } else if (!validator.isLength(req.body.password, { min: undefined, max: 20 })) {
        res.status(400).send({ auth: false, message: "password is longer than minimum length" })
    } else if (!strongRegex.test(req.body.password)) {
        res.status(400).send({ auth: false, message: "password invalid criteria" })
    } else if (!req.body.confirmpassword) {
        res.status(400).send({ auth: false, message: "confirmpassword not provided" })
    } else if (req.body.confirmpassword != req.body.password) {
        res.status(400).send({ auth: false, message: "confirmpassword did not match password" })
    } else {
        await tokenhandler.tokenverify(req.body.token)
            .then(function (decoded) {
                api.post(req.path, req.body, {
                    params: {
                        email: decoded.email
                    }
                }).then((responseFromServer2) => {
                    if (responseFromServer2.data.success) {
                        res.status(200).send(responseFromServer2.data)
                    } else {
                        res.status(401).send(responseFromServer2.data)
                    }
                }).catch((err) => {
                    res.status(417).send(err)
                })
            }).catch((error) => res.status(417).send(error));
    }

});



router.post('/auth/checkuserexist', async (req, res) => {
    var response = await User.checkuserexist(req, res);
    if (response.success) {
        res.status(200).send(response)
    } else {
        res.status(200).send(response)
    }
})

module.exports = router