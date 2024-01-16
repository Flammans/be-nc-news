const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/endpoints.controller');
const { getArticleById, getArticles } = require('./controllers/articles.controller');
const { AppError, InternalServerError } = require('./errors');
const { getCommentsByArticleId, createCommentByArticleId } = require('./controllers/comments.controller');

app.get('/api/', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', express.json(), createCommentByArticleId);

app.use((err, req, res, next) => {
  if (!(err instanceof AppError)) {
    // console.error(err);
    err = new InternalServerError();
  }

  res.status(err.code).send({
    msg: err.message,
  });
});

module.exports = app;
