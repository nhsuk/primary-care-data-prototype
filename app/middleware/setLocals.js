const log = require('../lib/logger');

function processPreferredTimes(prefTimes) {
  log.info(prefTimes);
  if (prefTimes.length === 5) {
    return ['all'];
  } else if (prefTimes.length === 4) {
    if (prefTimes.contains("wend") || prefTimes.contains("oohwdays")) {
      return ['wend'];
    } else {
      return ['wdays'];
    }
  }
  return prefTimes;
}

function fromRequest(req, res, next) {
  res.locals.hasSymptoms = req.query.hasSymptoms;
  res.locals.age = req.query.age;
  res.locals.multiChoose = (req.query.multiChoose.includes(',') ?
    req.query.multiChoose.split(',') : [req.query.multiChoose]);
  let prefTimes = (req.query.prefTimes.includes(',') ?
    req.query.prefTimes.split(',') : [req.query.prefTimes]);
  res.locals.prefTimes = processPreferredTimes(prefTimes);

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
