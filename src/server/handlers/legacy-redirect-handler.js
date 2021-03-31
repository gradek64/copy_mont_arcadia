import { path as ramdaPath } from 'ramda'

import wcs from '../api/requests/wcs'
import * as logger from '../lib/logger'
import { getSiteConfig } from '../config'
import { getDestinationHostFromStoreCode } from '../api/utils'

function constructWcsUrl(hostname, pathname) {
  const siteConfig = getSiteConfig(hostname)
  const { storeCode } = siteConfig
  const wcsHostname = getDestinationHostFromStoreCode(
    process.env.WCS_ENVIRONMENT,
    storeCode
  )
  return `${wcsHostname}${pathname}`
}

/**
 * This function calls wcs to retrieve the redirect, and adds
 * before / after logging to the wcs call sequence.
 *
 * @param {string} wcsUrl - target endpoint
 * @param {*} query - Query object
 */
export function fetchRedirectFromWcs(wcsUrl, query) {
  const transactionId = logger.generateTransactionId()
  // These options ensure we get a json response back
  // from wcs
  const deviceType = 'mobile'
  const isMobileHostname = true
  const method = 'GET'

  logger.info('wcs:redirect', {
    loggerMessage: 'request',
    transactionId,
    method,
    url: wcsUrl,
    sessionKey: '',
    combinedCookies: [],
    query,
    deviceType,
    isMobileHostname,
  })

  return wcs(
    {
      destination: wcsUrl,
      method: 'get',
      query,
    },
    [], // cookies
    'mobile', // deviceType
    true // isMobileHostname
  )
    .then((res) => {
      const body = res && res.body ? res.body : {}

      logger.info('wcs:redirect', {
        loggerMessage: 'response',
        transactionId,
        method,
        url: wcsUrl,
        sessionKey: '',
        cookies: res.cookies,
        deviceType,
        isMobileHostname,
        statusCode: res.status,
        body: logger.isTraceLoggingEnabled() ? body : undefined,
      })

      return body
    })
    .catch((err) => {
      logger.info('wcs:redirect', {
        loggerMessage: 'response',
        transactionId,
        method,
        url: wcsUrl,
        sessionKey: '',
        cookies: ramdaPath(['output', 'headers', 'cookie'], err),
        deviceType,
        isMobileHostname,
        statusCode: ramdaPath(['output', 'statusCode'], err),
      })

      throw err
    })
}

/**
 * This function intercepts a request to the legacy application,
 * calls wcs to retrive the correct canonical url to redirect to,
 * and then permanently redirects the request to the provided url.
 *
 * If an error is encountered or the payload from wcs is as expected,
 * we redirect to the homepage but without setting the redirect to be
 * permanent.
 *
 * Query (search) parameters are retained on the redirect in order
 * to keep any tracking parameters from inbound links from third
 * parties
 *
 * @param {*} req - Hapi Request object
 * @param {*} reply - Hapi Response object
 */
export async function catalogLegacyRedirectHandler(req, reply) {
  const {
    url: { pathname, search },
    info: { hostname },
    query,
  } = req

  try {
    const wcsUrl = constructWcsUrl(hostname, pathname)
    const body = await fetchRedirectFromWcs(wcsUrl, query)
    const redirect = body.permanentRedirectUrl
      ? body.permanentRedirectUrl.split('?')[0]
      : ramdaPath(['plpJSON', 'canonicalURL'], body)

    // if no legitmate redirect provided,
    // throw error and fallback to non-permanent redirect
    if (!redirect) {
      throw new Error('No redirect or canonicalURL provided')
    }

    return reply()
      .redirect(`${redirect}${search || ''}`)
      .permanent()
  } catch (err) {
    // fallback to non-permanent homepage redirect on error
    return reply().redirect(`/${search || ''}`)
  }
}

/**
 * Requests to 'webapp/wcs/stores/servlet/TopCategoriesDisplay'
 * should be redirected to the homepage, but query params should be
 * retained on the subsequent redirect
 *
 * @param {*} req - Hapi JS Request
 * @param {*} reply - Hapi JS Response
 */
export async function homeLegacyRedirectHandler(req, reply) {
  const {
    url: { search },
  } = req
  const redirect = search ? `/${search}` : '/'
  return reply()
    .redirect(redirect)
    .permanent()
}
