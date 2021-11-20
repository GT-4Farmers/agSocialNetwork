exports.getNamesController = (req, res) => {
    const db = require("../server");
    let same = req.body.profileRoute;
    let sql = "SELECT uuid, firstName, lastName FROM Users WHERE uuid in ("
    for (let i = 0; i < same.length; i++) {
        sql += "\"" + same[i] + "\""
        if (i == same.length - 1) {
            break;
        }
        sql += ", ";
    }
    sql += ")";

    db.query(sql, (err, data) => {
        if (data) {
            let out = new Map();
            for (key in data) {
                out.set(data[key].uuid, `${data[key].firstName} ${data[key].lastName}`)
            }
            let temp = JSON.stringify([...out]);
            res.json({
                nameMap: temp
            })
        } else {
            res.json({
                success:false,
                msg:'An error occurred.'
            })
        }
    })
}