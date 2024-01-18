const { fetchArticleById, fetchArticles, patchVoteInArticleById, insertArticle } = require('../models/articles.model');

const getArticleById = (request, response, next) => {

  const { article_id } = request.params;

  fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article });
  }).catch((err) => {
    next(err);
  });
};

const getArticles = (request, response, next) => {

  const articles = {
    author: request.query.author,
    topic: request.query.topic,
    sort_by: request.query.sort_by,
    order: request.query.order,
  };

  fetchArticles(articles).then((articles) => {
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

const createArticle = (request, response, next) => {
  const article = {
    author: request.body.author,
    title: request.body.title,
    body: request.body.body,
    topic: request.body.topic,
    article_img_url: request.body.article_img_url,
  };
  
  insertArticle(article)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, getArticles, updateVoteInArticleById, createArticle };