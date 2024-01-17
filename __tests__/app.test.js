const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api', () => {
  test('Status 200, responds with endpoints data', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toBeInstanceOf(Object);
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
describe('GET /api/topics', () => {
  test('Status 200, responds correct topic data', () => {
    return request(app)
      .get('/api/topics')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics.length > 0).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toBeInstanceOf(Object);
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        });
      });
  });
});
describe('GET /api/articles/:article_id', () => {
  test('GET:200 sends a single article to the client', () => {
    return request(app).get('/api/articles/1').expect(200).then(({ body }) => {
      expect(body.article.article_id).toBe(1);
      expect(body.article.title).toBe('Living in the shadow of a great man');
      expect(body.article.author).toBe('butter_bridge');
      expect(body.article.body).toBe('I find this existence challenging');
      expect(body.article.topic).toBe('mitch');
      expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
      expect(body.article.votes).toBe(100);
      expect(body.article.article_img_url)
        .toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
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
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('The \'/api\' endpoint to include a description of this new \'/api/articles/:article_id\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['GET /api/articles/:article_id'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['GET /api/articles/:article_id'].exampleResponse)
          .toEqual(
            endpoints['GET /api/articles/:article_id'].exampleResponse);
      });
  });
});
describe('GET /api/articles', () => {
  test('GET:200 sends articles to the client', () => {
    return request(app).get('/api/articles').expect(200).then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles.length > 0).toBe(true);
      body.articles.forEach((article) => {
        expect(article).toBeInstanceOf(Object);
        expect(typeof article.article_id).toBe('number');
        expect(typeof article.title).toBe('string');
        expect(typeof article.author).toBe('string');
        expect(typeof article.topic).toBe('string');
        expect(typeof article.created_at).toBe('string');
        expect(typeof article.votes).toBe('number');
        expect(typeof article.article_img_url).toBe('string');
        expect(typeof article.comment_count).toBe('number');
      });
    });
  });
  test('GET:200 sends articles to the client sorted by date in descending order', () => {
    return request(app).get('/api/articles').expect(200).then(({ body }) => {
      const sortedArray = [...body.articles];
      sortedArray.sort((a, b) => {
        return Date.parse(b.created_at) - Date.parse(a.created_at);
      });
      expect(body.articles).toEqual(sortedArray);
    });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-right-path')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('The \'/api\' endpoint to include a description of this new \'/api/articles\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints['GET /api/articles'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(body.endpoints['GET /api/articles'].exampleResponse)
          .toEqual(endpoints['GET /api/articles'].exampleResponse);
      });
  });
});
describe('GET /api/articles/:article_id/comments', () => {
  test('GET:200 sends comments by article_id to the client', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length > 0).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment).toBeInstanceOf(Object);
          expect(typeof comment.comment_id).toBe('number');
          expect(typeof comment.votes).toBe('number');
          expect(typeof comment.created_at).toBe('string');
          expect(typeof comment.author).toBe('string');
          expect(typeof comment.body).toBe('string');
          expect(typeof comment.article_id).toBe('number');
        });
      });
  });
  test('GET:200 sends comments to the client sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const sortedArray = [...body.comments];
        sortedArray.sort((a, b) => {
          return Date.parse(b.created_at) - Date.parse(a.created_at);
        });
        expect(body.comments).toEqual(sortedArray);
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-valid-id/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
  test('The \'/api\' endpoint to include a description of this new \'/api/articles/:article_id/comments\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['GET /api/articles/:article_id/comments'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['GET /api/articles/:article_id/comments'].exampleResponse)
          .toEqual(
            endpoints['GET /api/articles/:article_id/comments'].exampleResponse);
      });
  });
});
describe('POST /api/articles/:article_id/comments', () => {
  test('POST:201 should insert new comment to DB and return it', () => {
    return request(app)
      .post('/api/articles/1/comments').send({ username: 'butter_bridge', body: 'a cat' })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBeInstanceOf(Object);
        expect(typeof body.comment.comment_id).toBe('number');
        expect(typeof body.comment.body).toBe('string');
        expect(typeof body.comment.article_id).toBe('number');
        expect(typeof body.comment.author).toBe('string');
        expect(typeof body.comment.votes).toBe('number');
        expect(typeof body.comment.created_at).toBe('string');
      });
  });
  test('POST:201 should return correct author name and comment\'s body', () => {
    return request(app)
      .post('/api/articles/1/comments').send({ username: 'butter_bridge', body: 'a cat' })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toBe('a cat');
        expect(body.comment.author).toBe('butter_bridge');
      });
  });
  test('POST:201 should ignore unused keys', () => {
    return request(app)
      .post('/api/articles/1/comments').send({ username: 'butter_bridge', body: 'a cat', anotherKey: 'ignore-me' })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toBe('a cat');
        expect(body.comment.author).toBe('butter_bridge');
        expect(body.comment.anotherKey).toBe(undefined);
      });
  });
  test('POST:400 sends an appropriate status and error message when given an invalid article_id', () => {
    return request(app)
      .post('/api/articles/not-valid-id/comments').send({ username: 'butter_bridge', body: 'a cat' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('POST:400 sends an appropriate status and error message when required key missed', () => {
    return request(app)
      .post('/api/articles/1/comments').send({ body: 'a cat' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('POST:400 sends an appropriate status and error message when given an invalid username', () => {
    return request(app)
      .post('/api/articles/1/comments').send({ username: 'this_user_name_doesn\'t_exist', body: 'I\'m not real user' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('POST:404 sends an appropriate status and error message when given an invalid article_id', () => {
    return request(app)
      .post('/api/articles/999/comments').send({ username: 'butter_bridge', body: 'a cat' })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
  test('The \'/api\' endpoint to include a description of this new POST \'/api/articles/:article_id/comments\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['POST /api/articles/:article_id/comments'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['POST /api/articles/:article_id/comments'].exampleResponse)
          .toEqual(
            endpoints['POST /api/articles/:article_id/comments'].exampleResponse);
      });
  });
});
describe('PATCH /api/articles/:article_id', () => {
  test('PATCH:201 should update votes in DB by article_id and return it', () => {
    return request(app)
      .patch('/api/articles/1').send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(typeof body.article.article_id).toBe('number');
        expect(typeof body.article.title).toBe('string');
        expect(typeof body.article.author).toBe('string');
        expect(typeof body.article.topic).toBe('string');
        expect(typeof body.article.created_at).toBe('string');
        expect(typeof body.article.votes).toBe('number');
        expect(typeof body.article.article_img_url).toBe('string');

        expect(body.article.votes).toBe(101);
      });
  });
  test('PATCH:201 should decrement the current article\'s vote property by 110', () => {
    return request(app)
      .patch('/api/articles/1').send({ inc_votes: -110 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(-10);
      });
  });
  test('PATCH:201 should return correct body', () => {
    return request(app)
      .patch('/api/articles/1').send({ inc_votes: 20 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.title).toBe('Living in the shadow of a great man');
        expect(body.article.author).toBe('butter_bridge');
        expect(body.article.body).toBe('I find this existence challenging');
        expect(body.article.topic).toBe('mitch');
        expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(body.article.votes).toBe(120);
        expect(body.article.article_img_url)
          .toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      });
  });
  test('PATCH:201 should ignore unused keys', () => {
    return request(app)
      .patch('/api/articles/1').send({ inc_votes: 20, anotherKey: 'ignore-me' })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.anotherKey).toBe(undefined);
      });
  });
  test('PATCH:400 sends an appropriate status and error message when given an invalid article_id', () => {
    return request(app)
      .patch('/api/articles/not-valid-id').send({ inc_votes: 20 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('PATCH:400 sends an appropriate status and error message when required key missed', () => {
    return request(app)
      .patch('/api/articles/1').send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('PATCH:404 sends an appropriate status and error message when given an invalid article_id', () => {
    return request(app)
      .patch('/api/articles/999').send({ inc_votes: 35 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
  test('The \'/api\' endpoint to include a description of this new PATCH \'/api/articles/:article_id\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['PATCH /api/articles/:article_id'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['PATCH /api/articles/:article_id'].exampleResponse)
          .toEqual(
            endpoints['PATCH /api/articles/:article_id'].exampleResponse);
      });
  });
});