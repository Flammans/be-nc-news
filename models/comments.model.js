const db = require('../db/connection');
const format = require('pg-format');
const { NotFoundError, BadRequestError } = require('../errors');
const { fetchArticleById } = require('./articles.model');

const fetchCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id).then(() => {
    return db.query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
      [article_id]);
  }).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Comments does not exist');
    }

    return result.rows;
  });
};

const insertCommentByArticleId = (comment) => {
  return fetchArticleById(comment.article_id).then(() => {
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

    return db.query(sql).catch(() => {
      throw new BadRequestError();
    });
  }).then((result) => {
    return result.rows[0];
  });
};
const fetchCommentByCommentId = (comment_id) => {
  if (!/^\d+$/.test(comment_id)) {
    throw new BadRequestError();
  }

  return db.query('SELECT * FROM comments WHERE comment_id = $1;',
    [comment_id]).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Comment does not exist');
    }
    return result.rows[0];
  });
};
const deleteCommentByIdFromDB = (comment_id) => {

  return fetchCommentByCommentId(comment_id).then(() => {
    db.query('DELETE FROM comments WHERE comment_id = $1;',
      [comment_id]).then((result) => {
    });
  });

};

const patchVoteInCommentById = (comment) => {
  return fetchCommentByCommentId(comment.comment_id).then(() => {

    if (!Number.isInteger(comment.inc_votes)) {
      throw new BadRequestError();
    }

    const sql = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;

    return db.query(sql, [comment.inc_votes, comment.comment_id]).catch(() => {
      throw new BadRequestError();
    });
  }).then((result) => {
    return result.rows[0];
  });
};

module.exports = { fetchCommentsByArticleId, insertCommentByArticleId, fetchCommentByCommentId, deleteCommentByIdFromDB, patchVoteInCommentById };