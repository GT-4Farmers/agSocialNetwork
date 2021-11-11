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
        if (req.files === undefined) {
            res.json({
                success: false,
                msg: "no file"
            })
            return;
        }

        let image_names = [];
        let image_locs = [];

        // console.log("req files")
        // console.log(req.files)

        var sql = `INSERT INTO Media (File_reference, uuid) VALUES (?, ?)`;
        
        for (const f of req.files) {
            image_locs.push(f.location);
            image_names.push(f.key);

            var cols = [f.location, uuid];

            db.query(sql, cols, (err, data) => {
                if (err) {
                    res.json({
                        success: false,
                        error: error
                    })
                }
            })
        }

        // console.log(image_names)
        // console.log(image_locs)

        res.json({
            success: true,
            msg: "image successfully uploaded",
            image_names: image_names,
            image_locs: image_locs
        })
        return;

    })
}