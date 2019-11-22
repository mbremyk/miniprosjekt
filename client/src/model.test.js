import {Article} from "./model";

let article: Article;

beforeAll(() => {
    console.log("Starting all tests");
});

beforeEach(() => {
    console.log("Starting test");
    article = new Article(
        "Caption",
        0,
        0,
        new Date('November 20, 2019 18:00:00'),
        "Content",
        new Date('November 20, 2019 18:00:00'),
        "img.org"
    );
});

afterEach(() => {
    console.log("Test ended");
});

afterAll(() => {
    console.log("All tests ended");
});

test("dummy test", () => {
    console.log("Dummy test");
    expect(article.caption).toBe("Caption");
    expect(article.writerId).toBe(0);
    expect(article.id).toBe(0);
    expect(article.content).toBe("Content");
    expect(article.imageUrl).toBe("img.org");
});



