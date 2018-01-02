const messages = require('../lib/messages');
const log = require('../lib/logger');

function results(req, res) {
  if (res.locals.services.length > 0) {
    res.render('7-results');
  } else {
    res.render('7-no-results');
  }
}

function searchForServices(req, res) {
  res.render('6-location.hbs');
}

function postcodeError(error, postcode, res, next) {
  log.debug({ postcode }, 'Error in postcode');
  res.locals.errorMessage = messages.technicalProblems();
  next(error);
}

function postcodeNotEnglish(req, res) {
  const postcodeHash = { isOutcode: req.query.isOutcode === 'true', term: req.query.postcode };
  res.locals.outOfEnglandMessage = messages.outOfEngland(postcodeHash);
  log.debug({ query: req.query, postcodeHash, message: res.locals.outOfEnglandMessage });
  log.info(res);
  res.render('7-outside-england');
}

function setInvalidPostcodeLabel(res, postcode) {
  res.locals.searchErrorLabel = `The postcode '${postcode}' does not exist`;
  res.locals.searchErrorClass = 'postcode';
  res.locals.errorMessage = messages.invalidPostcode();
}

function invalidPostcodePage(postcode, req, res) {
  log.debug({ postcode }, 'Location failed validation');
  setInvalidPostcodeLabel(res, postcode);
  searchForServices(req, res);
}

module.exports = {
  results,
  searchForServices,
  postcodeError,
  postcodeNotEnglish,
  invalidPostcodePage,
};
