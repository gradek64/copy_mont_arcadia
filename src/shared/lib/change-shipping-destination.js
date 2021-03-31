import qs from 'querystring'
import { changeURL, getProtocol } from './window'
import {
  allLanguages,
  defaultLanguages,
  euCountries,
} from '../constants/languages'
import { all, is, contains, path } from 'ramda'
import { getStoreId } from '../selectors/configSelectors'
import { getShoppingBagOrderId } from '../selectors/shoppingBagSelectors'
import { isFeatureTransferBasketEnabled } from '../selectors/featureSelectors'
import countryList from 'country-list'
import { appendGTMParams } from './geo-ip-utils'

export const getTransferBasketParameters = function getTransferBasketParameters(
  state
) {
  if (!isFeatureTransferBasketEnabled(state)) {
    return {} /* eslint-disable  no-else-return */
  } else {
    const transferStoreID = getStoreId(state)
    const transferOrderID = getShoppingBagOrderId(state)
    const isValidOrderId = (orderId) => orderId > 0
    return all(is(Number))([transferStoreID, transferOrderID]) &&
      isValidOrderId(transferOrderID)
      ? {
          transferStoreID,
          transferOrderID,
        }
      : {}
  }
}

export const isEUCountry = (euCountries, shippingDestination) =>
  contains(shippingDestination, euCountries)

export const findHostnameByDefaultLanguage = (
  langHostnames,
  selectedLanguage
) => {
  const country = Object.keys(langHostnames).find((country) => {
    return langHostnames[country].defaultLanguage === selectedLanguage
  })
  return country ? langHostnames[country] : langHostnames.default
}

export const findShippingDestination = (
  langHostnames,
  shippingDestination,
  selectedLanguage
) => {
  return isEUCountry(euCountries, shippingDestination)
    ? selectedLanguage === 'English'
      ? langHostnames.default
      : findHostnameByDefaultLanguage(langHostnames, selectedLanguage)
    : langHostnames.nonEU
}

export const findRedirectUrl = (
  langHostnames,
  shippingDestination,
  selectedLanguage
) => {
  const destination = path([shippingDestination], langHostnames)

  return destination && destination.defaultLanguage === selectedLanguage
    ? destination
    : findShippingDestination(
        langHostnames,
        shippingDestination,
        selectedLanguage
      )
}

export const getShippingDestinationRedirectURL = (
  shippingDestination,
  langHostnames,
  selectedLanguage,
  hostname = ''
) => {
  const env = hostname.split('.')[0]
  const redirectURL = findRedirectUrl(
    langHostnames,
    shippingDestination,
    selectedLanguage
  )
  const port = window.location.port || '8080'
  switch (env) {
    case 'local':
      return `${env}.${redirectURL.hostname}:${port}`
    case 'integration':
    case 'preprod':
    case 'showcase':
    case 'stage':
      return `${env}.${redirectURL.hostname}`
    default:
      switch (process.env.NODE_ENV) {
        case 'development': {
          // Get port number when working locally
          return `${env}.${redirectURL.hostname}:${port}`
        }
        default:
          // production
          return redirectURL.hostname
      }
  }
}

function legacyParams(shippingDestination, language) {
  const selectedLanguage =
    language || defaultLanguages[shippingDestination] || 'English'

  return shippingDestination
    ? {
        prefShipCtry: countryList.getCode(shippingDestination),
        userLanguage: allLanguages.find(
          ({ value }) => value === selectedLanguage
        ).isoCode,
      }
    : null
}

export function shippingDestinationRedirect({
  shippingDestination,
  langHostnames,
  thirdPartySiteUrls,
  selectedLanguage,
  optionalParameters = {},
  hostname = '',
}) {
  const { search } = location
  const destinationURL = thirdPartySiteUrls[shippingDestination]
    ? thirdPartySiteUrls[shippingDestination]
    : getShippingDestinationRedirectURL(
        shippingDestination,
        langHostnames,
        selectedLanguage,
        hostname
      )

  const params = {
    currentCountry: shippingDestination
      ? countryList.getCode(shippingDestination)
      : null,
    ...legacyParams(shippingDestination, selectedLanguage),
    ...optionalParameters,
  }

  // This is done to save GA utm params to credit those who advertises Arcadia sites through affiliate programs
  const urlWithGtmParams = appendGTMParams(
    `${getProtocol()}//${destinationURL}?${qs.stringify(params)}`,
    search
  )

  changeURL(urlWithGtmParams)
}
