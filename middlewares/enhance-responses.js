/**
 * Add read-time and time-ago to all responses for easier use in frontend.
 */

var timeAgo = require('epoch-to-timeago').timeAgo;
var wordCount = require('word-count');
var marked = require('marked');

var renderer = new marked.Renderer();

renderer.heading = function(text, level) {
  return '<p class="h' + level + '"">' + text + '</p>';
};

marked.setOptions({
  renderer: renderer,
  sanitize: true
});

module.exports = function(req, res, next) {
  if (req.payload && req.payload.responses && req.query.raw === undefined) {

    var now = Date.now();
    req.payload.responses.forEach(function(response) {

      // Time ago
      var published = new Date(response.published).getTime();
      response.timeAgo = timeAgo(published, now);

      // Markdown to html
      response.html = marked(response.text);

      // Read time and excerpt
      var spaces = Array(41).join(' ');
      var textWithSpaces = response.text.replace(/\r?\n/g, spaces);
      if (textWithSpaces.length > 300) {
        var spacePlacement = textWithSpaces.indexOf(' ', 300);
        response.excerpt = textWithSpaces.substr(0, spacePlacement) + '...';
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
