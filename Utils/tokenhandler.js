
var jwt = require('jsonwebtoken');
var config = require('../config');

function tokenhandler() {
    this.sign = function (UserReg) {
        return jwt.sign({ id: UserReg.id, name: UserReg.name, email: UserReg.email, password: UserReg.password }, config.secret, { expiresIn: 86400 })
    }

    this.verify = function (token, args) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return reject("Forbidden")
                } else {
                    resolve(decoded)
                }
            })
        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            //console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
            return err;
        });
    }
}

module.exports = new tokenhandler(); 