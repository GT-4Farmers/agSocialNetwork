exports.editLocationController = (req, res) => {
    const db = require("../server");
    var uuid = req.session.userID
    var location = req.body.location

    var update_sql = 'UPDATE Profiles SET location = ? WHERE uuid = ?'
    var update_cols = [location, uuid]
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