exports.createDiscussionController = (req, res) => {
    const db = require("../server");
    const uuid = require("uuid")
    
    let content = req.body.content;
    let user = req.session.userID;
    let tag1 = req.body.tags[0];
    let tag2 = req.body.tags[1] ? req.body.tags[1] : null;
    let tag3 = req.body.tags[2] ? req.body.tags[2] : null;
    let discussion_id = uuid.v4();
    console.log("discussion_id: ", discussion_id);
    console.log("user: ", user);
    console.log("content: ", content);
    console.log("tag1: ", tag1);
    console.log("tag2: ", tag2);
    console.log("tag3: ", tag3);

    var sql = `INSERT INTO Discussions (discussionID, createdBy, content, tag_1, tag_2, tag_3) VALUES (?, ?, ?, ?, ?, ?)`;
    var input = [discussion_id, user, content, tag1, tag2, tag3];

    db.query(sql, input, (err, data) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while creating discussion.'
            })
            return;
        } else {
            res.json({
                success: true,
                msg:'Successfully created discussion.'
            })
            return;  
        }    
    })  
}