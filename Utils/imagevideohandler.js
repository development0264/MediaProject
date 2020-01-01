
var Media = require('../data_accesss/media');
var Commonfunction = require('./common.js');
var formidable = require('formidable');
var fs = require('fs');


function imagevideohandler() {


    this.imagevideoupload = async function (req, res) {
        return new Promise(function (resolve, reject) {
            var form = new formidable.IncomingForm();
            var FileName = [];
            form.parse(req, function (err, fields, files) {
            });
            form.on('fileBegin', function (name, file) {
                var dir = "./" + process.env.MediaFolderName;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                form.uploadDir = __dirname + "/../" + process.env.MediaFolderName;

                var ext = file.name.substring(file.name.indexOf('.'), file.name.length);
                var NewName = Commonfunction.GetMediaNameFromDate();
                if (ext.indexOf('?') > -1) {
                    ext = ext.substring(0, ext.indexOf('?'));
                };
                file.path = form.uploadDir + "/" + NewName + ext;

                FileName.push({ "Type": file.type, "Name": NewName + ext });

            });
            form.on('end', function () {
                function uploader(i) {
                    if (i < FileName.length) {
                        Media.SaveMedia(req.decoded, FileName[i]).then(function (upload) {
                            uploader(i + 1);
                        })
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