module.exports = function (input, req) {
  if (input.multiChoose !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      multiChoose: input.multiChoose
    });
    if ((input.multiChoose.includes('location')) || (input.multiChoose.includes('pharmacy'))) {
      input.redirect = '/5-preferred-times';
    } else {
      input.redirect = '/6-location-online';
    }
  }

  return input;
}
