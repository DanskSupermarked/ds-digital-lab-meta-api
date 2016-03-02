/**
 * Get data (posts, users, tags) from the blog and expose a search endpoint
 * based on lunr.js.
 */

// Dependenceis
var request = require('request');
var lunr = require('lunr');
var striptags = require('striptags');

// Constants
const BASE_URL = 'https://ds-digital-lab.azurewebsites.net/ghost/api/v0.1/';
const CLIENT_SECRET = '7712f3f90b54';

// Structure the indexing
var index = lunr(function() {
  this.field('title', {
    boost: 10
  });
  this.field('tags', {
    boost: 5
  });
  this.field('author', {
    boost: 5
  });
  this.field('body');
  this.ref('ref');
});

/**
 * Get data from the blogs api
 */
var getData = function(resource, qs, callback) {
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

/**
 * Add all posts to the search index
 */
var updatePostsIndex = function() {
  getData('posts', {
    include: 'author,tags'
  }, function(err, posts) {
    if (err) {
      return;
    }
    posts.forEach(function(post) {
      index.add({
        title: post.title,
        body: striptags(post.html),
        author: post.author.name,
        tags: post.tags.map(tag => tag.name).join(', '),
        ref: 'posts/' + post.id
      });
    });
  });
};

/**
 * Add all tags to the search index
 */
var updateTagsIndex = function() {
  getData('tags', {}, function(err, tags) {
    if (err) {
      return;
    }

    tags.forEach(function(tag) {
      index.add({
        title: tag.name,
        body: striptags(tag.description),
        ref: 'tags/' + tag.id
      });
    });
  });
};

/**
 * Add all users to the search index
 */
var updateUsersIndex = function() {
  getData('users', {}, function(err, users) {
    if (err) {
      return;
    }

    users.forEach(function(user) {
      index.add({
        title: user.name,
        body: striptags(user.description),
        ref: 'users/' + user.id
      });
    });
  });
};

/**
 * Update the index wit all data
 */
var updateIndex = function() {
  updatePostsIndex();
  updateTagsIndex();
  updateUsersIndex();
};

// Update the index every hour
updateIndex();
setInterval(updateIndex, 1 * 60 * 60 * 1000);

// Search results as a endpoint
module.exports = function(req, res, next) {
  req.payload = index.search(req.query.q);
  next();
};
