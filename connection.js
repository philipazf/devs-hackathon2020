const mysql = require("mysql");

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'appdatabase'
});

db.connect(function(err){
    if(err) {
        throw err;
    }
    else {
        console.log("MySql Connected...");
    }   
});

module.exports = db;