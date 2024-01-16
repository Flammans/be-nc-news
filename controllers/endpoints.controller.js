const { fetchEndpoints } = require('../models/endpoints.model');

const getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpoints) => {
    response.status(200).send({ endpoints });
  }).catch((err) => {
    next(err);
  });
};

module.exports = { getEndpoints };