import {
  cookieOptions,
  cookieOptionsBag,
  cookieOptionsAuth,
  cookieOptionsUnset,
  cookieOptionsUserSeg,
  partiallyAuthenticatedCookieTTL,
} from '../../../../../lib/auth'

const logonHeaders = (bvToken) => [
  {
    name: 'bvtoken',
    value: bvToken,
  },
]

const createCookies = (instructions) =>
  instructions.map(([name, value, options]) => ({
    name,
    value,
    options,
  }))

const logonCookies = ({ basketItemCount = 0 }, bvToken, userSeg = null) =>
  createCookies([
    ['bvToken', bvToken, cookieOptions],
    ['bagCount', basketItemCount.toString(), cookieOptionsBag],
    ['userSeg', userSeg, cookieOptionsUserSeg],
    ['authenticated', 'yes', cookieOptionsAuth],
    ['klarnaClientToken', null, cookieOptionsUnset],
    ['klarnaSessionId', null, cookieOptionsUnset],
  ])

const logoutCookies = () =>
  createCookies([
    ['bvToken', null, cookieOptionsUnset],
    ['bagCount', null, cookieOptionsUnset],
    ['authenticated', null, cookieOptionsAuth],
    ['userSeg', null, cookieOptionsUnset],
    ['klarnaClientToken', null, cookieOptionsUnset],
    ['klarnaSessionId', null, cookieOptionsUnset],
  ])

const authenticatedCookies = () =>
  createCookies([['authenticated', 'yes', cookieOptionsAuth]])

const registerCookies = (bvToken) =>
  createCookies([
    ['authenticated', 'yes', cookieOptionsAuth],
    ['bvToken', bvToken, cookieOptions],
  ])

const partialAuthenticatedCookies = `authenticated=partial;Max-Age=${partiallyAuthenticatedCookieTTL};Path=/;`

export {
  logonHeaders,
  logonCookies,
  logoutCookies,
  registerCookies,
  authenticatedCookies,
  partialAuthenticatedCookies,
}
