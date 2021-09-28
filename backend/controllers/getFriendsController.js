exports.getFriendsController = (req, res) => {
    const db = require("../server");
    
    let route = req.body.profileRoute;
    // console.log("userToSearch:",userToSearch);

    db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND Relationship = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND Relationship = ?', [route, 'Accepted', route, 'Accepted'], (err, data, fields) => {

        // if at least 1 user exists
        if (data[0]) {
            let friendsList = [];
            for (const key in data) {
                friendsList.push(`${data[key].RequesterID}`);
            }
            console.log(friendsList)

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