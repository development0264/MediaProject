var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
const isAuthorized = require('../controller/requestAuthenticator')
var config = require('../config.js')

const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

var FormData = require('form-data');
var multer = require('multer')();


router.post('/upload/photo', multer.single('Image'), isAuthorized, (req, res) => {

    const fileRecievedFromClient = req.file; //File Object sent in 'fileFieldName' field in multipart/form-data

    let form = new FormData();
    form.append('fileFieldName', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

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
        res.send(responseFromServer2.data)
    }).catch((err) => {
        res.send(err)
    })
})

router.post('/upload/video', multer.single('Video'), isAuthorized, (req, res) => {

    const fileRecievedFromClient = req.file;
    let form = new FormData();
    form.append('fileFieldName', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

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
        res.send(responseFromServer2.data)
    }).catch((err) => {
        res.send(err)
    })
})

var cpUpload = multer.fields([{ name: 'Image', maxCount: 1 }, { name: 'Video', maxCount: 1 }])
router.post('/upload/photoandvideo', cpUpload, isAuthorized, async (req, res) => {

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
        res.send(responseFromServer2.data)
    }).catch((err) => {
        res.send(err)
    })
})

module.exports = router