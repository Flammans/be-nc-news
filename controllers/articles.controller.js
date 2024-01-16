const { fetchArticleById, fetchArticles, fetchCommentsByArticleId } = require('../models/articles.model')

const getArticleById = (request, response, next) => {

  const { article_id } = request.params

  fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article })
  }).catch((err) => {
    next(err)
  })
}

const getArticles = (request, response, next) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles })
  }).catch((err) => {
    next(err)
  })
}

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params

  fetchCommentsByArticleId(article_id).then((comments) => {
    response.status(200).send({ comments })
  }).catch((err) => {
    next(err)
  })
}

module.exports = { getArticleById, getArticles, getCommentsByArticleId }