var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

//email Config
var smtpConfig = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 2525,
    secure: false,
    auth: {
        user: process.env.SystemEmail,
        pass: process.env.SystemEmailPassword
    },
    tls: {
        rejectUnauthorized: false
    }
};

var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

function emailhandler() {

    this.sendemail = function (obj) {
        return new Promise(function (resolve, reject) {
            var mail = {
                from: process.env.FromEmail,
                to: obj.email,
                subject: obj.subject,
                html: obj.body
            };
            transporter.sendMail(mail, function (error, response) {
                if (error) {
                    reject({ success: false, err: error, response: null });
                } else {
                    resolve({ success: true, err: null, response: response });
                }
            });
        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            return err;
        });

    }
}
module.exports = new emailhandler(); 