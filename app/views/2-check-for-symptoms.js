module.exports = function (input, req) {
  switch (input.hasSymptoms) {
    case 'yes':
      req.session.validated = Object.assign({}, req.session.validated, {
        hasSymptoms: 'yes'
      });
      input.hasSymptoms = req.session.validated.hasSymptoms;
      input.redirect = '/3-users-age';
      break;
    case 'no':
      req.session.validated = Object.assign({}, req.session.validated, {
        hasSymptoms: 'no'
      });
      input.hasSymptoms = req.session.validated.hasSymptoms;
      input.redirect = '/3-users-age';
      break;
  }

  return input;
}
