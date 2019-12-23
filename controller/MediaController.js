var express = require('express');
var router = express.Router();
var imagevideohandler = require('../Utils/imagevideohandler');
const isAuthorized = require('../Utils/tokenhandler').isAuthorized;
var Media = require('../data_accesss/media');
var User = require('../data_accesss/user');


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
    var response = await User.share(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});


router.get('/notificationcount', async (req, res) => {
    var response = await Media.notificationcount(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});

router.get('/notificationupdate', async (req, res) => {
    var response = await Media.notificationupdate(req, res)
    if (response.success) {
        res.status(200).send(response).end();
    }
    else {
        res.status(200).send(response).end();
    }
});
module.exports = router