let mysql = require('mysql');

let con = mysql.createConnection({
  host: "haystack-starter.cgwmhwqegcm0.us-east-1.rds.amazonaws.com",
  user: "dwilson74",
  password: "juniordesign2021"
});

con.connect(function(err) {
  if (err) {
      return console.error('error: ' + err.message);
  }
  console.log("Connected!");
});

