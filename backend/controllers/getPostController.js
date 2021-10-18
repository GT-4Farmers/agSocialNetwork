exports.getPostController = (req, res) => {
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
            let images_data = [];
            let likeCounts = [];
            let liked = [];

            for (const key in data) {
                posts.push(`${data[key].content}`);
                timestamps.push(`${data[key].createdAt}`);
                postIDs.push(`${data[key].postID}`);
                db.query("SELECT File_reference FROM Images WHERE postID = ?", [data[key].postID], (err, img_data, fields) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Database error"
                        })
                    }

                    if (img_data[0]) {images_data.push(img_data[0]);}
                    else {images_data.push(null)}
                    
                })
                
                likeCounts.push(`${data[key].likeCount}`);

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