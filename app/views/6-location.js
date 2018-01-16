module.exports = function (input, req) {
  if (input.loc !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: input.loc
    })
    input.redirect = `/7-results?loc=${input.loc}&multiChoose=${req.session.validated.multiChoose}&prefTimes=${req.session.validated.prefTimes}&hasSymptoms=${req.session.validated.hasSymptoms}&age=${req.session.validated.age}`
  }

  input.multiChoose = req.session.validated.multiChoose;
  if ((input.multiChoose.includes('location')) && (input.multiChoose.includes('pharmacy'))) {
    input.locationHeading = 'Where do you want to get a test?'
  } else if (input.multiChoose.includes('location')) {
    input.locationHeading = 'Where do you want to find a sexual health professional?'
  } else {
    input.locationHeading = 'Where do you want to get a test kit from?'
  }

  return input
}
