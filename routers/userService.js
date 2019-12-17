var express = require('express');
var router = express.Router()
const isAuthorized = require('../controller/requestAuthenticator')

// const BASE_URL = 'http://localhost:8000'
// const api = apiAdapter(BASE_URL)

router.get('/feeds', isAuthorized, (req, res) => {

})

router.get('/feeds/:hashtag', isAuthorized, (req, res) => {

})

router.post('/feeds', isAuthorized, (req, res) => {

})

module.exports = router