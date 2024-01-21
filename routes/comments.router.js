const { deleteCommentById, updateVoteInCommentById } = require('../controllers/comments.controller');
const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id')
  .delete(deleteCommentById)
  .patch(updateVoteInCommentById);

module.exports = commentsRouter;