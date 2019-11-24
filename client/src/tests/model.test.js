import {Article, categoryStore} from "../model";

let article: Article;

beforeAll(() => {
    console.log("Starting all tests");
});

beforeEach(() => {
    console.log("Starting tests");
    article = new Article(
        "Caption",
        0,
        0,
        new Date('November 20, 2019 18:00:00'),
        "Content",
        new Date('November 20, 2019 18:00:00'),
        "img.org"
    );
    let categories = [{categoryId: 0, categoryName: "cat1"}, {categoryId: 1, categoryName: "cat2"}];
    const a = jest.spyOn(categoryStore, "getCategories").mockResolvedValue(categories);
    categoryStore.getCategories().then(response => {
        categoryStore.setCategories(response);
    }).catch(error => console.error(error));
});

afterEach(() => {
    console.log("Test ended");
});

afterAll(() => {
    console.log("All tests ended");
});

test("dummy tests", () => {
    console.log("Dummy tests");
    expect(article.caption).toBe("Caption");
    expect(article.writerId).toBe(0);
    expect(article.id).toBe(0);
    expect(article.content).toBe("Content");
    expect(article.imageUrl).toBe("img.org");
});

test("Category tests", () => {
    let instances = categoryStore.categories;
    expect(typeof instances[0]).toEqual('object');
    expect(instances[0].categoryId).toBe(0);
    expect(instances[0].categoryName).toBe("cat1");
    expect(typeof instances[1]).toEqual('object');
    expect(instances[1].categoryId).toBe(1);
    expect(instances[1].categoryName).toBe("cat2");
});

