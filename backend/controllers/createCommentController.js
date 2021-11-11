exports.createCommentController = (req, res) => {
    const db = require("../server");
    const uuid = require("uuid")
    
    let content = req.body.content;
    let user = req.session.userID;
    let post_id = req.body.postID;
    let reply_id = uuid.v4();

    var sql = `INSERT INTO Comments (postID, replyID, createdBy, content) VALUES (?, ?, ?, ?)`;
    var input = [post_id, reply_id, user, content];

    db.query(sql, input, (err, data) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while making comment.'
            })
            return;
        } else {
            res.json({
                success: true,
                msg:'Successfully created comment on post.'
            })
            return;       
        }      
    })  
}
