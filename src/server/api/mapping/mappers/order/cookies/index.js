import {
  klarnaCookieOptions,
  cookieOptionsUnset,
} from '../../../../../lib/auth'

const createCookies = (instructions) =>
  instructions.map(([name, value, options]) => ({
    name,
    value,
    options,
  }))

export const klarnaCookies = ({ sessionId = '', clientToken = '' } = {}) =>
  createCookies([
    ['klarnaSessionId', sessionId, klarnaCookieOptions],
    ['klarnaClientToken', clientToken, klarnaCookieOptions],
  ])

export const clearKlarnaCookies = () =>
  createCookies([
    ['klarnaClientToken', null, cookieOptionsUnset],
    ['klarnaSessionId', null, cookieOptionsUnset],
  ])
