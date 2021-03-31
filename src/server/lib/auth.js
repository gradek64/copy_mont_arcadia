import JWT from 'jsonwebtoken'

const JWTSECRET = process.env.JWT_SECRET

const sessionTtl = 1000 * 60 * 30
export const partiallyAuthenticatedCookieTTL = 60 * 60 * 24 * 10 // 10 days in seconds

export function basicAuthVerification(request, username, password, callback) {
  const isValid =
    username === process.env.BASIC_AUTH_USERNAME &&
    password === process.env.BASIC_AUTH_PASSWORD
  return callback(null, isValid, { id: '1337', name: 'Sir Montague' })
}

export function verifyJwt(jwt, callback) {
  JWT.verify(jwt, JWTSECRET, callback)
}

export function signJwt(payload, callback) {
  JWT.sign(payload, JWTSECRET, { algorithm: 'HS256' }, callback)
}

export function verifyJwtSync(jwt) {
  return JWT.verify(jwt, JWTSECRET)
}

export function signJwtSync(payload) {
  return JWT.sign(payload, JWTSECRET, { algorithm: 'HS256' })
}

export const cookieOptionsUnset = {
  ttl: 0,
  path: '/',
  encoding: 'none',
  isSecure: false, // change back to (process.env.NODE_ENV === 'production') when usablenet migration is complete
  isHttpOnly: true,
  clearInvalid: true,
  strictHeader: false,
}

export const cookieOptionsDay = {
  ttl: 1000 * 60 * 60 * 24,
  path: '/',
  encoding: 'none',
  isSecure: false, // change back to (process.env.NODE_ENV === 'production') when usablenet migration is complete
  isHttpOnly: true,
  clearInvalid: false,
  strictHeader: false,
}

export const cookieOptions = {
  ttl: sessionTtl,
  path: '/',
  encoding: 'none',
  isSecure: false, // change back to (process.env.NODE_ENV === 'production') when usablenet migration is complete
  isHttpOnly: true,
  clearInvalid: false,
  strictHeader: false,
}

export const cookieOptionsAuth = {
  ttl: sessionTtl,
  path: '/',
  encoding: 'none',
  isSecure: false,
  isHttpOnly: false,
  clearInvalid: false,
  strictHeader: false,
}

export const cookieOptionsUserSeg = {
  path: '/',
  encoding: 'none',
  isSecure: false,
  isHttpOnly: false,
  clearInvalid: false,
  strictHeader: false,
}
export const cookieOptionsBag = {
  path: '/',
  encoding: 'none',
  isSecure: false,
  isHttpOnly: false,
  clearInvalid: false,
  strictHeader: false,
}

export const cookieOptionsApi = {
  path: '/',
  encoding: 'none',
  isSecure: false,
  isHttpOnly: false,
  clearInvalid: false,
  strictHeader: false,
}

export const klarnaCookieOptions = {
  ttl: 1000 * 60 * 60 * 48,
  path: '/',
  encoding: 'none',
  isSecure: false, // change back to (process.env.NODE_ENV === 'production') when usablenet migration is complete
  isHttpOnly: true,
  clearInvalid: false,
  strictHeader: false,
}
