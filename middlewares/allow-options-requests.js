module.exports = function allowOptionsRequest(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
};
