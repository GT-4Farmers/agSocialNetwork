exports.likesController = (req, res) => {
    const db = require("../server");

    let postID = req.body.postID;
    let uuid = req.body.uuid;
    let mode = req.body.mode;

    if (mode === "like") {
        var sql = 'INSERT INTO `Likes` (postID, uuid) VALUES (?, ?)';
    } else {
        var sql = 'DELETE FROM `Likes` WHERE postID = ? AND uuid = ?';
    }
    var input = [postID, uuid];

    db.query(sql, input, (err) => {
        if (!err) {
            res.json({
                success: true,
                msg: 'Successfully liked/unliked post.'
            })
        } else {
            res.json({
                success: false,
                msg: 'An error occured while liking/unliking post.'
            })
        }
    })
}