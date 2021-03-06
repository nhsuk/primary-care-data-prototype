const log = require('../../app/lib/logger');
// const OpeningTimes = require('moment-opening-times');
// const moment = require('moment');
const geolib = require('geolib');
const assert = require('assert');
// const utils = require('../lib/utils');
// const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');

const metersInAMile = 1609;

function sortByDistance(a, b) {
  return a.distanceInMiles - b.distanceInMiles;
}

function getDistanceInMiles(start, end) {
  const distanceInMeters = geolib.getDistance(start, end);
  return distanceInMeters / metersInAMile;
}

function nearby(searchPoint, geo, limits) {
  // TODO: Move geo into this module rather than passing it in
  assert(geo, 'geo can not be null');
  assert.equal(typeof (geo.nearBy), 'function', 'geo must contain a nearBy function');

  // const openServices = [];
  let serviceCount = 0;
  // let openServiceCount = 0;

  log.debug('get-nearby-results-start');
  const nearbyGeo =
    geo.nearBy(searchPoint.latitude, searchPoint.longitude, limits.searchRadius * metersInAMile);
  log.debug('get-nearby-results-end');

  log.debug(`Found ${nearbyGeo.length} nearby results`);
  log.debug('add-distance-start');
  const nearbyOrgs = nearbyGeo.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = getDistanceInMiles(searchPoint, item);

  return item;
});
  log.debug('add-distance-end');

  log.debug('sort-nearby-results-start');
  const sortedOrgs = nearbyOrgs.sort(sortByDistance);
  log.debug('sort-nearby-results-end');

  // log.debug('filter-open-results-start');
  // for (let i = 0; i < sortedOrgs.length; i++) {
  //   const item = sortedOrgs[i];
  //   const openingTimes = item.openingTimes;
  //   const now = moment();
  //   let isOpen;
  //   let openingTimesMessage;
  //
  //   if (openingTimes) {
  //     const openingTimesMoment =
  //       new OpeningTimes(
  //         item.openingTimes.general,
  //         'Europe/London',
  //         item.openingTimes.alterations);
  //
  //     const status = openingTimesMoment.getStatus(now, { next: true });
  //     openingTimesMessage = getOpeningHoursMessage(status);
  //     isOpen = status.isOpen;
  //   } else {
  //     openingTimesMessage = 'Call for opening times';
  //     isOpen = false;
  //   }
  //
  //   item.openingTimesMessage = openingTimesMessage;
  //   item.isOpen = isOpen;
  //
  //   if (isOpen && openServiceCount < limits.open) {
  //     openServiceCount += 1;
  //     openServices.push(utils.deepClone(item));
  //   }
  //
  //   serviceCount += 1;
  //
  //   if (openServiceCount >= limits.open && serviceCount >= limits.nearby) {
  //     break;
  //   }
  // }
  // log.debug('filter-open-results-end');

  return {
    nearbyServices: sortedOrgs.slice(0, limits.nearby)
    // ,
    // openServices,
  };
}

module.exports = {
  nearby,
};
