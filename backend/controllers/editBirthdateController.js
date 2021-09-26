exports.editBirthdateController = (req, res) => {
    const db = require("../server");
    var uuid = req.session.userID
    var birthdate = req.body.birthdate

    var update_sql = 'UPDATE Profiles SET birthdate = ? WHERE uuid = ?'
    var update_cols = [birthdate, uuid]
    db.query(update_sql, update_cols, (err) => {
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