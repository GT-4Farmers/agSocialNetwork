exports.getDashboardTextPostsController = (req, res) => {
    const db = require("../server");

    let friendUuid = [];
    friendUuid.push(req.session.userID);
    req.body.friendUuid.forEach(friend => friendUuid.push(friend));

    var sql = 'SELECT * FROM `Posts` WHERE createdBy IN (?) ORDER BY createdAt DESC';
    var input = [friendUuid];

    db.query(sql, input, (err, data, fields) => {
        if (data) {
            let posts = [];
            let timestamps = [];
            let postIDs = [];
            let authors = [];

            for (const key in data) {
                postIDs.push(`${data[key].postID}`);
                authors.push(`${data[key].createdBy}`);
                timestamps.push(`${data[key].createdAt}`);
                posts.push(`${data[key].content}`);
            }

            res.json({
                success: true,
                msg: 'Successfully retrieved posts',
                posts: posts,
                timestamps: timestamps,
                postIDs: postIDs,
                authors: authors
            })
        } else {
            res.json({
                success: false,
                msg:'An error occurred while getting posts.',
                posts: [],
                timestamps: [],
                postIDs: [],
                author: []
            })
        }
    });
}