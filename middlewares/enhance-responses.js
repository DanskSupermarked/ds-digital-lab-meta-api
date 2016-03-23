/**
 * Add read-time and time-ago to all responses for easier use in frontend.
 */

const timeAgo = require('epoch-to-timeago').timeAgo;
const wordCount = require('word-count');
const marked = require('marked');

const renderer = new marked.Renderer();

renderer.heading = (text, level) => `<p class="h${level}">${text}</p>`;

marked.setOptions({
  renderer,
  sanitize: true,
});

module.exports = function enhanceResponses(req, res, next) {
  if (req.payload && req.payload.responses && req.query.raw === undefined) {
    const now = Date.now();
    req.payload.responses.forEach(response => {
      // Time ago
      const published = new Date(response.published).getTime();
      response.timeAgo = timeAgo(published, now);

      // Markdown to html
      response.html = marked(response.text);

      // Read time and excerpt
      const spaces = Array(41).join(' ');
      const textWithSpaces = response.text.replace(/\r?\n/g, spaces);
      if (textWithSpaces.length > 300) {
        const spacePlacement = textWithSpaces.indexOf(' ', 300);
        response.excerpt = `${textWithSpaces.substr(0, spacePlacement)}...`;
        response.excerpt = response.excerpt.replace(new RegExp(spaces, 'g'), '\n');

        response.excerpt = marked(response.excerpt);

        response.readTime = Math.ceil(wordCount(response.text) / 300);
        if (response.readTime > 1) {
          response.readTime += ' mins';
        } else {
          response.readTime += ' min';
        }
      }
    });
  }

  next();
};
