exports.createTextPostController = (req, res) => {
    const db = require("../server");
    
    let content = req.body.content;
    let user = req.session.userID;

    var sql = `INSERT INTO Posts (createdBy, content) VALUES (?, ?)`;
    var input = [user, content];

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