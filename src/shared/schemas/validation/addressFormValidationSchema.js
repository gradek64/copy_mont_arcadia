import {
  regexValidate,
  requiredCurried,
  countryValidate,
  maxLength60Characters,
  validateSpecialChars,
} from '../../lib/validator/validators'

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

export const getDeliverToAddressSchema = () => ({
  deliverToAddress: requiredCurried(
    'Please confirm this new address or cancel to continue'
  ),
})
const postCodeValidation = (rules) => {
  return rules && !!rules.postcodeRequired && !!rules.pattern
    ? [
        'required',
        regexValidate('Please enter a valid post code', rules.pattern),
      ]
    : []
}

export const getYourAddressSchema = (rules, countriesByAddressType) => ({
  address1: ['required', 'noEmoji', validateSpecialChars],
  address2: ['noEmoji', validateSpecialChars],
  postcode: [...postCodeValidation(rules), 'noEmoji'],
  city: ['required', 'noEmoji', validateSpecialChars],
  country: ['required', countryValidate(countriesByAddressType)],
})

export const getFindAddressSchema = (rules, options = {}) => {
  const { hasFoundAddresses = false, hasSelectedAddress = false } = options
  return {
    postcode: [...postCodeValidation(rules), 'noEmoji'],
    houseNumber: 'noEmoji',
    findAddress: hasFoundAddresses
      ? []
      : requiredCurried('Please click on FIND ADDRESS'),
    selectAddress: hasSelectedAddress
      ? []
      : requiredCurried('Please select an address'),
  }
}
