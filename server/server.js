// @flow

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
    return model.ArticleModel.findAll({order: [['createdAt', 'DESC']]}).then(article => res.send(article));
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
        },
        order: [['createdAt', 'DESC']]
    }).then(article => res.send(article));
});

app.get("/categories", (req, res) => {
    console.log("GET-request received from client");
    return model.CategoryModel.findAll({
        order: [['createdAt', 'DESC']]
    }).then(category => res.send(category));
});

app.get("/news/:id", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll({
        where: {
            id: req.params.id
        },
        order: [['createdAt', 'DESC']]
    })
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
    }, {
        where: {
            id: req.body.id
        }
    })
                .then(res.send(204))
                .catch(res.send(404))
                .catch(error => console.error(error));
});

app.delete("/news/:id", (req, res) => {
    console.log("DELETE-request received from clien");
    return model.ArticleModel.destroy({where: {id: req.params.id}})
                .then(res.send(204))
                .catch(res.send(404))
                .catch(error => console.error(error));
});

var server = app.listen(4000);