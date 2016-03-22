/**
 * Get data (posts, users, tags) from the blog and expose a search endpoint
 * based on lunr.js.
 */

// Dependenceis
const getData = require('../util/get-data-from-ghost-api');
const lunr = require('lunr');
const striptags = require('striptags');

// Structure the indexing
const index = lunr(function lunrSettings() {
  this.field('title', {
    boost: 10,
  });
  this.field('tags', {
    boost: 5,
  });
  this.field('author', {
    boost: 5,
  });
  this.field('body');
  this.ref('ref');
});

/**
 * Add all posts to the search index
 */
const updatePostsIndex = () => {
  getData('posts', {
    include: 'author,tags',
  }, (err, posts) => {
    if (err) {
      console.log(err);
      return;
    }
    posts.forEach(post => {
      index.add({
        title: post.title,
        body: striptags(post.html),
        author: post.author.name,
        tags: post.tags.map(tag => tag.name).join(', '),
        ref: `posts/${post.id}`,
      });
    });
  });
};

/**
 * Add all tags to the search index
 */
const updateTagsIndex = () => {
  getData('tags', {}, (err, tags) => {
    if (err) {
      console.log(err);
      return;
    }

    tags.forEach(tag => {
      index.add({
        title: tag.name,
        body: striptags(tag.description),
        ref: `tags/${tag.id}`,
      });
    });
  });
};

/**
 * Add all users to the search index
 */
const updateUsersIndex = () => {
  getData('users', {}, (err, users) => {
    if (err) {
      console.log(err);
      return;
    }

    users.forEach(user => {
      index.add({
        title: user.name,
        body: striptags(user.description),
        ref: `users/${user.id}`,
      });
    });
  });
};

/**
 * Update the index wit all data
 */
const updateIndex = () => {
  updatePostsIndex();
  updateTagsIndex();
  updateUsersIndex();
};

// Update the index every hour
updateIndex();
setInterval(updateIndex, 1 * 60 * 60 * 1000);

// Search results as a endpoint
module.exports = function search(req, res, next) {
  req.payload = index.search(req.query.q);
  next();
};
