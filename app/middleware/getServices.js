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

function mapResults(results, res, search) {
  res.locals.services = results.map((result) => {
    const newService = result.feed.entry;
    if (newService) {
      newService.distance = result.distanceInMiles.toFixed(2);
      // eslint-disable-next-line no-underscore-dangle
      newService.name = newService.title.__text;
      if (newService.content) {
        // eslint-disable-next-line no-underscore-dangle
        newService.tel = newService.content.service.contact.telephone.__text;
        newService.address = `${newService.content.service.address.addressLine[0].__text}, ${newService.content.service.address.addressLine[1].__text}, ${newService.content.service.address.addressLine[2].__text}, ${newService.content.service.address.postcode.__text}`;
      }
      if (newService.link) {
        // eslint-disable-next-line no-underscore-dangle
        newService.url = newService.link[1]._href;
      }
    }

    return newService;
  });
  // res.locals.resultsHeader = resultsFormat.pluraliseSurgeryQuestion(res.locals.services.length);
  // res.locals.resultsSubHeader = resultsFormat.pluraliseSurgery(res.locals.services.length, search);
}

module.exports = getServices;
