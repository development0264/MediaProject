
'use strict';

var app = require('../server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe('Auth API Tests', function () {

    var signup = {
        "name": process.env.unit_test_name,
        "email": process.env.unit_test_email,
        "password": process.env.unit_test_password,
        "confirmpassword": process.env.unit_test_confirmpassword
    };

    console.log("signup", signup)

    var token;
<<<<<<< HEAD
=======
    var RequestToken;
>>>>>>> 5114a838d2b297fd096a3c68a9a79da5078f84d6

    describe('## signup ', () => {
        it('should return 409 if name is not provided', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                })
        });

        it('should return 400 if name is shorter than minimum length', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": "a", "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if name is longer than maximum length', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": Array(257).join('a'), "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email not provided', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is shorted than minimum length', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": "a@a.", "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is longer than maximum length', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": Array(50).join('a') + "@a.com", "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password not provided', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": process.env.unit_test_email, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password is shorter than minimum length', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": process.env.unit_test_email, "password": "1234567", "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password is longer than maximum length', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": process.env.unit_test_email, "password": Array(257).join('a'), "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password invalid criteria', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": process.env.unit_test_email, "password": "12345678", "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if confirmpassword not provided', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": process.env.unit_test_email, "password": process.env.unit_test_password })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if confirmpassword did not match password', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "name": process.env.unit_test_name, "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": '87654321' })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

