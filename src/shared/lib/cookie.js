const getCookieValue = (cookies, key) => {
  if (!cookies) return undefined

  const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const value = cookies.match(`(^|;)\\s*${escapedKey}\\s*=\\s*([^;]+)`)

  return value ? value.pop() : undefined
}

const getTraceIdFromCookie = (cookies) => {
  return getCookieValue(cookies, 'traceId2')
}

// e.g.:
// extractCookie('paymentCallBackUrl', [..., 'paymentCallBackUrl="https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0"; Expires=Fri, 26-Jan-18 12:33:51 GMT; Path=/', ...])
// => https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0
//
const extractCookie = (cookieName, cookies) => {
  if (!Array.isArray(cookies) || !cookies.length) return null

  // 'paymentCallBackUrl="https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0"; Expires=Fri, 26-Jan-18 12:33:51 GMT; Path=/'
  const cookieString = cookies.find((cookie) => cookie.startsWith(cookieName))
  // "https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0"; Expires=Fri, 26-Jan-18 12:33:51 GMT; Path=/
  const cookieValue = cookieString && cookieString.replace(`${cookieName}=`, '')

  if (!cookieValue) return null

  const indexOfCookieValueEnd =
    cookieValue.indexOf(';') !== -1
      ? cookieValue.indexOf(';')
      : cookieValue.length

  // "https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0"
  const cookieValueNoExpiryNoPath = cookieValue.substr(0, indexOfCookieValueEnd)
  // https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0
  const cookieValueClean = cookieValueNoExpiryNoPath.replace(/"/g, '')

  return cookieValueClean
}

// gets value for the latest AB test that compares
// group OLD as users on ScrAPI/CheckoutV1
// VS
// group NEW as CoreAPI/CheckoutV2
const getDRETValue = ({ cookies = '' } = {}) => {
  const akamaiDRETValue = getCookieValue(cookies, 'akaas_DRET') || ''
  if (akamaiDRETValue.toUpperCase().endsWith('=OLD')) return 'OLD'
  if (akamaiDRETValue.toUpperCase().endsWith('=NEW')) return 'NEW'

  return undefined
}

/**
 * @description  This function adds a cookie to an existing cookie string
 * @param {String} cookie cookie to add to the cookie string e.g. "deviceType=mobile"
 * @param {String} cookiesString cookie string before the addition of the new cookie e.g.: "jsessionid=123"
 * @return {String} cookie string resulting from the addition e.g.: "jsessionid=123; deviceType=mobile"
 */
const addToCookiesString = (cookie, cookiesString) => {
  if (typeof cookie !== 'string' || typeof cookiesString !== 'string') return ''
  if (!cookiesString) return cookie
  if (!cookie) return cookiesString

  return `${cookiesString}; ${cookie}`
}

/**
 * Parses a cookie string into an array easily useable with Hapi
 * e.g. [name, value, options]
 * @param {String} cookieString the string to parse
 *
 * @returns {Array} the parsed array
 */
function parseCookieString(cookieString) {
  const [keyValue, ...options] = cookieString.split(';')
  const [key, value] = keyValue.split('=')

  const optionObject = options.reduce((result, next) => {
    if (!next.includes('=')) {
      const cleanString = next.trim()

      return cleanString
        ? {
            ...result,
            [cleanString]: true,
          }
        : result
    }

    const [optionKey, optionValue] = next.split('=').map((part) => part.trim())

    function parseValue(value) {
      const numberValue = parseInt(value, 10)

      if (!Number.isNaN(numberValue)) {
        return numberValue
      }

      const dateValue = Date.parse(value)

      return Number.isNaN(dateValue) ? value : dateValue
    }

    return {
      ...result,
      [optionKey]: parseValue(optionValue),
    }
  }, {})

  return [key, value || null, optionObject]
}

export {
  getCookieValue,
  getTraceIdFromCookie,
  extractCookie,
  getDRETValue,
  addToCookiesString,
  parseCookieString,
}
