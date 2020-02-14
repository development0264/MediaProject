
var jwt = require('jsonwebtoken');
var config = require('../config');

const apiAdapter = require('../routers/apiAdapter')
const BASE_URL = process.env.BASE_URL
const api = apiAdapter(BASE_URL)

function tokenhandler() {
    this.sign = function (UserReg, expiresIn) {
        return jwt.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email }, config.secret, { expiresIn: expiresIn })
    }

    this.forgotpasswordsign = function (UserReg, expiresIn) {
        return jwt.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email, password: UserReg.password }, config.forgotsecret, { expiresIn: expiresIn })
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

    this.tokenverify = async function (token, args) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.forgotsecret, (err, decoded) => {
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
            if (!req.headers['authorization'] || req.headers['authorization'] == null) {
                res.status(401).send("Unauthorized")
            } else {
                jwt.verify(req.headers['authorization'], config.secret, (err, decoded) => {
                    if (err instanceof jwt.TokenExpiredError) {
                        res.status(401).send("Unauthorized")
                    } else if (err instanceof jwt.JsonWebTokenError) {
                        res.status(403).send("Token is Invalid")
                    } else {
                        api.get('auth/check', {
                            params: {
                                email: decoded.email
                            }
                        }).then((responseFromServer2) => {
                            if (responseFromServer2.data.success) {
                                req.Is_Expired = false;
                                req.decoded = decoded;
                                next()
                            }
                            else {
                                return reject({ success: false, message: "Token is Invalid" })
                            }
                        }).catch((err) => {
                            return reject({ success: false, message: "Token is Invalid" })
                        })
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

    this.isrefreshAuthorized = async function (req, res, next) {
        const refreshToken = req.body.refreshToken;
        return new Promise(function (resolve, reject) {
            if (!refreshToken) {
                res.status(401).send("Unauthorized")
            } else {
                jwt.verify(refreshToken, config.secret, (err, decoded) => {
                    if (err instanceof jwt.TokenExpiredError) {
                        res.status(401).send("Unauthorized")
                    } else if (err instanceof jwt.JsonWebTokenError) {
                        res.status(403).send("Token is Invalid")
                    } else {
                        api.get('auth/checkrefreshToken', {
                            params: {
                                token: refreshToken
                            }
                        }).then((responseFromServer2) => {
                            if (responseFromServer2.data.success) {
                                var accesstoken = jwt.sign({ id: decoded.id, name: decoded.name, email: decoded.email }, config.secret, { expiresIn: config.AuthorizationexpiresIn })
                                return resolve({ jwt: accesstoken })
                            }
                            else {
                                res.status(403).send("Token is Invalid")
                            }
                        }).catch((err) => {
                            res.status(403).send("Token is Invalid")
                        })
                    }
                })
            }
        }).then(function (resUpdate) {
            res.status(200).send(resUpdate)
        }).catch(function (err) {
            //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            res.send(err)
        });
    }

}

module.exports = new tokenhandler();