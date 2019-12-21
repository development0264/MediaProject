var express = require('express');
var router = express.Router();
var imagevideohandler = require('../Utils/imagevideohandler');
var sharehandler = require('../Utils/sharehandler');
const isAuthorized = require('../Utils/tokenhandler').isAuthorized;


router.post('/photo', async (req, res) => {
    var response = await imagevideohandler.imageupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/video', async (req, res) => {
    var response = await imagevideohandler.videoupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/photoandvideo', async (req, res) => {
    var response = await imagevideohandler.imagevideoupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.post('/share', async (req, res) => {
    var response = await sharehandler.share(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

module.exports = router