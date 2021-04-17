const bcrypt = require('bcrypt');

let pswrd = bcrypt.hashSync('asdf123', 9);
console.log(pswrd)