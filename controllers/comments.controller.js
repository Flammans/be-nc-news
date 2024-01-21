const { fetchCommentsByArticleId, insertCommentByArticleId, deleteCommentByIdFromDB, patchVoteInCommentById, fetchCommentsCount } = require('../models/comments.model');

const getCommentsByArticleId = (request, response, next) => {
  const options = {
    article_id: request.params.article_id,
    page: request.query.p,
    limit: request.query.limit,
  };
  Promise.all([
    fetchCommentsCount(options),
    fetchCommentsByArticleId(options),
  ]).then(([total_count, comments]) => {
    response.status(200).send({ comments, total_count });
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