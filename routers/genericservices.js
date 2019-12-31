var express = require('express');
var router = express.Router()
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

module.exports = router