function postcodeProximityMessage(searchPostcode) {
  let returnValue = '';

  if (searchPostcode) {
    if (searchPostcode.isOutcode) {
      returnValue += ` close to the '${searchPostcode.term}' area`;
    } else {
      returnValue += ` near to '${searchPostcode.term}'`;
    }
  }
  return returnValue;
}

function noResults(searchPostcode) {
  const headerPrompt = `We can not find a surgery${postcodeProximityMessage(searchPostcode)}`;
  let paragraphPrompt = '';
  let errorClass = '';
  if (searchPostcode) {
    paragraphPrompt = 'Check the name and the postcode you entered are right. You get better results if you enter ' +
      'a full name or postcode.';
    errorClass = 'blank';
  }
  return { header: headerPrompt, paragraph: paragraphPrompt, class: errorClass };
}

function outOfEngland(searchPostcode) {
  let returnValue = '';

  if (searchPostcode) {
    if (searchPostcode.isOutcode) {
      returnValue = `The area '${searchPostcode.term}'`;
    } else {
      returnValue = `The postcode '${searchPostcode.term}'`;
    }
  }

  returnValue += ` is not in England. If you entered the wrong postcode, you can ${searchAgainLink}.`;

  return returnValue;
}

function emptySearch() {
  return 'Enter the name of your surgery, the name of your GP or a postcode.';
}

function invalidPostcode() {
  return 'Check you\'re using the right postcode. Or search using the name of your GP or surgery.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  noResults,
  postcodeProximityMessage,
  outOfEngland,
  emptySearch,
  invalidPostcode,
  technicalProblems,
};
