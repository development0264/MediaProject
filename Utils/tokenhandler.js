
var jwt = require('jsonwebtoken');
var config = require('../config');

const apiAdapter = require('../routers/apiAdapter')
const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

function tokenhandler() {
    this.sign = function (UserReg, expiresIn) {
        return jwt.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email, password: UserReg.password }, config.secret, { expiresIn: expiresIn })
    }

    this.verify = async function (token, args) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    reject({ success: false, message: "Token is invalid or expired" })
                } else {
                    resolve(decoded)
                }
            })
        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            throw err;
        });
    }

    this.isAuthorized = async function (req, res, next) {
        return new Promise(function (resolve, reject) {
            if (!req.headers['authorization']) {
                res.status(401).send("Unauthorized")
            } else {
                jwt.verify(req.headers['authorization'], config.secret, (err, decoded) => {
                    if (err) {
                        reject({ success: false, message: "Token is invalid or expired" })
                    } else {
                        api.get('auth/check', {
                            params: {
                                email: decoded.email
                            }
                        }).then((responseFromServer2) => {
                            if (responseFromServer2.data.success) {
                                req.decoded = decoded;
                                next()
                            }
                            else {
                                reject({ success: false, message: "Token is invalid or expired" })
                            }
                        }).catch((err) => {
                            reject({ success: false, message: "Token is invalid or expired" })
                        })

                        // console.log(decoded)
                        // var response = await userTransaction.checkuser(decoded);
                        // console.log("response", response)
                        // if (response.success) {
                        //     req.decoded = decoded;
                        //     next()
                        // }
                        // else {
                        //     reject({ success: false, message: "Token is invalid or expired" })
                        // }
                    }
                })
            }
        }).then(function (resUpdate) {
            res.status(403).send(resUpdate)
        }).catch(function (err) {
            //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            res.send(err)
        });
    }
}

module.exports = new tokenhandler(); 