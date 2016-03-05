var request = require('request');

// Constants
const GHOST_URL = process.env.GHOST_URL || 'http://localhost:3000';
const BASE_URL = GHOST_URL + '/ghost/api/v0.1/';
const CLIENT_SECRET = process.env.GHOST_CLIENT_SECRET || '18ba571f60c7';

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
