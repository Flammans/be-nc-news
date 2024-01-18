const { fetchUsers, fetchUserByUserName } = require('../models/users.model');

const getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  }).catch((err) => {
    next(err);
  });
};

const getUserByUserName = (request, response, next) => {

  const username = request.params.username;

  fetchUserByUserName(username).then((user) => {
    response.status(200).send({ user });
  }).catch((err) => {
    next(err);
  });
};

module.exports = { getUsers, getUserByUserName };