exports.getDiscussionPageController = (req, res) => {
    const db = require("../server");

    let user = req.session.userID;
    let discussionID = req.body.discussionID;

    let sql = "SELECT Discussions.discussionID AS discussionID, Discussions.createdAt AS dCreatedAt, Discussions.createdBy AS dCreatedBy, Discussions.content AS dContent, Discussions.tag_1, Discussions.tag_2, Discussions.tag_3, Pages.content AS pContent, Users.uuid, Users.firstName, Users.lastName, Pages.PagePostID, Pages.createdAt AS pCreatedAt, Pages.likeCount, DiscussionComments.content AS cContent, DiscussionLikes.uuid AS likeUuid, DiscussionComments.replyID, DiscussionComments.createdAt AS cCreatedAt, DiscussionComments.createdBy AS cCreatedBy FROM haystackdb.Discussions INNER JOIN Pages ON Discussions.discussionID = Pages.DiscussionID INNER JOIN Users ON Pages.createdBy = Users.uuid LEFT JOIN DiscussionComments ON Pages.PagePostID = DiscussionComments.PagePostID LEFT JOIN DiscussionLikes ON Pages.PagePostID = DiscussionLikes.PagePostID AND DiscussionLikes.uuid = \"" + user + "\" WHERE Pages.DiscussionID = \"" + discussionID + "\" ORDER BY Pages.likeCount DESC, cCreatedAt";

    db.query(sql, (err, data, fields) => {
        let commentsMap = new Map();
        if (data[0]) {
            let posts = [];
            let timestamps = [];
            let postIDs = [];
            let authors = [];
            let likeCounts = [];
            let liked = [];
            let commentsPost = [];
            let authorNames = [];
            let cAuthors = [];
            
            for (const key in data) {
                if (!postIDs.includes(data[key].PagePostID)) {
                    //console.log(commentsMap);
                    if (commentsPost.length !== 0) {
                        commentsMap.set(postIDs[postIDs.length - 1], commentsPost);
                        commentsPost = [];
                    }
                    if (data[key].cContent !== null) {
                        commentsPost.push({cContent: `${data[key].cContent}`, cCreatedBy: `${data[key].cCreatedBy}`, cCreatedAt: `${data[key].cCreatedAt}`});
                        if (!cAuthors.includes(`${data[key].cCreatedBy}`)) {
                            cAuthors.push(`${data[key].cCreatedBy}`);
                        }
                    }
                    postIDs.push(`${data[key].PagePostID}`);
                    authors.push(`${data[key].uuid}`);
                    authorNames.push(`${data[key].firstName} ${data[key].lastName}`);
                    timestamps.push(`${data[key].pCreatedAt}`);
                    posts.push(`${data[key].pContent}`);
                    likeCounts.push(`${data[key].likeCount}`);
                    if (data[key].likeUuid === user) {
                        liked.push("green");
                    } else {
                        liked.push("black");
                    }
                } else {
                    commentsPost.push({cContent: `${data[key].cContent}`, cCreatedBy: `${data[key].cCreatedBy}`, cCreatedAt: `${data[key].cCreatedAt}`});
                    if (!cAuthors.includes(`${data[key].cCreatedBy}`)) {
                        cAuthors.push(`${data[key].cCreatedBy}`);
                    }
                }
            }
            if (commentsPost.length !== 0) {
                commentsMap.set(postIDs[postIDs.length - 1], commentsPost);
                commentsPost = [];
            }
            let mainAuthorRoute = `${data[0].dCreatedBy}`;
            let mainTime = `${data[0].dCreatedAt}`;
            let mainContent = `${data[0].dContent}`;
            db.query("SELECT firstName, lastName FROM Users WHERE uuid = ?", data[0].dCreatedBy, (err, data) => {
                let temp = JSON.stringify([...commentsMap]);
                    res.json({
                        success: true,
                        msg: 'Successfully retrieved posts',
                        posts: posts,
                        timestamps: timestamps,
                        postIDs: postIDs,
                        authors: authors,
                        authorNames: authorNames,
                        likeCounts: likeCounts,
                        liked: liked,
                        comments: temp,
                        cAuthors: cAuthors,
                        dContent: mainContent,
                        dCreatedBy: `${data[0].firstName} ${data[0].lastName}`,
                        dCreatedByRoute: mainAuthorRoute,
                        dCreatedAt: mainTime
                    })
            })
        } else {
            db.query ("SELECT * FROM haystackdb.Discussions left join Users on Discussions.createdBy = Users.uuid WHERE discussionID = ?", discussionID, (err, data) => {
                if (data) {
                    let b = JSON.stringify([...commentsMap]);
                    res.json({
                        success: false,
                        msg:'An error occurred while getting posts.',
                        posts: [],
                        timestamps: [],
                        postIDs: [],
                        authors: [],
                        authorNames: [],
                        likeCounts: [],
                        liked: [],
                        comments: b,
                        cAuthors: [],
                        dContent: `${data[0].content}`,
                        dCreatedBy: `${data[0].firstName} ${data[0].lastName}`,
                        dCreatedByRoute: `${data[0].uuid}`,
                        dCreatedAt: `${data[0].createdAt}`
                    })
                }
            })
        }
    });
}