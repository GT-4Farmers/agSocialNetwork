exports.getDiscussionsController = (req, res) => {
    const db = require("../server");
    
    let signedInUser = req.session.userID;
    let tags = req.body.displayedTags;

    let sql = "SELECT * FROM Discussions INNER JOIN Users ON Discussions.createdBy = Users.uuid WHERE (";
    for (let i = 0; i < tags.length; i++) {
        sql += "tag_1 = \"" + tags[i] + "\" OR tag_2 = \"" + tags[i] + "\" OR tag_3 = \"" + tags[i] + "\")";
        if (i == tags.length - 1) {
            break;
        }
        sql += " OR (";
    }
    sql += " ORDER BY createdAt DESC"

    db.query(sql, (err, data, fields) => {
        if (data[0]) {
            let discussions = [];
            let timestamps = [];
            let discussionIDs = [];
            let authors = [];
            let authorNames = [];

            for (const key in data) {
                if (discussionIDs[discussionIDs.length - 1] !== data[key].discussionID) {
                    discussionIDs.push(`${data[key].discussionID}`);
                    timestamps.push(`${data[key].createdAt}`);
                    discussions.push(`${data[key].content}`);
                    authors.push(`${data[key].createdBy}`);
                    authorNames.push(`${data[key].firstName} ${data[key].lastName}`)
                }
            }
            res.json({
                discussions: discussions,
                timestamps: timestamps,
                discussionIDs: discussionIDs,
                authors: authors,
                authorNames: authorNames
            })
        } else {
            res.json({
                success: false,
                msg:'An error occurred while getting discussions.',
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