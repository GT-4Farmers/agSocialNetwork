exports.getPhotosController = (req, res) => {
    const db = require("../server");
    let uuid = req.session.userID;
    db.query("SELECT File_reference FROM Media WHERE uuid = ? ORDER BY createdAt", uuid, (err, data) => {
        if (data[0]) {
            let photos = [];
            for (const key in data) {
                photos.push(`${data[key].File_reference}`);
            }
            res.json({
                success: true,
                photos: photos
            })
        } else {
            res.json({
                success:false,
                msg:'An error occurred.'
            })
        }
    })
}