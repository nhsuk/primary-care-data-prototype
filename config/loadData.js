const log = require('../app/lib/logger');
const cache = require('memory-cache');
const Geo = require('geo-nearby');
const geohash = require('ngeohash');

// hand-crafted json from syndication
// const sexualHealthListPath = process.env.SEXUAL_HEALTH_PATH || '../data/chlamydia_u25s_sti_gsds';

// json Sexual Health data from db
const sexualHealthListPath = process.env.SEXUAL_HEALTH_PATH || '../data/query_sexual_health_20180115114514';

// json Chlamydia data from db
// const sexualHealthListPath = process.env.SEXUAL_HEALTH_PATH || '../data/query_Chlamydia_gsd_20180110121014';

// eslint-disable-next-line import/no-dynamic-require
const services = require(sexualHealthListPath);
// const postcodesDict = cache.get('postcodesDict');
var uniqueOrganisationNames = [];

log.info(`Loaded data from ${sexualHealthListPath}`);

function loadData() {
  const mappedOrgs =
    services.filter((item) => {
      // hand-crafted json from syndication
      if ((item.feed) && (item.feed.entry.content.service)) {
        /* eslint-disable no-param-reassign */
        item.latitude = item.feed.entry.content.service.latitude.__text;
        item.longitude = item.feed.entry.content.service.longitude.__text;
        item.g = geohash.encode_int(item.latitude, item.longitude);
        /* eslint-enable no-param-reassign */
        return true;
      } else { // json data from db
          if (uniqueOrganisationNames.includes(item.OrganisationName)) {
            return false;
          } else {
            uniqueOrganisationNames.push(item.OrganisationName);
            /* eslint-disable no-param-reassign */
            // item.latitude = postcodesDict[item.Postcode].latitude;
            // item.longitude = postcodesDict[item.Postcode].longitude;
            item.latitude = item.Latitude;
            item.longitude = item.Longitude;
            item.g = geohash.encode_int(item.latitude, item.longitude);
            /* eslint-enable no-param-reassign */
            return true;
          }
      }
    log.warn(`No location found for: ${item.identifier}`);
    return false;
  });

  const geo = new Geo(mappedOrgs);

  cache.put('geo', geo);
  cache.put('services', services);
  log.info(`${mappedOrgs.length} services available for searching`);
}

module.exports = loadData;
