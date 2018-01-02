/** * This file defines all routes used in this application. Any logic that is
 * applicable to all routes can be added here.
 */
const router = require('express').Router();
const preRender = require('../app/middleware/preRender');
const renderer = require('../app/middleware/renderer');
const setLocals = require('../app/middleware/setLocals');
const stripWhitespace = require('../app/middleware/stripWhitespace');
const searchValidator = require('../app/middleware/searchValidator');
const postcodeLookup = require('../app/middleware/postcodeLookup');
const notInEnglandHandler = require('../app/middleware/notInEnglandHandler');
const getServices = require('../app/middleware/getServices');

const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(path.resolve(__dirname, 'routes'));

const routes = files.map((file) => {
  return require(path.resolve(__dirname, 'routes', file.replace('.js', '')));
});


module.exports = function (router, hbs) {
  routes.forEach(function (route) {
      router.get(
      '/7-results',
      setLocals.fromRequest,
      stripWhitespace,
      searchValidator,
      postcodeLookup,
      notInEnglandHandler,
      getServices,
      preRender,
      renderer.results
    );

    router.get(
      '/7-outside-england',
      renderer.postcodeNotEnglish
    );

    route(router, hbs);
  });
};
