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
        
        for (const f of req.files) {
            image_locs.push(f.location);
            image_names.push(f.key);
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