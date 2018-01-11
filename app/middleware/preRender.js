const messages = require('../lib/messages');

function preRender(req, res, next) {
  const postcode =
    (res.locals.search) ?
      { isOutcode: res.locals.postcodeLocationDetails.isOutcode, term: res.locals.search }
      : undefined;

  res.locals.proximity = messages.postcodeProximityMessage(postcode);
  res.locals.noResultsMessage = messages.noResults(postcode);
  if (res.locals.noResultsMessage) {
    res.locals.searchErrorClass = res.locals.noResultsMessage.class;
  }

  const hasSymptoms = res.locals.hasSymptoms;
  const age = res.locals.age;
  const multiChoose = res.locals.multiChoose;
  var partials;

  if (hasSymptoms === 'yes') {
    if (multiChoose.includes('location')) {
      res.locals.locationHeading = `Places you can see a sexual health professional${res.locals.proximity}`;
      res.locals.partialContexts = [ { partialHeadingExists: false, SHProviders: res.locals.SHProviders } ];
      res.locals.partials = ['sexual-health-providers'];
    }
  } else if (hasSymptoms === 'no') {
    if (multiChoose.length === 3) {
      if ((multiChoose.includes('location')) && (multiChoose.includes('pharmacy')) && (multiChoose.includes('online'))) {
        if (parseInt(age) >= 25) {
          partials = ['sexual-health-providers', 'pharmacies', 'online-providers'];
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Places you can see a someone', SHProviders: res.locals.SHProviders },
            { partialHeadingExists: true, partialHeading: 'Pharmacies where you can buy a self-test kit', pharmacies: res.locals.pharmacies },
            { partialHeadingExists: true, partialHeading: 'Where to buy a self-test kit online', onlineProviders: res.locals.onlineProviders } ];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          partials = ['pharmacies', 'online-providers', 'sexual-health-providers'];
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Places where you can pick up a self-test kit', pharmacies: res.locals.pharmacies },
            { partialHeadingExists: true, partialHeading: 'Where to order a self-test kit online', onlineProviders: res.locals.onlineProviders },
            { partialHeadingExists: true, partialHeading: 'Places you can see a someone', SHProviders: res.locals.SHProviders } ];
        }
        res.locals.locationHeading = `Where you can get a test${res.locals.proximity}`;
        res.locals.partials = partials;
      }
    } else if (multiChoose.length === 2) {
      if ((multiChoose.includes('location')) && (multiChoose.includes('pharmacy'))) {
        if (parseInt(age) >= 25) {
          partials = ['sexual-health-providers', 'pharmacies'];
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Places you can see a someone', SHProviders: res.locals.SHProviders },
            { partialHeadingExists: true, partialHeading: 'Pharmacies where you can buy a self-test kit', pharmacies: res.locals.pharmacies} ];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          partials = ['pharmacies', 'sexual-health-providers'];
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Places where you can pick up a self-test kit', pharmacies: res.locals.pharmacies}, {
            partialHeadingExists: true, partialHeading: 'Places you can see a someone', SHProviders: res.locals.SHProviders } ];
        }
      }
      if ((multiChoose.includes('online')) && (multiChoose.includes('location'))) {
        if (parseInt(age) >= 25) {
          partials = ['sexual-health-providers', 'online-providers'];
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Places you can see a someone', SHProviders: res.locals.SHProviders },
            { partialHeadingExists: true, partialHeading: 'Where to buy a self-test kit online', onlineProviders: res.locals.onlineProviders} ];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          partials = ['online-providers', 'sexual-health-providers'];
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Where to order a self-test kit online', onlineProviders: res.locals.onlineProviders},
            { partialHeadingExists: true, partialHeading: 'Places you can see a someone', SHProviders: res.locals.SHProviders } ];
        }
      }
      if ((multiChoose.includes('online')) && (multiChoose.includes('pharmacy'))) {
        partials = ['pharmacies', 'online-providers'];
        if (parseInt(age) >= 25) {
          res.locals.partialContexts = [ { partialHeadingExists: true, partialHeading: 'Pharmacies where you can buy a self-test kit',  pharmacies: res.locals.pharmacies},
            { partialHeadingExists: true, partialHeading: 'Where to buy a self-test kit online', onlineProviders: res.locals.onlineProviders} ];
        } else if ((parseInt(age) >= 16) && (parseInt(age) < 25)) {
          res.locals.partialContexts = [{ partialHeadingExists: true, partialHeading: 'Places where you can pick up a self-test kit',  pharmacies: res.locals.pharmacies },
            { partialHeadingExists: true, partialHeading: 'Where to order a self-test kit online', onlineProviders: res.locals.onlineProviders}];
        }
      }
      res.locals.locationHeading = `Where you can get a test${res.locals.proximity}`;
      res.locals.partials = partials;
    } else {
      if (multiChoose.includes('location')) {
        res.locals.locationHeading = `Places you can see a sexual health professional${res.locals.proximity}`;
        res.locals.partials = ['sexual-health-providers'];
        res.locals.partialContexts = [{partialHeadingExists: false, SHProviders: res.locals.SHProviders}];
      }
      if (multiChoose.includes('pharmacy')) {
        if (parseInt(age) >= 25) {
          res.locals.locationHeading = `Pharmacies where you can buy a self-test kit${res.locals.proximity}`;
        } else {
          res.locals.locationHeading = `Places where you can pick up a self-test kit${res.locals.proximity}`;
        }
        res.locals.partials = ['pharmacies'];
        res.locals.partialContexts = [{partialHeadingExists: false, pharmacies: res.locals.pharmacies}];
      }
      if (multiChoose.includes('online')) {
        if (parseInt(age) >= 25) {
          res.locals.locationHeading = `Where to buy a self-test kit online${res.locals.proximity}`;
        }
        else {
          res.locals.locationHeading = `Where to order a self-test kit online${res.locals.proximity}`;
        }
        res.locals.partials = ['online-providers'];
        res.locals.partialContexts = [{partialHeadingExists: false, onlineProviders: res.locals.onlineProviders}];
      }
    }
  }

  next();
}

module.exports = preRender;
