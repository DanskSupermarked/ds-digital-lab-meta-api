var sendMail = require('../util/send-mail');
var getData = require('../util/get-data-from-ghost-api');

module.exports = function(req, res, next) {
  next();

  if (!Array.isArray(req.body.responses) || req.body.responses.length === 0) {
    return;
  }
  if (!req.payload.authorEmail) {
    return;
  }

  var responses = req.payload.responses;
  var latestResponse = responses[responses.length - 1];

  // More than 10 secs old
  if (Date.now() > new Date(latestResponse.published).getTime() + 10 * 1000) {
    return;
  }

  getData('posts', {
    filter: 'uuid:' + latestResponse.id
  }, function(err, posts) {

    if (err || posts.length === 0) {
      return;
    }

    var post = posts[0];

    sendMail({
      to: req.payload.authorMail,
      subject: 'New response to your article "' + post.title + '"',
      message: latestResponse.text + '\n\n' + '/ ' + latestResponse.name + '\n\n<a href="https://ds-digital-lab.azurewebsites.net' + post.url + '">https://ds-digital-lab.azurewebsites.net' + post.url + '</a>'
    });
  });

};
