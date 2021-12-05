exports.getPrivacyController = (req, res) => {
    const db = require("../server");
    let user = req.session.userID;

    db.query("SELECT isPrivate FROM Users WHERE uuid = ?", user, (err, data) => {
        if (data) {
            res.json({
                isPrivate: data[0].isPrivate
            })
        } else {
            res.json({
                success:false,
                msg:'An error occurred.'
            })
        }
    })
}