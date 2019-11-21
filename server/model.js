const Sequelize = require('sequelize');
const credentials = require('./credentials.js');

let sequelize = process.env.CI ? new Sequelize("School", "root", "", {
    host: "mysql",
    dialect: "mysql"
}) : new Sequelize(credentials.Credentials.database, credentials.Credentials.username, credentials.Credentials.password, {
    host: credentials.Credentials.host,//process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
    dialect: credentials.Credentials.dialect
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export type Article = {
    id?: number,
    caption: string,
    content: string,
    uploadTime: Date,
    imageUrl: string,
    categoryId: number,
    priority: number
};

let ArticleModel: Class<Sequelize.Model<Article>> = sequelize.define('article', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    caption: Sequelize.STRING,
    content: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    categoryId: Sequelize.INTEGER,
    priority: Sequelize.INTEGER
}, {
    tableName: 'article'
});

export type Category = {
    categoryId: number,
    categoryName: string
}

let CategoryModel: Class<Sequelize.Model<Category>> = sequelize.define('category', {
    categoryId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    categoryName: Sequelize.STRING
}, {
    tableName: 'category'
});

let production = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV);

module.exports = {ArticleModel, CategoryModel};