import axios from "axios";
import React from "react";

let _localhost = "http://localhost:4000";

class Article
{
    caption: string;
    writerId: number;
    id: number;
    createdAt: Date;
    content: string;
    imageUrl: string;
    updatedAt: Date;

    constructor(caption: string, writerId: number, id: number, createdAt: Date, text: string, updatedAt: Date, imageUrl?: string)
    {
        this.caption = caption;
        this.writerId = writerId;
        this.id = id;
        this.createdAt = createdAt;
        this.content = text;
        this.imageUrl = imageUrl;
        this.updatedAt = updatedAt;
    }
}

export class ArticleStore
{
    articles: Article[] = [];

    setArticles(props: Article[])
    {
        this.articles = props;
    }

    getArticles()
    {
        return axios.get(_localhost + '/news/').then(response => {
            this.setArticles(response.data);
            return response.data;
        });
    }

    getArticlesByCategory(category: number)
    {
        return axios.get(_localhost + `/category/${category}/`).then(response => {
            this.setArticles(response.data);
            return response.data;
        });
    }

    getArticlesById(id:number)
    {
        return axios.get(_localhost + `/news/${id}/`).then(response => {
            return response.data;
        });
    }

    postArticle(article)
    {
        return axios.post(_localhost + `/news`, article).then(response => {
            return response.data;
        })
    }
}

class Category
{
    categoryId: number;
    categoryName: string;
}

export class CategoryStore
{
    categories: Category[] = [];

    setCategories(props: Category[])
    {
        this.categories = props;
    }

    getCategories()
    {
        return axios.get(_localhost + '/categories').then(response => {
            return response.data;
        });
    }
}

export class User
{
    name: string;
    link: string;

    constructor(name: string, link: string)
    {
        this.name = name;
        this.link = link;
    }
}

export class Comment
{
    commenter: User;
    id: number;
    static nextId: number = 0;
    text: string;

    constructor(commenter: User, text: string)
    {
        this.commenter = commenter;
        this.id = Comment.nextId++;
        this.text = text;
    }
}