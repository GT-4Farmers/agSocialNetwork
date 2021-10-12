exports.deleteTextPostController = (req, res) => {
    const db = require("../server");
    
    let deletedPostID = req.body.deletedPostID;

    var sql = 'DELETE FROM `Posts` WHERE postID = ?';
    var input = [deletedPostID];

    db.query(sql, input, (err, data, fields) => {
        if (err) {
            req.json({
                msg: 'An error occurred while deleting post.'
            })
        } else {
            res.json({
                msg:'Successfully deleted post.'
            })
        }
    });
}