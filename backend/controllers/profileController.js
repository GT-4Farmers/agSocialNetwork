exports.profileController = (req, res) => {
    const db = require("../server");
    let same = req.body.profileRoute;

    db.query("SELECT * FROM Users WHERE uuid = ?", same, (err, data) => {
        if (data) {
            res.json({
                uuid: data[0].uuid,
                email: data[0].email,
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