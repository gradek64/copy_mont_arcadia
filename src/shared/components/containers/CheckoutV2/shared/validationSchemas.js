import paymentValidationRules from '../../../../constants/paymentValidationRules'
import {
  cardExpiry,
  regexValidate,
  hasLength,
  smsMobileNumber,
  requiredCurried,
  maxLength60Characters,
  validateSpecialChars,
} from '../../../../lib/validator/validators'

export const regionalPhoneValidation = (country) => {
  switch (country) {
    case 'United Kingdom':
      return ['ukPhoneNumber']
    case 'United States':
      return ['usPhoneNumber']
    default:
      return ['numbersOnly']
  }
}

export const getYourDetailsSchema = (country) => {
  return {
    firstName: [
      'noEmoji',
      'required',
      maxLength60Characters,
      validateSpecialChars,
    ],
    lastName: [
      'noEmoji',
      'required',
      maxLength60Characters,
      validateSpecialChars,
    ],
    telephone: ['required', ...regionalPhoneValidation(country), 'noEmoji'],
  }
}

export const getDeliveryInstructionsSchema = (country) => {
  const rules = {
    deliveryInstructions: 'noEmoji',
  }
  if (country === 'United Kingdom') rules.smsMobileNumber = smsMobileNumber
  return rules
}

const postCodeValidation = (rules) => {
  return rules && !!rules.postcodeRequired && !!rules.pattern
    ? [
        'required',
        regexValidate('Please enter a valid post code', rules.pattern),
      ]
    : []
}

export const getYourAddressSchema = (rules) => ({
  address1: ['required', 'noEmoji', validateSpecialChars],
  address2: ['noEmoji', validateSpecialChars],
  postcode: [...postCodeValidation(rules), 'noEmoji'],
  city: ['required', 'noEmoji', validateSpecialChars],
})

export const getFindAddressSchema = (rules, options = {}) => {
  const { hasFoundAddresses, hasSelectedAddress } = options
  return {
    postcode: postCodeValidation(rules),
    country: 'country',
    houseNumber: 'noEmoji',
    findAddress: hasFoundAddresses
      ? []
      : requiredCurried('Please click on FIND ADDRESS'),
    selectAddress: hasSelectedAddress
      ? []
      : requiredCurried('Please select an address'),
  }
}

const validateCvv = (type) =>
  paymentValidationRules[type]
    ? [
        'cvvValidation',
        hasLength(
          paymentValidationRules[type].cvv.messageV2,
          paymentValidationRules[type].cvv.length
        ),
      ]
    : ''

/*
*ADP-3849
*expiryMonth and expiryDate needs formating but 
*at the time of this ticket expiryMonth is used by qubit 
*experience
*/

export const getCardSchema = (type, customerDetailsSection = false) => ({
  cardNumber: paymentValidationRules[type]
    ? [
        hasLength(
          paymentValidationRules[type].cardNumber.message,
          paymentValidationRules[type].cardNumber.length
        ),
        'numbersOnly',
      ]
    : '',
  cvv: customerDetailsSection ? '' : validateCvv(type),
  expiryMonth: paymentValidationRules[type]
    ? cardExpiry(`Please select a valid expiry date`, new Date())
    : '',
  expiryDate: paymentValidationRules[type]
    ? cardExpiry(`Please select a valid expiry date`, new Date())
    : '',
})

export const getOrderSchema = () => ({
  isAcceptedTermsAndConditions: ['required'],
})

export const guestUserSchema = () => ({
  email: 'email',
})
