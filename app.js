// Dependencies
const DSServer = require('ds-server');
const RedisCRUD = require('ds-redis-crud');

const crud = new RedisCRUD({
  schema: require('./schema/meta'),
  redisHost: process.env.REDIS_HOST,
  redisKey: process.env.REDIS_KEY,
  dbIndex: process.env.REDIS_DB_INDEX || 1,
});

// Setup server

const server = new DSServer({
  port: '3021',
  websocket: false,
});

const app = server.app;

app.use(require('./middlewares/add-cors-headers'));
app.use(require('./middlewares/allow-options-requests'));
app.use(require('./middlewares/email-to-gravatar'));

app.get('/search', require('./middlewares/search'));

crud.createRESTInterface(app, {
  get: true,
  post: true,
  put: true,
  delete: true,
});

app.use(require('./middlewares/enhance-responses'));
app.put('/', require('./middlewares/email-on-new-responses'));
app.put('/', require('./middlewares/email-on-like'));
app.use(require('./middlewares/transform-to-ds-server-v2'));

server.listen();
