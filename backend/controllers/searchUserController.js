exports.searchUserController = (req, res) => {
    const db = require("../server");
    
    let userToSearch = (req.body.userToSearch === "" ? "" : '%' + req.body.userToSearch + '%');

    db.query('SELECT * FROM `Users` WHERE ((LOWER(`firstName`) LIKE LOWER(?)) OR (LOWER(`lastName`) LIKE LOWER(?))) AND isPrivate = 0 LIMIT 10', [userToSearch, userToSearch], (err, data, fields) => {

        // if at least 1 user exists
        if (data[0]) {
            let users = [];
            let uniqueIds = [];
            for (const key in data) {
                users.push(`${data[key].firstName} ${data[key].lastName}`);
                uniqueIds.push(`${data[key].uuid}`);
            }

            res.json({
                success: true,
                uniqueIds: [uniqueIds],
                users: [users]
            })
        } else {
            res.json({
                success: false,
                msg:'An error occurred.'
            })
        }
    });
}