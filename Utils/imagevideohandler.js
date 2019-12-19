
var Mediaservices = require('../services/mediaservices');
var Commonfunction = require('./common.js');
var formidable = require('formidable');


function imagevideohandler() {

    this.imageupload = async function (req, res) {
        return new Promise(function (resolve, reject) {
            var form = new formidable.IncomingForm();
            form.uploadDir = __dirname + '/../MediaUploads/Images';
            var Image = {};

            form.parse(req, function (err, fields, files) {
            });
            form.on('fileBegin', function (name, file) {
                var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                var NewName = Commonfunction.GetUserNameFromDate();
                if (ext.indexOf('?') > -1) {
                    ext = ext.substring(0, ext.indexOf('?'));
                };
                file.path = form.uploadDir + "/" + NewName + ext;
                Image["FileName"] = NewName + ext;
                Image["ImageList"] = name;
                Image["decoded"] = req.decoded;

            });
            form.on('end', function () {
                if (Image["FileName"] != "") {
                    Mediaservices.saveImage(Image["decoded"], Image["FileName"]).then(function (upload) {
                        resolve(upload)
                    })
                }
                else {
                    return reject({ success: false, message: "Please Select atleast One File..." });
                }
            });

        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            return err;
        });
    }

    this.videoupload = async function (req, res) {
        return new Promise(function (resolve, reject) {
            var form = new formidable.IncomingForm();
            form.uploadDir = __dirname + '/../MediaUploads/Video';
            var Video = {};
            form.parse(req, function (err, fields, files) {
            });
            form.on('fileBegin', function (name, file) {
                var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                var NewName = Commonfunction.GetUserNameFromDate();
                if (ext.indexOf('?') > -1) {
                    ext = ext.substring(0, ext.indexOf('?'));
                };
                file.path = form.uploadDir + "/" + NewName + ext;
                Video["FileName"] = NewName + ext;
                Video["decoded"] = req.decoded;

            });
            form.on('end', function () {
                if (Video["FileName"] != "") {
                    Mediaservices.savevideo(Video["decoded"], Video["FileName"]).then(function (upload) {
                        resolve(upload);
                    })
                }
                else {
                    return reject({ success: false, message: "Please Select atleast One File..." });
                }
            });
        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            return err;
        });
    }

    this.imagevideoupload = async function (req, res) {
        return new Promise(function (resolve, reject) {
            var form = new formidable.IncomingForm();
            var FileName = [];
            form.parse(req, function (err, fields, files) {
            });
            form.on('fileBegin', function (name, file) {
                if (name == "Image") {
                    form.uploadDir = __dirname + '/../MediaUploads/Images';
                    var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                    var NewName = Commonfunction.GetUserNameFromDate();
                    if (ext.indexOf('?') > -1) {
                        ext = ext.substring(0, ext.indexOf('?'));
                    };
                    file.path = form.uploadDir + "/" + NewName + ext;
                    FileName.push({ "Type": "Image", "Name": NewName + ext });
                }
                if (name == "Video") {
                    form.uploadDir = __dirname + '/../MediaUploads/Video';
                    var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                    var NewName = Commonfunction.GetUserNameFromDate();
                    if (ext.indexOf('?') > -1) {
                        ext = ext.substring(0, ext.indexOf('?'));
                    };
                    file.path = form.uploadDir + "/" + NewName + ext;
                    FileName.push({ "Type": "Video", "Name": NewName + ext });

                }

            });
            form.on('end', function () {
                function uploader(i) {
                    if (i < FileName.length) {
                        if (FileName[i].Type == "Image") {
                            console.log(req.decoded)
                            Mediaservices.saveImage(req.decoded, FileName[i].Name).then(function (upload) {
                                uploader(i + 1);
                            })
                        }
                        else if (FileName[i].Type == "Video") {
                            Mediaservices.savevideo(req.decoded, FileName[i].Name).then(function (upload) {
                                uploader(i + 1);
                            })
                        }
                    } else {
                        resolve({ success: true, message: "Image and Video Uploaded Successfully..." })
                    }
                }
                uploader(0);
                if (FileName.length == 0) {
                    resolve({ success: false, message: "Please Select atleast One File..." });
                }
            });
        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            return err;
        });
    }
}
module.exports = new imagevideohandler(); 