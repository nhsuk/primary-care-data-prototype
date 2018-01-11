const messages = require('../lib/messages');
const log = require('../lib/logger');

function results(req, res) {
  if ((res.locals.pharmacies.length > 0) || (res.locals.onlineProviders.length > 0) || (res.locals.SHProviders.length > 0)) {
    log.info(res.locals.partialContexts);
    res.render('7-results');
  } else {
    res.render('7-no-results');
  }
}

function searchForServices(req, res) {
  if (((res.locals.multiChoose.includes('location')) || (res.locals.multiChoose.includes('pharmacy'))) && (res.locals.multiChoose.includes('online'))) {
    res.render('6-location-all3');
  } else if ((res.locals.multiChoose.includes('location')) || (res.locals.multiChoose.includes('pharmacy'))) {
    res.render('6-location');
  } else {
    res.render('6-location-online');
  }

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
