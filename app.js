const express = require("express");
const bodyParser = require("body-parser");
const db = require(__dirname + "/connection");

const app = express();

let nextId = 0;
let currentId = 0;
let nextSkillId = 0;
let userSkillArray = [];
let email;
let name;
let password;
let matchNames = ["Sahil", "Saad", "Sreeniketh", "Harpreet"];
let skills = ["Skills: Piano, French", "Skills: Guitar, Banjo", "Skills: Violen, Mathematics", "Skills: Python, Cooking"];
let showMatches = [false, false, false, false];
let myskills = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index");
    userSkillArray = [];
    myskills = [];
    showMatches = [false, false, false, false];
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
    email = req.body.email;
    name = req.body.name;
    password = req.body.password;

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
        res.render("profile", {
            userSkills: userSkillArray, 
            userName: name, 
            userEmail: email, 
            showMatches1: showMatches[0],
            showMatches2: showMatches[1],
            showMatches3: showMatches[2],
            showMatches4: showMatches[3],
            matchNames: matchNames,
            skillsList: skills,
            myskills: myskills
        });

    let sqlQueryMax = "SELECT MAX(id) AS id FROM appdatabase.user" + currentId;

    db.query(sqlQueryMax, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            nextSkillId = result[0].id + 1;
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

            let getUserSkills = "SELECT * FROM appdatabase.user" + currentId;
            userSkillArray = [];
            db.query(getUserSkills, function (err, result) {
                for(let i = 1; i < result.length; i++) {
                    userSkillArray.push(result[i].name);
                }
                if(userSkillArray.length == 1) {
                    showMatches[0] = true;
                }
                else if(userSkillArray.length == 2) {
                    showMatches[1] = true;
                }
                else if(userSkillArray.length == 3) {
                    showMatches[2] = true;
                }
                else {
                    showMatches[3] = true;
                }
                console.log(userSkillArray);
            });

            res.redirect("/user/" + currentId);
        }
    });
});

app.post("/removeskill", function(req, res) {
    userSkillArray.pop();
    res.redirect("/user/" + currentId);
});

app.post("/addmyskill", function(req, res) {
    let myskillname = req.body.myskillname;
    myskills.push(myskillname);
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
