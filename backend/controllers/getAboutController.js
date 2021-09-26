exports.getAboutController = (req, res) => {
    const db = require("../server");
    // console.log(req.session.userID);
    db.query("SELECT * FROM Profiles WHERE uuid = ?", req.session.userID, (err, data) => {
        if (data) {
            res.json({
                email: data[0].email,
                bio: data[0].bio,
                birthdate: data[0].birthdate,
                location: data[0].location,
                phone: data[0].phone
            })
        } else {
            res.json({
                success:false,
                msg:'An error occurred.'
            })
        }
    })
}