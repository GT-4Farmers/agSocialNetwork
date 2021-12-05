exports.updatePrivacyController = (req, res) => {
    const db = require("../server");
    let user = req.session.userID;
    let privacy = req.body.isPrivate;

    db.query("UPDATE Users SET isPrivate = ? WHERE uuid = ?", [privacy, user], (err, data) => {
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