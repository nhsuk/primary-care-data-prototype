const log = require('../lib/logger');
const PostcodesIOClient = require('postcodesio-client');
// const postcodesIORequestHistogram = require('../lib/promHistograms').postcodesIORequest;

// rewire (a framework for mocking) doesn't support const
// eslint-disable-next-line no-var
var PostcodesIO = new PostcodesIOClient();
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function toArray(countries) {
  return Array.isArray(countries) ? countries : [countries];
}

function isOutcode(postcodeDetails) {
  return !postcodeDetails.incode;
}

function postcodeDetailsMapper(postcodeDetails) {
  return {
    isOutcode: isOutcode(postcodeDetails),
    location: {
      lat: postcodeDetails.latitude,
      lon: postcodeDetails.longitude
    },
    countries: toArray(postcodeDetails.country)
  };
}

async function lookupPostcode(req, res, next) {
  const search = res.locals.search;

  log.debug({ search }, 'postcode search text');
  // const endTimer = postcodesIORequestHistogram.startTimer();
  if (search) {
    try {
      const postcodeDetails = await PostcodesIO.lookup(search);
      log.debug({ postcodeIOResponse: { postcodeDetails } }, 'PostcodeIO postcode response');
      if (postcodeDetails) {
        res.locals.postcodeLocationDetails = postcodeDetailsMapper(postcodeDetails);
        next();
      } else {
        renderer.invalidPostcodePage(search, req, res);
      }
    } catch (error) {
      renderer.postcodeError(error, search, req, res);
    // } finally {
    //   endTimer();
    }
  } else {
    log.debug('no postcode');
    next();
  }
}

module.exports = lookupPostcode;
