var User = require('../data_accesss/user');

function Mediashare() {

    this.share = async function (req, res) {
        return new Promise(function (resolve, reject) {
            User.share(req).then(function (usershare) {
                resolve(usershare);
            })
        }).then(function (resUpdate) {
            return resUpdate;
        }).catch(function (err) {
            return err;
        });
    }

}

module.exports = new Mediashare(); 