var express = require('express');
var router = express.Router();
var models = require('../models');
var sequelize = models.sequelize;
var Contactus = models.tblcontactus;
var fs = require('fs');


router.get('/terms', async (req, res) => {
    fs.readFile('Terms&Conditions.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
        }
        res.end();
    });
})

router.post('/contactus', async (req, res) => {
    return sequelize.transaction(function (t) {
        req.body.createddate = new Date()
        req.body.createdby = req.body.email
        return Contactus.create(req.body).then(function (create) {
            if (create) {
                return { success: true, message: "Data save successfully...", data: create }
            } else {
                return { success: false, message: "Data save Fail..." };
            };
        })
    }).then(function (response) {
        res.json(response)
    }).catch(function (err) {
        res.json({
            success: false,
            message: err.message,
        });
    });
})

module.exports = router