var generatePassword = require("password-generator");
var bcrypt = require('bcryptjs');

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

var InvalidToken = {
    success: false,
    message: "Invalid token...",
    data: "TOKEN"
};

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

function encryption(password) {
    return bcrypt.hashSync(password, 8)
}

function encryptioncompareSync(password, userpassword) {
    return bcrypt.compareSync(password, userpassword)
}

function GetUserNameFromDate() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();

    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    var milisec = d.getMilliseconds();

    return curr_year.toString() + curr_month.toString() + curr_date.toString() + hour.toString() + minutes.toString() + seconds.toString() + milisec.toString();
}

// function CheckValidToken(decoded, callback) {
//     if (decoded) {
//         userTransaction.checkuser(decoded, function (UserExist) {
//             if (UserExist != null) {
//                 console.log("calll")
//                 return callback({
//                     success: true,
//                     message: "Valid token",
//                     data: UserExist
//                 });
//             } else {
//                 return callback(decoded);
//             }
//         })
//     } else {
//         return callback(InvalidToken);
//     }
// }

module.exports = {
    customPassword: customPassword,
    encryption: encryption,
    encryptioncompareSync: encryptioncompareSync,
    GetUserNameFromDate: GetUserNameFromDate,
    //CheckValidToken: CheckValidToken
}