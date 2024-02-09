const db = require('../db/connection');
const { NotFoundError, BadRequestError } = require('../errors');
const format = require('pg-format');

const fetchArticleById = (article_id) => {
  if (!/^\d+$/.test(article_id)) {
    throw new BadRequestError();
  }

  return db.query(`SELECT * , (
            SELECT count(*)
            FROM comments
            WHERE comments.article_id = articles.article_id
        ) AS comment_count
        FROM articles WHERE article_id = $1;`,
    [article_id]).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Article does not exist');
    }
    return result.rows[0];
  });
};
const filterArticles = (options) => {
  let sql = '';
  const conditions = [];

  if (options.topic) {
    conditions.push(format('topic = %L', options.topic));
  }

  if (options.author) {
    conditions.push(format('author = %L', options.author));
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  return sql;
};
const fetchArticlesCount = (options) => {
  let sql = format(`SELECT COUNT(*) as total_count FROM articles`);

  sql += filterArticles(options);

  return db.query(sql).then((result) => {
    return parseInt(result.rows[0].total_count);
  });
};

const fetchArticles = (options) => {
  let sortBy = 'created_at';
  let orderBy = 'DESC';
  let limit = parseInt(options.limit) || 10;
  let page = parseInt(options.page) || 1;
  let offset = limit * (page - 1);

  if (options.sort_by) {
    if (!['title', 'created_at', 'author', 'comment_count', 'votes'].includes(options.sort_by)) {
      throw new BadRequestError();
    }
    sortBy = options.sort_by;
  }

  if (options.order) {
    if (!['asc', 'ASC', 'desc', 'DESC'].includes(options.order)) {
      throw new BadRequestError();
    }
    orderBy = options.order;
  }

  let sql = format(`
      SELECT author, title, article_id, topic, created_at, votes, article_img_url,
          (
              SELECT count(*)
              FROM comments
              WHERE comments.article_id = articles.article_id
          ) AS comment_count
      FROM articles
  `);

  sql += filterArticles(options);

  sql += format(' ORDER BY %I %s', sortBy, orderBy);

  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  return db.query(sql).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('Articles does not exist');
    }
    return result.rows.map(row => {
      row.comment_count = parseInt(row.comment_count);
      return row;
    });
  });
};

const patchVoteInArticleById = (article) => {
  return fetchArticleById(article.article_id).then(() => {

    if (!Number.isInteger(article.inc_votes)) {
      throw new BadRequestError();
    }

    const sql = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;

    return db.query(sql, [article.inc_votes, article.article_id]).catch(() => {
      throw new BadRequestError();
    });
  }).then((result) => {
    return result.rows[0];
  });
};

const insertArticle = (article) => {
  const sql = format(
    'INSERT INTO articles (author, title, body, topic, article_img_url) VALUES %L RETURNING article_id;',
    [
      [
        article.author,
        article.title,
        article.body,
        article.topic,
        article.article_img_url,
      ],
    ],
  );

  return db.query(sql).catch(() => {
    throw new BadRequestError();
  }).then((result) => {
    return fetchArticleById(result.rows[0].article_id);
  });
};

const deleteArticleByIdFromDB = (article_id) => {
  return fetchArticleById(article_id).then(() => {
    return db.query('DELETE FROM comments WHERE comment_id = $1;',
      [article_id]);
  });
};

module.exports = { fetchArticleById, fetchArticles, patchVoteInArticleById, insertArticle, deleteArticleByIdFromDB, fetchArticlesCount };