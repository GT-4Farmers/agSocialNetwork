exports.getFriendsController = (req, res) => {
    const db = require("../server");

    let route = req.body.profileRoute;

    db.query('SELECT * FROM haystackdb.Friends WHERE RequesterID = ? AND Relationship = ? UNION SELECT * FROM haystackdb.Friends WHERE RequesteeID = ? AND Relationship = ?', [route, 'Accepted', route, 'Accepted'], (err, data, fields) => {

        // if at least 1 user exists
        if (data[0]) {
            let friendsListRoutes = [];
            for (const key in data) {
                if (data[key].RequesterID == route) {
                    friendsListRoutes.push(`${data[key].RequesteeID}`);
                } else {
                    friendsListRoutes.push(`${data[key].RequesterID}`);
                }
            }

            let sql = 'SELECT * FROM ' +
                '(SELECT * FROM haystackdb.Users ' +
                'WHERE uuid IN (?) ORDER BY firstName ASC) as A ' +
                'join (SELECT * ' +
                'FROM haystackdb.Friends ' +
                'WHERE RequesterID = ? AND Relationship = ? ' +
                'UNION SELECT * ' +
                'FROM haystackdb.Friends ' +
                'WHERE RequesteeID = ? AND Relationship = ?) as B ' +
                'ON A.uuid = B.RequesterID or A.uuid = B.RequesteeID ' +
                'ORDER BY firstName ';

            db.query(sql, [friendsListRoutes, route, 'Accepted', route, 'Accepted'], (err, data, fields) => {
                if (data[0]) {
                    let friendsList = [];
                    let orderedFriendsListRoutes = [];
                    for (const key in data) {
                        friendsList.push(`${data[key].firstName} ${data[key].lastName}`)
                        if (data[key].uuid === data[key].RequesterID) {
                            orderedFriendsListRoutes.push(`${data[key].RequesterID}`)
                        } else {
                            orderedFriendsListRoutes.push(`${data[key].RequesteeID}`)
                        }
                    }
                    res.json({
                        success: true,
                        friendsList: [friendsList],
                        friendsListRoute: [orderedFriendsListRoutes]
                    })
                } else {
                    res.json({
                        success: false,
                        msg: 'An error occurred.'
                    })
                }
            }
            )
        } else {
            res.json({
                success: false,
                msg: 'An error occurred.'
            })
        }
    });
}