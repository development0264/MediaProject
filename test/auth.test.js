
'use strict';

var app = require('../server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;


describe('API Tests', function () {

    var signup = {
        "name": "enter_name",
        "email": "enter_email",
        "password": "enter_password",
        "confirmpassword": "enter_confirm_password"
    };

    var token;

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

});