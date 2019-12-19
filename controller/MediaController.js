var express = require('express');
var router = express.Router();
const isAuthorized = require('./requestAuthenticator')
var imagevideohandler = require('../Utils/imagevideohandler');


router.post('/upload/photo', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.imageupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(500).send(response).end();
    }
});

router.post('/upload/video', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.videoupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(500).send(response).end();
    }
});

router.post('/upload/photoandvideo', isAuthorized, async (req, res) => {
    console.log(req.body)
    var response = await imagevideohandler.imagevideoupload(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(500).send(response).end();
    }


    // var response = await imagevideohandler.videoupload(req, res)
    // if (response.success) {
    //     res.status(200).send(response).end();
    // }
    // else {
    //     res.status(500).send(response).end();
    // }
});

module.exports = router