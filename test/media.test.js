var app = require('../server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Media API Tests', function () {

    describe('## Upload photo ', () => {

        const Auth_testImage1 = __dirname + "/../TestImage/202017184717423.jpg";
        const Auth_testImage2 = __dirname + "/../TestImage/202017184717424.jpg";
        const Auth_testImage3 = __dirname + "/../TestImage/202017184717425.jpg";
        const Auth_testImage4 = __dirname + "/../TestImage/202017184717426.jpg";
        const Auth_testImage5 = __dirname + "/../TestImage/202017184717427.jpg";
        const Auth_testImage6 = __dirname + "/../TestImage/202017184717428.jpg";

        it('should return 401 if Authorizationtoken not sent', function (done) {
            request(app)
                .post('/api/media/photo')
                //.set('Authorization', null)
                .attach("files", Auth_testImage1)
                .attach("files", Auth_testImage2)
                .attach("files", Auth_testImage3)
                .attach("files", Auth_testImage4)
                .attach("files", Auth_testImage5)
                .attach("files", Auth_testImage6)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(401);
                    done();
                })

        });

        const testImage1 = __dirname + "/../TestImage/202017184717423.jpg";
        const testImage2 = __dirname + "/../TestImage/202017184717424.jpg";
        const testImage3 = __dirname + "/../TestImage/202017184717425.jpg";
        const testImage4 = __dirname + "/../TestImage/202017184717426.jpg";
        const testImage5 = __dirname + "/../TestImage/202017184717427.jpg";
        const testImage6 = __dirname + "/../TestImage/202017184717428.jpg";

        it('should return 500 if upload photo more than five', function (done) {
            console.log(global.Authorizationtoken)
            request(app)
                .post('/api/media/photo')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", testImage1)
                .attach("files", testImage2)
                .attach("files", testImage3)
                .attach("files", testImage4)
                .attach("files", testImage5)
                .attach("files", testImage6)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(500);
                    done();
                })

        });

        const Image_1 = __dirname + "/../TestImage/202017184717423.jpg";
        const Image_2 = __dirname + "/../TestImage/202017184717424.jpg";
        const Image_3 = __dirname + "/../TestImage/202017184717425.jpg";
        const Image_4 = __dirname + "/../TestImage/202017184717426.jpg";
        const Otherfile_5 = __dirname + "/../TestImage/README-Windows.txt";

        it('should return 500 if upload files are not Images', function (done) {
            request(app)
                .post('/api/media/photo')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", Image_1)
                .attach("files", Image_2)
                .attach("files", Image_3)
                .attach("files", Image_4)
                .attach("files", Otherfile_5)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(500);
                    done();
                })

        });

        it('should return 401 if file(s) not selected', function (done) {
            request(app)
                .post('/api/media/photo')
                .set('Authorization', global.Authorizationtoken)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    done();
                })
        });

        const Image_Upload_1 = __dirname + "/../TestImage/202017184717423.jpg";
        const Image_Upload_2 = __dirname + "/../TestImage/202017184717424.jpg";
        const Image_Upload_3 = __dirname + "/../TestImage/202017184717425.jpg";
        const Image_Upload_4 = __dirname + "/../TestImage/202017184717426.jpg";
        const Image_Upload_5 = __dirname + "/../TestImage/202017184717427.jpg";
        it('should return 200 if Image uploaded successfully', function (done) {
            request(app)
                .post('/api/media/photo')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", Image_Upload_1)
                .attach("files", Image_Upload_2)
                .attach("files", Image_Upload_3)
                .attach("files", Image_Upload_4)
                .attach("files", Image_Upload_5)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
        });
    });

    describe('## Upload video ', () => {


        const Auth_testvideo1 = __dirname + "/../TestImage/202017184717307.mp4";
        const Auth_testvideo2 = __dirname + "/../TestImage/202017184717308.mp4";
        const Auth_testvideo3 = __dirname + "/../TestImage/202017184717309.mp4";
        const Auth_testvideo4 = __dirname + "/../TestImage/202017184717310.mp4";
        const Auth_testvideo5 = __dirname + "/../TestImage/202017184717311.mp4";
        const Auth_testvideo6 = __dirname + "/../TestImage/202017184717311.mp4";

        it('should return 401 if Authorizationtoken not sent', function (done) {
            request(app)
                .post('/api/media/video')
                //.set('Authorization', null)
                .attach("files", Auth_testvideo1)
                .attach("files", Auth_testvideo2)
                .attach("files", Auth_testvideo3)
                .attach("files", Auth_testvideo4)
                .attach("files", Auth_testvideo5)
                .attach("files", Auth_testvideo6)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(401);
                    done();
                })

        });

        const testvideo1 = __dirname + "/../TestImage/202017184717307.mp4";
        const testvideo2 = __dirname + "/../TestImage/202017184717308.mp4";
        const testvideo3 = __dirname + "/../TestImage/202017184717309.mp4";
        const testvideo4 = __dirname + "/../TestImage/202017184717310.mp4";
        const testvideo5 = __dirname + "/../TestImage/202017184717311.mp4";
        const testvideo6 = __dirname + "/../TestImage/202017184717312.mp4";

        it('should return 500 if upload video more than five', function (done) {
            request(app)
                .post('/api/media/video')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", testvideo1)
                .attach("files", testvideo2)
                .attach("files", testvideo3)
                .attach("files", testvideo4)
                .attach("files", testvideo5)
                .attach("files", testvideo6)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(500);
                    done();
                })

        });

        const Video_1 = __dirname + "/../TestImage/202017184717307.mp4";
        const Video_2 = __dirname + "/../TestImage/202017184717308.mp4";
        const Video_3 = __dirname + "/../TestImage/202017184717309.mp4";
        const Video_4 = __dirname + "/../TestImage/202017184717310.mp4";
        const OtherfileVideo_5 = __dirname + "/../TestImage/README-Windows.txt";

        it('should return 500 if upload files are not Video', function (done) {
            request(app)
                .post('/api/media/video')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", Video_1)
                .attach("files", Video_2)
                .attach("files", Video_3)
                .attach("files", Video_4)
                .attach("files", OtherfileVideo_5)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(500);
                    done();
                })

        });

        it('should return 401 if file(s) not selected', function (done) {
            request(app)
                .post('/api/media/video')
                .set('Authorization', global.Authorizationtoken)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    done();
                })
        });

        const Video_Upload_1 = __dirname + "/../TestImage/202017184717307.mp4";
        const Video_Upload_2 = __dirname + "/../TestImage/202017184717308.mp4";
        const Video_Upload_3 = __dirname + "/../TestImage/202017184717309.mp4";
        const Video_Upload_4 = __dirname + "/../TestImage/202017184717310.mp4";
        //const Video_Upload_5 = __dirname + "/../TestImage/202017184717311.mp4";
        it('should return 200 if Video uploaded successfully', function (done) {
            request(app)
                .post('/api/media/video')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", Video_Upload_1)
                .attach("files", Video_Upload_2)
                .attach("files", Video_Upload_3)
                .attach("files", Video_Upload_4)
                //.attach("files", Video_Upload_5)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
        });
    });


    describe('## Upload photo&video ', () => {

        const Auth_testvideo1 = __dirname + "/../TestImage/202017184717307.mp4";
        const Auth_testImage2 = __dirname + "/../TestImage/202017184717423.jpg";

        it('should return 401 if Authorizationtoken not sent', function (done) {
            request(app)
                .post('/api/media/photoandvideo')
                //.set('Authorization', null)
                .attach("files", Auth_testvideo1)
                .attach("files", Auth_testImage2)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(401);
                    done();
                })

        });

        const testvideo1 = __dirname + "/../TestImage/202017184717307.mp4";
        const testImage1 = __dirname + "/../TestImage/202017184717423.jpg";
        const testImage2 = __dirname + "/../TestImage/202017184717428.jpg";

        it('should return 500 if upload video or Image more than One', function (done) {
            request(app)
                .post('/api/media/photoandvideo')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", testvideo1)
                .attach("files", testImage1)
                .attach("files", testImage2)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(500);
                    done();
                })

        });

        const Video_1 = __dirname + "/../TestImage/202017184717307.mp4";
        const OtherfileVideo_5 = __dirname + "/../TestImage/README-Windows.txt";

        it('should return 500 if upload files are not Video or Image', function (done) {
            request(app)
                .post('/api/media/photoandvideo')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", Video_1)
                .attach("files", OtherfileVideo_5)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(500);
                    done();
                })

        });

        it('should return 401 if file(s) not selected', function (done) {
            request(app)
                .post('/api/media/photoandvideo')
                .set('Authorization', global.Authorizationtoken)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    console.log(res.statusCode)
                    expect(res.statusCode).to.equal(401);
                    done();
                })
        });

        const Video_Upload_1 = __dirname + "/../TestImage/202017184717307.mp4";
        const Video_Upload_2 = __dirname + "/../TestImage/202017184717423.jpg";

        it('should return 200 if Video&Image  uploaded successfully', function (done) {
            request(app)
                .post('/api/media/photoandvideo')
                .set('Authorization', global.Authorizationtoken)
                .attach("files", Video_Upload_1)
                .attach("files", Video_Upload_2)
                //.attach("files", Video_Upload_5)
                //send({ "email": process.env.unit_test_email, "password": process.env.unit_test_password, "confirmpassword": process.env.unit_test_confirmpassword })
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
        });
    });
});