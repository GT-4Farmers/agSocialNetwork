exports.getDashboardTextPostsController = (req, res) => {
    const db = require("../server");

    let user = req.session.userID;
    let friendUuid = [];
    friendUuid.push(user);
    req.body.friendUuid.forEach(friend => friendUuid.push(friend));

    var sql = 'SELECT Posts.postID, Posts.createdBy, createdAt, content, likeCount, Likes.uuid FROM Posts left join Likes ON Posts.postID = Likes.postID AND uuid = ? WHERE createdBy IN (?) ORDER BY createdAt DESC';
    var input = [user, friendUuid];
    db.query(sql, input, (err, data, fields) => {
        if (data) {
            let posts = [];
            let timestamps = [];
            let postIDs = [];
            let images = [];
            let authors = [];
            let likeCounts = [];
            let liked = [];

            for (const key in data) {
                postIDs.push(`${data[key].postID}`);
                authors.push(`${data[key].createdBy}`);
                timestamps.push(`${data[key].createdAt}`);
                posts.push(`${data[key].content}`);
                likeCounts.push(`${data[key].likeCount}`);

                db.query("SELECT File_reference FROM Images WHERE postID = ?", [data[key].postID], (err, img_data) => {
                    console.log("did db query, starting callback")
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Database error"
                        })
                    }
                
                    if (img_data[0]) {images.push(`${img_data[0].File_reference}`)}
                    else {images.push(null)}

                    if (images.length == data.length) {
                        // console.log("starting json response")
                        // console.log(posts)
                        // console.log(images)
                        res.json({
                            success: true,
                            msg: 'Successfully retrieved posts',
                            posts: posts,
                            timestamps: timestamps,
                            postIDs: postIDs,
                            images: images,
                            authors: authors,
                            likeCounts: likeCounts,
                            liked: liked
                        })
                    }
                    // console.log(images)
                    
                });

                if (data[key].uuid === user) {
                    liked.push("green");
                } else {
                    liked.push("black");
                }
            }
        } else {
            res.json({
                success: false,
                msg:'An error occurred while getting posts.',
                posts: [],
                timestamps: [],
                postIDs: [],
                images: [],
                authors: [],
                likeCounts: [],
                liked: []
            })
        }
    });
}