exports.getTextPostController = (req, res) => {
    const db = require("../server");
    
    let user = req.body.profileRoute;

    var sql = 'SELECT createdAt, content FROM `Posts` WHERE createdBy = ? ORDER BY createdAt DESC';
    var input = [user];

    db.query(sql, input, (err, data, fields) => {
        if (data[0]) {
            let posts = [];
            let timestamps = [];
            let postIDs = [];

            for (const key in data) {
                posts.push(`${data[key].content}`);
                timestamps.push(`${data[key].createdAt}`);
                postIDs.push(`${data[key].postID}`)
            }

            res.json({
                success: true,
                msg: 'Successfully retrieved posts',
                posts: posts,
                timestamps: timestamps,
                postIDs: postIDs
            })
        } else {
            res.json({
                success: false,
                msg:'An error occurred while getting posts.',
                posts: [],
                timestamps: [],
                postIDs: []
            })
        }
    });
}