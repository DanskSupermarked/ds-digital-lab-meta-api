module.exports = function search(req, res, next) {
  res.body = req.payload;
  next();
};
