import storeHostMapPerEnvironment from './hostsConfig/store_host_map.json'
import storeHostMapPerEnvironmentNew from './hostsConfig/store_host_map_new.json'

/**
 * Takes string of cookie values and splits into array of values in the form 'key=value'
 * @param {String} clientCookies string of semi-colon separated cookie key value pairs
 * @returns {Array.<string>} Array of string values in the form 'key=value'
 */
function mapCookies(clientCookies) {
  if (!clientCookies || typeof clientCookies !== 'string') return []
  return clientCookies.replace(/\s/g, '').split(';') // 'foo=bar; bat=baz;' -> "foo=bar;bat=baz;" -> ['foo=bar', 'bat=baz', '']
}

/**
 * Takes a cookieName and a string of client cookies and extracts the value of the
 * named cookie, if it exists, else returns an empty string
 * @param {String} cookieName - the target cookie value to extract
 * @param {String} clientCookies - a string of the passed cookies
 * @returns {String} returns the value of the cookie or an empty string
 */
function extractCookieValue(cookieName, clientCookies) {
  const cookiesAr = mapCookies(clientCookies)
  if (Array.isArray(cookiesAr)) {
    const cookieValue = cookiesAr.find((cookie) =>
      cookie.startsWith(`${cookieName}=`)
    )
    return (cookieValue && cookieValue.replace(`${cookieName}=`, '')) || ''
  }
  // should only get here if cookiesAr is an empty string
  return cookiesAr
}

function extractEncodedHTMLText(html) {
  if (typeof html !== 'string') return ''
  return decodeURIComponent(html)
    .replace(/<.+?>|\+/g, ' ')
    .replace(/\s\s/, ' ')
    .trim()
}

/**
 * Given the store code and the environment used the current function returns the associated hostname
 * as stated in the corresponding hostsConfig file.
 *
 * @param {String} env       e.g.: stage
 * @param {String} storeCode e.g.: tsuk
 * @return {String} hostname associated with storeCode for the env environment (e.g.: ts.stage.arcadiagroup.ltd.uk)
 */
function getDestinationHostFromStoreCode(env, storeCode) {
  const storeHostMap =
    process.env.USE_NEW_STORE_HOST_MAP === 'true'
      ? storeHostMapPerEnvironmentNew
      : storeHostMapPerEnvironment

  return storeHostMap[env] && storeHostMap[env][storeCode]
    ? storeHostMap[env][storeCode]
    : false
}

function translate(dictionary, lang, eng) {
  return (dictionary && dictionary[eng] && dictionary[eng][lang]) || eng || ''
}

/**
 * @description Given a string representing a WCS User Activity cookie name WC_USERACTIVITY_{ID}={ID}... this function returns ID
 * @param {String} wcUserActivity e.g.: WC_USERACTIVITY_1571057=1571057%2C12556%2C...
 * @returns {Boolean|Integer} false in case of invalid argument format, ID integer value otherwise (e.g.: 1571057)
 */
function getWcUserActivityId(wcUserActivity) {
  if (!wcUserActivity || typeof wcUserActivity !== 'string') return false

  const wcUserActivityCookieNamePrefix = 'WC_USERACTIVITY_'

  if (!wcUserActivity.startsWith(wcUserActivityCookieNamePrefix)) return false

  const endOfPrefix = wcUserActivityCookieNamePrefix.length
  const positionOfEqualSymbol = wcUserActivity.indexOf('=')

  // '=' not found (-1) or misplaced
  if (positionOfEqualSymbol < endOfPrefix) return false

  return wcUserActivity.substring(endOfPrefix, positionOfEqualSymbol)
}

/**
 * @description given a cookie name prefix and an array of cookies returns the full cookie from the array if the array contains a cookie whose name is prefixed with the prefix argument, false otherwise
 * @param {String} cookieNamePrefix e.g.: WC_USERACTIVITY_
 * @param {Array} cookies e.g.: [ 'WC_USERACTIVITY_123=123..., JSESSIONID=0000yPBsXkUBckDs-z-t82iyHxn:ppl_515.01; HTTPOnly; Path=/', 'WC_SESSION_ESTABLISHED=true; Path=/', ...
 * @returns {String} the full cookie from the "cookies" array (e.g.: ) WC_USERACTIVITY_123=123...
 */
function getCookieByNamePrefix(cookieNamePrefix, cookies) {
  if (!Array.isArray(cookies) || typeof cookieNamePrefix !== 'string')
    return false

  return cookies.find((cookie) => cookie.startsWith(cookieNamePrefix)) || false
}

/**
 * @description For Guest/Logged In User (not Generic User) it compares the request and response ID in the cookie name WC_USERACTIVITY_{ID}
 *              and if they differ it logs an error and returns true. It returns false otherwise.
 *
 * @param {Array} redisCookies e.g.: [ 'WC_USERACTIVITY_123=123..., JSESSIONID=abc
 * @param {Array} wcsCookies   e.g.: [ 'WC_USERACTIVITY_123=123..., JSESSIONID=def
 * @param {String} path e.g.: /webapp/wcs/stores/servlet/NotUser
 * @returns {Boolean} true in case of session clash
 */
function sessionsClash(redisCookies, wcsCookies, path) {
  // WC_USERACTIVITY_123=123...
  const requestUserActivityCookie = getCookieByNamePrefix(
    'WC_USERACTIVITY_',
    redisCookies
  )
  const responseUserActivityCookie = getCookieByNamePrefix(
    'WC_USERACTIVITY_',
    wcsCookies
  )

  // Request cookies do not represent a Generic User (Guest or Logged In User)
  // Guest Users and Logged In Users can be recognized by the fact that in their collection of WCS cookies the pair
  // WC_USERACTIVITY_ and WC_AUTHENTICATION_ is always present.
  const requestNotFromGenericUser =
    getCookieByNamePrefix('WC_AUTHENTICATION_', redisCookies) !== false &&
    requestUserActivityCookie !== false
  // Response cookies do not represent a Generic User  (Guest or Logged In User)
  const responseNotFromGenericUser =
    getCookieByNamePrefix('WC_AUTHENTICATION_', wcsCookies) !== false &&
    responseUserActivityCookie !== false

  if (requestNotFromGenericUser && responseNotFromGenericUser) {
    if (
      path !== '/webapp/wcs/stores/servlet/NotUser' &&
      path !== '/webapp/wcs/stores/servlet/Logon'
    ) {
      // No transition Guest <-> Logged In should happen

      // WC_USERACTIVITY_123=123... => 123
      const reqUserActivityId = getWcUserActivityId(requestUserActivityCookie)
      const resUserActivityId = getWcUserActivityId(responseUserActivityCookie)

      if (resUserActivityId !== reqUserActivityId) return true
    }
  }

  return false
}

/**
 * This function extract the correct body from a wcs response
 *
 * @param {Object} res response object from superagent
 */
const getBodyOnWcsResponse = (res) =>
  res.body && typeof res.body === 'object' && Object.keys(res.body).length
    ? // sometimes the response is unparsed inside the "text" response property and sometimes it is also in "body" as object.
      // We give precedence to the "body".
      res.body
    : // the response content is in "text" and we expect it to be a stringyfied object
      JSON.parse(res.text)

export {
  extractCookieValue,
  mapCookies,
  extractEncodedHTMLText,
  getDestinationHostFromStoreCode,
  translate,
  getWcUserActivityId,
  getCookieByNamePrefix,
  sessionsClash,
  getBodyOnWcsResponse,
}
