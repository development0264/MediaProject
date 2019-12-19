var express = require('express');
var router = express.Router()
var authRouter = require('../controller/AuthController')
var mediaRouter = require('../controller/MediaController')

router.use((req, res, next) => {
    next()
})

router.use(authRouter)
router.use(mediaRouter)

module.exports = router