module.exports = function (input, req) {
  switch (input.age) {
    case '15':
      req.session.validated = Object.assign({}, req.session.validated, {
        age: '15'
      });
      input.redirect = '/4-choices-u16';
      break;
    case '18':
      req.session.validated = Object.assign({}, req.session.validated, {
        age: '18'
      });
      if (req.session.validated.hasSymptoms === 'no') {
        input.redirect = '/4-choices-u25';
      } else if (req.session.validated.hasSymptoms === 'yes') {
        req.session.validated = Object.assign({}, req.session.validated, {
          multiChoose: 'location'
        });
        input.redirect = '/5-preferred-times';
      }

      break;
    case '32':
      req.session.validated = Object.assign({}, req.session.validated, {
        age: '32'
      });
      if (req.session.validated.hasSymptoms === 'no') {
        input.redirect = '/4-choices';
      } else if (req.session.validated.hasSymptoms === 'yes') {
        req.session.validated = Object.assign({}, req.session.validated, {
          multiChoose: 'location'
        });
        input.redirect = '/5-preferred-times';
      }
      break;
  }

  return input;
}
