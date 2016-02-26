// Dependencies
var DSServer = require('ds-server');
var RedisCRUD = require('ds-redis-crud');
var timeAgo = require('epoch-to-timeago').timeAgo;
var wordCount = require('word-count');

var crud = new RedisCRUD({
  schema: require('./schema/meta'),
  redisHost: process.env.REDIS_HOST,
  redisKey: process.env.REDIS_KEY,
  dbIndex: process.env.REDIS_DB_INDEX || 1
});

//////////////////
// Setup server //
//////////////////

var server = new DSServer({
  port: '3021',
  websocket: false,
  parseError: true
});

var app = server.app;

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type, Accept-Ranges, X-Request-URL');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(function(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

crud.createRESTInterface(app, {
  get: true,
  post: true,
  put: true,
  delete: true
});

app.use(function(req, res, next) {
  if (req.payload && req.payload.responses && req.query.raw === undefined) {

    var now = Date.now();
    req.payload.responses.forEach(function(response) {

      // Time ago
      var published = new Date(response.published).getTime();
      response.timeAgo = timeAgo(published, now);

      // Read time and excerpt
      var spaces = Array(41).join(' ');
      var textWithSpaces = response.text.replace(/\r?\n/g, spaces);
      if (textWithSpaces.length > 300) {
        var spacePlacement = textWithSpaces.indexOf(' ', 300);
        response.excerpt = textWithSpaces.substr(0, spacePlacement) + '...';
        response.excerpt = response.excerpt.replace(new RegExp(spaces, 'g'), '\n');

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

});

server.listen();
