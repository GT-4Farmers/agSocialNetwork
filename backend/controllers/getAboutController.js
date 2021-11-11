exports.getAboutController = (req, res) => {
    const db = require("../server");
    let same = req.body.profileRoute;
    db.query("SELECT * FROM Profiles WHERE uuid = ?", same, (err, data) => {
        if (data) {
            res.json({
                profilePicture: data[0].profilePicture,
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