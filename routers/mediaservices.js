var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
const isAuthorized = require('../Utils/tokenhandler').isAuthorized;
var config = require('../config.js')

const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

var FormData = require('form-data');
var multer = require('multer')();


router.post('/media/photo', multer.single('Image'), isAuthorized, (req, res) => {

    const fileRecievedFromClient = req.file; //File Object sent in 'fileFieldName' field in multipart/form-data

    let form = new FormData();
    form.append('Image', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

    api.post(req.path, form, {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
            common: {
                'Authorization': req.headers['authorization'],
                'Tokenconfig': config.secret
            }
        },
        'maxContentLength': Infinity,
        'maxBodyLength': Infinity
    }).then((responseFromServer2) => {
        if (responseFromServer2.data.success) {
            res.status(200).send(responseFromServer2.data)
        } else {
            res.status(401).send(responseFromServer2.data)
        }
    }).catch((err) => {
        res.send(err)
    })
})

router.post('/media/video', multer.single('Video'), isAuthorized, (req, res) => {

    const fileRecievedFromClient = req.file;
    let form = new FormData();
    form.append('Video', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

    api.post(req.path, form, {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
            common: {
                'Authorization': req.headers['authorization'],
                'Tokenconfig': config.secret
            }
        },
        'maxContentLength': Infinity,
        'maxBodyLength': Infinity
    }).then((responseFromServer2) => {
        if (responseFromServer2.data.success) {
            res.status(200).send(responseFromServer2.data)
        } else {
            res.status(401).send(responseFromServer2.data)
        }
    }).catch((err) => {
        res.send(err)
    })
})

var cpUpload = multer.fields([{ name: 'Image', maxCount: 10 }, { name: 'Video', maxCount: 10 }])
router.post('/media/photoandvideo', cpUpload, isAuthorized, async (req, res) => {

    let form = new FormData();
    form.append('Image', req.files['Image'][0].buffer, req.files['Image'][0].originalname);
    form.append('Video', req.files['Video'][0].buffer, req.files['Video'][0].originalname);

    api.post(req.path, form, {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
            common: {
                'Authorization': req.headers['authorization'],
                'Tokenconfig': config.secret
            }

        },
        'maxContentLength': Infinity,
        'maxBodyLength': Infinity
    }).then((responseFromServer2) => {
        if (responseFromServer2.data.success) {
            res.status(200).send(responseFromServer2.data)
        } else {
            res.status(401).send(responseFromServer2.data)
        }
    }).catch((err) => {
        res.send(err)
    })
})

router.post('/media/share', isAuthorized, async (req, res) => {
    api.post(req.path, req.body, {
        params: {
            iduser: req.decoded.id,
            email: req.decoded.email,
            idmedia: req.query.photoids
        }
    }).then((responseFromServer2) => {
        if (responseFromServer2.data.success) {
            var obj = {
                email: req.decoded.email,
                message: req.decoded.email + ' shared photo with you'
            }
            io.sockets.emit(req.body.email + '-notifications', obj);
            res.status(200).send(responseFromServer2.data)
        } else {
            res.status(401).send(responseFromServer2.data)
        }
    }).catch((err) => {
        res.send(err)
    })
})

router.get('/media/notificationcount', isAuthorized, async (req, res) => {
    api.get(req.path, {
        params: {
            iduser: req.decoded.id
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
})

router.post('/media/notificationupdate', isAuthorized, async (req, res) => {
    api.get(req.path, {
        params: {
            idshare: req.body.id,
            iduser: req.decoded.id
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
})

module.exports = router