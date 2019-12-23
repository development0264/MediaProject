var models = require('../models');
var sequelize = models.sequelize;
var Usershare = models.tblshare;
var u = require('underscore');

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

    this.notificationcount = async function (req, res) {
        return sequelize.transaction(function (t) {
            return Usershare.findAndCountAll({ where: { iduser: req.query.iduser } }).then(function (response) {
                var unreadmessage = 0
                if (response.rows.length > 0) {
                    unreadmessage = u.filter(response.rows, { isread: 0 });

                }
                return { success: true, data: response.rows, unreadcount: unreadmessage.length }
            })
        }).then(function (response) {
            return response
        }).catch(function (err) {
            return ({
                success: false,
                message: err.message,
            });
        });
    }

    this.notificationupdate = async function (req, res) {
        return sequelize.transaction(function (t) {
            return Usershare.update({ isread: true }, { where: { iduser: req.query.iduser, id: req.query.idshare } }).then(function (response) {
                return {
                    success: true,
                    message: "Notification updated successfully...",
                    data: response
                }
            })
        }).then(function (response) {
            return response
        }).catch(function (err) {
            return ({
                success: false,
                message: err.message,
            });
        });
    }
}

module.exports = new userImage();  