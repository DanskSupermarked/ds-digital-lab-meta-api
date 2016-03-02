module.exports = function(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    return res.send(204);
  }
  next();
};
