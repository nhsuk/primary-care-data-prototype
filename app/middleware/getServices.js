const services = require('../lib/getServices');
const cache = require('memory-cache');
const log = require('../lib/logger');
const qs = require('querystring');


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
    const nearby = req.query['limits:results:nearby'] || 123;
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

// hand-crafted json from syndication
// function mapResults(results, res) {
//   var uniqueUrls = [];
//   var pharmacies = [];
//   var SHProviders = [];
//   var onlineProviders = [];
//
//   const symptomFilter = res.locals.hasSymptoms;
//   const locationFilter = res.locals.multiChoose;
//   const ageFilter = res.locals.age;
//
//   results.forEach((result) => {
//
//     var newService = result.feed.entry;
//
//     if (ageFilter >= 25) {
//       if ((result.feed.u25 !== undefined) && (result.feed.u25 === 'true') && (result.feed.generalPublic === 'false')) {
//         return;
//       }
//     }
//
//     if (symptomFilter === 'yes') {
//       if (result.feed.type === 'pharmacy') {
//         return;
//       }
//       if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
//         return;
//       }
//     } else {
//       if ((result.feed.online !== undefined) && (result.feed.online === 'true') && !locationFilter.includes('online')) {
//         return;
//       }
//
//       if (!locationFilter.includes('pharmacy') && (result.feed.type === 'pharmacy')){
//         return;
//       }
//
//       if (!locationFilter.includes('location') &&
//           ((result.feed.type === 'pharmacy') ||
//             ((result.feed.online !== undefined) && (result.feed.online === 'true'))
//           )){
//         return;
//       }
//     }
//     if (newService) {
//       newService.distance = result.distanceInMiles.toFixed(2);
//       // eslint-disable-next-line no-underscore-dangle
//       newService.name = newService.title.__text;
//       if ((newService.content) && (newService.content.service)) {
//         if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
//           // eslint-disable-next-line no-underscore-dangle
//           newService.url = newService.content.service.WebAddress.__text;
//         } else {
//           // eslint-disable-next-line no-underscore-dangle
//           newService.tel = newService.content.service.contact.telephone.__text;
//           // eslint-disable-next-line no-underscore-dangle
//           newService.address = `${newService.content.service.address.addressLine[0].__text}, ${newService.content.service.address.addressLine[1].__text}, ${newService.content.service.address.addressLine[2].__text}, ${newService.content.service.address.postcode.__text}`;
//         }
//       }
//       if (newService.link) {
//         // eslint-disable-next-line no-underscore-dangle
//         newService.choicesUrl = newService.link[1]._href;
//         if (uniqueUrls.includes(newService.choicesUrl)) {
//           newService = null;
//         } else {
//           uniqueUrls.push(newService.choicesUrl);
//         }
//       }
//     }
//     if (newService) {
//       if (result.feed.type == 'pharmacy') {
//         pharmacies.push(newService);
//       } else if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
//         onlineProviders.push(newService);
//       } else {
//         SHProviders.push(newService);
//       }
//     }
//   });
//
//   res.locals.pharmacies = pharmacies;
//   res.locals.onlineProviders = onlineProviders;
//   res.locals.SHProviders = SHProviders;
//
//   // log.info(pharmacies);
//   // log.info(onlineProviders);
//   // log.info(SHProviders);
// }

