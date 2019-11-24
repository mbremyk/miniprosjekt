import * as React from 'react';
import {shallow} from "enzyme";
import {TabList} from "../index.js";
import {categoryStore} from "../model.js";
import {Card, CardActionArea, CardActions, Tabs} from "@material-ui/core";
import {articleStore} from "../model";
import type {Article} from "../../../server/model";
import {ArticleCard} from "../index";

describe('TabList tests', () => {
    let tabs = [{categoryId: 0, categoryName: "cat1"}, {categoryId: 1, categoryName: "cat2"}];

    const a = jest.spyOn(categoryStore, "getCategories").mockResolvedValue(tabs);
    categoryStore.getCategories().then(response => {
        categoryStore.setCategories(response);
    }).catch(error => console.error(error));

    let value;
    const setValue = (newValue) => {
        value = newValue;
    };

    const wrapper = shallow(
        <TabList
            required={true}
            setValue={setValue}
            match={{isExact: true, path: "", url: ""}}
        />
    );

    beforeEach(() => {
        categoryStore.getCategories().then(response => {
            categoryStore.setCategories(response);
        });
    });

    it('renders TabList with Tabs component', () => {
        expect(wrapper.find(Tabs).length).toBe(1);
    });
});

describe("ArticleCard tests", () => {
    let articles: Article[] = [{
        caption: "art1",
        writerId: 0,
        id: 0,
        createdAt: new Date(),
        content: "art1",
        imageUrl: "url1",
        updatedAt: new Date()
    }, {
        caption: "art2",
        writerId: 1,
        id: 1,
        createdAt: new Date(),
        content: "art2",
        imageUrl: "url2",
        updatedAt: new Date()
    }];

    const a = jest.spyOn(articleStore, "getArticles").mockResolvedValue(articles);
    articleStore.getArticles().then(response => {
        articleStore.setArticles(response);
    }).catch(error => console.error(error));

    const wrapper = article => shallow(
        <ArticleCard
            required={true}
            props={article}
            match={{isExact: true, path: "", url: ""}}
        />
    );

    beforeEach(() => {
        articleStore.getArticles().then(response => {
            articleStore.setArticles(response);
        }).catch(error => console.error(error));
    });

    it('fetches articles', () => {
        let instances = articleStore.articles;
        expect(typeof instances[0]).toEqual('object');
        expect(instances[0].caption).toBe("art1");
        expect(instances[0].writerId).toBe(0);
        expect(instances[0].id).toBe(0);
        expect(instances[0].content).toBe("art1");
        expect(instances[0].imageUrl).toBe("url1");
        expect(typeof instances[1]).toEqual('object');
        expect(instances[1].caption).toBe("art2");
        expect(instances[1].writerId).toBe(1);
        expect(instances[1].id).toBe(1);
        expect(instances[1].content).toBe("art2");
        expect(instances[1].imageUrl).toBe("url2");
    });

    it('renders ArticleCards', () => {
        let instance = wrapper(articleStore.articles[0]);
        expect(instance.find(Card).length).toBe(1);
        instance = wrapper(articleStore.articles[1]);
        expect(instance.find(Card).length).toBe(1)
    });

    it('has the appropriate children', () => {
        let instance = wrapper(articleStore.articles[0]);
        expect(instance.find(CardActionArea).length).toBe(1);
        expect(instance.find(CardActions).length).toBe(1);
        instance = wrapper(articleStore.articles[1]);
        expect(instance.find(CardActionArea).length).toBe(1);
        expect(instance.find(CardActions).length).toBe(1);
    });
});