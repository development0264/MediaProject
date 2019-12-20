var express = require('express');
var router = express.Router();
var imagevideohandler = require('../Utils/imagevideohandler');
const isAuthorized = require('../controller/requestAuthenticator')


router.post('/photo', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.imageupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/video', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.videoupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/photoandvideo', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.imagevideoupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

module.exports = router