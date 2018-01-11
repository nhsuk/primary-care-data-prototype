 module.exports = function (input, req) {
  if (input.preferredTimes !== undefined) {
    req.session.validated = Object.assign({}, req.session.validated, {
      time: input.preferredTimes
    })
    input.multiChoose = req.session.validated.multiChoose
    if (((input.multiChoose.includes('location')) || (input.multiChoose.includes('pharmacy'))) && (input.multiChoose.includes('online'))) {
      input.redirect = '/6-location-all3'
    } else if ((input.multiChoose.includes('location')) || (input.multiChoose.includes('pharmacy'))) {
      input.redirect = '/6-location'
    } else {
      input.redirect = '/6-location-online'
    }
  }

  input.hasSymptoms = req.session.validated.hasSymptoms;
  input.multiChoose = req.session.validated.multiChoose;
  input.age = req.session.validated.age;

  if ((input.multiChoose.includes('location')) && (input.multiChoose.includes('pharmacy')) && (input.multiChoose.includes('online'))) {
    input.locationTimeHeading = 'When can you go?'
    input.locationTimePara = "We'll show you places that are open during the times you choose."
    return input
  }
  if ((input.multiChoose.includes('location')) && (input.multiChoose.includes('online'))) {
    input.locationTimeHeading = 'When can you see a sexual health professional?'
    input.locationTimePara = "We'll show you places that are open during the times you choose."
    return input
  }
  if ((input.multiChoose.includes('pharmacy')) && (input.multiChoose.includes('online'))) {
    if (input.age >= 25) {
      input.locationTimeHeading = 'When can you go to a pharmacy?'
      input.locationTimePara = "We'll show you pharmacies that are open during the times you choose."
    } else {
      input.locationTimeHeading = 'When can you go to a pharmacy or other facility?'
      input.locationTimePara = "We'll show you places that are open during the times you choose."
    }
    return input
  }
  if ((input.multiChoose.includes('location')) && (input.multiChoose.includes('pharmacy'))) {
    input.locationTimeHeading = 'When can you go?'
    input.locationTimePara = "We'll show you places that are open during the times you choose."
    return input
  }
  if ((input.hasSymptoms === 'yes') || (input.multiChoose.includes('location'))) {
    input.locationTimeHeading = 'When can you see a sexual health professional?'
    input.locationTimePara = "We'll show you places that are open during the times you choose."
    return input
  }
  if (input.multiChoose.includes('pharmacy')) {
    if (input.age >= 25) {
      input.locationTimeHeading = 'When can you go to a pharmacy?'
      input.locationTimePara = "We'll show you pharmacies that are open during the times you choose."
    } else {
      input.locationTimeHeading = 'When can you go to a pharmacy or other facility?'
      input.locationTimePara = "We'll show you places that are open during the times you choose."
    }

    return input
  }

 }
