const express = require("express");
const app = express();

const mysql = require('mysql');
const cors = require("cors");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const aws = require('aws-sdk');

const db = mysql.createConnection({
    host: 'haystackdb.cwuhnsyt464r.us-east-1.rds.amazonaws.com',
    user: 'hayderson',
    password: 'shellhb3311',
    database: 'haystackdb'
});

db.connect(function(err) {
    if (err) {
        console.log('Connection to DB failed')
        throw err;
        return false;
    }
    console.log('Connected to HaystackDB!')
});

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT"]
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({
    expiration: (60 * 60 * 24 * 60),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: 'userCookietv254gt2grwg43w',
    secret: '69g968ewr8h2397834h78vhs',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (60 * 60 * 24 * 60),
        httpOnly: false
    }
}));

app.use("/home/", require("./routes/homeRoute"));
app.use("/profile/", require("./routes/profileRoute"));
app.use("/register/", require("./routes/registerRoute"));
app.use("/login/", require("./routes/loginRoute"));
app.use("/logout/", require("./routes/logoutRoute"));
app.use("/searchUser/", require("./routes/searchUserRoute"));
app.use("/forums/", require("./routes/forumRoute"));
app.use("/settings/", require("./routes/settingsRoute"));

app.listen(3001, () => {
    console.log("Backend running on port 3001");
})

module.exports = db