exports.getPhotosController = (req, res) => {
    const db = require("../server");
    let uuid = req.body.profileRoute;
    db.query("SELECT File_reference FROM Media WHERE uuid = ? ORDER BY createdAt DESC", uuid, (err, data) => {
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