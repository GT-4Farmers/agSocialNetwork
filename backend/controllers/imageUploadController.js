exports.imageUploadController = (req, res) => {
    const post_media_upload = require("../upload")
    const db = require("../server");
    let uuid = req.session.userID;
    
    post_media_upload(req, res, (error) => {
        if (error) {
            res.json({
                success: false,
                error: error
            })
            return;
        }
        if (req.file == undefined) {
            res.json({
                success: false,
                msg: "no file"
            })
            return;
        }
        const imageLocation = req.file.location
        const imageName = req.file.key

        var sql = `INSERT INTO Media (File_reference, uuid) VALUES (?, ?)`;
        var cols = [imageLocation, uuid];
        db.query(sql, cols, (err, data) => {
            if (err) {
                res.json({
                    success: false,
                    error: error
                })
            }
        })
        res.json({
            success: true,
            msg: "image successfully uploaded",
            image_name: imageName,
            image_loc: imageLocation
        })
        return;

    })
}