var jwt = require('jsonwebtoken');
var config = require('../config.js')
var models = require('../models');
var sequelize = models.sequelize;
var User = models.user;
var Commonfunction = require('../Utils/common');

module.exports = (req, res, next) => {
    console.log(req.headers['authorization'])
    if (!req.headers['authorization']) {
        res.status(401).send("Unauthorized")
    } else {
        jwt.verify(req.headers['authorization'], config.secret, (err, decoded) => {
            console.log(err)
            if (err) {
                res.status(403).send("Forbidden")
            } else {
                req.decoded = decoded;
                next()
            }
        })
    }
}