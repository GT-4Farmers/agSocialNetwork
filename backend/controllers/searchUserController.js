exports.searchUserController = (req, res) => {
    const db = require("../server");
    
    let userToSearch = (req.body.userToSearch === "" ? "" : '%' + req.body.userToSearch + '%');
    // console.log("userToSearch:",userToSearch);

    db.query('SELECT * FROM `Users` WHERE (LOWER(`firstName`) LIKE LOWER(?)) OR (LOWER(`lastName`) LIKE LOWER(?)) LIMIT 5', [userToSearch, userToSearch], (err, data, fields) => {

        // if at least 1 user exists
        if (data[0]) {
            let users = [];
            for (const key in data) {
                users.push(`${data[key].firstName} ${data[key].lastName}`);
            }

            res.json({
                success: true,
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