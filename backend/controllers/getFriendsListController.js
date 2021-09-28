exports.getFriendsListController = (req, res) => {
    const db = require("../server");
    
    let friendsUuids = [];
    for(let j = 0; j < (req.body.friendsUuids).length; j++) {
        friendsUuids.push(req.body.friendsUuids[j]);
    }
    let friendsList = [];
    for(let i=0; i < friendsUuids.length; i++) {
        db.query('SELECT * FROM haystackdb.Users WHERE uuid = ?', [friendsUuids[i]], (err, data, fields) => {
            // if at least 1 user exists
            if (data[0]) {
                friendsList.push(`${data[0].firstName} ${data[0].lastName}`);
                if (i == friendsUuids.length - 1) {
                    res.json({
                        success: true,
                        friendsList: [friendsList]
                    })
                }
            } else {
                res.json({
                    success: false,
                    msg:'An error occurred.'
                })
            }
        });
    }
}