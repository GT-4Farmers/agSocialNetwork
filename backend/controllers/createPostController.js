exports.createPostController = (req, res) => {
    const db = require("../server");
    const post_media_upload = require("../upload")
    const uuid = require("uuid")
    
    let content = req.body.content;
    let image_names = req.body.image_names;
    let image_locs = req.body.image_locs;
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
            if (!image_names) {
                res.json({
                success: true,
                msg:'Successfully created post with no image.'
                })
                return;
            } else {
                for (let i = 0; i < image_names.length; i++) {
                    db.query("INSERT INTO Images (File_reference, Filename, postID) VALUES (?, ?, ?)", [image_locs[i], image_names[i], post_id], (err, data, fields) => { 
                        if (err) {
                            res.json({
                                success: false,
                                msg: err
                            })
                            return;
                        }
                                
                    })
                }
                res.json({
                    success: true,
                    msg:'Successfully created post with image(s).'
                })
                return;
                
            }
                
        }
            
    })
    

        
}
