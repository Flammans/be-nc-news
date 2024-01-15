const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app =require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
  test("Status 200, responds with topics data", () => {
    return request(app)
      .get("/api/topics")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) =>{
          expect(topic).toBeInstanceOf(Object);
        })
      });
  });
  test("Status 200, responds with correct topic data", () => {
    return request(app)
      .get("/api/topics")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        })
      });
  });
});
