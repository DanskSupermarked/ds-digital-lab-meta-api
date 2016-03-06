var sendMail = require('../util/send-mail');
var getData = require('../util/get-data-from-ghost-api');
var marked = require('marked');

var renderer = new marked.Renderer();

renderer.heading = function(text, level) {
  return '<p class="h' + level + '"">' + text + '</p>';
};

marked.setOptions({
  renderer: renderer,
  sanitize: true
});

var ghostURL = process.env.GHOST_URL || 'http://localhost:3000';

module.exports = function(req, res, next) {
  next();

  if (!Array.isArray(req.body.responses) || req.body.responses.length === 0) {
    return;
  }
  if (!req.payload.authorEmail) {
    return;
  }

  var authorEmail = req.payload.authorEmail;
  var responses = req.payload.responses;
  var latestResponse = responses[responses.length - 1];

  // More than 10 secs old
  if (Date.now() > new Date(latestResponse.published).getTime() + 10 * 1000) {
    return;
  }

  getData('posts', {
    filter: 'uuid:' + req.payload.id
  }, function(err, posts) {

    if (err || posts.length === 0) {
      return;
    }

    var post = posts[0];

    sendMail({
      to: authorEmail,
      subject: 'New response to your article "' + post.title + '"',
      html: marked(latestResponse.text) + '<p>' + '/ ' + latestResponse.name + '</p><p><a href="' + ghostURL + post.url + '">' + ghostURL + post.url + '</a></p>'
    });
  });

};
