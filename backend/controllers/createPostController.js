exports.createPostController = (req, res) => {
    const db = require("../server");
    const post_media_upload = require("../upload")
    const uuid = require("uuid")
    
    let content = req.body.content;
    let image_name = req.body.image_name;
    let image_loc = req.body.image_loc;
    let user = req.session.userID;
    let post_id = uuid.v4();

    var sql = `INSERT INTO Posts (postID, createdBy, content) VALUES (?, ?, ?)`;
    var input = [post_id, user, content];

    db.query(sql, input, (err, data) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while making post.'
            })
            return;
        } else {
            if (!image_name) {
                res.json({
                success: true,
                msg:'Successfully created post with no image.'
                })
                return;
            } else {
                db.query("INSERT INTO Images (File_reference, Filename, postID) VALUES (?, ?, ?)", [image_loc, image_name, post_id], (err, data, fields) => { 
                    if (err) {
                        res.json({
                            success: false,
                            msg: err
                        })
                        return;
                    } else {
                        res.json({
                            success: true,
                            msg:'Successfully created post with an image.'
                        })
                        return;
                    }
                            
                })
            }
                
        }
            
    })
    

        
}
