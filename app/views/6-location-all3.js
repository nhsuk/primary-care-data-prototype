module.exports = function (input, req) {
  if ((input.loc !== undefined) || (input.loc2 !== undefined)) {
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: input.loc,
      loc2: input.loc2
    })

    input.redirect = '/7-results'
  }

  return input
}
