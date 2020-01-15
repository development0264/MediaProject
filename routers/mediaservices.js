var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
const isAuthorized = require('../Utils/tokenhandler').isAuthorized;
var config = require('../config.js')

const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

var FormData = require('form-data');
var multer = require('multer');
var upload = multer().array('files', 2)
var uploadvideo = multer().array('files', 5)
var uploadphoto = multer().array('files', 5)

router.get('/media/list', isAuthorized, (req, res) => {
    api.get(req.path, {
        params: {
            iduser: req.decoded.id,
            active: req.query.active,
            order: req.query.order,
            search: req.query.search,
            length: req.query.pageSize,
            start: req.query.page,
        }
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

router.get('/media/sharedlist', isAuthorized, (req, res) => {
    api.get(req.path, {
        params: {
            iduser: req.decoded.id,
            active: req.query.active,
            order: req.query.order,
            search: req.query.search,
            length: req.query.pageSize,
            start: req.query.page,
        }
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

router.post('/media/photo', isAuthorized, (req, res) => {

    uploadphoto(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({
                "status": "failed",
                "message": err.message
            });
        } else if (err) {
            res.status(500).send({
                "status": "failed",
                "message": err.message
            });
        } else {

            let form = new FormData();
            for (var i = 0; i < req.files.length; i++) {
                const fileRecievedFromClient = req.files[i];
                form.append(fileRecievedFromClient.fieldname, fileRecievedFromClient.buffer, fileRecievedFromClient.originalname, fileRecievedFromClient.mimetype);
            }

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

        }
    })
})

router.post('/media/video', isAuthorized, (req, res) => {

    uploadvideo(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({
                "status": "failed",
                "message": err.message
            });
        } else if (err) {
            res.status(500).send({
                "status": "failed",
                "message": err.message
            });
        } else {

            let form = new FormData();
            for (var i = 0; i < req.files.length; i++) {
                const fileRecievedFromClient = req.files[i];
                form.append(fileRecievedFromClient.fieldname, fileRecievedFromClient.buffer, fileRecievedFromClient.originalname, fileRecievedFromClient.mimetype);
            }

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

        }
    })
})

router.post('/media/photoandvideo', isAuthorized, async (req, res, next) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({
                "status": "failed",
                "message": err.message
            });
        } else if (err) {
            res.status(500).send({
                "status": "failed",
                "message": err.message
            });
        } else {
            let form = new FormData();
            for (var i = 0; i < req.files.length; i++) {
                const fileRecievedFromClient = req.files[i];
                form.append(fileRecievedFromClient.fieldname, fileRecievedFromClient.buffer, fileRecievedFromClient.originalname, fileRecievedFromClient.mimetype);
            }

            api.post(req.path, form, {
                params: {
                    ispair: true
                },
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
                res.status(401).send(err)
            })
        }
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
    console.log(req.decoded.id)
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