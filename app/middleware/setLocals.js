function fromRequest(req, res, next) {
  res.locals.hasSymptoms = req.query.hasSymptoms;
  res.locals.age = req.query.age;
  res.locals.multiChoose = req.query.multiChoose;
  if (req.query.loc2 !== undefined) {
    res.locals.search =  req.query.loc2;
  } else {
    res.locals.search =  req.query.loc;
  }

  next();
}

module.exports = {
  fromRequest,
};
