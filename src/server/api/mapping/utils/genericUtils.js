import diacritics from 'diacritics'

/*
    Given an integer "numberOfYears" returns an array containing "numberOfYears" years starting from the current one.
    e.g.:
          - numberOfYears = 6 => [2017, 2018, 2019, 2020, 2021, 2022]
 */
export function getExpiryYears(numberOfYears) {
  const expiryDates = [new Date().getFullYear().toString()]
  while (expiryDates.length < numberOfYears) {
    expiryDates.push(
      (parseInt(expiryDates[expiryDates.length - 1], 10) + 1).toString()
    )
  }
  return expiryDates
}

/**
 * Temporary function to remove diacritic characters from payload.
 * @todo Remove this function when WCS changes are applied to allow diacritic characters.
 * @param {string} field
 */
export const removeDiacritics = (field) =>
  typeof field === 'string' ? diacritics.remove(field) : field

// This removes Diacritics from the state if the shipping Country is not the same as the compared country.
// It is currently used in CreatedOrder.js and AddDeliveryAddress.js and it is defaulted to Canada
export const removeStateDiacritics = (
  state,
  shippingCountry,
  compareCountry = 'Canada'
) =>
  state !== null && shippingCountry !== compareCountry
    ? removeDiacritics(state)
    : ''

// This func is specific for Canada and currently used in CreatedOrder.js and AddDeliveryAddress.js
export const removeCanadaDiacritics = (state, shippingCountry) =>
  shippingCountry === 'Canada' ? removeDiacritics(state) : ''

// This func works for both billingState and shippingState. It is currently used in CreatedOrder.js
// and AddDeliveryAddress.js for the properties
// billing_state_hidden, shipping_state_hidden, saved_state and shipping_state
export const removeBillingShippingStateDiacritics = (state) =>
  state !== null ? removeDiacritics(state) : ''

export function toTwoDecimalPlaces(data, defaultValue = '') {
  if (data === '' || data === null || Array.isArray(data)) {
    return defaultValue
  }

  const value = Number(data)

  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return defaultValue
  }

  return value.toFixed(2)
}
