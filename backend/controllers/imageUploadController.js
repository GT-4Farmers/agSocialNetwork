exports.imageUploadController = (req, res) => {
    const post_media_upload = require("../upload")
    
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

        res.json({
            success: true,
            msg: "image successfully uploaded",
            image_name: imageName,
            image_loc: imageLocation
        })
        return;

    })
}