var sendMail = require('../util/send-mail');
var getData = require('../util/get-data-from-ghost-api');

var ghostURL = process.env.GHOST_URL || 'http://localhost:3000';

module.exports = function(req, res, next) {
  next();

  if (!req.body.likes) {
    return;
  }
  if (!req.payload.authorEmail) {
    return;
  }

  var authorEmail = req.payload.authorEmail;
  var likes = req.payload.likes;

  getData('posts', {
    filter: 'uuid:' + req.payload.id
  }, function(err, posts) {

    if (err || posts.length === 0) {
      return;
    }

    var post = posts[0];

    sendMail({
      to: authorEmail,
      subject: 'Someone liked your article "' + post.title + '"',
      html: '<p>There are now a total of ' + likes + ' likes on your article "' + post.title + '"<br><a href="' + ghostURL + post.url + '">' + ghostURL + post.url + '</a></p>'
    });
  });

};
