const model = require('./model.js');
const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(bodyParser.json()); // for å tolke JSON
app.use(cors());

// Connect to mysql-database


/*const pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "magbre",
    password: "xUcddGdB",
    database: "magbre",
    debug: false
});*/

app.get("/news", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll().then(article => res.send(article));
});

app.post("/news", (req, res) => {
    console.log("POST-request received from client");
    return model.ArticleModel.create({
        caption: req.body.caption,
        content: req.body.content,
        imageUrl: ((req.body.imageUrl != null && req.body.imageUrl !== '') ? req.body.imageUrl : null),
        categoryId: req.body.categoryId,
        priority: req.body.priority
    });
});

app.get("/category/:categoryId", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll({
        where: {
            categoryId: req.params.categoryId
        }
    }).then(article => res.send(article));
});

/*app.get("/news/category/:categoryId", (req, res) => {
    console.log("GET-request received from client");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Error during connection");
            res.json({ "error": "error during connection" });
        } else {
            console.log("Database connection aquired");
            var query = "SELECT * FROM news";
            if(req.params.category != -1 || req.params.priority != -1)
            {
                query += " WHERE";
                query += req.params.category != -1 ? (" categoryId = ?" + (req.params.priority != -1 ? (" AND priority = ?") : (""))) : (req.params.priority != -1 ? (" priority = ?") : (""));
                console.log(query);
            }
            connection.query(
                query,
                req.params.category != -1 ? ((req.params.priority != -1 ? [req.params.category, req.params.priority] : [req.params.category])) : (req.params.priority != -1 ? [req.params.priority] : []),
                (err, rows) => {
                    connection.release();
                    if(err) {
                        console.log(err);
                        res.json({"error":"error during query"})
                    } else {
                        console.log(rows);
                        res.json(rows);
                    }
                }
            );
        }
    });
});*/

app.get("/categories", (req, res) => {
    console.log("GET-request received from client");
    return model.CategoryModel.findAll().then(category => res.send(category));
});

app.get("/news/:id", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll({where: {id: req.params.id}})
                .then(article => res.send(article))
                .catch(error => console.error(error));
});

app.put("/news/:id", (req, res) => {
    console.log("PUT-request received from client");
    return model.ArticleModel.update({
        caption: req.body.caption,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        priority: req.body.priority
    },{
        where: {
            id: req.body.id
        }
    })
});

var server = app.listen(4000);