const log = require('../app/lib/logger');
const cache = require('memory-cache');
const Geo = require('geo-nearby');
const geohash = require('ngeohash');

const sexualHealthListPath = process.env.SEXUAL_HEALTH_PATH || '../data/chlamydia_u25s_sti_gsds';
// eslint-disable-next-line import/no-dynamic-require
const services = require(sexualHealthListPath);

log.info(`Loaded data from ${sexualHealthListPath}`);

function loadData() {
  const mappedOrgs =
    services.filter((item) => {
      if (item.feed.entry.content.service) {
    /* eslint-disable no-param-reassign */
    item.longitude = item.feed.entry.content.service.longitude.__text;
    item.latitude = item.feed.entry.content.service.latitude.__text;
    item.g = geohash.encode_int(item.latitude, item.longitude);
    /* eslint-enable no-param-reassign */
    return true;
  }
  log.warn(`No location found for: ${item.identifier}`);
  return false;
});

  const geo = new Geo(mappedOrgs);

  cache.put('geo', geo);
  cache.put('services', services);
  log.info(`${services.length} services available for searching`);
}

module.exports = loadData;
