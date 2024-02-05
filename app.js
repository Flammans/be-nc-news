const express = require('express');
const app = express();
const { AppError, InternalServerError } = require('./errors');
const apiRouter = require('./routes/api.router');
const topicsRouter = require('./routes/topics.router');
const articlesRouter = require('./routes/articles.router');
const commentsRouter = require('./routes/comments.router');
const usersRouter = require('./routes/users.router');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', express.Router()
  .use('/', apiRouter)
  .use('/topics', topicsRouter)
  .use('/articles', articlesRouter)
  .use('/comments', commentsRouter)
  .use('/users', usersRouter),
);

app.use((err, req, res, next) => {
  if (!(err instanceof AppError)) {
    err = new InternalServerError();
  }
  res.status(err.code).send({
    msg: err.message,
  });
});

module.exports = app;
