exports.getTagsController = (req, res) => {
    const db = require("../server");
    let sql = "SELECT tag FROM Tags"
    let filter = "";
    if (req.body.filter != null && req.body.filter.length > 0) {
        sql += " WHERE tag in "
        filter += "(";
        for (let i = 0; i < req.body.filter.length; i++) {
            if (i == req.body.filter.length - 1) {
                filter +=  "\"" + req.body.filter[i] + "\")";
            } else {
                filter += "\"" + req.body.filter[i] + "\", ";
            }
        }
        sql += filter;
    }
    console.log(filter);
    console.log(sql);
    db.query(sql, (err, data) => {
        console.log(data);
        if (data[0]) {
            let tags = [];
            for (const key in data) {
                tags.push(`${data[key].tag}`)
            }
            res.json({
                success: true,
                tags: tags
            })
        } else {
            res.json({
                success:false,
                msg:'An error occurred.'
            })
        }
    })
}