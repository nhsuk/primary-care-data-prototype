module.exports = function (input, req) {
  req.session.destroy()

  return input
}
