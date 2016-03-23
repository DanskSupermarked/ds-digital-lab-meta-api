const md5 = require('md5');
const querystring = require('querystring');

module.exports = function emailToGravatar(req, res, next) {
  if (req.body.responses && Array.isArray(req.body.responses)) {
    req.body.responses.forEach(response => {
      if (!response.image) {
        // Default is a random image from unsplash
        response.image = `https://unsplash.it/84/84?image=${Math.ceil(Math.random() * 1000)}`;

        // If there is a gravatar on the e-mails this is used
        if (response.email) {
          response.image = `https://gravatar.com/avatar/${md5(response.email)}?${querystring.stringify({ s: 84, d: response.image })}`;
        }
      }

      delete response.email;
    });
  }
  next();
};
