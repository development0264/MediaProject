var models = require('../models');
var sequelize = models.sequelize;
var Usershare = models.tblshare;
var Media = models.tblusermedia;
var User = models.tbluser;
var u = require('underscore');

function userImage() {

    this.list = async function (req, res) {
        return sequelize.transaction(function (t) {
            var objParam = req.query;
            var Orderby = objParam.active + ' ' + objParam.order;
            var search = {};
            search['$and'] = [];
            if (objParam.iduser != null && objParam.iduser != '' && objParam.iduser != undefined) {
                var objSearch = {
                    ['iduser']: {
                        ['$eq']: objParam.iduser
                    }
                }
                search['$and'].push(objSearch);
            }


            return Media.findAndCountAll({
                where: search,
                order: Orderby,
                offset: parseInt(objParam.start),
                limit: parseInt(objParam.length),
            }).then(function (response) {

                var response1 = new Object();
                response1.success = true;
                response1.draw = objParam.draw;
                response1.recordsTotal = response.count;
                response1.recordsFiltered = response.count;
                response1.data = response.rows;
                return response1;

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

    this.sharedlist = async function (req, res) {
        return sequelize.transaction(function (t) {
            var objParam = req.query;
            var Orderby = objParam.active + ' ' + objParam.order;
            var search = {};
            search['$and'] = [];
            if (objParam.iduser != null && objParam.iduser != '' && objParam.iduser != undefined) {
                var objSearch = {
                    ['iduser']: {
                        ['$eq']: objParam.iduser
                    }
                }
                search['$and'].push(objSearch);
            }

            Usershare.belongsTo(User, {
                foreignKey: {
                    name: 'idtouser',
                    allowNull: false
                }
            });

            Usershare.belongsTo(Media, {
                foreignKey: {
                    name: 'idmedia',
                    allowNull: false
                }
            });

            return Usershare.findAndCountAll({
                where: search,
                order: Orderby,
                offset: parseInt(objParam.start),
                limit: parseInt(objParam.length),
                include: [{
                    model: User,
                    required: true,
                }, {
                    model: Media,
                    //required: true,
                }]
            }).then(function (response) {

                var response1 = new Object();
                response1.success = true;
                response1.draw = objParam.draw;
                response1.recordsTotal = response.count;
                response1.recordsFiltered = response.count;
                response1.data = response.rows;
                return response1;

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

    this.SaveMedia = async function (decode, Filename) {
        return sequelize.transaction(function (t) {
            return Media.create({
                iduser: decode.id,
                filename: Filename.Name,
                createdby: decode.name,
                createddate: new Date(),
                Type: Filename.Type
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

    this.UploadPoster = async function (Filename, id_media) {
        return sequelize.transaction(function (t) {
            return Media.update({
                poster: Filename.Name,
                Type: "Both",
                ispair: (Filename.ispair == true || Filename.ispair == 'true') ? 1 : 0
            }, { where: { id: id_media } }).then(function (create) {
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
            return Media.create({
                iduser: decode.id,
                filename: Filename,
                createdby: decode.name,
                createddate: new Date(),
                Type: 'Video'
            }).then(function (create) {
                console.log(create)
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
            Usershare.belongsTo(User, {
                foreignKey: {
                    name: 'iduser',
                    allowNull: false
                }
            });
            Usershare.belongsTo(Media, {
                foreignKey: {
                    name: 'idmedia',
                    allowNull: false
                }
            });
            return Usershare.findAndCountAll({
                where: { idtouser: req.query.iduser },
                include: [{
                    model: User,
                    required: true,
                }, {
                    model: Media,
                    required: false,
                }]
            }).then(function (response) {
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
                unreadcount: 0
            });
        });
    }

    this.notificationupdate = async function (req, res) {
        return sequelize.transaction(function (t) {
            return Usershare.update({ isread: true }, { where: { idtouser: req.query.iduser, id: req.query.idshare } }).then(function (response) {
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