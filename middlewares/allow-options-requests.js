module.exports = function(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};
