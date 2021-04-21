const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

const db = mysql.createConnection({
    host: 'haystackdb.cwuhnsyt464r.us-east-1.rds.amazonaws.com',
    user: 'hayderson',
    password: 'shellhb3311',
    database: 'haystackdb'
});

db.connect(function(err) {
    if (err) {
        console.log('DB error')
        throw err;
        return false;
    }
    console.log('Connected!')
});

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: '4h873fhqnruiof33n3h8743q',
    secret: '69g96h8ewr8h2397834h78vh',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, db);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);