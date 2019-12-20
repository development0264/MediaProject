
var Mediaservices = require('../services/mediaservices');
var Commonfunction = require('./common.js');
var formidable = require('formidable');
var fs = require('fs');


function imagevideohandler() {

    this.imageupload = async function (req, res) {
        return new Promise(function (resolve, reject) {
            var form = new formidable.IncomingForm();
            var dir = "./" + process.env.MediaFolderName;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            form.uploadDir = __dirname + "/../" + process.env.MediaFolderName;
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

            var dir = "./" + process.env.MediaFolderName;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            form.uploadDir = __dirname + "/../" + process.env.MediaFolderName;

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
                    var dir = "./" + process.env.MediaFolderName;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    form.uploadDir = __dirname + "/../" + process.env.MediaFolderName;

                    var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                    var NewName = Commonfunction.GetUserNameFromDate();
                    if (ext.indexOf('?') > -1) {
                        ext = ext.substring(0, ext.indexOf('?'));
                    };
                    file.path = form.uploadDir + "/" + NewName + ext;
                    FileName.push({ "Type": "Image", "Name": NewName + ext });
                    //console.log(fs.createReadStream(file.path))
                }
                if (name == "Video") {
                    var dir = "./" + process.env.MediaFolderName;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    form.uploadDir = __dirname + "/../" + process.env.MediaFolderName;

                    var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                    var NewName = Commonfunction.GetUserNameFromDate();
                    if (ext.indexOf('?') > -1) {
                        ext = ext.substring(0, ext.indexOf('?'));
                    };
                    file.path = form.uploadDir + "/" + NewName + ext;
                    FileName.push({ "Type": "Video", "Name": NewName + ext });
                    //console.log(fs.createReadStream(dir + "/" + NewName + ext))

                }
                //fs.createReadStream(file.path)

            });
            form.on('end', function () {
                function uploader(i) {
                    if (i < FileName.length) {
                        if (FileName[i].Type == "Image") {
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