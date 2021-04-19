const bcrypt = require('bcrypt');

class Router {

	constructor(app, db) {
		this.login(app, db);
		this.logout(app, db);
		this.isLoggedIn(app, db);
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
							req.session.userID = data[0].idUsers;

							res.json({
								success: true,
								email: data[0].email
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
				db.query('SELECT * FROM Users WHERE idUsers = ? LIMIT 1', cols, (err, data, fields) => {
					if (data && data.length === 1) {
						res.json({
							success: true,
							email: data[0].email
						})
						return true;
					} else {
						res.json({
							success: false
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