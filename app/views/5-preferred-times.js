 module.exports = function (input, req) {
  if (input.preferredTimes !== undefined) {
     req.session.validated = Object.assign({}, req.session.validated, {
       time: input.preferredTimes
     })
     input.multiChoose = req.session.validated.multiChoose
     if (((input.multiChoose.includes('choose-location')) || (input.multiChoose.includes('choose-pharmacy'))) && (input.multiChoose.includes('choose-online'))) {
       input.redirect = '/6-location-all3'
     } else if ((input.multiChoose.includes('choose-location')) || (input.multiChoose.includes('choose-pharmacy'))) {
       input.redirect = '/6-location'
     } else {
       input.redirect = '/6-location-online'
     }
   }

   return input
 }
