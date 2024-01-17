const { fetchArticleById, fetchArticles, patchVoteInArticleById } = require('../models/articles.model');
const { insertCommentByArticleId } = require('../models/comments.model');

const getArticleById = (request, response, next) => {

  const { article_id } = request.params;

  fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article });
  }).catch((err) => {
    next(err);
  });
};

const getArticles = (request, response, next) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  }).catch((err) => {
    next(err);
  });
};

const updateVoteInArticleById = (request, response, next) => {

  const article = {
    article_id: request.params.article_id,
    inc_votes: request.body.inc_votes,
  };

  patchVoteInArticleById(article)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, getArticles, updateVoteInArticleById };