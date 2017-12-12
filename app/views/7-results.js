module.exports = function (input, req) {
  input.hasSymptoms = req.session.validated.hasSymptoms;
  input.age = req.session.validated.age;
  input.multiChoose = req.session.validated.multiChoose;

  if (input.hasSymptoms === 'yes') {
    if (input.multiChoose.includes('choose-location')) {
      input.locationHeading = 'Places you can see a sexual heath professional'
      input.partialHeading = [undefined];
      input.partials = ['sexual-health-providers'];
    }
  } else if (input.hasSymptoms === 'no') {
    if (input.multiChoose.length == 3) {
      if ((input.multiChoose.includes('choose-location')) && (input.multiChoose.includes('choose-pharmacy'))
        && (input.multiChoose.includes('choose-online'))) {
        if (parseInt(input.age) >= 25) {
          input.partialHeading = ['sexual-health-providers', 'pharmacies', 'online-providers'];
        } else if ((parseInt(input.age) >= 16) && (parseInt(input.age) < 25)) {
          input.partialHeading = ['pharmacies', 'online-providers', 'sexual-health-providers'];
        }
        input.locationHeading = 'Where you can get a test';
        input.partials = input.partialHeading;
      }
    } else if (input.multiChoose.length == 2) {
      if ((input.multiChoose.includes('choose-location')) && (input.multiChoose.includes('choose-pharmacy'))) {
        if (parseInt(input.age) >= 25) {
          input.partialHeading = ['sexual-health-providers', 'online-providers'];
        } else if ((parseInt(input.age) >= 16) && (parseInt(input.age) < 25)) {
          input.partialHeading = ['pharmacies', 'sexual-health-providers'];
        }
      }
      if ((input.multiChoose.includes('choose-online')) && (input.multiChoose.includes('choose-location'))) {
        if (parseInt(input.age) >= 25) {
          input.partialHeading = ['sexual-health-providers', 'online-providers'];
        } else if ((parseInt(input.age) >= 16) && (parseInt(input.age) < 25)) {
          input.partialHeading = ['online-providers', 'sexual-health-providers'];
        }
      }
      if ((input.multiChoose.includes('choose-online')) && (input.multiChoose.includes('choose-pharmacy'))) {
        input.partialHeading = ['pharmacies', 'online-providers'];
      }
      input.locationHeading = 'Where you can get a test';
      input.partials = input.partialHeading;
    } else {
      if (input.multiChoose.includes('choose-location')) {
        input.locationHeading = 'Places you can see a sexual heath professional'
        input.partials = ['sexual-health-providers'];
      } else if (input.multiChoose.includes('choose-pharmacy')) {
        input.locationHeading = 'Pharmacies where you can buy a self-test kit'
        input.partials = ['pharmacies'];
      } else if (input.multiChoose.includes('choose-online')) {
        input.locationHeading = 'Where to order a self-test kit online'
        input.partials = ['online-providers'];
      }
      input.partialHeading = [undefined];
    }
  }

  req.session.destroy()

  return input
}
