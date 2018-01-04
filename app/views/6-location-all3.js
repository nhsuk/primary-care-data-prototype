module.exports = function (input, req) {
  if ((input.loc !== undefined) || (input.loc1 !== undefined)) {
    const loc =  input.loc || input.loc1
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: loc,
      loc1: input.loc1
    })

    input.redirect = `/7-results?loc=${loc}&loc1=${input.loc1}&multiChoose=${req.session.validated.multiChoose}&hasSymptoms=${req.session.validated.hasSymptoms}&age=${req.session.validated.age}`
  }

  return input
}
