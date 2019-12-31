
'use strict';

var app = require('../server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;


describe('API Tests', function () {

    var signup = {
        "name": process.env.unit_test_name,
        "email": process.env.unit_test_email,
        "password": process.env.unit_test_password,
        "confirmpassword": process.env.unit_test_confirmpassword
    };

    console.log(signup)

    var token;
    var Authorizationtoken;

    describe('## signup ', function () {
        it('should do signup', function (done) {
            request(app)
                .post('/api/auth/signup')
                .send(signup)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('token');
                    token = res.body.token;
                    done();
                });
        });
    });

    describe('## verify ', function () {
        it('should do verify after Signup', function (done) {
            request(app)
                .get('/api/auth/verify?token=' + token)
                .expect(301)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    var login = {
        "email": process.env.unit_test_email,
        "password": process.env.unit_test_password,
    }

    describe('## login ', function () {
        it('should do login after Signup', function (done) {
            request(app)
                .post('/api/auth/login')
                .expect(200)
                .send(login)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('token');
                    if (err) {
                        return done(err);
                    } else {
                        Authorizationtoken = res.body.token
                    }
                    done();
                });
        });
    });

});