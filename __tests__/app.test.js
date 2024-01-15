const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app =require('../app');

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
        for(const endpoint in body.endpoints ){
          expect(body.endpoints[endpoint]).toBeInstanceOf(Object);
        }
      });
  });
});
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
        expect(body.topics.length > 0).toBe(true);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        })
      });
  });
});
