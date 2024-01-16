const fetchEndpoints = () => {
  return new Promise((resolve) => {
    resolve(require('../endpoints.json'));
  });
};

module.exports = { fetchEndpoints };