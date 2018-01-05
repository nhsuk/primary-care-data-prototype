const services = require('../lib/getServices');
const cache = require('memory-cache');
const log = require('../lib/logger');


function getServices(req, res, next) {
  // req.checkQuery('latitude', 'latitude is required').notEmpty();
  // req.checkQuery('longitude', 'longitude is required').notEmpty();
  // req.checkQuery('latitude', 'latitude must be between -90 and 90').isFloat({ min: -90, max: 90 });
  // req.checkQuery('longitude', 'longitude must be between -180 and 180').isFloat({ min: -180, max: 180 });
  req.checkQuery('limits:results:open', 'limits:results:open must be a number between 1 and 10').optional().isInt({ min: 1, max: 10 });
  req.checkQuery('limits:results:nearby', 'limits:results:nearby must be a number between 1 and 10').optional().isInt({ min: 1, max: 10 });

  const errors = req.validationErrors();

  if (errors) {
    log.warn(errors, 'getServices errors');
    res.status(400).json(errors);
  } else {
    const latitude = res.locals.postcodeLocationDetails.location.lat; // res.query.latitude;
    const longitude = res.locals.postcodeLocationDetails.location.lon; // res.query.longitude;
    const nearby = req.query['limits:results:nearby'] || 10;
    // const open = req.query['limits:results:open'] || 1;
    // Given how search performance is impacted by the radius of the search
    // it has intentionaly not been allowed to be specificed by the client
    const searchRadius = 50; // TODO: no data under 40

    const searchPoint = { latitude, longitude };
    const geo = cache.get('geo');
    const limits = { nearby,
      // open,
      searchRadius };

    log.info('get-services-start');
    const closeByServices = services.nearby(searchPoint, geo, limits);
    log.info('get-services-end');

    // res.json({ nearby: closeByServices.nearbyServices
      // ,
      // open: closeByServices.openServices
    // });
    mapResults(closeByServices.nearbyServices, res, res.locals.search);
    next();
  }
}

function mapResults(results, res) {
  var uniqueUrls = [];
  var pharmacies = [];
  var SHProviders = [];
  var onlineProviders = [];

  const symptomFilter = res.locals.hasSymptoms;
  const locationFilter = res.locals.multiChoose;
  const ageFilter = res.locals.age;

  results.forEach((result) => {

    var newService = result.feed.entry;

    if (ageFilter >= 25) {
      if ((result.feed.u25 !== undefined) && (result.feed.u25 === 'true') && (result.feed.generalPublic === 'false')) {
        return;
      }
    }

    if (symptomFilter === 'yes') {
      if (result.feed.type === 'pharmacy') {
        return;
      }
      if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
        return;
      }
    } else {
      if ((result.feed.online !== undefined) && (result.feed.online === 'true') && !locationFilter.includes('online')) {
        return;
      }

      if (!locationFilter.includes('pharmacy') && (result.feed.type === 'pharmacy')){
        return;
      }

      if (!locationFilter.includes('location') &&
          ((result.feed.type === 'pharmacy') ||
            ((result.feed.online !== undefined) && (result.feed.online === 'true'))
          )){
        return;
      }
    }
    if (newService) {
      newService.distance = result.distanceInMiles.toFixed(2);
      // eslint-disable-next-line no-underscore-dangle
      newService.name = newService.title.__text;
      if ((newService.content) && (newService.content.service)) {
        if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
          // eslint-disable-next-line no-underscore-dangle
          newService.url = newService.content.service.WebAddress.__text;
        } else {
          // eslint-disable-next-line no-underscore-dangle
          newService.tel = newService.content.service.contact.telephone.__text;
          // eslint-disable-next-line no-underscore-dangle
          newService.address = `${newService.content.service.address.addressLine[0].__text}, ${newService.content.service.address.addressLine[1].__text}, ${newService.content.service.address.addressLine[2].__text}, ${newService.content.service.address.postcode.__text}`;
        }
      }
      if (newService.link) {
        // eslint-disable-next-line no-underscore-dangle
        newService.choicesUrl = newService.link[1]._href;
        if (uniqueUrls.includes(newService.choicesUrl)) {
          newService = null;
        } else {
          uniqueUrls.push(newService.choicesUrl);
        }
      }
    }
    if (newService) {
      if (result.feed.type == 'pharmacy') {
        pharmacies.push(newService);
      } else if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
        onlineProviders.push(newService);
      } else {
        SHProviders.push(newService);
      }
    }
  });

  res.locals.pharmacies = pharmacies;
  res.locals.onlineProviders = onlineProviders;
  res.locals.SHProviders = SHProviders;

  // log.info(pharmacies);
  // log.info(onlineProviders);
  // log.info(SHProviders);
}

module.exports = getServices;
