exports.getFriendsController = (req, res) => {
    const db = require("../server");
    
    let route = req.body.profileRoute;

    db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND Relationship = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND Relationship = ?', [route, 'Accepted', route, 'Accepted'], (err, data, fields) => {

        // if at least 1 user exists
        if (data[0]) {
            let friendsList = [];
            for (const key in data) {
                if (data[key].RequesterID == route) {
                    friendsList.push(`${data[key].RequesteeID}`);
                } else {
                    friendsList.push(`${data[key].RequesterID}`);
                }
            }

            res.json({
                success: true,
                friendsList: [friendsList]
            })
        } else {
            res.json({
                success: false,
                msg:'An error occurred.'
            })
        }
    });
}