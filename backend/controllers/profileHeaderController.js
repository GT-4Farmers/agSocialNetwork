exports.profileHeaderController = (req, res) => {
    const db = require("../server");

    db.query("SELECT * FROM Users WHERE uuid = ?", req.session.userID, (err, data) => {
        if (data) {
            res.json({
                uuid: data[0].uuid,
                firstName: data[0].firstName,
                lastName: data[0].lastName
            })
        } else {
            res.json({
                success:false,
                msg:'An error occurred.'
            })
        }
    })
}