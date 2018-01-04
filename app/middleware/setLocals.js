function fromRequest(req, res, next) {
  res.locals.hasSymptoms = req.query.hasSymptoms;
  res.locals.age = req.query.age;
  res.locals.multiChoose = req.query.multiChoose.split(',');
  if (req.query.loc1 !== undefined) {
    res.locals.search =  req.query.loc1;
  } else {
    res.locals.search =  req.query.loc;
  }

  next();
}

module.exports = {
  fromRequest,
};
