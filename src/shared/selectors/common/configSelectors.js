// TODO: Move this file to ../ (main selectors folder) https://arcadiagroup.atlassian.net/browse/PTM-575

import { createSelector } from 'reselect'
import { pathOr, path } from 'ramda'

export const getRegion = (state) => {
  return pathOr(false, ['config', 'region'], state)
}

export const getPostCodeRules = (state, country) => {
  return pathOr({}, ['config', 'checkoutAddressFormRules', country], state)
}

export const getCountryCodeFromQAS = (state, country) => {
  return pathOr('', ['config', 'qasCountries', country], state)
}

// Will return an array of objects with the Country's name and iso
const getDeliveryCountries = (state) =>
  pathOr([], ['config', 'deliveryCountries'], state)

// Will return an array containing the full name of each country
const getDeliveryCountriesNames = createSelector(
  getDeliveryCountries,
  (countries) => countries.map((countryObject) => countryObject.name)
)

// Will return the iso of the country passed as arg
export const getDeliveryCountryISO = (state, country) =>
  pathOr(
    '',
    ['iso'],
    getDeliveryCountries(state).find(
      (countryObject) => countryObject.name === country
    )
  )

export const getCountriesByAddressType = (state, addressType) => {
  const defaultValue = []
  switch (addressType) {
    case 'deliveryCheckout':
    case 'deliveryMCD':
    case 'addressBook':
      return getDeliveryCountriesNames(state)
    case 'billingCheckout':
    case 'billingMCD':
      return pathOr(defaultValue, ['siteOptions', 'billingCountries'], state)
    default:
      return defaultValue
  }
}

export const getShippingCountries = (state) => {
  return getDeliveryCountriesNames(state)
}

export const getOrderReturnUrl = (state) => {
  return path(['config', 'orderReturnUrl'], state)
}
