exports.isLoggedInController = (req, res) => {
    const db = require("../server"); 

    if (req.session.userID) {
        let cols = [req.session.userID];
        db.query('SELECT * FROM Users WHERE uuid = ? LIMIT 1', cols, (err, data, fields) => {
            if (data && data.length === 1) {
                res.json({
                    success: true,
                    email: data[0].email,
                    firstName: data[0].firstName,
                    lastName: data[0].lastName,
                    uuid: data[0].uuid
                })
                return;
            } else {
                res.json({
                    success:false
                })
                return;
            }
        });
    } else {
        res.json({
            success: false
        })
        return;
    }
}