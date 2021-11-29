exports.updateCredentialsController = (req, res) => {
    const db = require("../server");
    const bcrypt = require('bcrypt');
    var uuid = req.session.userID;
    var credential = req.body.credential;
    if (credential == "password") {
        var sql = 'UPDATE Users SET password = ? WHERE uuid = ?'
        var input = bcrypt.hashSync(req.body.input, 9);
    } else {
        var sql = 'UPDATE Users SET email = ? WHERE uuid = ?'
        var input = req.body.input;
    }

    var update_cols = [input, uuid]
    db.query(sql, update_cols, (err) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occured, please try again.'
            })
            return;
        } else {
            res.json({
                success: true
            })
            return;
        }
    })
}