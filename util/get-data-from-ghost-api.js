var request = require('request');

// Constants
const BASE_URL = 'https://ds-digital-lab.azurewebsites.net/ghost/api/v0.1/';
const CLIENT_SECRET = '7712f3f90b54';

module.exports = function(resource, qs, callback) {
  callback = callback || function() {};
  qs = qs || {};
  qs.client_id = 'ghost-frontend';
  qs.client_secret = CLIENT_SECRET;
  qs.limit = 'all';
  request(BASE_URL + resource, {
    json: true,
    qs: qs
  }, function(err, response, data) {
    if (err) {
      return callback(err);
    }
    if (response.statusCode !== 200) {
      return callback(data);
    }
    if (!data[resource]) {
      return callback(new Error('No data'));
    }
    callback(null, data[resource]);
  });
};
