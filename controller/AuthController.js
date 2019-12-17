var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var models = require('../models');
var User = models.user;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var validator = require('validator');
var Commonfunction = require('../Utils/common.js');
const isAuthorized = require('./requestAuthenticator')
var sequelize = models.sequelize;


const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = redis.createClient({
    enable_offline_queue: false,
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/signup', (req, res) => {
    if (!req.body.name) {
        res.status(404).send({ auth: false, message: "name not provided" })
    } else if (!validator.isLength(req.body.name, { min: 6, max: undefined })) {
        res.status(404).send({ auth: false, message: "name is shorter than minimum length" })
    } else if (!validator.isLength(req.body.name, { min: undefined, max: 20 })) {
        res.status(404).send({ auth: false, message: "name is shorter than maximum length" })
    } else if (!req.body.email) {
        res.status(404).send({ auth: false, message: "email not provided" })
    } else if (!validator.isEmail(req.body.email)) {
        res.status(404).send({ auth: false, message: "email is	invalid,	wrong	format" })
    } else if (!validator.isLength(req.body.email, { min: 6, max: undefined })) {
        res.status(404).send({ auth: false, message: "email is	shorted	than minimum length" })
    } else if (!validator.isLength(req.body.email, { min: undefined, max: 50 })) {
        res.status(404).send({ auth: false, message: "email is longer than maximum length" })
    } else if (!req.body.password) {
        res.status(404).send({ auth: false, message: "password not provided" })
    } else if (!validator.isLength(req.body.password, { min: 8, max: undefined })) {
        res.status(404).send({ auth: false, message: "password is shorter than minimum length" })
    } else if (!validator.isLength(req.body.password, { min: undefined, max: 20 })) {
        res.status(404).send({ auth: false, message: "password is longer than minimum length" })
    } else if (!strongRegex.test(req.body.password)) {
        res.status(404).send({ auth: false, message: "password invalid criteria" })
    } else if (!req.body.confirmpassword) {
        res.status(404).send({ auth: false, message: "confirmpassword not provided" })
    } else if (req.body.confirmpassword != req.body.password) {
        res.status(404).send({ auth: false, message: "confirmpassword did not match password" })
    } else {
        sequelize.transaction(function (t) {
            return User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(function (chkUserExist) {
                if (chkUserExist != null) {
                    res.status(200).send({ auth: false, message: "email is already exist..." })
                } else {
                    let hashedPassword = bcrypt.hashSync(req.body.password, 8)
                    var objUserReg = req.body
                    objUserReg.password = hashedPassword
                    objUserReg.createddate = new Date()
                    return User.create(objUserReg).then(function (UserReg) {
                        if (UserReg != null) {
                            var token = jwt.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email, password: hashedPassword }, config.secret, { expiresIn: 86400 })
                            var EmailLink = process.env.APIURl + "api/Confirm?token=" + token
                            var body = '<h1><b>Thank You</b></h1><br>' +
                                'Thanks for registering. Please follow the link below to complete your registration.<br>' + EmailLink;
                            var obj = {
                                email: UserReg.email,
                                subject: "Thanks for Registering",
                                body: body,
                            }
                            return SendEmail(obj).then(function () {
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
})

router.get('/verify', function (req, res) {
    try {
        jwt.verify(req.query.token, config.secret, (err, decoded) => {
            if (err) {
                res.status(403).send("Forbidden")
            } else {
                User.findOne({ where: { email: decoded.email, isaccountverify: false } }).then(function (checkUserExist) {
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
        })
    }
    catch (ex) {
        res.send("Invalid token");
    }
})

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

    // Check if IP is already blocked
    if (resFastByIP !== null && resFastByIP.consumedPoints > maxWrongAttemptsByIPperMinute) {
        retrySecs = Math.round(resFastByIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        res.status(429).send({ success: false, message: "multiple attempts to login Retry-After : " + parseInt(retrySecs / 60) + " minutes" });
    } else {
        //sequelize.transaction(function (t) {
        var Encryptpassword = bcrypt.hashSync(req.body.password, 8);
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
                var passwordIsValid = bcrypt.compareSync(req.body.password, response.password)
                if (passwordIsValid) {
                    var user = {
                        id: response.id,
                        name: response.name,
                        email: response.email,
                        password: Encryptpassword,
                    }
                    var token = jwt.sign(user, config.secret, { expiresIn: 86400 })
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

router.post('/login', async (req, res) => {
    try {
        await loginRoute(req, res);
    } catch (err) {
        res.status(500).end();
    }
})

router.get('/forgotpassword', function (req, res) {
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
                    message: 'This email or username is not registered with us..',
                };
            } else {
                var NewPassword = Commonfunction.customPassword();
                let hashedPassword = bcrypt.hashSync(NewPassword, 8)
                // var NewPassword = 12345;             
                return response.updateAttributes({
                    password: hashedPassword
                }).then(function (UpdateRandomPassword) {
                    var body = '<b>Hi,</b><br>' +
                        '<b>Your Password is.</b> ' + NewPassword;
                    var obj = {
                        email: UpdateRandomPassword.email,
                        subject: "Forgot Password",
                        body: body,
                    }
                    return SendEmail(obj).then(function (ressendEmail) {
                        if (ressendEmail) {
                            return {
                                success: true,
                                message: 'Password sent to your email successfully...',
                            };
                        } else {
                            return {
                                success: false,
                                message: 'Password not sent to your email successfully...',
                            };
                        }
                    });
                }).catch(function (err) {
                    return {
                        success: false,
                        message: 'Password not sent to your email successfully...',
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
});


router.get('/resetverification', isAuthorized, function (req, res, nex) {
    try {
        // jwt.verify(req.query.token, config.secret, (err, decoded) => {
        //     if (err) {
        //         res.status(403).send("Forbidden")
        //     } else {
        console.log(req.decoded.email)
        User.findOne({ where: { email: req.decoded.email, isaccountverify: true } }).then(function (checkUserExist) {
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
        //     }
        // })
    }
    catch (ex) {
        res.send("Invalid token");
    }
});

//Comman Function Send Mail
function SendEmail(obj) {

    return new Promise(function (resolve, reject) {
        var mail = {
            from: process.env.FromEmail,
            to: obj.email,
            subject: obj.subject,
            html: obj.body
        };
        Commonfunction.transporter.sendMail(mail, function (error, response) {
            console.log("ERROR", error)
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }).then(function (resUpdate) {
        return resUpdate;
    }).catch(function (err) {
        //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
        return false;
    });
}

module.exports = router