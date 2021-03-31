import canonicalisationMap from '../../../src/shared/constants/canonicalisationMap'

/**
 * @param url: m.topshop.com | m.burton.co.uk | ...
 * @returns {string} http://www.topshop.com | http://www.burton.co.uk | ...
 */
export const getCanonicalHostname = (url, httpsCanonicalEnabled) => {
  if (canonicalisationMap[url]) {
    // m.

    return httpsCanonicalEnabled
      ? canonicalisationMap[url].replace('http', 'https')
      : canonicalisationMap[url]
  }
  // www.

  return httpsCanonicalEnabled ? `https://${url}` : url
}

/**
 * Function used to prefix canonical URLs with https:// so that we can overwrite
 * modify the canonical that we receive from WCS (e.g. plp) which provides http://
 * as protocol which will not make any sense once monty desktop is 100%.
 *
 * @param {String} url url to be prefixed
 * @param {Boolean} httpsCanonicalEnabled only if true then the prefixing happens
 */
export const prefixWithHttpsProtocol = (url, httpsCanonicalEnabled) => {
  if (!url || httpsCanonicalEnabled !== true) return url

  let prefixedUrl = url

  prefixedUrl = prefixedUrl.replace('http://', 'https://')

  if (prefixedUrl && !prefixedUrl.startsWith('http')) {
    if (prefixedUrl.startsWith('//')) {
      prefixedUrl = `https:${prefixedUrl}`
    } else {
      prefixedUrl = `https://${prefixedUrl}`
    }
  }

  return prefixedUrl
}
