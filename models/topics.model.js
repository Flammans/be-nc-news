const db = require('../db/connection');
const format = require('pg-format');
const { BadRequestError } = require('../errors');

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

const insertTopic = (topic) => {
  const sql = format(
    'INSERT INTO topics (slug, description) VALUES %L RETURNING *',
    [
      [
        topic.slug,
        topic.description,
      ],
    ],
  );
 
  return db.query(sql).catch(() => {
    throw new BadRequestError();
  }).then((result) => {
    return result.rows[0];
  });
};

module.exports = { fetchTopics, insertTopic };