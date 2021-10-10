exports.uuidIsUserOrFriendController = (req, res) => { //Is the currently logged in user the same as or a friend of the passed in uuid?
    const db = require("../server")

    const user_id = req.session.userID
    if (!user_id) {
        res.json({
            success: false,
            msg: "No current active session"
        })
    }
    const test_id = req.body.profileRoute

    const isUser = user_id === test_id

    if (!isUser) {
        db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND RequesteeID = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND RequesterID = ?', [user_id, test_id, user_id, test_id], (err, data, fields) => {
            if (data[0]) {
                db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND RequesteeID = ? AND Relationship = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND RequesterID = ? AND Relationship = ?', [user_id, test_id, 'Accepted', user_id, test_id, 'Accepted'], (err, data, fields) => {
                    if (data[0]) {
                        res.json({
                            success: true,
                            isUser: false,
                            isFriend: true,
                            isPending: false
                        })
                    } else {
                        res.json({
                            success: true,
                            isUser: false,
                            isFriend: false,
                            isPending: true
                        })
                    }
                })
            } else {
                res.json({
                    success: true,
                    isUser: false,
                    isFriend: false,
                    isPending: false
                })
            }
        })
    } else {
        res.json({
            success: true,
            isUser: true,
            isFriend: false,
            isPending: false
        })
    }

}