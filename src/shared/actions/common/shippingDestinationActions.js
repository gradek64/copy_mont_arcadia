import { getName } from 'country-list'
import { getDefaultLanguageByShippingCountry } from '../../lib/language'
import { getGeoIPGeoISO } from '../../selectors/geoIPSelectors'
import {
  getCurrentCountry,
  selectHostname,
} from '../../selectors/routingSelectors'
import { getShippingDestination } from '../../selectors/shippingDestinationSelectors'
import {
  getBrandCode,
  getCountry,
  getLangHostnames,
  getSiteDeliveryISOs,
  getStoreCode,
  getThirdPartySiteUrls,
} from '../../selectors/configSelectors'
import {
  getTransferBasketParameters,
  shippingDestinationRedirect,
} from '../../lib/change-shipping-destination'
import { isValidISO2 } from '../../../shared/lib/geo-ip-utils'
import { getDeliveryCountryISO } from '../../selectors/common/configSelectors'

export const shippingDestinationConsts = {
  SET_SHIPPING_DESTINATION: 'SET_SHIPPING_DESTINATION',
  SET_LANGUAGE: 'SET_LANGUAGE',
}

export function setLanguage(language, persist = true) {
  return {
    type: shippingDestinationConsts.SET_LANGUAGE,
    language,
    persist,
  }
}

// We can opt to pass a country,
// let it get the current country from the query in routing from the store or
// the shipping destination also from the redux store
export function updateShippingDestination(country) {
  return (dispatch, getState) => {
    const state = getState()
    const geoISO = getGeoIPGeoISO(state)
    const deliversToCurrentGeoISO =
      geoISO && getSiteDeliveryISOs(state).includes(geoISO)

    // Returns the country's ISO using the country passed as arg
    // or by using the country from the routing => query in the redux store
    const currentCountry =
      getDeliveryCountryISO(state, country) || getCurrentCountry(state)

    // Returns the ISO using the country passed as arg
    // or by using the country from the shipping destination in the redux store
    const shippingDestination =
      getDeliveryCountryISO(state, country) || getShippingDestination(state)

    const defaultCountry = getCountry(state)

    let destination
    let persist = false
    if (currentCountry && isValidISO2(currentCountry)) {
      destination = getName(currentCountry)
      persist = true
    } else if (deliversToCurrentGeoISO) {
      destination = getName(geoISO)
    } else if (!shippingDestination && defaultCountry) {
      destination = defaultCountry
    }

    if (destination) {
      const defaultLanguage = getDefaultLanguageByShippingCountry(
        getBrandCode(state),
        destination
      )
      dispatch({
        type: shippingDestinationConsts.SET_SHIPPING_DESTINATION,
        destination,
        persist,
      })
      dispatch(setLanguage(defaultLanguage, persist))
    }
  }
}

/* eslint-disable  no-else-return */
export const redirect = (countryName, languageName, initiatedFrom) => (
  dispatch,
  getState
) => {
  const state = getState()
  const storeCode = getStoreCode(state)
  const optionalParameters = {
    ...getTransferBasketParameters(state),
    ...(initiatedFrom
      ? { internationalRedirect: `${initiatedFrom}-${storeCode}` }
      : {}),
  }
  shippingDestinationRedirect({
    shippingDestination: countryName,
    langHostnames: getLangHostnames(state),
    selectedLanguage: languageName,
    optionalParameters,
    thirdPartySiteUrls: getThirdPartySiteUrls(state),
    hostname: selectHostname(state),
  })
}
