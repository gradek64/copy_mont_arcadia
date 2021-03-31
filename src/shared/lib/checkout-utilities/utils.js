import { path, pluck, values } from 'ramda'
import { formNames } from '../../constants/forms'
import { getDetailsForm } from '../../selectors/checkoutSelectors'
import { nDaysInMs } from '../../lib/dates'

export const fromCookie = (cookie, key) => {
  const name = `${key}=`
  const pairs = cookie.split(';')

  return pairs.reduce((prev, pair) => {
    return pair.indexOf(name) === 0 ? pair.substring(name.length) : prev
  }, '')
}

/**
 * combineCardOptions is a function that returns an array that combines
 * Card type Payment Methods against other Payment Methods
 *
 * @param {object} [paymentMethods] - an object containing payment methods
 * @returns {Array}
 */
export const combineCardOptions = (paymentMethods) => {
  const cardPaymentOptions = paymentMethods.filter(
    ({ type }) => type === 'CARD'
  )

  const otherPaymentOptions = paymentMethods.filter(
    ({ type }) => type !== 'CARD'
  )

  const combinedCards = cardPaymentOptions.length
    ? [
        {
          value: 'CARD',
          type: 'CARD',
          label: 'Credit/Debit Card',
          description: cardPaymentOptions.map(({ label }) => label).join(', '),
          paymentTypes: cardPaymentOptions,
        },
      ]
    : []

  return [...combinedCards, ...otherPaymentOptions]
}

/**
 * withValue is a helper function that returns a curried function
 *
 * @param {string} [matcher] - a string containing a paymentType Value
 * @returns {function}
 */
export const withValue = (matcher) => ({ value }) => value === matcher

/**
 * standardCardCodesMap maps the correspondence between credit-card-type
 * module card ids and full monty's paymentMethods ids
 */
export const standardCardCodesMap = {
  mastercard: 'MCARD',
  'american-express': 'AMEX',
  maestro: 'SWTCH',
  visa: 'VISA',
}

/**
 * getPaymentTypeFromValidCardTypes is a function that returns a
 * valid Payment Method Identifier used by monty given an array of
 * credit card matchers
 *
 * @param {Array} validCardTypes - an array containing matched card types config
 * @returns {string}
 */
export const getPaymentTypeFromValidCardTypes = (validCardTypes) => {
  const cardCodes = standardCardCodesMap
  const type = path([0, 'type'], validCardTypes)

  return cardCodes[type] ? cardCodes[type] : cardCodes.visa
}

export const getPaymentMethodFromValue = (paymentValue, paymentMethods) => {
  return paymentMethods.find(({ value }) => value === paymentValue)
}

export const isCard = (currPaymentMethodValue, paymentMethods) => {
  const paymentSelected = getPaymentMethodFromValue(
    currPaymentMethodValue,
    paymentMethods
  )
  return !!(
    paymentSelected &&
    (paymentSelected.type === 'CARD' || paymentSelected.type === 'OTHER_CARD')
  )
}

// return true when all the user data are correct, false if one value is null
export const yourDetailsExist = (state) => {
  const yourDetailsState = getDetailsForm('deliveryCheckout', state) // @TODO REFACTOR
  const yourDetails = pluck('value', yourDetailsState.fields)
  return values(yourDetails).every((value) => value !== null)
}

// @TODO DELETE
export const getFormNames = (type) => formNames[type]

/**
 * The Channel Islands are within the UK but cannot benefit from the usual
 * UK shipping options owing to their distance from the mainland.
 *
 * Customers entering a Channel Islands postcode under the perfectly
 * reasonable assumption that they're part of the UK will have their
 * country updated so that appropriate shipping options
 * can be offered.
 *
 * @param {Object} params
 * @param {string} params.postcode - Full postcode
 * @param {string} params.country  - Name of country
 * @returns {string} A channel islands country, or null if no update necessary
 */
export const updateCountryForChannelIslands = ({ postcode, country }) => {
  const area = (postcode) => postcode.substring(0, 2)
  const isGuernsey = (postcode) => area(postcode) === 'GY'
  const isJersey = (postcode) => area(postcode) === 'JE'
  const uppercaseCode = postcode.toUpperCase()
  let updateCountry = null

  if (country === 'United Kingdom') {
    if (isGuernsey(uppercaseCode)) {
      updateCountry = 'Guernsey'
    } else if (isJersey(uppercaseCode)) {
      updateCountry = 'Jersey'
    }
  }

  return updateCountry
}

export const setActiveStep = (pathname, step) => ({
  ...step,
  active: pathname.startsWith(step.url),
})

/**
 * Checks if the user has just purchased DDP. The user object will have some
 * conflicting properties so this checks those properties and amends them as necessary
 * @param {Object} user
 * @returns {Object}
 */
export const getUnconfirmedDDPUser = (user) => {
  // if no ddpEndDate, return unchanged user object
  if (!user.ddpEndDate) return user

  // calculate ddpEndDate, return unchanged user object
  const ddpEndDate = new Date(user.ddpEndDate).valueOf()

  // if ddpEndDate is invalid exit
  if (!isFinite(ddpEndDate)) return user

  const endDateInFuture = ddpEndDate > Date.now()
  const expiryIsLessThan30Days = ddpEndDate - Date.now() < nDaysInMs(30)

  // only overwrite properties if user is set to false but they have an end date in the future
  // this means they are going through a fraud check and have bought DDP for the first time
  if (!user.isDDPUser) {
    return endDateInFuture
      ? {
          ...user,
          isDDPUser: true,
          // the user is only renewable if the end date is within 30 days - this shouldn't happen
          // for new ddp purchases as they are all 12 months currently, but could change in the future.
          isDDPRenewable: expiryIsLessThan30Days,
        }
      : user
  }
  // user.isDDPUser must be true

  // If isDDPRenewable set to true but the expiry is more than 30 days, the user has
  // renewed before the previous ddp subscription has expired so we need to set
  // isDDPRenewable to false
  return user.isDDPRenewable && !expiryIsLessThan30Days
    ? {
        ...user,
        isDDPRenewable: false,
      }
    : user
}
