const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');
const endpoints =  require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api', () => {
  test("Status 200, responds with endpoints data", () => {
    return request(app)
      .get("/api")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toBeInstanceOf(Object);
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
describe('GET /api/topics', () => {
  test("Status 200, responds correct topic data", () => {
    return request(app)
      .get("/api/topics")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics.length > 0).toBe(true);
        body.topics.forEach((topic) =>{
          expect(topic).toBeInstanceOf(Object);
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        })
      });
  });
});
describe('/api/articles/:article_id', () => {
  test('GET:200 sends a single article to the client', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.title).toBe('Living in the shadow of a great man');
        expect(body.article.author).toBe('butter_bridge');
        expect(body.article.body).toBe('I find this existence challenging');
        expect(body.article.topic).toBe('mitch');
        expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-a-article')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test("The '/api' endpoint to include a description of this new '/api/articles/:article_id' endpoint.", () => {
    return request(app)
      .get("/api")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints["GET /api/articles/:article_id"]).toBeInstanceOf(Object);
        expect(body.endpoints["GET /api/articles/:article_id"]).toEqual(endpoints["GET /api/articles/:article_id"]);
      });
  });
});
describe('/api/articles', () => {
  test('GET:200 sends articles to the client', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length > 0).toBe(true);
        body.articles.forEach((article) =>{
          expect(article).toBeInstanceOf(Object);
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.title).toBe('string');
          expect(typeof article.author).toBe('string');
          expect(typeof article.topic).toBe('string');
          expect(typeof article.created_at).toBe('string');
          expect(typeof article.votes).toBe('number');
          expect(typeof article.article_img_url).toBe('string');
          expect(typeof article.comment_count).toBe('number');
        })
      });
  });
});