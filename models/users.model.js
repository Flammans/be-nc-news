const db = require('../db/connection');
const { NotFoundError } = require('../errors');
const format = require('pg-format');

const fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};

const fetchUserByUserName = (username) => {
  const sql = format('SELECT * FROM users WHERE username = %L;', username);
  return db.query(sql).then((result) => {
    if (!result.rows[0]) {
      throw new NotFoundError('User does not exist');
    }
    return result.rows[0];
  });
};

module.exports = { fetchUsers, fetchUserByUserName };