const { fetchCommentsByArticleId, insertCommentByArticleId, deleteCommentByIdFromDB, patchVoteInCommentById } = require('../models/comments.model');

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  fetchCommentsByArticleId(article_id).then((comments) => {
    response.status(200).send({ comments });
  }).catch((err) => {
    next(err);
  });
};

const createCommentByArticleId = (request, response, next) => {

  const comment = {
    article_id: request.params.article_id,
    author: request.body.username,
    body: request.body.body,
  };

  insertCommentByArticleId(comment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });

};

const deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;

  deleteCommentByIdFromDB(comment_id).then(() => {
    response.status(204).send();
  }).catch((err) => {
    next(err);
  });
};

const updateVoteInCommentById = (request, response, next) => {

  const comment = {
    comment_id: request.params.comment_id,
    inc_votes: request.body.inc_votes,
  };

  patchVoteInCommentById(comment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCommentsByArticleId, createCommentByArticleId, deleteCommentById, updateVoteInCommentById };