const { getTopics, createNewTopic } = require('../controllers/topics.controller');
const topicsRouter = require('express').Router();

topicsRouter.route('/')
  .get(getTopics)
  .post(createNewTopic);

module.exports = topicsRouter;