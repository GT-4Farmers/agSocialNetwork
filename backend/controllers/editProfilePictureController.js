exports.editProfilePictureController = (req, res) => {
    const db = require("../server");
    var uuid = req.session.userID
    var profilePicture = req.body.profilePicture

    var update_sql = 'UPDATE Profiles SET profilePicture = ? WHERE uuid = ?'
    var update_cols = [profilePicture, uuid]
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