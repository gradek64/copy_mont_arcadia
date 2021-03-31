import { signJwtSync, verifyJwtSync } from './auth'
import { parseCookieString, removeExpiredCookies } from '../api/requests/utils'
import { BACKEND_JWT } from '../api/constants/cookies'
import { error, setCustomAttribute } from './logger'

const jwtSections = ['header', 'payload', 'signature']

export default class WcsCookieCapture {
  constructor(clientCookies, doNotGenerateSession = false) {
    this.doNotGenerateSession = doNotGenerateSession
    // if doNotGenerateSession is true, the user has been
    // identified as a bot so we should ignore any wcs cookies
    const cookies = doNotGenerateSession
      ? []
      : this.extractCookiesOnRequest(clientCookies)
    this.cookies = removeExpiredCookies(cookies)
    this.requestHasWcsCookies = this.cookies.length > 0
    setCustomAttribute('cookiesFromClient', this.requestHasWcsCookies)
  }

  extractCookiesOnRequest(clientCookies) {
    const jwt = clientCookies && clientCookies[BACKEND_JWT]
    if (jwt) {
      try {
        const cookies = verifyJwtSync(jwt)
        return cookies
      } catch (e) {
        const jwtSplit = jwt.split('.')
        const jwtInfo = jwtSplit
          .map((v, i) => `${jwtSections[i]} length: ${v.length}`)
          .join(', ')
        error('security:jwt', {
          errorMessage: e.message,
          jwtHasSignature: jwtSplit.length === 3,
          message: `error verifying JWT. ${jwtInfo}`,
        })
        throw new Error('Invalid JWT received')
      }
    } else {
      return []
    }
  }

  hasWcsCookies() {
    return this.requestHasWcsCookies
  }

  capture(newCookies) {
    this.cookies = removeExpiredCookies([...newCookies])
  }

  removeCookieByName(cookieName) {
    this.cookies = this.cookies.filter((cookie) => {
      const { name } = parseCookieString(cookie)
      return name !== cookieName
    })
  }

  readForServer() {
    return [...this.cookies]
  }

  generateCookieValue() {
    const cookieContent = this.doNotGenerateSession ? [] : this.cookies
    return JSON.stringify(cookieContent)
  }

  // bots get a cookie with an empty array set as it's payload.
  // which will look like something this:
  // <header>.W10.<signature>
  readForClient() {
    const cookieContent = this.generateCookieValue()

    try {
      const jwt = signJwtSync(cookieContent)
      return [
        {
          name: BACKEND_JWT,
          value: jwt,
        },
      ]
    } catch (e) {
      error('wcs:err', {
        errorMessage: e.message,
        message: 'error generating JWT',
      })
      return []
    }
  }
}
