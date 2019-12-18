var express = require('express');
var router = express.Router()
var authRouter = require('../controller/AuthController')

router.use((req, res, next) => {
    next()
})

router.use(authRouter)

module.exports = router