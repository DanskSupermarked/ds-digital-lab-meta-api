// Dependencies
var DSServer = require('ds-server');
var RedisCRUD = require('ds-redis-crud');
var keepAlive = require('./util/keep-alive');

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

app.use(require('./middlewares/add-cors-headers'));
app.use(require('./middlewares/allow-options-requests'));
app.use(require('./middlewares/email-to-gravatar'));

app.get('/search', require('./middlewares/search'));

crud.createRESTInterface(app, {
  get: true,
  post: true,
  put: true,
  delete: true
});

app.use(require('./middlewares/enhance-responses'));

server.listen();

keepAlive('https://ds-digital-lab.azurewebsites.net/');
