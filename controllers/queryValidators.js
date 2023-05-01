const { isEmail, isMobilePhone, isISO8601, isNumeric } = require('validator');

function isValidEmail(email) {
  console.log('isEmail(email)', isEmail(email));
  return isEmail(email);
}

function isValidMobileNumber(number) {
  console.log('isMobilePhone(number)', isMobilePhone(number));
  return isMobilePhone(number);
}

function isValidPincode(pincode) {
  if (pincode.length > 4 && pincode.length < 7 && isNumeric(pincode)) {
    console.log('isValidPincode', true);
    return true;
  } else {
    console.log('isValidPincode', false);
    return false;
  }
}

function isValidBirthdate(date) {
  console.log('isValidBirthdate', isISO8601(date));
  return isISO8601(date);
}

module.exports = {
  isValidPincode,
  isValidEmail,
  isValidMobileNumber,
  isValidBirthdate
};
