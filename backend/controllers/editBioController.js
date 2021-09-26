exports.editBioController = (req, res) => {
    const db = require("../server");
    var uuid = req.session.userID
    var bio = req.body.bio

    var update_sql = 'UPDATE Profiles SET bio = ? WHERE uuid = ?'
    var update_cols = [bio, uuid]
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