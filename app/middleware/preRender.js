const messages = require('../lib/messages');

function preRender(req, res, next) {
  const postcode =
    (res.locals.search) ?
      { isOutcode: res.locals.postcodeLocationDetails.isOutcode, term: res.locals.search }
      : undefined;

  res.locals.noResultsMessage = messages.noResults(postcode);
  if (res.locals.noResultsMessage) {
    res.locals.searchErrorClass = res.locals.noResultsMessage.class;
  }

  const hasSymptoms = res.locals.hasSymptoms;
  const age = res.locals.age;
  const multiChoose = res.locals.multiChoose;

  if (hasSymptoms === 'yes') {
    if (multiChoose.includes('choose-location')) {
      res.locals.locationHeading = 'Places you can see a sexual heath professional'
      res.locals.partialHeading = [undefined];
      res.locals.partials = ['sexual-health-providers'];
    }
  } else if (hasSymptoms === 'no') {
    if (multiChoose.length == 3) {
      if ((multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy'))
        && (multiChoose.includes('choose-online'))) {
        if (parseInt(age) >= 25) {
          res.locals.partialHeading = ['sexual-health-providers', 'pharmacies', 'online-providers'];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          res.locals.partialHeading = ['pharmacies', 'online-providers', 'sexual-health-providers'];
        }
        res.locals.locationHeading = 'Where you can get a test';
        res.locals.partials = partialHeading;
      }
    } else if (multiChoose.length == 2) {
      if ((multiChoose.includes('choose-location')) && (multiChoose.includes('choose-pharmacy'))) {
        if (parseInt(age) >= 25) {
          res.locals.partialHeading = ['sexual-health-providers', 'online-providers'];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          res.locals.partialHeading = ['pharmacies', 'sexual-health-providers'];
        }
      }
      if ((multiChoose.includes('choose-online')) && (multiChoose.includes('choose-location'))) {
        if (parseInt(age) >= 25) {
          res.locals.partialHeading = ['sexual-health-providers', 'online-providers'];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          res.locals.partialHeading = ['online-providers', 'sexual-health-providers'];
        }
      }
      if ((multiChoose.includes('choose-online')) && (multiChoose.includes('choose-pharmacy'))) {
        res.locals.partialHeading = ['pharmacies', 'online-providers'];
      }
      res.locals.locationHeading = 'Where you can get a test';
      res.locals.partials = partialHeading;
    } else {
      if (multiChoose.includes('choose-location')) {
        res.locals.locationHeading = 'Places you can see a sexual heath professional'
        res.locals.partials = ['sexual-health-providers'];
      } else if (multiChoose.includes('choose-pharmacy')) {
        res.locals.locationHeading = 'Pharmacies where you can buy a self-test kit'
        res.locals.partials = ['pharmacies'];
      } else if (multiChoose.includes('choose-online')) {
        res.locals.locationHeading = 'Where to order a self-test kit online'
        res.locals.partials = ['online-providers'];
      }
      res.locals.partialHeading = [undefined];
    }
  }

  next();
}

module.exports = preRender;
