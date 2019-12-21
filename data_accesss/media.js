var models = require('../models');
var sequelize = models.sequelize;
var UserMedia = models.tblusermedia;


function userImage() {

    this.saveImage = async function (decode, Filename) {
        return sequelize.transaction(function (t) {
            return UserMedia.create({
                iduser: decode.id,
                filename: Filename,
                createdby: decode.name,
                createddate: new Date(),
                Type: 'Image'
            }).then(function (create) {
                if (create) {
                    return { success: true, message: "Image Uploaded Successfully...", data: create }
                } else {
                    return { success: false, message: "Image Uploadeding Fail..." };
                };
            })
        }).then(function (response) {
            return (response)
        }).catch(function (err) {
            return ({
                success: false,
                message: err.message,
            });
        });
    }

    this.savevideo = async function (decode, Filename) {
        return sequelize.transaction(function (t) {
            return UserMedia.create({
                iduser: decode.id,
                filename: Filename,
                createdby: decode.name,
                createddate: new Date(),
                Type: 'Video'
            }).then(function (create) {
                if (create) {
                    return { success: true, message: "Video Uploaded Successfully...", data: create }
                } else {
                    return { success: false, message: "Video Uploadeding Fail..." };
                };
            })
        }).then(function (response) {
            return (response)
        }).catch(function (err) {
            return ({
                success: false,
                message: err.message,
            });
        });
    }
}

module.exports = new userImage();  