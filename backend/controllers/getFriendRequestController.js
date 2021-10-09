exports.getFriendRequestController = (req, res) => {
    const db = require("../server");
    
    let uid = req.session.userID;

    db.query(`select firstName, lastName, RequesterID, RequesteeID, Relationship from Friends inner join Users on Friends.RequesterID = Users.uuid where RequesteeID = ? and Relationship = 'Pending'`, uid, (err, data, fields) => {

        // if at least 1 user exists
        if (data[0]) {
            let incomingRequests = [];
            let incomingRequestsRoutes = [];
            for (const key in data) {
                incomingRequests.push(`${data[0].firstName} ${data[0].lastName}`);
                incomingRequestsRoutes.push(`${data[0].RequesterID}`);
            }
            res.json({
                success: true,
                incomingRequests: [incomingRequests],
                incomingRequestsRoutes: [incomingRequestsRoutes]
            })
        } else {
            let incomingRequests = [];
            let incomingRequestsRoutes = [];
            res.json({
                incomingRequests: [incomingRequests],
                incomingRequestsRoutes: [incomingRequestsRoutes]
            })
        }
    });
}