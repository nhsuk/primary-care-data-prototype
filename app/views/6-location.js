module.exports = function (input, req) {
  if (input.loc !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      loc: input.loc,
    })

    input.redirect = '/7-results'
  }

  return input
}
