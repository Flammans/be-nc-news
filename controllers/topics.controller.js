const { fetchTopics, insertTopic } = require('../models/topics.model');

const getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  }).catch((err) => {
    next(err);
  });
};

const createNewTopic = (request, response, next) => {
  const topic = {
    slug: request.body.slug,
    description: request.body.description,
  };

  insertTopic(topic)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getTopics, createNewTopic };