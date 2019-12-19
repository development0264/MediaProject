var jwt = require('jsonwebtoken');
var config = require('../config.js')
var models = require('../models');
var sequelize = models.sequelize;
var User = models.user;
var Commonfunction = require('../Utils/common');

module.exports = (req, res, next) => {
    if (!req.headers['authorization']) {
        res.status(401).send("Unauthorized")
    } else {
        jwt.verify(req.headers['authorization'], config.secret, (err, decoded) => {
            if (err) {
                res.status(403).send("Forbidden")
            } else {
                req.decoded = decoded;
                next()
                // sequelize.transaction(function (t) {
                //     return User.findOne({ where: { email: decoded.email, isaccountverify: true } }).then(function (UserExist) {
                //         if (UserExist != null) {
                //             return next()
                //         }
                //         else {
                //             return { message: "Invalid Token" };
                //         }
                //     })
                // }).then(function (response) {
                //     return response
                // }).catch(function (err) {
                //     return {
                //         success: false,
                //         message: err.message,
                //     };
                // });
                // Commonfunction.CheckValidToken(decoded, function (resToken) {
                //     if (resToken.success == true) {
                //         next()
                //     }
                //     else {
                //         res.json(resToken);
                //     }
                // })
            }
        })
    }
}