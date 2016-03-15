/**
 * Get data (posts, users, tags) from the blog and expose a search endpoint
 * based on lunr.js.
 */

// Dependenceis
var getData = require('../util/get-data-from-ghost-api');
var lunr = require('lunr');
var striptags = require('striptags');

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
 * Add all posts to the search index
 */
var updatePostsIndex = function() {
  getData('posts', {
    include: 'author,tags'
  }, function(err, posts) {
    if (err) {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
