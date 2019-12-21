var express = require('express');
var router = express.Router()
var authRouter = require('../controller/AuthController')
var mediaRouter = require('./mediaservices')
var userServices = require('./userservices')

router.use((req, res, next) => {
    next()
})

router.use(mediaRouter)
router.use(userServices)

module.exports = router