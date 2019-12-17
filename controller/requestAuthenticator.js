var jwt = require('jsonwebtoken');
var config = require('../config.js')

module.exports = (req, res, next) => {
    console.log("authorization", req.headers['authorization'])
    if (!req.headers['authorization']) {
        res.status(401).send("Unauthorized")
    } else {
        jwt.verify(req.headers['authorization'], config.secret, (err, decoded) => {
            console.log(err, decoded)
            if (err) {
                res.status(403).send("Forbidden")
            } else {
                req.decoded = decoded;
                next()
            }
        })
    }
}