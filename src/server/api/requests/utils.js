import { requestsWithBodies, deviceTypes } from './constants'
import { merge, reduce } from 'ramda'
import moment from 'moment-timezone'

import countryList from 'country-list'
import { getConfigByStoreCode, getFirstPreferredISO } from '../../config'

const getCookieName = (cookie = '') => {
  if (cookie && typeof cookie === 'string') {
    return cookie.slice(0, cookie.indexOf('='))
  }
  return ''
}

/**
 * Returns the ISO 2 country code of the requester
 * @param  {Object} headers
 * @return {String}
 */
const getCountryISO = (headers) =>
  getFirstPreferredISO(getConfigByStoreCode(headers['brand-code']))

const encodeUserCountry = (countryISO) =>
  encodeURI(countryList.getName(countryISO, 'en'))

const mergeCookies = (newCookies, oldCookies) => {
  const newCookieNames = newCookies.map(getCookieName)
  const cookies = oldCookies.filter(
    (cookie) => !newCookieNames.includes(getCookieName(cookie))
  )
  return cookies.concat(newCookies)
}

export const getCookiesOnWcsResponse = (response) =>
  (response && response.headers && response.headers['set-cookie']) || []

const mergeCookiesResponse = (response, oldCookies) => {
  const newCookies = getCookiesOnWcsResponse(response)
  return newCookies ? mergeCookies(newCookies, oldCookies) : oldCookies
}

const genCookieString = ({ name, value, path = '/' }) => {
  if (!name) return
  return `${name}=${value}; Path=${path}`
}

const combineCookies = (newCookies = [], oldCookies = []) => {
  return mergeCookies(
    newCookies
      .filter((item) => item.name)
      .map((cookie) => genCookieString(cookie)),
    oldCookies
  )
}

const getNewDestination = (response) =>
  response && response.headers && response.headers.location
    ? response.headers.location
    : ''

const getJSessionId = (cookies) => {
  const cookie = cookies.find((item) => item.startsWith('JSESSIONID=')) || ''
  const startIndex = cookie.indexOf('JSESSIONID=') + 'JSESSIONID='.length
  const endIndex = cookie.indexOf(':', startIndex)
  return cookie.slice(startIndex, endIndex)
}

const canRequestHaveBody = (method) => requestsWithBodies.includes(method)

const parseOption = (opt = '') => {
  const [optName, optValue] = opt.replace(/^\s/, '').split('=')
  if (optName && optValue) {
    if (optName === 'Path') {
      return { path: optValue }
    }
    if (optName === 'Expires' || optName === 'expires') {
      const ttl = moment(optValue).diff(moment())
      return { ttl }
    }
    return { [optName]: optValue }
  }
  return {}
}

const parseOptions = (options = '') =>
  reduce((memo, opt) => merge(parseOption(opt), memo), {}, options.split(';'))

const parseCookieString = (string) => {
  if (!(typeof string === 'string' && /=/.test(string))) {
    return {}
  }
  const { 1: name, 2: value, 3: opts } =
    string.match(/^([\w-]*)=([^;]*);?( .*)?$/) || {}
  return { name, value, options: parseOptions(opts) }
}

export const parseCookies = (cookies) =>
  cookies.map((cookie) => parseCookieString(cookie))

/**
 * Given an array of cookies, this function removes any cookies that have expired
 * or have had the value set to DEL.
 * @param {string[]} cookies
 * @returns {string[]}
 */
const removeExpiredCookies = (cookies) => {
  return cookies.filter((cookie) => {
    const { value } = parseCookieString(cookie)
    return value !== 'DEL'
  })
}

/**
 * Given two arrays of new cookies and old cookies, this function returns a single
 * array of cookies, whose values have been updated to the values of the new cookies
 * in case of conflicts and removes any cookies that have expired or signaled to be deleted
 * @param {string[]} newCookies
 * @param {string[]} oldCookies
 * @returns {string[]}
 */
const mergeWcsCookies = (newCookies, oldCookies) => {
  const mergedCookies = mergeCookies(newCookies, oldCookies)
  const activeCookies = removeExpiredCookies(mergedCookies)
  return activeCookies
}

const extractAndParseCookie = (cookies, name) => {
  if (
    cookies &&
    Array.isArray(cookies) &&
    cookies.length &&
    name &&
    typeof name === 'string'
  ) {
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`))
    if (cookie) {
      return parseCookieString(cookie)
    }
  }
}

const getGeoCookies = (headers = {}) => {
  const countryISO = headers['x-user-geo'] || getCountryISO(headers)
  const prefShipCtry = headers['x-pref-ship']
  const cookies = [
    {
      name: 'userCountry',
      value: encodeUserCountry(countryISO),
    },
  ]
  if (prefShipCtry) {
    cookies.push({
      name: 'prefShipCtry',
      value: encodeURIComponent(prefShipCtry),
    })
  }
  return cookies
}

/**
 * This function maps the device type received as argument to a device type that WCS can understand.
 *
 * @param {String} devicetype device type value as produced by the library that we use to deduce the user agent from the device type.
 *                            Possible values provided by the library currently are console, mobile, tablet, smarttv, wearable, embedded.
 * @returns {String} the associated device type as understood by WCS.
 */
const getMontyHeaderDeviceType = (devicetype) => {
  if (!devicetype || deviceTypes[devicetype] === 'mobile')
    return deviceTypes.mobileWcs

  if (devicetype === deviceTypes.apps) return deviceTypes.apps
  if (devicetype === deviceTypes.tablet) return deviceTypes.tablet

  return deviceTypes.desktop
}

export {
  getJSessionId,
  mergeCookiesResponse,
  getNewDestination,
  canRequestHaveBody,
  mergeCookies,
  combineCookies,
  genCookieString,
  parseOption,
  parseOptions,
  parseCookieString,
  extractAndParseCookie,
  getGeoCookies,
  getMontyHeaderDeviceType,
  removeExpiredCookies,
  mergeWcsCookies,
}
