exports.friendRequestController = (req, res) => { //Is the currently logged in user the same as or a friend of the passed in uuid?
    const db = require("../server")

    const target_id = req.body.profileRoute
    const mode = req.body.mode
    const user_id = req.session.userID
    const isUser = user_id === target_id
    if (!user_id) {
        res.json({
            success: false,
            msg: "No current active session"
        })
    } else if (mode !== 'request' && mode !== 'accept' && mode !== 'reject') {
        res.json({
            success: false,
            msg: 'Invalid friend mode'
        })
    } else if (isUser) {
        res.json({
            success: false,
            msg: "Cannot send friend request to own profile"
        })
    } else if (mode === 'request') {
        db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND RequesteeID = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND RequesterID = ?', [user_id, target_id, user_id, target_id], (err, data, fields) => {
            if (data[0]) {
                res.json({
                    success: false,
                    msg: "Entry already exists for this pair"
                })
            } else {
                db.query('INSERT INTO haystackdb.Friends (RequesterID, RequesteeID, Relationship) VALUES (?, ?, ?)', [user_id, target_id, 'Pending'], (err, data, fields) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: err
                        })
                    } else {
                        res.json({
                            success: true
                        })
                    }
                })
            }
        })
    } else if (mode === 'accept') {
        db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND RequesteeID = ? AND Relationship = ?', [target_id, user_id, 'Pending'], (err, data, fields) => {
            if (!data[0]) {
                res.json({
                    success: false,
                    msg: "No pending friend request from target"
                })
            } else {
                db.query('UPDATE haystackdb.Friends SET Relationship = ? WHERE RequesterID = ? AND RequesteeID = ?', ['Accepted', target_id, user_id], (err, data, fields) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: err
                        })
                    } else {
                        res.json({
                            success: true
                        })
                    }
                })
            }
        })
    } else if (mode === 'reject') {
        db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND RequesteeID = ? AND Relationship = ?', [target_id, user_id, 'Pending'], (err, data, fields) => {
            if (!data[0]) {
                res.json({
                    success: false,
                    msg: "No pending friend request from target"
                })
            } else {
                db.query('DELETE FROM haystackdb.Friends WHERE RequesterID = ? AND RequesteeID = ?', [target_id, user_id], (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: err
                    })
                } else {
                    res.json({
                        success: true
                    })
                }
            })
        }
    })
} 
// db.query('UPDATE haystackdb.Friends SET Relationship = ? WHERE RequesterID = ? AND RequesteeID = ?', ['Blocked', target_id, user_id], (err, data, fields) => {
}
