const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const messages = require('../lib/messages');

function isEmptySearch(searchTermName) {
  return !(searchTermName);
}

function validateSearch(req, res, next) {
  const searchTermName = res.locals.search;

  if (isEmptySearch(searchTermName)) {
    log.info('Empty Search');
    res.locals.errorMessage = messages.emptySearch();
    res.locals.searchErrorLabel = 'You need to enter some text';
    res.locals.searchErrorClass = 'blank';
    renderer.searchForServices(req, res);
  } else {
    next();
  }
}

module.exports = validateSearch;
