const { fetchArticleById, fetchArticles, patchVoteInArticleById, insertArticle, deleteArticleByIdFromDB, fetchArticlesCount } = require(
  '../models/articles.model');

const getArticleById = (request, response, next) => {

  const { article_id } = request.params;

  fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article });
  }).catch((err) => {
    next(err);
  });
};

const getArticles = (request, response, next) => {

  const options = {
    author: request.query.author,
    topic: request.query.topic,
    sort_by: request.query.sort_by,
    order: request.query.order,
    page: request.query.p,
    limit: request.query.limit,
  };

  Promise.all([
    fetchArticlesCount(options),
    fetchArticles(options),
  ]).then(([total_count, articles]) => {
    response.status(200).send({ articles, total_count });
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

const deleteArticleById = (request, response, next) => {
  const { article_id } = request.params;

  deleteArticleByIdFromDB(article_id).then(() => {
    response.status(204).send();
  }).catch((err) => {
    next(err);
  });
};

module.exports = { getArticleById, getArticles, updateVoteInArticleById, createArticle, deleteArticleById };