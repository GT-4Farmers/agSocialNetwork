exports.deleteTextPostController = (req, res) => {
    const db = require("../server");
    
    let deletedPostID = req.body.deletedPostID;

    var input = [deletedPostID];
    
    var sql = 'DELETE FROM `Comments` WHERE postID = ?';
    db.query(sql, input, (err, data, fields) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while deleting comments from post.'
            })
        }
    });

    var sql = 'DELETE FROM `Images` WHERE postID = ?';
    db.query(sql, input, (err, data, fields) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while deleting images from post.'
            })
        }
    });

    var sql = 'DELETE FROM `Likes` WHERE postID = ?';
    db.query(sql, input, (err, data, fields) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while deleting likes from post.'
            })
        }
    });

    var sql = 'DELETE FROM `Posts` WHERE postID = ?';
    db.query(sql, input, (err, data, fields) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while deleting post.'
            })
        }
    });

    res.json({
        success: true,
        msg:'Successfully deleted post.'
    })
}