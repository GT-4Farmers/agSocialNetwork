exports.editPhoneController = (req, res) => {
    const db = require("../server");
    var uuid = req.session.userID
    var phone = req.body.phone

    var update_sql = 'UPDATE Profiles SET phone = ? WHERE uuid = ?'
    var update_cols = [phone, uuid]
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