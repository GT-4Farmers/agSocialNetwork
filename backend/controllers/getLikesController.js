exports.getLikesController = (req, res) => {
    const db = require("../server");

    let postID = req.body.postID;

    var sql = 'SELECT uuid FROM Likes WHERE postID = ?'
    var input = [postID];

    db.query(sql, input, (err, data, fields) => {
        likers = []
        count = 0;
        if (data) {
            for (const key in data) {
                likers.push(data[key].uuid);
                count++;
            }
            res.json({
                success: true,
                likers: likers,
                count: count
            })
        } else {
            res.json({
                success: false,
                likers: likers,
                count: count
            })
        }
    })
}