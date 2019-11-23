import * as React from 'react';
import {shallow} from "enzyme";
import {TabList} from "../index.js";
import {categoryStore} from "../model.js";
import {NavLink} from "react-router-dom";

describe('Category tests', () => {
    let tabs = [{categoryId: 0, categoryName: "cat1"}, {categoryId: 1, categoryName: "cat2"}];

    const a = jest.spyOn(categoryStore, "getCategories").mockResolvedValue(tabs);
    categoryStore.getCategories().then(response => {
        categoryStore.setCategories(response);
    });

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

    it('fetches categories and saves them in categoryStore', () => {
        let instances = categoryStore.categories;
        expect(typeof instances[0]).toEqual('object');
        expect(instances[0].categoryId).toBe(0);
        expect(instances[0].categoryName).toBe("cat1");
        expect(typeof instances[1]).toEqual('object');
        expect(instances[1].categoryId).toBe(1);
        expect(instances[1].categoryName).toBe("cat2");
    });

    it('renders TabList', () => {
        let instance;
        categoryStore.getCategories().then(() => {
            instance = wrapper.instance();
            expect(instance.find('Tab[id=tab-0]').props()).toEqual({
                label: 'cat1',
                component: NavLink,
                to: '/category/0',
                'aria-controls': 'tabpanel-0',
                key: 0
            });
            expect(wrapper.find('Tab[id=tab-1]').props()).toEqual({
                label: 'cat2',
                component: NavLink,
                to: '/category/1',
                'aria-controls': 'tabpanel-1',
                key: 1
            });
        });
    });
});