exports.createPostController = (req, res) => {
    const db = require("../server");
    const post_media_upload = require("../upload")
    const uuid = require("uuid")
    
    let content = req.body.content; // How do we differentiate between content and file requests?
    let user = req.session.userID;
    let post_id = uuid.v4()

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
            if (req.file == undefined) {
                res.json({
                success: true,
                msg:'Successfully created post.'
                })
                return;
            } else {
                post_media_upload(req, res, (error) => {

                    if(error){
                        console.log('errors', error);
                        res.json({error : error});
                    // } else if (req.file == undefined) {
                    //         console.log('error: no file selected');
                    //         res.json('error: no file selected')
                        
                    } else {
                        const imageName = req.file.key;
                        //this location is what we need to store in our sql database.
                        //it's the URL to the image
                        const imageLocation = req.file.location;
            
                        //save the file into the database
                        //he does this with a json but i'm not sure how we should do it

                        db.query("INSERT INTO Images (File_reference, filename, postID) VALUES ?, ?, ?", [imageLocation, imageName, post_id], (err, data, fields) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: err
                                })
                            }
                        })
                    }
                })
            }
            
        }
    });

        
}
