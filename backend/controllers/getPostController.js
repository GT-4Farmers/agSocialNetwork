exports.getPostController = (req, res) => {
    const db = require("../server");
    
    let user = req.body.profileRoute;
    let signedInUser = req.session.userID;

    //var sql = 'SELECT Likes.uuid, createdAt, content, Posts.postID, likeCount FROM Posts left join Likes ON Posts.postID = Likes.postID AND uuid = ? WHERE createdBy = ? ORDER BY createdAt DESC';
    var sql = 'SELECT Posts.postID, Posts.createdAt AS postCreatedAt, Posts.content AS postContent, likeCount, Likes.uuid, Comments.replyID, Comments.content AS commentContent, Comments.createdAt AS commentCreatedAt, Comments.createdBy AS commentCreatedBy FROM Posts left join Comments ON Posts.postID = Comments.postID left join Likes ON Posts.postID = Likes.postID AND uuid = ? WHERE Posts.createdBy = ? ORDER BY Posts.createdAt DESC, Comments.createdAt ASC';
    var input = [signedInUser, user];

    db.query(sql, input, (err, data, fields) => {
        if (data[0]) {
            let posts = [];
            let timestamps = [];
            let postIDs = [];
            let images = [];
            let likeCounts = [];
            let liked = [];
            let commentsPost = [];
            let commentsMap = new Map();

            for (const key in data) {
                if (postIDs[postIDs.length - 1] !== data[key].postID) {
                    //console.log(commentsMap);
                    if (commentsPost.length !== 0) {
                        commentsMap.set(postIDs[postIDs.length - 1], commentsPost);
                        commentsPost = [];
                    }
                    if (data[key].commentContent !== null) {
                        commentsPost.push({cContent: `${data[key].commentContent}`, cCreatedBy: `${data[key].commentCreatedBy}`, cCreatedAt: `${data[key].commentCreatedAt}`});
                    }
                    postIDs.push(`${data[key].postID}`);
                    timestamps.push(`${data[key].postCreatedAt}`);
                    posts.push(`${data[key].postContent}`);
                    likeCounts.push(`${data[key].likeCount}`);
                    if (data[key].uuid === signedInUser) {
                        liked.push("green");
                    } else {
                        liked.push("black");
                    }
                } else {
                    commentsPost.push({cContent: `${data[key].commentContent}`, cCreatedBy: `${data[key].commentCreatedBy}`, cCreatedAt: `${data[key].commentCreatedAt}`});
                }
                db.query("SELECT File_reference FROM Images WHERE postID = ?", [data[key].postID], (err, img_data) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Database error"
                        })
                    }
                
                    if (img_data[0]) {images.push(`${img_data[0].File_reference}`)}
                    else {images.push(null)}

                    if (images.length == data.length) {
                        let temp = JSON.stringify([...commentsMap]);
                        res.json({
                            success: true,
                            msg: 'Successfully retrieved posts',
                            posts: posts,
                            timestamps: timestamps,
                            postIDs: postIDs,
                            images: images,
                            likeCounts: likeCounts,
                            liked: liked,
                            comments: temp
                        })
                    }
                    // console.log(images)
                    
                });
            }
            if (commentsPost.length !== 0) {
                commentsMap.set(postIDs[postIDs.length - 1], commentsPost);
                commentsPost = [];
            }
        } else {
            res.json({
                success: false,
                msg:'An error occurred while getting posts.',
                posts: [],
                timestamps: [],
                postIDs: [],
                images: [],
                likeCounts: [],
                liked: [],
                comments: ''
            })
        }
    });
}