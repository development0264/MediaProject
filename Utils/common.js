
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var generatePassword = require("password-generator");

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

var maxLength = 10;
var minLength = 8;
var uppercaseMinCount = 2;
var lowercaseMinCount = 2;
var numberMinCount = 2;
var specialMinCount = 1;
var UPPERCASE_RE = /([A-Z])/g;
var LOWERCASE_RE = /([a-z])/g;
var NUMBER_RE = /([\d])/g;
var SPECIAL_CHAR_RE = /([\?\-\^\$\#\@\!\%\&\*])/g;
var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
    var uc = password.match(UPPERCASE_RE);
    var lc = password.match(LOWERCASE_RE);
    var n = password.match(NUMBER_RE);
    var sc = password.match(SPECIAL_CHAR_RE);
    var nr = password.match(NON_REPEATING_CHAR_RE);
    return password.length >= minLength &&
        !nr &&
        uc && uc.length >= uppercaseMinCount &&
        lc && lc.length >= lowercaseMinCount &&
        n && n.length >= numberMinCount &&
        sc && sc.length >= specialMinCount;
}


function customPassword() {
    var password = "";
    var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    while (!isStrongEnough(password)) {
        password = generatePassword(randomLength, false, /[\w\d\?\-]/);
    }
    return password;
}
module.exports = {
    transporter: transporter,
    customPassword: customPassword,
}