exports.loginController = (req, res) => {
    const db = require("../server");
    const bcrypt = require("bcrypt");

    let email = req.body.email;
    let password = req.body.password;

    email = email.toLowerCase();

    if (email.length > 45 || password.length > 45) {
        res.json({
            success: false,
            msg: 'An error occured, please try again.'
        })
        return;
    }

    // Users table
    // select from email
    let cols = [email];
    db.query('SELECT * FROM Users WHERE email = ? LIMIT 1', cols, (err, data, fields) => {
        if (err) {
            res.json({
                success: false,
                msg: 'An error occured, please try again.'
            })
            return;
        }

        // if found 1 user
        if (data && data.length === 1) {
            bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
                if (verified) {
                    req.session.userID = data[0].uuid;
                    // console.log(req.session.userID);

                    res.json({
                        success:true,
                        email: data[0].email,
                        firstName: data[0].firstName,
                        lastName: data[0].lastName
                    })
                    return;
                } else {
                    res.json({
                        success: false,
                        msg: 'Invalid password'
                    })
                    return;
                }
            });
        } else {
            res.json({
                success: false,
                msg: 'User not found, please try again'
            })
            return;
        }
    });
}