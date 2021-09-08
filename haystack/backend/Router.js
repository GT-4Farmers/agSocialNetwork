const bcrypt = require('bcrypt');

const url = require('url');
const cors = require('cors');


class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.signUp(app, db);
    }

    signUp(app, db) {
        app.post('/signUp', (req, res) => {
            var email = req.body.email;

            let cols = [email];

            // Check users table to see if email is already in use
            db.query(`SELECT * FROM Users WHERE email = '${email}' LIMIT 1`, cols, (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occured, please try again.'
                    })
                    return;
                }

                // if found 1 user
                if (data && data.length === 1) {
                    res.json({
                        success: false,
                        msg: "A user already exists with that email address."
                    })
                    return;
                } else { // if email is not found a new user can be made
                    var firstName = req.body.firstName;
                    var lastName = req.body.lastName;
                    var password = bcrypt.hashSync(req.body.password, 9);
                
                    var sql = `INSERT INTO Users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
                    var cols = [firstName, lastName, email, password];
                    db.query(sql, cols, function (err, data) {
                        if (err) {
                            res.json({
                                success: false,
                                msg: 'An error occured, please try again.'
                            })
                            return;
                        } else {
                            res.json({
                                success: true,
                                email: email,
                                firstName: firstName,
                                lastName: lastName
                            })
                            return;
                        }
                    });
                }
            });
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

    editProfile(app, db) {

        app.post('/editProfile', (req, res) => {
            
            //make sure the id exists in the profiles database
            var email = req.session.userID

            var check_cols = [email]
            var check_sql = 'SELECT * FROM Profiles WHERE email = ? LIMIT 1'
            db.query(check_sql, check_cols, (err, data) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occurred, please try again.'
                    })
                    return;
                } else if (!data || data.length !== 1) {
                    res.json({
                        success: false,
                        msg: 'The user does not exist in the profiles table.'
                    })
                }
            })
            
            //update the profile
            var bio = req.body.bio
            var birthdate = req.body.birthdate
            var location = req.body.location
            var phone = req.body.phone

            var update_sql = 'UPDATE Profiles SET bio = ?, birthdate = ?, location = ?, phone = ? WHERE email = ?'
            var update_cols = [bio, birthdate, location, phone, email]
            db.query(update_sql, update_cols, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "An error occurred, please try again."
                    })
                }
            })
        })

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