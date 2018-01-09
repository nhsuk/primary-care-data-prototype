module.exports = function (input, req) {
  if (input.sel !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      sel: "yes"
    });
    input.redirect = '/5-preferred-times'
  }
  return input
}