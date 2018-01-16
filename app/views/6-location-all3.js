module.exports = function (input, req) {
  if ((input.loc !== undefined) || (input.loc1 !== undefined)) {
    const loc =  input.loc || input.loc1
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: loc,
      loc1: loc
    })

    input.redirect = `/7-results?loc=${loc}&loc1=${loc}&multiChoose=${req.session.validated.multiChoose}&prefTimes=${req.session.validated.prefTimes}&hasSymptoms=${req.session.validated.hasSymptoms}&age=${req.session.validated.age}`
  }

  return input
}
