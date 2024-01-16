const db = require('../db/connection');
const format = require('pg-format');
const { NotFoundError, BadRequestError } = require('../errors');

const fetchCommentsByArticleId = (article_id) => {
  if (!/^\d+$/.test(article_id)) {
    throw new BadRequestError();
  }

  return db.query(
    'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
    [article_id]).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Comments does not exist');
    }
    return result.rows;
  });
};

const insertCommentByArticleId = (comment) => {
  const sql = format(
    'INSERT INTO comments (body, author, article_id) VALUES %L RETURNING *;',
    [
      [
        comment.body,
        comment.author,
        comment.article_id,
      ],
    ],
  );
  return db.query(sql).then((result) => result.rows[0]);
};

module.exports = { fetchCommentsByArticleId, insertCommentByArticleId };