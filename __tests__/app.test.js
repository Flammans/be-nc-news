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
  test('GET:200 sends all articles when no topic is specified with correct properties and data types', () => {
    return request(app).get('/api/articles').expect(200).then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles.length === 13).toBe(true);
      expect(body.articles).toBeInstanceOf(Array);

      body.articles.forEach((article) => {
        expect(article).toBeInstanceOf(Object);

        expect(article).toHaveProperty('article_id');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
        expect(article).toHaveProperty('comment_count');

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
  test('GET:200 sends all articles when no topic is specified with correct data', () => {
    return request(app).get('/api/articles').expect(200).then(({ body }) => {
      expect(body.articles[0]).toHaveProperty('article_id', 3);
      expect(body.articles[0]).toHaveProperty('title', 'Eight pug gifs that remind me of mitch');
      expect(body.articles[0]).toHaveProperty('author', 'icellusedkars');
      expect(body.articles[0]).toHaveProperty('topic', 'mitch');
      expect(body.articles[0]).toHaveProperty('created_at', '2020-11-03T09:12:00.000Z');
      expect(body.articles[0]).toHaveProperty('votes', 0);
      expect(body.articles[0])
        .toHaveProperty('article_img_url', 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      expect(body.articles[0]).toHaveProperty('comment_count', 2);
    });
  });
  test('GET:200 sends all filtered articles when a topic is specified in the correct order', () => {
    const topic = 'mitch';
    return request(app).get(`/api/articles?topic=${topic}`).expect(200).then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles).toBeSortedBy('created_at', {
        descending: true,
      });
      expect(body.articles.length === 12).toBe(true);
      body.articles.forEach((article) => {
        expect(article).toHaveProperty('topic', 'mitch');
      });
    });
  });
  test('GET:200 sends all filtered articles when a topic is specified in ascending order', () => {
    const topic = 'mitch';
    return request(app).get(`/api/articles?topic=${topic}&order=ASC`).expect(200).then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles).toBeSortedBy('created_at');
      expect(body.articles.length === 12).toBe(true);
      body.articles.forEach((article) => {
        expect(article).toHaveProperty('topic', 'mitch');
      });
    });
  });
  test('GET:200 sends all filtered articles when a topic is specified in ascending order should be sorted by \'title\' column', () => {
    const topic = 'mitch';
    const sort_by = 'title';
    return request(app).get(`/api/articles?topic=${topic}&order=ASC&sort_by=${sort_by}`).expect(200).then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles).toBeSortedBy('title');
      expect(body.articles.length === 12).toBe(true);
      body.articles.forEach((article) => {
        expect(article).toHaveProperty('topic', 'mitch');
      });
    });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid endpoint', () => {
    return request(app)
      .get('/api/articles/not-right-path')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('GET:404 sends an appropriate status and error message when topic not exist', () => {
    const topic = 'dogs';
    return request(app).get(`/api/articles?topic=${topic}`).expect(404).then(({ body }) => {
      expect(body.msg).toBe('Articles does not exist');
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
describe('POST /api/articles', () => {

  const newArticle = {
    author: 'lurker',
    title: 'We need more food',
    body: 'Despite their aloof demeanor, our feline friends have a compelling way of reminding us that when it comes to food, there\'s simply never enough; a constant meow-chorus underscoring the eternal truth - cats believe in a world where more is always better.',
    topic: 'cats',
    article_img_url: 'https://images.unsplash.com/photo-1599572739984-8ae9388f23b5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };

  test('POST:201 should insert new article to DB and return it', () => {
    return request(app).post('/api/articles/').send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toHaveProperty('author');
        expect(body.article).toHaveProperty('title');
        expect(body.article).toHaveProperty('body');
        expect(body.article).toHaveProperty('topic');
        expect(body.article).toHaveProperty('article_img_url');
        expect(body.article).toHaveProperty('article_id');
        expect(body.article).toHaveProperty('votes');
        expect(body.article).toHaveProperty('created_at');
        expect(body.article).toHaveProperty('comment_count');
        expect(typeof body.article.article_id).toBe('number');
        expect(typeof body.article.votes).toBe('number');
        expect(typeof body.article.created_at).toBe('string');
        expect(typeof body.article.comment_count).toBe('string');

        // GET:200 sends the new article to the client
        return request(app).get('/api/articles/14').expect(200).then(({ body }) => {

          expect(body.article).toBeInstanceOf(Object);
          expect(body.article).toHaveProperty('author', 'lurker');
          expect(body.article).toHaveProperty('title', 'We need more food');
          expect(body.article)
            .toHaveProperty('body',
              'Despite their aloof demeanor, our feline friends have a compelling way of reminding us that when it comes to food, there\'s simply never enough; a constant meow-chorus underscoring the eternal truth - cats believe in a world where more is always better.');
          expect(body.article).toHaveProperty('topic', 'cats');
          expect(body.article)
            .toHaveProperty('article_img_url',
              'https://images.unsplash.com/photo-1599572739984-8ae9388f23b5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
          expect(body.article).toHaveProperty('article_id', 14);
          expect(body.article).toHaveProperty('votes', 0);
          expect(body.article).toHaveProperty('created_at');
          expect(body.article).toHaveProperty('comment_count', '0');
        });
      });

  });
  test('POST:201 should ignore unused keys', () => {

    newArticle.anotherKey = 'ignore-me';

    return request(app)
      .post('/api/articles').send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toHaveProperty('author');
        expect(body.article).toHaveProperty('title');
        expect(body.article).toHaveProperty('body');
        expect(body.article).toHaveProperty('topic');
        expect(body.article).toHaveProperty('article_img_url');
        expect(body.article).toHaveProperty('article_id');
        expect(body.article).toHaveProperty('votes');
        expect(body.article).toHaveProperty('created_at');
        expect(body.article).toHaveProperty('comment_count');
        expect(body.article.anotherKey).toBe(undefined);
      });
  });
  test('POST:400 sends an appropriate status and error message when required key missed', () => {
    return request(app)
      .post('/api/articles').send(
        {
          title: 'We need more food',
          body: 'Despite their aloof demeanor, our feline friends have a compelling way of reminding us that when it comes to food, there\'s simply never enough; a constant meow-chorus underscoring the eternal truth - cats believe in a world where more is always better.',
          topic: 'cats',
          article_img_url: 'https://images.unsplash.com/photo-1599572739984-8ae9388f23b5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('POST:400 sends an appropriate status and error message when given an invalid username(username does not exist in DataBase)', () => {
    return request(app)
      .post('/api/articles/1/comments').send(
        {
          author: 'Cat',
          title: 'We need more food',
          body: 'Despite their aloof demeanor, our feline friends have a compelling way of reminding us that when it comes to food, there\'s simply never enough; a constant meow-chorus underscoring the eternal truth - cats believe in a world where more is always better.',
          topic: 'cats',
          article_img_url: 'https://images.unsplash.com/photo-1599572739984-8ae9388f23b5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('The \'/api\' endpoint to include a description of this new POST \'/api/article\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['POST /api/article'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['POST /api/article'].exampleResponse)
          .toEqual(
            endpoints['POST /api/article'].exampleResponse);
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
  test('PATCH:201 should update votes in DB by article_id and return correct data type', () => {
    return request(app)
      .patch('/api/articles/1').send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toHaveProperty('article_id');
        expect(body.article).toHaveProperty('title');
        expect(body.article).toHaveProperty('author');
        expect(body.article).toHaveProperty('topic');
        expect(body.article).toHaveProperty('created_at');
        expect(body.article).toHaveProperty('votes');
        expect(body.article).toHaveProperty('article_img_url');
        expect(typeof body.article.article_id).toBe('number');
        expect(typeof body.article.title).toBe('string');
        expect(typeof body.article.author).toBe('string');
        expect(typeof body.article.topic).toBe('string');
        expect(typeof body.article.created_at).toBe('string');
        expect(typeof body.article.votes).toBe('number');
        expect(typeof body.article.article_img_url).toBe('string');
      });
  });
  test('PATCH:201 should update votes in DB by article_id and return correct data', () => {
    return request(app)
      .patch('/api/articles/1').send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('article_id', 1);
        expect(body.article).toHaveProperty('title', 'Living in the shadow of a great man');
        expect(body.article).toHaveProperty('author', 'butter_bridge');
        expect(body.article).toHaveProperty('topic', 'mitch');
        expect(body.article).toHaveProperty('created_at', '2020-07-09T20:11:00.000Z');
        expect(body.article).toHaveProperty('votes', 101);
        expect(body.article)
          .toHaveProperty('article_img_url', 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
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
describe('DELETE /api/articles/:article_id', () => {
  test('DELETE:204 should delete article in DB by article_id and return status 204 and no content.', () => {
    return request(app)
      .delete('/api/articles/1')
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test('DELETE:400 sends an appropriate status and error message when given an invalid article_id', () => {
    return request(app)
      .delete('/api/articles/not-valid-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('DELETE:404 sends an appropriate status and error message when comment by article_id not exist', () => {
    return request(app)
      .delete('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
  test('The \'/api\' endpoint to include a description of this new DELETE \'/api/articles/:article_id\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['DELETE /api/articles/:article_id'])
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['DELETE /api/articles/:article_id'])
          .toEqual(
            endpoints['DELETE /api/articles/:article_id']);
      });
  });
});
describe('PATCH /api/comments/:comment_id', () => {
  test('PATCH:201 should update votes in DB by comment_id and return correct data type', () => {
    return request(app)
      .patch('/api/comments/1').send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBeInstanceOf(Object);
        expect(body.comment).toHaveProperty('comment_id');
        expect(body.comment).toHaveProperty('body');
        expect(body.comment).toHaveProperty('article_id');
        expect(body.comment).toHaveProperty('author');
        expect(body.comment).toHaveProperty('created_at');
        expect(body.comment).toHaveProperty('votes');
        expect(typeof body.comment.comment_id).toBe('number');
        expect(typeof body.comment.body).toBe('string');
        expect(typeof body.comment.author).toBe('string');
        expect(typeof body.comment.article_id).toBe('number');
        expect(typeof body.comment.created_at).toBe('string');
        expect(typeof body.comment.votes).toBe('number');
      });
  });
  test('PATCH:201 should update votes in DB by comment_id and return correct data', () => {
    return request(app)
      .patch('/api/comments/1').send({ inc_votes: 2 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty('comment_id', 1);
        expect(body.comment).toHaveProperty('body', 'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!');
        expect(body.comment).toHaveProperty('article_id', 9);
        expect(body.comment).toHaveProperty('author', 'butter_bridge');
        expect(body.comment).toHaveProperty('created_at', '2020-04-06T12:17:00.000Z');
        expect(body.comment).toHaveProperty('votes', 18);
      });
  });
  test('PATCH:201 should decrement the current comment\'s vote property by 100', () => {
    return request(app)
      .patch('/api/comments/1').send({ inc_votes: -100 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(-84);
      });
  });
  test('PATCH:201 should return correct body', () => {
    return request(app)
      .patch('/api/comments/1').send({ inc_votes: 20 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty('comment_id', 1);
        expect(body.comment).toHaveProperty('body', 'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!');
        expect(body.comment).toHaveProperty('article_id', 9);
        expect(body.comment).toHaveProperty('author', 'butter_bridge');
        expect(body.comment).toHaveProperty('created_at', '2020-04-06T12:17:00.000Z');
        expect(body.comment).toHaveProperty('votes', 36);
      });
  });
  test('PATCH:201 should ignore unused keys', () => {
    return request(app)
      .patch('/api/comments/1').send({ inc_votes: 20, anotherKey: 'ignore-me' })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.anotherKey).toBe(undefined);
      });
  });
  test('PATCH:400 sends an appropriate status and error message when given an invalid comment_id', () => {
    return request(app)
      .patch('/api/comments/not-valid-id').send({ inc_votes: 20 })
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
  test('PATCH:404 sends an appropriate status and error message when comment by comment_id does not exist ', () => {
    return request(app)
      .patch('/api/comments/999').send({ inc_votes: 35 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment does not exist');
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
          body.endpoints['PATCH /api/comments/:comment_id'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['PATCH /api/comments/:comment_id'].exampleResponse)
          .toEqual(
            endpoints['PATCH /api/comments/:comment_id'].exampleResponse);
      });
  });
});
describe('DELETE /api/comments/:comment_id', () => {
  test('DELETE:204 should delete comment in DB by comment_id and return status 204 and no content.', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test('DELETE:400 sends an appropriate status and error message when given an invalid comment_id', () => {
    return request(app)
      .delete('/api/comments/not-valid-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('DELETE:404 sends an appropriate status and error message when comment by comment_id not exist', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment does not exist');
      });
  });
  test('The \'/api\' endpoint to include a description of this new DELETE \'/api/comments/:comment_id\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(
          body.endpoints['DELETE /api/comments/:comment_id'])
          .toBeInstanceOf(Object);
        expect(
          body.endpoints['DELETE /api/comments/:comment_id'])
          .toEqual(
            endpoints['DELETE /api/comments/:comment_id']);
      });
  });
});
describe('GET /api/users', () => {
  test('GET:200 sends an array of users objects to the client with correct data type', () => {
    return request(app).get('/api/users').expect(200).then(({ body }) => {
      expect(body.users).toBeInstanceOf(Array);
      expect(body.users.length === 4).toBe(true);
      body.users.forEach((user) => {
        expect(user).toBeInstanceOf(Object);
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('avatar_url');
        expect(typeof user.username).toBe('string');
        expect(typeof user.name).toBe('string');
        expect(typeof user.avatar_url).toBe('string');
      });
    });
  });
  test('GET:200 sends an array of users objects to the client with correct data', () => {
    return request(app).get('/api/users').expect(200).then(({ body }) => {
      expect(body.users[0]).toHaveProperty('username', 'butter_bridge');
      expect(body.users[0]).toHaveProperty('name', 'jonny');
      expect(body.users[0]).toHaveProperty('avatar_url', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
    });
  });
  test('The \'/api\' endpoint to include a description of this new \'/api/users\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints['GET /api/users'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(body.endpoints['GET /api/users'].exampleResponse)
          .toEqual(endpoints['GET /api/users'].exampleResponse);
      });
  });
});
describe('GET /api/users/:username', () => {
  test('GET:200 sends an object to the client with correct user data type', () => {
    return request(app).get('/api/users/butter_bridge').expect(200).then(({ body }) => {
      expect(body.user).toBeInstanceOf(Object);
      expect(body.user).toHaveProperty('username');
      expect(body.user).toHaveProperty('name');
      expect(body.user).toHaveProperty('avatar_url');
      expect(typeof body.user.username).toBe('string');
      expect(typeof body.user.name).toBe('string');
      expect(typeof body.user.avatar_url).toBe('string');
    });
  });
  test('GET:200 sends an object to the client with correct data', () => {
    return request(app).get('/api/users/butter_bridge').expect(200).then(({ body }) => {
      expect(body.user).toHaveProperty('username', 'butter_bridge');
      expect(body.user).toHaveProperty('name', 'jonny');
      expect(body.user).toHaveProperty('avatar_url', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
    });
  });
  test('GET:404 sends an appropriate status and error message when username does not exist', () => {
    return request(app)
      .get('/api/users/not-valid-username')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User does not exist');
      });
  });
  test('The \'/api\' endpoint to include a description of this new \'/api/users\' endpoint.', () => {
    return request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints['GET /api/users/:username'].exampleResponse)
          .toBeInstanceOf(Object);
        expect(body.endpoints['GET /api/users/:username'].exampleResponse)
          .toEqual(endpoints['GET /api/users/:username'].exampleResponse);
      });
  });
});

