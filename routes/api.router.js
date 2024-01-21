const { getEndpoints } = require('../controllers/endpoints.controller');
const apiRouter = require('express').Router();

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;