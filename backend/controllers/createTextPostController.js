exports.createTextPostController = (req, res) => {
    const db = require("../server");
    const { v4: uuidv4 } = require('uuid');
    
    let content = req.body.content;
    let user = req.session.userID;
    let postID = uuidv4();
    let discussionID = req.body.discussionID

    // console.log(content);
    // console.log(user);
    // console.log(postID);

    var sql = `INSERT INTO Pages (DiscussionID, PagePostID, createdBy, content) VALUES (?, ?, ?, ?)`;
    var input = [discussionID, postID, user, content];

    db.query(sql, input, (err, data) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occurred while making post.'
            })
            return;
        } else {
            res.json({
                success: true,
                msg:'Successfully created post.'
            })
            return;
        }
    });
}