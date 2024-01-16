const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getArticleById } = require('./controllers/articles.controller')
const { AppError } = require('./errors')


app.get('/api/', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
  if(err instanceof AppError) {
    res.status(err.code).send({
      msg: err.message
    });
  } else {
    res.status(500).send({
      msg: 'Internal Server Error'
    });
  }
})

module.exports = app;
