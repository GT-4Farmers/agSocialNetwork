exports.getTextPostController = (req, res) => {
    const db = require("../server");
    
    let user = req.body.profileRoute;
    let loggedIn = req.session.userID;

    var sql = 'SELECT Likes.uuid, createdAt, content, Posts.postID, likeCount FROM Posts left join Likes ON Posts.postID = Likes.postID AND uuid = ? WHERE createdBy = ? ORDER BY createdAt DESC';
    var input = [loggedIn, user];

    db.query(sql, input, (err, data, fields) => {
        if (data[0]) {
            let posts = [];
            let timestamps = [];
            let postIDs = [];
            let likeCounts = [];
            let liked = [];

            for (const key in data) {
                posts.push(`${data[key].content}`);
                timestamps.push(`${data[key].createdAt}`);
                postIDs.push(`${data[key].postID}`);
                likeCounts.push(`${data[key].likeCount}`);

                console.log("data[key].uuid:",data[key].uuid);
                console.log("user:",user);

                if (data[key].uuid === user || data[key].uuid !== null) {
                    liked.push("green");
                } else {
                    liked.push("black");
                }
            }

            res.json({
                success: true,
                msg: 'Successfully retrieved posts',
                posts: posts,
                timestamps: timestamps,
                postIDs: postIDs,
                likeCounts: likeCounts,
                liked: liked
            })
        } else {
            res.json({
                success: false,
                msg:'An error occurred while getting posts.',
                posts: [],
                timestamps: [],
                postIDs: [],
                likeCounts: [],
                liked: []
            })
        }
    });
}