function stripWhitespace(req, res, next) {
  if (res.locals.search) {
    res.locals.search = res.locals.search.trim();
  }
  next();
}

module.exports = stripWhitespace;
