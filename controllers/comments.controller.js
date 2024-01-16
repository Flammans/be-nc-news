const { fetchCommentsByArticleId, insertCommentByArticleId } = require(
  '../models/comments.model');
const { fetchArticleById } = require('../models/articles.model');

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  fetchCommentsByArticleId(article_id).then((comments) => {
    response.status(200).send({ comments });
  }).catch((err) => {
    next(err);
  });
};

const createCommentByArticleId = (request, response, next) => {
  
  const comment = {
    article_id: request.params.article_id,
    author: request.body.username,
    body: request.body.body,
  };

  fetchArticleById(comment.article_id)
    .then(() => insertCommentByArticleId(comment))
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });

};

module.exports = { getCommentsByArticleId, createCommentByArticleId };