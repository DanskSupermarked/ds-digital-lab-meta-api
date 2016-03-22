const sendMail = require('../util/send-mail');
const getData = require('../util/get-data-from-ghost-api');

const ghostURL = process.env.GHOST_URL || 'http://localhost:3000';

module.exports = function emailOnLike(req, res, next) {
  next();

  if (!req.body.likes) {
    return;
  }
  if (!req.payload.authorEmail) {
    return;
  }

  const authorEmail = req.payload.authorEmail;
  const likes = req.payload.likes;

  getData('posts', {
    filter: `uuid: ${req.payload.id}`,
  }, (err, posts) => {
    if (err || posts.length === 0) {
      return;
    }

    const post = posts[0];

    sendMail({
      to: authorEmail,
      subject: `Someone liked your article "${post.title}"`,
      html: `
        <p>
          There are now a total of ${likes} likes on your article "${post.title}"<br>
          <a href="${ghostURL + post.url}">${ghostURL + post.url}</a>
        </p>`,
    });
  });
};
