var express = require('express');
var router = express.Router()
var UserRouter = require('./userService')
var authRouter = require('../controller/AuthController')

router.use((req, res, next) => {
    next()
})

router.use(UserRouter)
router.use(authRouter)

module.exports = router