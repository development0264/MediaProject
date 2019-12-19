
var models = require('../models');
var emailhandler = require('../Utils/emailhandler');
var commonfunction = require('../Utils/common');
var tokenhandler = require('../Utils/tokenhandler');
var sequelize = models.sequelize;
var User = models.user;

const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = redis.createClient({
    enable_offline_queue: false,
});

const maxWrongAttemptsByIPperMinute = 5;

const limiterFastBruteByIP = new RateLimiterRedis({
    redis: redisClient,
    keyPrefix: 'login_fail_ip_per_minute',
    points: maxWrongAttemptsByIPperMinute,
    duration: 30,
    blockDuration: 60 * 10, // Block for 10 minutes, if 5 wrong attempts per 30 seconds
});

async function loginRoute(req, res) {

    const ipAddr = req.connection.remoteAddress;
    const [resFastByIP, resSlowByIP] = await Promise.all([
        limiterFastBruteByIP.get(ipAddr),
    ]);

    let retrySecs = 0;

    if (resFastByIP !== null && resFastByIP.consumedPoints > maxWrongAttemptsByIPperMinute) {
        retrySecs = Math.round(resFastByIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        res.status(429).send({ success: false, message: "multiple attempts to login Retry-After : " + parseInt(retrySecs / 60) + " minutes" });
    } else {
        //sequelize.transaction(function (t) {
        var Encryptpassword = commonfunction.encryption(req.body.password);
        User.findOne({
            where: {
                $or: [{
                    email: req.body.email
                }, {
                    name: req.body.email,
                }],
                isaccountverify: true
            }
        }).then(function (response) {
            if (response == null) {
                try {
                    Promise.all([
                        limiterFastBruteByIP.consume(ipAddr)
                    ]);
                    res.status(400).send({ success: false, message: 'email or name is wrong' });
                } catch (rlRejected) {
                    if (rlRejected instanceof Error) {
                        throw rlRejected;
                    } else {
                        res.set('Retry-After', parseInt(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
                        res.status(429).send({ success: false, message: "multiple attempts to login Retry-After : " + String(Math.round(rlRejected.msBeforeNext / 1000)) || 1 + " minutes" });
                    }
                }
            }
            else {
                var passwordIsValid = commonfunction.encryptioncompareSync(req.body.password, response.password)
                if (passwordIsValid) {
                    var user = {
                        id: response.id,
                        name: response.name,
                        email: response.email,
                        password: Encryptpassword,
                    }
                    var token = tokenhandler.sign(user)
                    res.status(400).send({
                        success: true,
                        token: token,
                        data: response,
                        message: "Login Successfully..."
                    });
                } else {
                    try {
                        limiterFastBruteByIP.consume(ipAddr),
                            res.status(400).send({ success: false, message: 'password is wrong' });
                    } catch (rlRejected) {
                        if (rlRejected instanceof Error) {
                            throw rlRejected;
                        } else {
                            res.set('Retry-After', parseInt(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
                            res.status(429).send({ success: false, message: "multiple attempts to login Retry-After : " + String(Math.round(rlRejected.msBeforeNext / 1000)) || 1 + " minutes" });
                        }
                    }
                }
            }
        });
    }
}

function userTransaction() {

    this.signup = function (req, res) {
        sequelize.transaction(function (t) {
            return User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(function (chkUserExist) {
                if (chkUserExist != null) {
                    res.status(200).send({ auth: false, message: "email is already exist..." })
                } else {
                    console.log(req.body.password)
                    let hashedPassword = commonfunction.encryption(req.body.password)
                    var objUserReg = req.body
                    objUserReg.password = hashedPassword
                    objUserReg.createddate = new Date()
                    return User.create(objUserReg).then(function (UserReg) {
                        if (UserReg != null) {
                            var token = tokenhandler.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email, password: hashedPassword })

                            console.log("token", token)
                            var EmailLink = process.env.APIURl + "api/Confirm?token=" + token
                            var body = '<h1><b>Thank You</b></h1><br>' +
                                'Thanks for registering. Please follow the link below to complete your registration.<br>' + EmailLink;
                            var obj = {
                                email: UserReg.email,
                                subject: "Thanks for Registering",
                                body: body,
                            }
                            return emailhandler.sendemail(obj).then(function () {
                                return {
                                    auth: true,
                                    message: 'Your account have been successfully created. In order to activate it, please check your mailbox for more details.',
                                    token: token
                                };
                            })
                        } else {
                            res.status(500).send({ auth: false, message: "Registration failed" })
                        }

                    })
                }
            })
        }).then(function (response) {
            res.json(response);
        }).catch(function (err) {
            res.json({
                success: false,
                message: err.message,
            });
        });
    }

    this.verify = function (req, res, decoded) {
        return User.findOne({ where: { email: decoded.email, isaccountverify: false } }).then(function (checkUserExist) {
            if (checkUserExist != null) {
                User.update({ isaccountverify: true, modifieddate: new Date() }, {
                    where: {
                        id: checkUserExist.id
                    }
                }).then(function (response) {
                    res.writeHead(301,
                        { Location: "http://localhost:3000" }
                    );
                    res.end()
                })
            } else {
                res.send({ auth: false, message: "Invalid token : " + req.query.token });
            }
        })
    }

    this.login = async function (req, res) {
        await loginRoute(req, res);
    }

    this.forgotpassword = async function (req, res) {
        sequelize.transaction(function (t) {
            return User.findOne({
                where: {
                    $or: [{
                        email: req.query.email
                    }, {
                        name: req.query.email,
                    }],
                }
            }).then(function (response) {
                if (response == null) {
                    return {
                        success: false,
                        message: 'Please check email for reset password instructions',
                    };
                } else {

                    var token = tokenhandler.sign({ email: req.query.email })

                    var EmailLink = process.env.APIURl + "/ResetPassword?token=" + token
                    var body = '<h1><b>Reset Password</b></h1><br>' +
                        'Please follow the link below to Reset your Password.<br>' + EmailLink;
                    var obj = {
                        email: response.email,
                        subject: "Reset Password",
                        body: body,
                    }

                    return emailhandler.sendemail(obj).then(function () {
                        return {
                            auth: true,
                            message: 'email is sent on your register mail address.',
                            token: token
                        };
                    })
                }
            });
        }).then(function (response) {
            res.json(response);
        }).catch(function (err) {
            // The catch here for other errors
            // console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            res.json({
                success: false,
                message: err.message,
            });
        });
    }

    this.resetverification = async function (req, res) {
        sequelize.transaction(function (t) {
            return User.findOne({ where: { email: req.decoded.email, isaccountverify: true } }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    checkUserExist.updateAttributes({ isaccountverify: false, modifieddate: new Date() }).then(function (response) {
                        res.writeHead(301,
                            { Location: "http://localhost:3000" }
                        );
                        res.end()
                    })
                } else {
                    res.send({ auth: false, message: "Invalid token : " + req.query.token });
                }
            })
        }).then(function (response) {
            res.json(response);
        }).catch(function (err) {
            res.json({
                success: false,
                message: err.message,
            });
        });

    }

    this.request = async function (req, res, decoded) {
        sequelize.transaction(function (t) {
            return User.findOne({ where: { email: decoded.email, isaccountverify: true } }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    return true
                } else {
                    return false
                }
            })
        }).then(function (response) {
            if (response) {
                res.send({ auth: true, message: "valid token : " + req.body.token });
            } else {
                res.send({ auth: false, message: "Invalid token : " + req.body.token });
            }
        }).catch(function (err) {
            res.json({
                success: false,
                message: err.message,
            });
        });
    }

    this.confirm = async function (req, res, decoded) {
        sequelize.transaction(function (t) {
            return User.findOne({ where: { email: decoded.email, isaccountverify: true } }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    let hashedPassword = commonfunction.encryption(req.body.password)
                    return checkUserExist.updateAttributes({ password: hashedPassword, modifieddate: new Date() }).then(function (Updateresponse) {
                        return true
                    })
                } else {
                    return false
                }
            })
        }).then(function (response) {
            if (response) {
                res.send({ auth: true, message: "Your password is successfully reset." });
                res.end()
            } else {
                res.send({ auth: false, message: "Invalid token : " + req.body.token });
            }
        }).catch(function (err) {
            res.json({
                success: false,
                message: err.message,
            });
        });
    }

    // this.checkuser = async function (decoded, callback) {
    //     User.findOne({ where: { email: decoded.email, isaccountverify: true } }).then(function (UserExist) {
    //         if (UserExist != null) {
    //             return callback(UserExist)
    //         }
    //         else {
    //             return callback(null)
    //         }
    //     })
    // }

}



module.exports = new userTransaction();  