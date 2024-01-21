const { getArticles, getArticleById, createArticle, updateVoteInArticleById, deleteArticleById } = require('../controllers/articles.controller');
const { getCommentsByArticleId, createCommentByArticleId } = require('../controllers/comments.controller');

const articlesRouter = require('express').Router();

articlesRouter.route('/')
  .get(getArticles)
  .post(createArticle);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(updateVoteInArticleById)
  .delete(deleteArticleById);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(createCommentByArticleId);

module.exports = articlesRouter;