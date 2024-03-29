exports.getDashboardTextPostsController = (req, res) => {
    const db = require("../server");

    let user = req.session.userID;
    let friendUuid = [];
    friendUuid.push(user);
    req.body.friendUuid.forEach(friend => friendUuid.push(friend));

    //var sql = 'SELECT Posts.postID, Posts.createdBy, createdAt, content, likeCount, Likes.uuid FROM Posts left join Likes ON Posts.postID = Likes.postID AND uuid = ? WHERE createdBy IN (?) ORDER BY createdAt DESC';
    var sql = 'SELECT Posts.postID, Posts.createdBy AS postCreatedBy, Posts.createdAt AS postCreatedAt, Posts.content AS postContent, likeCount, Likes.uuid, Comments.replyID, Comments.content AS commentContent, Comments.createdAt AS commentCreatedAt, Comments.createdBy AS commentCreatedBy, Profiles.profilePicture FROM Posts left join Comments ON Posts.postID = Comments.postID left join Likes ON Posts.postID = Likes.postID AND uuid = ? left join Profiles ON Profiles.uuid = Posts.createdBy WHERE Posts.createdBy IN (?) ORDER BY Posts.createdAt DESC, Comments.createdAt ASC';
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
            let commentsPost = [];
            let commentsMap = new Map();
            let profilePictures = [];
            
            for (const key in data) {
                if (postIDs[postIDs.length - 1] !== data[key].postID) {
                    if (commentsPost.length !== 0) {
                        commentsMap.set(postIDs[postIDs.length - 1], commentsPost);
                        commentsPost = [];
                    }
                    if (data[key].commentContent !== null) {
                        commentsPost.push({cContent: `${data[key].commentContent}`, cCreatedBy: `${data[key].commentCreatedBy}`, cCreatedAt: `${data[key].commentCreatedAt}`});
                    }
                    postIDs.push(`${data[key].postID}`);
                    authors.push(`${data[key].postCreatedBy}`);
                    timestamps.push(`${data[key].postCreatedAt}`);
                    posts.push(`${data[key].postContent}`);
                    likeCounts.push(`${data[key].likeCount}`);
                    profilePictures.push(`${data[key].profilePicture}`)
                    if (data[key].uuid === user) {
                        liked.push("green");
                    } else {
                        liked.push("black");
                    }
                    db.query("SELECT File_reference FROM Images WHERE postID = ?", [data[key].postID], (err, img_data) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: "Database error"
                            })
                        }
                    
                        if (img_data[0]) {
                            let file_references = img_data.map((x) => {return x.File_reference})
                            images.push(file_references)}
                        else {images.push(null)}
    
                        if (images.length == posts.length) {
                            let temp = JSON.stringify([...commentsMap]);
                            res.json({
                                success: true,
                                msg: 'Successfully retrieved posts',
                                posts: posts,
                                timestamps: timestamps,
                                postIDs: postIDs,
                                images: images,
                                authors: authors,
                                likeCounts: likeCounts,
                                liked: liked,
                                comments: temp,
                                profilePictures: profilePictures
                            })
                        }
    
                        // console.log(images)
                        
                    });
                } else {
                    commentsPost.push({cContent: `${data[key].commentContent}`, cCreatedBy: `${data[key].commentCreatedBy}`, cCreatedAt: `${data[key].commentCreatedAt}`});
                }
            }
            if (commentsPost.length !== 0) {
                commentsMap.set(postIDs[postIDs.length - 1], commentsPost);
                commentsPost = [];
            }
        } else {
            // let b = JSON.stringify([...commentsMap]);
            res.json({
                success: false,
                msg:'An error occurred while getting posts.',
                posts: [],
                timestamps: [],
                postIDs: [],
                images: [],
                authors: [],
                likeCounts: [],
                liked: [],
                comments: "",
                profilePictures: []
            })
        }
    });
}