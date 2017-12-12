module.exports = function (input, req) {
  if (input.loc !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: input.loc
    })
    input.redirect = '/7-results'
  }

  input.multiChoose = req.session.validated.multiChoose;
  if ((input.multiChoose.includes('choose-location')) && (input.multiChoose.includes('choose-pharmacy'))) {
    input.locationHeading = 'Where do you want to get a test?'
  } else if (input.multiChoose.includes('choose-location')) {
    input.locationHeading = 'Where do you want to find a sexual health professional?'
  } else {
    input.locationHeading = 'Where do you want to get a self-test kit from?'
  }

  return input
}
