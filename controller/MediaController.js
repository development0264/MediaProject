var express = require('express');
var router = express.Router();
var imagevideohandler = require('../Utils/imagevideohandler');
const isAuthorized = require('../Utils/tokenhandler').isAuthorized;
var Media = require('../data_accesss/media');
var User = require('../data_accesss/user');


router.get('/list', async (req, res) => {
    var response = await Media.list(req, res)
    res.status(200).send(response).end();
});

router.get('/sharedlist', async (req, res) => {
    var response = await Media.sharedlist(req, res)
    res.status(200).send(response).end();
});

router.post('/photo', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.imagevideoupload(req, res)
    res.status(200).send(response).end();
});

router.post('/video', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.imagevideoupload(req, res)
    res.status(200).send(response).end();
});

router.post('/photoandvideo', isAuthorized, async (req, res) => {
    var response = await imagevideohandler.mediapair(req, res)
    console.log(response)
    res.status(200).send(response).end();
});

router.post('/share', async (req, res) => {
    var response = await User.share(req, res)
    res.status(200).send(response).end();
});


router.get('/notificationcount', async (req, res) => {
    var response = await Media.notificationcount(req, res)
    res.status(200).send(response).end();
});

router.get('/notificationupdate', async (req, res) => {
    var response = await Media.notificationupdate(req, res)
    res.status(200).send(response).end();
});
module.exports = router