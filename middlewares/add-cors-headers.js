module.exports = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type, Accept-Ranges, X-Request-URL');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};
