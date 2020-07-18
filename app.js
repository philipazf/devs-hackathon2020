const express = require("express");
const bodyParser = require("body-parser");
const db = require(__dirname + "/connection");

const app = express();

let nextId = 0;
let currentId = 0;
let nextSkillId = 0;
let userSkillArray = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/signup", function (req, res) {
    res.render("signup");

    let sqlQuery = "SELECT MAX(id) AS id FROM appdatabase.users";

    db.query(sqlQuery, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            nextId = result[0].id + 1;
        }
    });
});

app.post("/signup", function (req, res) {
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;

    let sql = "INSERT INTO appdatabase.users VALUES (" + nextId + ", \"" + name + "\", \"" + String(email) + "\", \"" + password + "\")";
    let userTaskTable = "CREATE TABLE appdatabase.user" + nextId + " (id INT NOT NULL, name TEXT, description TEXT, PRIMARY KEY (id) )";

    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            db.query(userTaskTable, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    currentId = nextId;
                    let sql = "SELECT * FROM appdatabase.users where id = " + currentId;
                    db.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            let addVal = "INSERT INTO appdatabase.user" + currentId + " VALUES (" + 0 + ", \"temp\", \"temp\")";
                            db.query(addVal, function (err, result) {
                                if (err) {
                                    throw err;
                                }
                            });
                            res.redirect("/user/" + currentId);
                        }
                    });
                }
            });
        }
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/user/:id", function (req, res) {
    if(req.params.id == currentId) {
        res.render("profile", {userSkills: userSkillArray});

    let sqlQueryMax = "SELECT MAX(id) AS id FROM appdatabase.user" + currentId;

    db.query(sqlQueryMax, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            nextSkillId = result[0].id + 1;
            let getUserSkills = "SELECT * FROM appdatabase.user" + currentId;
            userSkillArray = [];
            db.query(getUserSkills, function (err, result) {
                for(let i = 1; i < result.length; i++) {
                    userSkillArray.push(result[i].name);
                    // res.render("profile", {userSkills: userSkillArray});
                }
                console.log(userSkillArray);
            });
        }
    });

    }
    else {
        res.send("Login Error");
    }
});

app.post("/addskill",function(req, res) {
    let skillname = req.body.skillname;
    let skilldescription = "lregfnekljgn fejgnerkjwlgn ewrskillgnerljk";

    let sqlQuery = "INSERT INTO appdatabase.user" + currentId + " VALUES (" + nextSkillId + ", \"" + skillname + "\", \"" + skilldescription + "\")";

    db.query(sqlQuery, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.redirect("/user/" + currentId);
        }
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
