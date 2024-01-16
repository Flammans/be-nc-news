const db = require("../db/connection");
const { NotFoundError, BadRequestError } = require('../errors')

const fetchArticleById = (article_id) => {

  if(!/^\d+$/.test(article_id)){
    throw new BadRequestError('Bad request');
  }

  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (!result.rows[0]) {
        throw new NotFoundError('Article does not exist');
      }
      return result.rows[0]
    });
}

module.exports = { fetchArticleById };