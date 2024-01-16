const db = require('../db/connection');
const { NotFoundError, BadRequestError } = require('../errors');

const fetchArticleById = (article_id) => {

  if (!/^\d+$/.test(article_id)) {
    throw new BadRequestError();
  }

  return db.query('SELECT * FROM articles WHERE article_id = $1;',
    [article_id]).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Article does not exist');
    }
    return result.rows[0];
  });
};

const fetchArticles = () => {
  return db.query(`select author, title, article_id, topic, created_at, votes, article_img_url,
      (
       SELECT count(*)
       FROM comments
       WHERE comments.article_id = articles.article_id
      ) AS comment_count
       FROM articles
       ORDER BY created_at DESC;`).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Articles does not exist');
    }
    return result.rows.map(row => {
      row.comment_count = parseInt(row.comment_count);
      return row;
    });
  });
};

module.exports = { fetchArticleById, fetchArticles };