<<<<<<< HEAD
=======


        it('should return 200 after adding new user and 409 after re adding same user', function (done) {
>>>>>>> 5114a838d2b297fd096a3c68a9a79da5078f84d6


        it('should return 200 after adding new user and 409 after re adding same user', function (done) {

            console.log("fghdfgkjhdfkjgbdfkjbghkjdfgkjdfbgkj", signup)
            request(app)
                .post('/api/auth/checkuserexist')
                .send(signup)
                .end(function (err, res) {
                    expect(res.body.data).to.equal(null);
                });


            request(app)
                .post('/api/auth/signup')
                .send(signup)
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('token');
                    token = res.body.token;

                    request(app)
                        .post('/api/auth/signup')
                        .send(signup)
                        .end(function (err, res) {
                            expect(res.statusCode).to.equal(409);
                            done();
                        });
                });

        })
    });

    describe('## verify ', function () {

        var InvalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZbmFtZSI6IkpheV90YW1ha3V3YWxhMiIsImVtYWlsIjoiSmF5c3RhbWFrdXdhbGEzQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JFU1ajlDQkdsRGlrdS5HbnIyR0JDVC5xS3BSQkdMeloxUlpKMGJqTzFLV3MzS3NYMjBBbGxpIiwiaWF0IjoxNTc3OTc0MjA5LCJleHAiOjE1Nzg4MzgyMDl9.hR97qDmaGxrrR9sFapEZ0SycA6d5blkRNxm2wyL_CTE"

        it('should return 409 if Invalid token', function (done) {
            request(app)
                .get('/api/auth/verify?token=' + InvalidToken)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(409);
                    done();
                });
        });

        it('should return 301 if user account verify', function (done) {
            request(app)
                .get('/api/auth/verify?token=' + token)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(301);
                    done();
                });
        });

        it('should return 422 if User verification is already done', function (done) {
            request(app)
                .get('/api/auth/verify?token=' + token)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(422);
                    done();
                });
        });

    });

    describe('## login ', function () {
        it('should return 400 if email not provided', function (done) {
            request(app)
                .post('/api/auth/login')
                .send({ "password": process.env.unit_test_password })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is shorted than minimum length', function (done) {
            request(app)
                .post('/api/auth/login')
                .send({ "email": "a@a.", "password": process.env.unit_test_password })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is longer than maximum length', function (done) {
            request(app)
                .post('/api/auth/login')
                .send({ "email": Array(50).join('a') + "@a.com", "password": process.env.unit_test_password })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password not provided', function (done) {
            request(app)
                .post('/api/auth/login')
                .send({ "email": process.env.unit_test_email })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password is shorter than minimum length', function (done) {
            request(app)
                .post('/api/auth/login')
                .send({ "email": process.env.unit_test_email, "password": "1234567" })
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password invalid criteria', function (done) {
            request(app)
                .post('/api/auth/login')
                .send({ "email": process.env.unit_test_email, "password": "12345678" })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        var loginInvalid = {
            "email": process.env.unit_test_wrong_email,
            "password": process.env.unit_test_password,
        }

        it('should return 422 if email or password is invalid', function (done) {
            request(app)
                .post('/api/auth/login')
                .send(loginInvalid)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(422);
                    done();
                });
        });

<<<<<<< HEAD
        var Authorizationtoken = null;
=======
        global.Authorizationtoken = null;
>>>>>>> 5114a838d2b297fd096a3c68a9a79da5078f84d6
        var login = {
            "email": process.env.unit_test_email,
            "password": process.env.unit_test_password,
        }


        it('should return 200 if login success', function (done) {
            request(app)
                .post('/api/auth/login')
                .expect(200)
                .send(login)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    if (err) {
                        return done(err);
                    } else {
                        expect(res.body).to.have.property('token');
                        Authorizationtoken = res.body.token
                    }
                    done();
                });
        });
    });

    describe('## forgotpassword ', function () {
        it('should return 400 if email not provided', function (done) {
            request(app)
                .get('/api/auth/forgotpassword')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is wrong format', function (done) {
            request(app)
                .get('/api/auth/forgotpassword?email=a@a.')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is shorted than minimum length', function (done) {
            request(app)
                .get('/api/auth/forgotpassword?email=a@a.c')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if email is longer than maximum length', function (done) {
            request(app)
                .get("/api/auth/forgotpassword?email=" + Array(50).join('a') + "@a.com" + "")
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });


        it('should return 200 if forgotpassword success', function (done) {
            request(app)
                .get("/api/auth/forgotpassword?email=" + process.env.unit_test_email + "")
                .end(function (err, res) {
                    expect(res.body).to.have.property('token');
                    RequestToken = res.body.token;
                    done();
                });
        });
    })

    describe('## request ', function () {
        var Invalidsignature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpheXN0YW1ha3V3YWxhM0BnbWFpbC5jb20iLCJpYXQiOjE1Nzg1NjQ2OTgsImV4cCI6MTU3ODU2NTI5OH0.oC-oddCiQ1P55QxAbO99_LLwB51gXqri5bPwL2GPwL5"

        it('should return 417 if Invalid signature', function (done) {
            request(app)
                .post('/api/auth/request')
                .send({ "token": Invalidsignature })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(417);
                    done();
                });
        });

        var expairedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpheXN0YW1ha3V3YWxhMUBnbWFpbC5jb20iLCJpYXQiOjE1Nzg1NzAwODcsImV4cCI6MTU3ODU3MDY4N30.jZMXh78zv7SIR6SDZW1CttkHCclJiCxn9l59QhP1V24"

        it('should return 417 if Expaired Token', function (done) {
            request(app)
                .post('/api/auth/request')
                .send({ "token": expairedToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(417);
                    done();
                });
        });

        it('should return 200 if valid token', function (done) {
            request(app)
                .post('/api/auth/request')
                .send({ "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });

    })

    describe('## confirm ', function () {

        var Invalidsignature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpheXN0YW1ha3V3YWxhM0BnbWFpbC5jb20iLCJpYXQiOjE1Nzg1NjQ2OTgsImV4cCI6MTU3ODU2NTI5OH0.oC-oddCiQ1P55QxAbO99_LLwB51gXqri5bPwL2GPwL5"
        var expairedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpheXN0YW1ha3V3YWxhMUBnbWFpbC5jb20iLCJpYXQiOjE1Nzg1NzAwODcsImV4cCI6MTU3ODU3MDY4N30.jZMXh78zv7SIR6SDZW1CttkHCclJiCxn9l59QhP1V24"

        it('should return 400 if token not provided', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": process.env.unit_test_reset_password, "confirmpassword": process.env.unit_test_reset_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password not provided', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "confirmpassword": process.env.unit_test_reset_password, "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password is shorter than minimum length', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": "1234567", "confirmpassword": process.env.unit_test_reset_confirmpassword, "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password is longer than maximum length', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": Array(257).join('a'), "confirmpassword": process.env.unit_test_reset_confirmpassword, "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if password invalid criteria', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": "12345678", "confirmpassword": process.env.unit_test_reset_confirmpassword, "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if confirmpassword not provided', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": process.env.unit_test_reset_password, "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 400 if confirmpassword did not match password', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send({ "password": process.env.unit_test_reset_password, "confirmpassword": '87654321', "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('should return 417 if Invalid signature', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": process.env.unit_test_reset_password, "confirmpassword": process.env.unit_test_reset_confirmpassword, "token": Invalidsignature })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(417);
                    done();
                });
        });


        it('should return 417 if Expaired Token', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": process.env.unit_test_reset_password, "confirmpassword": process.env.unit_test_reset_confirmpassword, "token": expairedToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(417);
                    done();
                });
        });

        it('should return 200 if Password Reset Successfully', function (done) {
            request(app)
                .post('/api/auth/confirm')
                .send({ "password": process.env.unit_test_reset_password, "confirmpassword": process.env.unit_test_reset_confirmpassword, "token": RequestToken })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });

    })

    after(function () {
        importTest("Media API Tests", './media.test.js');
    });
});