// json data from db
function mapResults(results, res) {
  var uniqueURLs = [];
  var uniqueDistances = [];
  var pharmacies = [];
  var SHProviders = [];
  var onlineProviders = [];
  var baseURL;

  const symptomFilter = res.locals.hasSymptoms;
  const locationFilter = res.locals.multiChoose;
  // const timeFilter = res.locals.preferredTimes;
  const ageFilter = res.locals.age;

  const allOpeningTimes = ['opening-times-aroundworkweekdays', 'opening-times-lunchweekdays', 'opening-times-oohweekdays', 'opening-times-weekdays', 'opening-times-weekend'];
  const allSnips = ['snip-3in1-u25', 'snip-generic-cash','snip-generic-cash-u25', 'snip-location-generic', 'snip-location-generic-u25', 'snip-pharmacy', 'snip-pharmacy-u25'];


  const unavailableServices = ['Marie Stopes', 'Young People Friendly Practice'];
  const pharmacyVariances = ['pharmacy', 'chemist', 'Boots', 'Lloyds', '3 in 1', 'Under 25s Drop In'];
  const u25Variances = ['3 in 1', 'Under 25s Drop In'];

  let saddr = `${res.locals.postcodeLocationDetails.location.lat},${res.locals.postcodeLocationDetails.location.lon}`;

  log.info("results");

  results.forEach((result) => {
    var newService = result;

  // no data!!!
  // if (ageFilter >= 25) {
  //   if ((result.feed.u25 !== undefined) && (result.feed.u25 === 'true') && (result.feed.generalPublic === 'false')) {
  //     return;
  //   }
  // }

  if (new RegExp(unavailableServices.join("|"), 'i').test(result.OrganisationName)) {
    return;
  }

  // if (ageFilter >= 25) {
  //   if (new RegExp(u25Variances.join("|"), 'i').test(result.OrganisationName)){
  //     return;
  //   }
  // }

  if (symptomFilter === 'yes') {
    if ((result.OrganisationTypeID === 'PHA') || (new RegExp(pharmacyVariances.join("|"), 'i').test(result.OrganisationName))) {
      return;
    }

    // if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
    //   return;
    // }
    if ((result.OrganisationTypeID === 'online')) {
      return;
    }
  } else {
    // if ((result.feed.online !== undefined) && (result.feed.online === 'true') && !locationFilter.includes('online')) {
    //   return;
    // }

    if ((result.OrganisationTypeID === 'online') && !locationFilter.includes('online')) {
      return;
    }

    if (!locationFilter.includes('pharmacy') &&
      ((result.OrganisationTypeID === 'PHA') || (new RegExp(pharmacyVariances.join("|"), 'i').test(result.OrganisationName)))) {
      return;
    }

    // if (!locationFilter.includes('location') &&
    //   ((result.OrganisationTypeID === 'PHA') ||
    //     true
    //     // ((result.feed.online !== undefined) && (result.feed.online === 'true'))
    //   )){
    //   return;
    // }
  }
  if (newService) {
    newService.name = newService.OrganisationName;
    if (!(newService.OrganisationID == 'online')) {

      // newService.snip = allSnips[Math.floor(Math.random() * allSnips.length)];
      newService.openingTimes = allOpeningTimes[Math.floor(Math.random() * allOpeningTimes.length)];

      newService.distance = result.distanceInMiles.toFixed(1);
      newService.address = `${(newService.Address1) ? newService.Address1 + ',' : '' } ` +
        `${(newService.Address2) ? newService.Address2 + ',' : '' } ` +
        `${(newService.Address3) ? newService.Address3 + ',' : '' } ` +
        `${newService.Postcode}`;

      newService.tel = `0113${Math.floor(1000000 + Math.random() * 9000000)}`;

      const params = {
        saddr,
        daddr: `${newService.address}`,
        near: `${newService.address}`
      };

      // eslint-disable-next-line no-param-reassign
      newService.mapUrl = `https://maps.google.com/maps?${qs.stringify(params)}`;

      if (uniqueDistances.includes(newService.distance)) {
        newService = null;
      } else {
        uniqueDistances.push(newService.distance);
      }
    }
    // if ((newService.content) && (newService.content.service)) {
    //   if ((result.feed.online !== undefined) && (result.feed.online === 'true')) {
    //     // eslint-disable-next-line no-underscore-dangle
    //     newService.url = newService.content.service.WebAddress.__text;
    //   } else {
    //     // eslint-disable-next-line no-underscore-dangle
    //     newService.tel = newService.content.service.contact.telephone.__text;
    //     // eslint-disable-next-line no-underscore-dangle
    //     newService.address = `${newService.content.service.address.addressLine[0].__text}, ${newService.content.service.address.addressLine[1].__text}, ${newService.content.service.address.addressLine[2].__text}, ${newService.content.service.address.postcode.__text}`;
    //   }
    // }

    if ((newService) && (newService.OrganisationID)) {
      switch (newService.OrganisationTypeID) {
        case 'CLI':
          baseURL = "https://www.nhs.uk/Services/clinics/Overview/DefaultView.aspx?";
          break;
        case 'PHA':
          baseURL = "https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx";
          break;
        case 'online':
          newService.url = newService.Url;
          baseURL = "https://www.nhs.uk/ServiceDirectories/Pages/GenericServiceDetails.aspx";
          break;
        default:
          baseURL = "https://www.nhs.uk/ServiceDirectories/Pages/GenericServiceDetails.aspx";
      }
      // eslint-disable-next-line no-underscore-dangle
      newService.choicesUrl = `${baseURL}?id=${newService.OrganisationID}`;
      if (uniqueURLs.includes(newService.choicesUrl)) {
        newService = null;
      } else {
        uniqueURLs.push(newService.choicesUrl);
      }
    }
  }

  if (newService) {
    if ((result.OrganisationTypeID == 'PHA') || (new RegExp(pharmacyVariances.join("|"), 'i').test(newService.name))) {
      pharmacies.push(newService);
      if (newService.name.includes("3 In 1")) {
        newService.snip = 'snip-3in1-u25';
      } else {
        newService.snip = (ageFilter >= 25) ? 'snip-pharmacy' : 'snip-pharmacy-u25';
      }
    // } else if ((result.feed !== undefined) && (result.feed.online !== undefined) && (result.feed.online === 'true')) {
    //   onlineProviders.push(newService);
    } else if (result.OrganisationTypeID == 'online') {
      onlineProviders.push(newService);
    } else {
      SHProviders.push(newService);
      if (newService.name.includes("CaSH")) {
        newService.snip = (ageFilter >= 25) ? 'snip-generic-cash': 'snip-generic-cash-u25';
      } else {
        newService.snip = (ageFilter >= 25) ? 'snip-location-generic': 'snip-location-generic-u25';
      }
    }
  }
});

  res.locals.pharmacies = pharmacies.slice(0, 5);
  res.locals.onlineProviders = onlineProviders.slice(0, 5);
  res.locals.SHProviders = SHProviders.slice(0, 5);
}

module.exports = getServices;
