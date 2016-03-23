const sendMail = require('../util/send-mail');
const getData = require('../util/get-data-from-ghost-api');
const marked = require('marked');

const renderer = new marked.Renderer();

renderer.heading = (text, level) => `<p class="h${level}">${text}</p>`;

marked.setOptions({
  renderer,
  sanitize: true,
});

const ghostURL = process.env.GHOST_URL || 'http://localhost:3000';

module.exports = function emailOnNewResponse(req, res, next) {
  next();

  if (!Array.isArray(req.body.responses) || req.body.responses.length === 0) {
    return;
  }
  if (!req.payload.authorEmail) {
    return;
  }

  const authorEmail = req.payload.authorEmail;
  const responses = req.payload.responses;
  const latestResponse = responses[responses.length - 1];

  // More than 10 secs old
  if (Date.now() > new Date(latestResponse.published).getTime() + 10 * 1000) {
    return;
  }

  getData('posts', {
    filter: `uuid:${req.payload.id}`,
  }, (err, posts) => {
    if (err || posts.length === 0) {
      return;
    }

    const post = posts[0];

    sendMail({
      to: authorEmail,
      subject: `New response to your article "${post.title}"`,
      html: `
        ${marked(latestResponse.text)}
        <p>/ ${latestResponse.name}</p>
        <p><a href="${ghostURL + post.url}">${ghostURL + post.url}</a></p>`,
    });
  });
};
