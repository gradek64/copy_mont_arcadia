import pantry from '@ag-digital/pantry'
import { extractCookieValue, mapCookies } from '../../utils'
import { extractCookie } from '../../../../shared/lib/cookie'
import isbot from 'isbot'

export const doNotGenerateSession = ({
  userAgentCallingApi,
  userAgentCallingSsr,
}) => {
  // These are bots we've identified that aren't captured by isbot
  isbot.extend([
    'MicroMessenger/6.5.16.1120',
    'Mb2345Browser/9.0',
    'LieBaoFast/4.51.3',
    'UCBrowser/11.7.0.953',
  ])
  // should not identify node-superagent as bot
  // these will most likely be for the core-api
  // TODO: HeadlessChrome allows e2e suite to run,
  // should be removed when user-agent added to e2e
  isbot.exclude(['^node-superagent', 'HeadlessChrome/'])
  const isUABot = isbot(userAgentCallingApi) || isbot(userAgentCallingSsr)
  return isUABot
}

export const getCookies = (session = {}) => {
  return session.cookies && Array.isArray(session.cookies)
    ? Promise.resolve(session.cookies)
    : Promise.resolve(null)
}

export const createGetSessionFromKey = (cookieCapture) => (jsessionid) => {
  if (!jsessionid) return Promise.reject('No jsessionid')
  const cookieJarSettings = {
    host: process.env.REDIS_HOST_FOR_SESSION_STORE,
    port: process.env.REDIS_PORT_FOR_SESSION_STORE,
  }
  return cookieCapture.hasWcsCookies()
    ? pantry(cookieJarSettings)
    : pantry(cookieJarSettings).retrieveSession(jsessionid)
}

/**
 * This creates a getSession function that can be used later.
 * by the mapper class for instance
 */
export const createGetSession = (cookieCapture) => (cookies = {}) => {
  const clientJsessionid = extractCookieValue('jsessionid', cookies)
  return createGetSessionFromKey(cookieCapture)(clientJsessionid)
}

/**
 * This creates the getCookieFromStore function that can be used later.
 * by the mapper class for instance
 */
export const createGetCookieFromStore = (cookieCapture) => (
  cookieName,
  cookies = {}
) => {
  return createGetSession(cookieCapture)(cookies)
    .then((res) => getCookies(res))
    .then((cookies) => {
      if (!cookies) {
        const serverCookies = cookieCapture.readForServer()
        return Promise.resolve(serverCookies)
      }
      return Promise.resolve(cookies)
    })
    .then((res) => {
      return extractCookie(cookieName, res)
    })
    .catch(() => null)
}

/**
 * The logic contained in this function is the same as extractCookieValue() except,
 * startsWith() uses a hardcoded value, and a boolean is returned rather than a string
 */
export const isAuthenticated = (clientCookies) => {
  // could use this instead?
  // return extractCookieValue('authenticated', clientCookies).indexOf('yes') >= 0;
  const cookiesAr = mapCookies(clientCookies)
  if (Array.isArray(cookiesAr)) {
    const authenticated = cookiesAr.find((cookie) =>
      cookie.startsWith('authenticated=')
    )
    return (authenticated && authenticated.indexOf('yes') >= 0) || false
  }
  return false
}
