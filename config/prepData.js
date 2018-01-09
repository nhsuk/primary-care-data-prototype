const log = require('../app/lib/logger');
const cache = require('memory-cache');
const request = require('request');

async function getGeoData(postcodes) {
  return new Promise((resolve, reject) => {
    request.post({ url: 'https://api.postcodes.io/postcodes', headers: {'content-type': 'application/json'},
    json: { "postcodes": postcodes }}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
    resolve(body.result);
  } else {
    reject(error);
  }
});
});
}

async function getPostcodes(postcodes, postcodesDict) {
  try {
    const response = await getGeoData(postcodes);
    response.filter((item) => {
      var info = item.result;
      if (info) {
        postcodesDict[info.postcode] = { latitude: info.latitude, longitude: info.longitude };
        return true;
      } else {
        return false;
      }
    });
  } catch (ex) {
    log.error(ex);
  }
}


// hand-crafted json from syndication
// const sexualHealthListPath = process.env.SEXUAL_HEALTH_PATH || '../data/chlamydia_u25s_sti_gsds';

// json data from db
const sexualHealthListPath = process.env.SEXUAL_HEALTH_PATH || '../data/sp_chlamydia_gsd_20171228162814';

const services = require(sexualHealthListPath);
var uniqueOrganisationNames = [];


function prepData() {
  log.info(`Preped data from ${sexualHealthListPath}`);
  var postcodes = [];
  services.filter((item) => {
    // hand-crafted json from syndication
    if ((item.feed) && (item.feed.entry.content.service)) {
     /* eslint-disable no-param-reassign */
     return false;
    } else { // json data from db
      if (uniqueOrganisationNames.includes(item.OrganisationName)) {
        return false;
      } else {
        uniqueOrganisationNames.push(item.OrganisationName);
        postcodes.push(item.Postcode);
        return true;
      }
    }
  });

  var postcodesDict = {};
  var postcodeChunks = [], size = 10;

  while (postcodes.length > 0) {
    postcodeChunks.push(postcodes.splice(0, size));
  }

  for (const postcodeChunk of postcodeChunks) {
    //  max 100 postcodes per request
    const result = getPostcodes(postcodeChunk, postcodesDict);

  }
  cache.put('postcodesDict', postcodesDict);
  log.info('postcodesDict' + postcodesDict);
  log.info(`${postcodesDict.length} postcodes mapped`);
}

module.exports = prepData;