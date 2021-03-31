import r from 'ramda'
import { createGetSession, getCookies } from './sessionUtils'
import { parseCookieString } from '../../../api/requests/utils'

export const extractCartId = (cookies = []) => {
  const cookie = cookies.find((item) => item.indexOf('cartId') >= 0)
  if (cookie) {
    const { value } = parseCookieString(cookie)
    return Promise.resolve(value)
  }
  return Promise.reject('No cartId found in session cookies')
}

export const createGetOrderId = (cookieCapture) => async (
  clientCookies = {}
) => {
  const session = await createGetSession(cookieCapture)(clientCookies)
  const sessionCookies = await getCookies(session)
  const wcsCookies = sessionCookies || cookieCapture.readForServer()
  return extractCartId(wcsCookies)
}

/**
 * Returns the delivery date or false
 *
 * @throws if passed invalid cookies
 * @param cookies {Array<String>} The cookies from the session between monty server and WCS
 * @return {String|false}
 */
export function extractNominatedDeliveryDate(cookies) {
  if (!cookies || !Array.isArray(cookies))
    throw new Error('Expected cookies array')
  return cookies.reduce((acc, c) => {
    return r.match(/^nominatedDeliveryDate=([^;]+);$/, c)[1] || acc
  }, false)
}
