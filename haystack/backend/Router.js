const bcrypt = require('bcrypt');

class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.signUp(app, db);
    }

    signUp(app, db) {
        app.post('/signUp', (req, res) => {
            
            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var email = req.body.email;
            var password = bcrypt.hashSync(req.body.password, 9);
        
            var sql = `INSERT INTO Users (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${password}')`;
            var cols = [firstName, lastName, email, password];
            db.query(sql, cols, function (err, data) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occured, please try again.'
                    })
                } else {
                    res.json({
                        success: true,
                        msg: 'ayy'
                    })
                }
                
            })
        })
    }

    login(app, db) {

        app.post('/login', (req, res) => {
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
                            req.session.userID = data[0].email;

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
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }
            });
        });
    }

    logout(app, db) {

        app.post('/logout', (req, res) => {
            if (req.session.userID) {
                req.session.destroy();
                res.json({
                    success: true
                })
                res.end();
                return true;
            } else {
                res.json({
                    success: false
                })

                return false;
            }
        })
    }

    isLoggedIn(app, db) {
        app.post('/isLoggedIn', (req, res) => {
            if (req.session.userID) {
                let cols = [req.session.userID];
                db.query('SELECT * FROM Users WHERE email = ? LIMIT 1', cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            email: data[0].email,
                            firstName: data[0].firstName,
                            lastName: data[0].lastName
                        })
                        return true;
                    } else {
                        res.json({
                            success:false
                        })
                    }
                });
            } else {
                res.json({
                    success: false
                })
            }
        });
    }
}

module.exports = Router;