// @flow

import * as Sequelize from "sequelize";

const model = require('./model.js');
const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

const Op = Sequelize.Op;

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

app.post("/news/article", (req, res) => {
    console.log("POST-request received from client");
    return model.ArticleModel.create({
        caption: req.body.caption,
        content: req.body.content,
        imageUrl: ((req.body.imageUrl != null && req.body.imageUrl !== '') ? req.body.imageUrl : null),
        categoryId: req.body.categoryId,
        priority: req.body.priority
    })
                .then(res.sendStatus(201))
                .catch(error => console.log(error));
});

app.get("/news/category/:categoryId", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll({
        where: {
            categoryId: req.params.categoryId
        },
        order: [['createdAt', 'DESC']]
    }).then(article => res.send(article));
});

app.get("/news/categories", (req, res) => {
    console.log("GET-request received from client");
    return model.CategoryModel.findAll().then(category => res.send(category));
});

app.get("/news/article/:id", (req, res) => {
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

app.put("/news/article/:id", (req, res) => {
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
                .then(res.sendStatus(204))
                .catch(error => console.error(error));
});

app.delete("/news/article/:id", (req, res) => {
    console.log("DELETE-request received from client");
    return model.ArticleModel.destroy({where: {id: req.body.id}})
                .then(res.sendStatus(204))
                .catch(error => console.error(error));
});

app.get("/news/first", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll({order: [['createdAt', 'DESC']], limit: 5})
                .then(articles => res.send(articles))
                .catch(error => console.error(error));
});

app.get("/news/search/:searchText", (req, res) => {
    console.log("GET-request received from client");
    return model.ArticleModel.findAll({
        where: {[Op.or]: [{caption: {[Op.like]: `%${req.params.searchText}%`}}, {content: {[Op.like]: `%${req.params.searchText}%`}}]},
        order: [['createdAt', 'DESC']]
    })
                .then(article => res.send(article))
                .catch(error => console.error(error));
});

app.get("/news/comments/:id", (req, res) => {
    console.log("GET-request received from client");
    return model.CommentModel.findAll({
        where: {articleId: req.params.id},
        order: [['createdAt', 'DESC']]
    })
                .then(comments => res.send(comments))
                .catch(error => console.error(error));
});

app.post("/news/comments", (req, res) => {
    console.log("POST-request received from client");
    return model.CommentModel.create({
        user: req.body.commenter,
        articleId: req.body.articleId,
        text: req.body.text
    })
                .then(res.sendStatus(201))
                .catch(error => console.log(error));
});

var server = app.listen(4000);