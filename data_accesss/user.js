
var models = require('../models');
var emailhandler = require('../Utils/emailhandler');
var commonfunction = require('../Utils/common');
var tokenhandler = require('../Utils/tokenhandler');
var sequelize = models.sequelize;
var User = models.tbluser;
var Share = models.tblshare;
var Invite = models.tblinviteduser;
var bcrypt = require('bcryptjs');

var config = require('../config');

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

    //return new Promise(function (resolve, reject) {
    const ipAddr = req.connection.remoteAddress;
    const [resFastByIP, resSlowByIP] = await Promise.all([
        limiterFastBruteByIP.get(ipAddr),
    ]);

    let retrySecs = 0;

    console.log('resFastByIP', resFastByIP)
    if (resFastByIP !== null && resFastByIP.consumedPoints > maxWrongAttemptsByIPperMinute) {
        retrySecs = Math.round(resFastByIP.msBeforeNext / 1000) || 1;
    }

    console.log('retrySecs', retrySecs)
    if (retrySecs > 1) {
        res.set('Retry-After', String(retrySecs));
        res.status(200).send({ success: false, message: "multiple attempts to login Retry-After : " + parseInt(retrySecs / 60) + " minutes" });
    } else {
        //sequelize.transaction(function (t) {       
        var Encryptpassword = bcrypt.hashSync(req.body.password, 8)//commonfunction.encryption(req.body.password);      
        User.findOne({
            where: {
                $or: [{
                    email: req.body.email
                }, {
                    name: req.body.email,
                }],
            }
        }).then(function (response) {
            if (response == null) {
                try {
                    Promise.all([
                        limiterFastBruteByIP.consume(ipAddr)
                    ]);
                    res.status(200).send({ success: false, message: 'email or name is wrong' });
                } catch (rlRejected) {
                    if (rlRejected instanceof Error) {
                        throw rlRejected;
                    } else {
                        res.set('Retry-After', parseInt(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
                        res.status(200).send({ success: false, message: "multiple attempts to login Retry-After : " + String(Math.round(rlRejected.msBeforeNext / 1000)) || 1 + " minutes" });
                    }
                }
            }
            else {
                if (response.isaccountverify == true) {
                    var passwordIsValid = bcrypt.compareSync(req.body.password, response.password)//commonfunction.encryptioncompareSync(req.body.password, response.password)                             
                    if (passwordIsValid) {
                        var user = {
                            id: response.id,
                            name: response.name,
                            email: response.email,
                            password: Encryptpassword,
                        }
                        var token = tokenhandler.sign(user, config.AuthorizationexpiresIn)

                        CheckInviteUser(req.body.email, response.id).then(function () {
                            var refreshToken = tokenhandler.sign(user, config.refreshTokenexpiresIn)
                            response.updateAttributes({ refreshToken: refreshToken }).then(function () {
                                res.status(200).send({
                                    success: true,
                                    token: token,
                                    refreshToken: refreshToken,
                                    data: response,
                                    message: "Login Successfully..."
                                })
                            })
                        })

                    } else {
                        try {
                            Promise.all([
                                limiterFastBruteByIP.consume(ipAddr)
                            ]);
                            res.status(200).send({ success: false, message: 'password is wrong' });
                        } catch (rlRejected) {
                            if (rlRejected instanceof Error) {
                                throw rlRejected;
                            } else {
                                res.set('Retry-After', parseInt(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
                                res.status(200).send({ success: false, message: "multiple attempts to login Retry-After : " + String(Math.round(rlRejected.msBeforeNext / 1000)) || 1 + " minutes" });
                            }
                        }
                    }
                }
                else {
                    res.status(200).send({ success: false, message: 'email is not verify' });
                }
            }
        });
    }
    // }).then(function (response) {
    //     return response;
    // }).catch(function (err) {
    //     return {
    //         success: false,
    //         message: err.message,
    //     };
    // });
}


function CheckInviteUser(email, UserId) {
    return new Promise(function (resolve, reject) {
        Invite.findAll({
            where: {
                email: email,
                isaccept: 0
            }
        }).then(function (result) {
            if (result.length) {
                function UpdateOneByOne(k) {
                    return new Promise(function (resolve1, reject1) {
                        if (k < result.length) {
                            return result[k].updateAttributes({
                                isaccept: true,
                            }).then(function () {
                                return Share.findOne({
                                    where: {
                                        idinvited: result[k].id
                                    }
                                }).then(function (resShare) {
                                    return resShare.updateAttributes({
                                        idtouser: UserId
                                    }).then(function (updatedCount) {
                                        UpdateOneByOne(k + 1).then(function () {
                                            resolve1(true);
                                        });
                                    })
                                })
                            })
                        } else {
                            resolve1(true);
                        }
                    })
                }
                return UpdateOneByOne(0).then(function (resreturnMargin) {
                    resolve(true);
                });
            }
            else {
                resolve(true);
            }
        })

    }).then(function (resUpdate) {
        return resUpdate;
    }).catch(function (err) {
        //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
        return true;
    });
}

function userTransaction() {

    this.signup = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(function (chkUserExist) {
                if (chkUserExist != null) {
                    reject({ success: false, message: "email is already exist...", statuscode: 409 })
                } else {
                    var hashedPassword = bcrypt.hashSync(req.body.password, 8)//commonfunction.encryption(req.body.password)                
                    var objUserReg = req.body
                    objUserReg.password = hashedPassword
                    objUserReg.createddate = new Date()
                    User.create(objUserReg).then(function (UserReg) {
                        if (UserReg != null) {
                            var token = tokenhandler.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email }, config.SignupexpiresIn)
                            var EmailLink = process.env.APIURl + "api/auth/verify?token=" + token
                            var body = '<h1><b>Thank You</b></h1><br>' +
                                'Thanks for registering. Please follow the link below to complete your registration.<br>' + EmailLink;
                            var obj = {
                                email: UserReg.email,
                                subject: "Thanks for Registering",
                                body: body,
                            }
                            return emailhandler.sendemail(obj).then(function (response) {
                                if (response.success) {
                                    resolve({
                                        success: true,
                                        message: 'Your account have been successfully created. In order to activate it, please check your mailbox for more details.',
                                        token: token
                                    });
                                }
                                else {
                                    reject({
                                        success: false,
                                        message: response.err,
                                        token: null,
                                        statuscode: 535
                                    });
                                }
                            })
                        } else {
                            reject({ success: false, message: "Registration failed", statuscode: 535 })
                        }
                    })
                }
            })
        }).then(function (response) {
            return response;
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
                statuscode: err.statuscode
            };
        });
    }

    this.resend = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(function (UserReg) {
                if (UserReg == null) {
                    reject({ success: false, message: "email is not registered...", statuscode: 200 })
                } else {
                    var token = tokenhandler.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email }, config.SignupexpiresIn)
                    var EmailLink = process.env.APIURl + "api/auth/verify?token=" + token
                    var body = '<h1><b>Thank You</b></h1><br>' +
                        'Thanks for registering. Please follow the link below to complete your registration.<br>' + EmailLink;
                    var obj = {
                        email: UserReg.email,
                        subject: "Thanks for Registering",
                        body: body,
                    }
                    return emailhandler.sendemail(obj).then(function (response) {
                        if (response.success) {
                            resolve({
                                success: true,
                                message: 'Your account have been successfully created. In order to activate it, please check your mailbox for more details.',
                                token: token
                            });
                        }
                        else {
                            reject({
                                success: false,
                                message: response.err,
                                token: null,
                                statuscode: 535
                            });
                        }
                    })
                }
            })
        }).then(function (response) {
            return response;
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
                statuscode: err.statuscode
            };
        });
    }

    this.verify = async function (req, res, decoded) {
        decoded = JSON.parse(decoded)
        return new Promise(function (resolve, reject) {
            return User.findOne({
                where:
                {
                    email: decoded.email,
                    isaccountverify: false
                }
            }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    checkUserExist.updateAttributes({ isaccountverify: true, modifieddate: new Date() })
                        .then(function (response) {
                            resolve({ success: true, Location: "http://localhost:4200/login" })
                        })
                } else {
                    resolve({ success: false, message: "Your verification is already done !" });
                }
            })
        }).then(function (response) {
            return response;
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
            };
        });
    }

    this.login = async function (req, res) {
        await loginRoute(req, res);
    }

    this.forgotpassword = async function (req, res) {
        return new Promise(function (resolve, reject) {
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
                    resolve({
                        success: false,
                        message: 'Please check email for reset password instructions',
                    });
                } else {

                    var token = tokenhandler.forgotpasswordsign({ email: req.query.email }, config.VerifyexpiresIn)

                    var EmailLink = process.env.Website_URL + "/resetpassword?token=" + token
                    var body = '<h1><b>Reset Password</b></h1><br>' +
                        'Please follow the link below to Reset your Password.<br>' + EmailLink + '<br>Please above link use in 10 minutes';
                    var obj = {
                        email: response.email,
                        subject: "Reset Password",
                        body: body,
                    }

                    return emailhandler.sendemail(obj).then(function (responsemail) {
                        if (responsemail.success) {
                            resolve({
                                success: true,
                                message: 'email is sent on your register mail address.',
                                token: token
                            });
                        }
                        else {
                            reject({
                                success: false,
                                message: responsemail.err,
                                token: null,
                                statuscode: 535
                            });
                        }
                    })
                }
            });
        }).then(function (response) {
            return (response);
        }).catch(function (err) {
            // The catch here for other errors
            // console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            return {
                success: false,
                message: err.message,
            };
        });
    }

    this.resetverification = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { email: req.query.email, isaccountverify: true } }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    checkUserExist.updateAttributes({ isaccountverify: false, modifieddate: new Date() }).then(function (response) {
                        // res.writeHead(301,
                        //     { Location: "http://localhost:3000" }
                        // );
                        // res.end()
                        resolve({ success: true, Location: "http://localhost:3000" })
                    })
                } else {
                    resolve({ success: false, message: "Invalid token " });
                }
            })
        }).then(function (response) {
            return (response);
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
            };
        });

    }

    this.request = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { email: req.body.email, isaccountverify: true } }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        }).then(function (response) {
            if (response) {
                return { success: true };
            } else {
                return { success: false, message: "Invalid token" };
            }
        }).catch(function (err) {
            res.json({
                success: false,
                message: err.message,
            });
        });
    }

    this.confirm = async function (req, res, decoded) {
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { email: req.query.email, isaccountverify: true } }).then(function (checkUserExist) {
                if (checkUserExist != null) {
                    let hashedPassword = bcrypt.hashSync(req.body.password, 8)//commonfunction.encryption(req.body.password)
                    return checkUserExist.updateAttributes({ password: hashedPassword, modifieddate: new Date() }).then(function (Updateresponse) {
                        resolve(true)
                    })
                } else {
                    resolve(false)
                }
            })
        }).then(function (response) {
            if (response) {
                return { success: true, message: "Your password is successfully reset." };
            } else {
                return { success: false, message: "Invalid token " };
            }
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
            };
        });
    }

    this.checkuser = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { email: req.query.email, isaccountverify: true } }).then(function (UserExist) {
                if (UserExist != null) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })
        }).then(function (response) {
            if (response) {
                return { success: true };
            } else {
                return { success: false, message: "Invalid token" };
            }
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
            };
        });
    }

    this.checkrefreshToken = async function (req, res) {
        console.log("checkrefreshToken", req.query.token)
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { refreshToken: req.query.token, isaccountverify: true } }).then(function (UserExist) {
                if (UserExist != null) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })
        }).then(function (response) {
            if (response) {
                return { success: true };
            } else {
                return { success: false, message: "Invalid token" };
            }
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
            };
        });
    }


    this.share = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { email: req.body.email } }).then(function (UserExist) {
                if (UserExist != null) {
                    if (req.query.iduser == UserExist.id) {
                        reject({ success: false, message: "Media doesn't share with you.." })
                    }
                    else {
                        var objShare = new Object();
                        objShare.iduser = req.query.iduser;
                        objShare.idmedia = req.query.idmedia;
                        objShare.idtouser = UserExist.id;
                        objShare.createdate = new Date();
                        objShare.createdby = req.query.email;
                        objShare.title = req.body.title;
                        objShare.description = req.body.description;

                        Share.findOrCreate({
                            where:
                            {
                                iduser: req.query.iduser,
                                idtouser: UserExist.id,
                                idmedia: req.query.idmedia,
                            },
                            defaults: objShare
                        }).then(function (ShareResponse) {
                            var obj = {
                                email: req.query.email,
                                message: req.query.email + 'shared photo with you'
                            }
                            io.sockets.emit(req.body.email + '-notifications', obj);
                            resolve({ success: true, message: "File Share successfully" })
                        })
                    }
                }
                else {
                    var objInvite = new Object();
                    objInvite.iduser = req.query.iduser;
                    objInvite.email = req.body.email;
                    Invite.findOrCreate({
                        where:
                        {
                            iduser: req.query.iduser,
                            email: req.body.email,
                            isaccept: 0

                        },
                        defaults: objInvite
                    }).then(function (InviteResponse) {
                        //var token = tokenhandler.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email, password: hashedPassword }, config.SignupexpiresIn)
                        var EmailLink = "http://localhost:3000"

                        var body = '<b>Hi,</b><br>' +
                            'Your are Invited from ' + req.query.email + '<br>' +
                            'Please follow the link below to registration.<br>' + EmailLink;


                        var obj = {
                            email: req.body.email,
                            subject: "Invitation Mail",
                            body: body,
                        }
                        return emailhandler.sendemail(obj).then(function (responsemail) {

                            if (responsemail.success) {
                                var objShare = new Object();
                                objShare.iduser = req.query.iduser;
                                objShare.idmedia = req.query.idmedia;
                                objShare.createdate = new Date();
                                objShare.createdby = req.query.email;
                                objShare.idinvited = InviteResponse[0].id
                                objShare.title = req.body.title;
                                objShare.description = req.body.description;

                                Share.findOrCreate({
                                    where:
                                    {
                                        iduser: req.query.iduser,
                                        idmedia: req.query.idmedia,
                                        idinvited: InviteResponse[0].id
                                    },
                                    defaults: objShare
                                }).then(function (ShareResponse) {
                                    resolve({ success: true, message: "File Share successfully" })
                                })
                            }
                            else {
                                reject({
                                    success: false,
                                    message: responsemail.err,
                                    token: null,
                                    statuscode: 535
                                });
                            }
                        })
                    })
                }
            })
        }).then(function (response) {
            return response
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
            };
        });
    }

    this.checkuserexist = async function (req, res) {
        return new Promise(function (resolve, reject) {
            return User.findOne({ where: { email: req.body.email } }).then(function (UserExist) {
                if (UserExist != null) {
                    resolve({ success: true, data: null })
                }
                else {
                    resolve({ success: false, data: UserExist })
                }
            })
        }).then(function (response) {
            return response
        }).catch(function (err) {
            return {
                success: false,
                message: err.message,
                data: null
            };
        });
    }

}



module.exports = new userTransaction();  