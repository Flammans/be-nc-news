const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/endpoints.controller');
const { getArticleById, getArticles, updateVoteInArticleById } = require('./controllers/articles.controller');
const { AppError, InternalServerError } = require('./errors');
const { getCommentsByArticleId, createCommentByArticleId, deleteCommentById, updateVoteInCommentById } = require('./controllers/comments.controller');
const { getUsers, getUserByUserName } = require('./controllers/users.controller');

app.use(express.json());

app.get('/api/', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', createCommentByArticleId);
app.patch('/api/articles/:article_id', updateVoteInArticleById);
app.delete('/api/comments/:comment_id', deleteCommentById);
app.patch('/api/comments/:comment_id', updateVoteInCommentById);
app.get('/api/users', getUsers);
app.get('/api/users/:username', getUserByUserName);

app.use((err, req, res, next) => {
  if (!(err instanceof AppError)) {
    err = new InternalServerError();
  }
  res.status(err.code).send({
    msg: err.message,
  });
});

module.exports = app;
