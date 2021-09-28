exports.sendFriendRequestController = (req, res) => {
    const db = require("../server");
    let requester = req.session.userID;
    let requestee = "";

    db.query('SELECT * FROM Friends WHERE RequesterID = ? AND RequesteeID = ?',
    [requester, requestee], (err, data, fields) => {
        console.log(data[0]);
        
        if (err) {
            res.json({
                success: false,
                msg: 'An error occured, please try again.'
            })
            return;
        }
        
        // if (data) {
        //     db.query(`INSERT INTO Friends (RequesterID, RequesteeID, Relationship) VALUES (?, ?, ?)`,
        //     [requester, requestee, "Pending"], (err) => {
        //         if (err) {
        //             res.json({
        //                 success: false,
        //                 msg: 'An error has occurred.'
        //             })
        //             return;
        //         } else {
        //             res.json({
        //                 success: true
        //             })
        //             return;
        //         }
        //     })
        // }
    });
}