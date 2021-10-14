exports.getCompleteFriendsListController = (req, res) => {
    const db = require("../server");

    let user = req.session.userID;
    let listOfUuid = [];
    let friendName = [];
    let friendUuid = [];

    db.query('SELECT * FROM Friends WHERE RequesterID = ? AND Relationship = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND Relationship = ?', [user, 'Accepted', user, 'Accepted'], (err, data, fields) => {
        // if at least 1 user exists
        if (data) {
            for (const key in data) {
                if (data[key].RequesterID == user) {
                    listOfUuid.push(`${data[key].RequesteeID}`);
                } else {
                    listOfUuid.push(`${data[key].RequesterID}`);
                }
            }

            db.query('SELECT * FROM haystackdb.Users WHERE uuid in (?)', [listOfUuid], (err, data, fields) => {

                if (data) {
                    for (const key in data) {
                        friendName.push(`${data[key].firstName} ${data[key].lastName}`);
                        friendUuid.push(`${data[key].uuid}`);
                    }

                    res.json({
                        success: true,
                        friendUuid: friendUuid,
                        friendName: friendName
                    })
                } else {
                    res.json({
                        success: false,
                        msg: "An error occurred retrieving friends' names"
                    })
                }
            })
        } else {
            res.json({
                success: false,
                msg:"An error occurred retrieving friends' uuids."
            })
        }
    });
}