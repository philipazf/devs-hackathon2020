const express = require("express");
const bodyParser = require("body-parser");
const db = require(__dirname + "/connection");

const app = express();

let nextId = 0;
let currentId = 0;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/signup", function(req, res) {
    res.render("signup");

    let sqlQuery = "SELECT MAX(id) AS id FROM appdatabase.users";

    db.query(sqlQuery, function(err, result) {
        if(err) {
            throw err;
        }
        else {
            nextId = result[0].id + 1;
        }
    });
});

app.post("/signup", function(req, res) {
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;

    let sql = "INSERT INTO appdatabase.users VALUES (" + nextId + ", \"" + name + "\", \"" + String(email) + "\", \"" + password + "\", 0)";
    let userTaskTable = "CREATE TABLE appdatabase.user" + nextId + " (id INT NOT NULL, name TEXT, description TEXT, PRIMARY KEY (id) )";

    db.query(sql, function(err, result) {
        if(err) {
            throw err;
        }
        else {
            db.query(userTaskTable, function(err, result) {
                if(err) {
                    throw err;
                }
                else {
                    currentId = nextId;
                    res.redirect("/user/" + currentId);
                }
            });
        }
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/user/:id", function(req, res) {
    let sql = "SELECT * FROM appdatabase.users where id = " + req.params.id;
    db.query(sql, function(err, result) {
        if(err) {
            throw err;
        }
        else if(req.params.id == currentId) {
            res.render("profile", {userName: result[0].name, userPoints: result[0].points});
        }
        else {
            res.send("Login Error");
        }
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
