module.exports = function (input, req) {
  if (input.loc !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: input.loc
    })

    input.redirect = `/7-results?loc=${input.loc}&multiChoose=${req.session.validated.multiChoose}&prefTimes=${req.session.validated.prefTimes}&hasSymptoms=${req.session.validated.hasSymptoms}&age=${req.session.validated.age}`
  }

  return input
}
