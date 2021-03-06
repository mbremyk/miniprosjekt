// @flow

import axios from "axios";
import React from "react";
import {sharedComponentData} from "react-simplified";

let host = "http://localhost:4000";

export class Article
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
        return axios.get(host + '/news/').then(response => {
            this.setArticles(response.data);
            return response.data;
        });
    }

    getArticlesByCategory(category: number)
    {
        return axios.get(host + `/news/category/${category}/`).then(response => {
            this.setArticles(response.data);
            return response.data;
        });
    }

    getArticlesById(id: number)
    {
        return axios.get(host + `/news/article/${id}/`).then(response => {
            return response.data;
        });
    }

    postArticle(article: Article)
    {
        return axios.post(host + `/news/article`, article).then(response => {
            return response.data;
        })
    }

    updateArticle(article: Article)
    {
        return axios.put(host + `/news/article/${article.id}`, article)
    }

    deleteArticle(id: number)
    {
        return axios.delete(host + `/news/article/${id}`, {data: {id: id}}).then(response => {
            return response.data;
        })
    }

    getFirstArticles(num: number)
    {
        return axios.get(host + `/news/first`).then(response => response.data);
    }

    getArticlesLike(searchText: string)
    {
        return axios.get(host + `/news/search/${searchText}`).then(response => response.data);
    }
}

export class Category
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
        return axios.get(host + '/news/categories').then(response => {
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
    commenter: string;
    articleId: number;
    text: string;

    constructor(articleId: number, commenter: string, text: string)
    {
        this.commenter = commenter;
        this.articleId = articleId;
        this.text = text;
    }
}

export class CommentStore
{
    comments: Comment[] = [];

    setComments(props: Comment[])
    {
        this.comments = props;
    }

    getComments(articleId: number)
    {
        return axios.get(host + `/news/comments/${articleId}`).then(response => {
            return response.data;
        });
    }

    postComment(comment: Comment)
    {
        return axios.post(host + `/news/comments`, comment).then(response => {
            return response.data;
        })
    }
}

export let articleStore = sharedComponentData(new ArticleStore());
export let categoryStore = sharedComponentData(new CategoryStore());
export let commentStore = sharedComponentData(new CommentStore());