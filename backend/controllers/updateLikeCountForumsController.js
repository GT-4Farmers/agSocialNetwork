exports.updateLikeCountForumsController = (req, res) => {
    const db = require("../server");

    let user = req.session.userID;
    let postID = req.body.postID;
    let postOwner = req.body.postOwner;

    var sql = 'SELECT * FROM DiscussionLikes WHERE PagePostID = ? and uuid = ?'
    var input = [postID, user];
    db.query(sql, input, (err, data, fields) => {
        // if user has already liked this post.
        if (data[0]) {
            var sql = 'SELECT * FROM `Pages` WHERE PagePostID = ? AND createdBy = ?';
            var input = [postID, postOwner];
            db.query(sql, input, (err, data, fields) => {
                if (data) {
                    var sql = 'UPDATE `Pages` SET likeCount = ? WHERE PagePostID = ? AND createdBy = ?';
                    var input = [data[0].likeCount - 1, postID, postOwner];
                    db.query(sql, input);
                }
            });

            var sql = 'DELETE FROM `DiscussionLikes` WHERE PagePostID = ? and uuid = ?';
            var input = [postID, user];
            db.query(sql, input, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "Error unliking post.",
                        action: "error"
                    })
                } else {
                    res.json({
                        success: true,
                        msg: "Unliked post.",
                        action: "unliked"
                    })
                }
            });

        // user hasn't liked this post
        } else {
            var sql = 'INSERT INTO `DiscussionLikes` VALUES (?,?)';
            var input = [postID, user];
            db.query(sql, input);

            var sql = 'SELECT * FROM `Pages` WHERE PagePostID = ? AND createdBy = ?';
            var input = [postID, postOwner];
            db.query(sql, input, (err, data, fields) => {
                if (data) {
                    var sql = 'UPDATE `Pages` SET likeCount = ? WHERE PagePostID = ? AND createdBy = ?';
                    var input = [data[0].likeCount + 1, postID, postOwner];
                    db.query(sql, input, (err) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: "Error liking post.",
                                action: "error"
                            })
                        } else {
                            res.json({
                                success: true,
                                msg: "Liked post.",
                                action: "liked"
                            })
                        }
                    })
                }
            });
        }
    })
}