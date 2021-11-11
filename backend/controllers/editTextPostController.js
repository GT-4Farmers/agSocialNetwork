exports.editTextPostController = (req, res) => {
    const db = require("../server");
    
    let editedPostID = req.body.editedPostID;
    let content = req.body.content;

    var sql = 'UPDATE `Posts` SET content = ? WHERE postID = ?';
    var input = [content, editedPostID];

    db.query(sql, input, (err, data, fields) => {
        if (err) {
            req.json({
                success: false,
                msg: 'An error occurred while deleting post.'
            })
        } else {
            res.json({
                success: true,
                msg:'Successfully deleted post.'
            })
        }
    });
}