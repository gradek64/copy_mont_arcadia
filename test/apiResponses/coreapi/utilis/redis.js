import redis from 'redis'
import { parseCookieString } from '../../../../src/server/api/requests/utils'
import { BACKEND_JWT } from '../../../../src/server/api/constants/cookies'
import { verifyJwtSync } from '../../../../src/server/lib/auth'

let client

const getClient = async () => {
  if (!client) {
    const options = {
      host: process.env.REDIS_HOST_FOR_SESSION_STORE,
      port: process.env.REDIS_PORT_FOR_SESSION_STORE,
    }
    client = redis.createClient(options)
  }
  return client
}

export const getJSessionIdFromCookies = (cookies) => {
  let jsessionid = ''
  cookies.some((cookie) => {
    const { name, value } = parseCookieString(cookie)
    const isJSessionId = name === 'jsessionid' && /^ey/.test(value)
    if (isJSessionId) {
      jsessionid = value
    }
    return isJSessionId
  })
  return jsessionid
}

export const getSession = (key) => {
  return new Promise((resolve, reject) => {
    getClient().then((client) => {
      client.get(key, (err, res) => {
        if (err) reject(err)
        resolve(JSON.parse(res || '[]'))
      })
    })
  })
}

const getCookiesFromHeader = (httpResponse) =>
  (httpResponse && httpResponse.header && httpResponse.header['set-cookie']) ||
  []

const getJWT = (cookies) => {
  const cookie = cookies.find((cookie) => {
    const { name } = parseCookieString(cookie)
    return name === BACKEND_JWT
  })
  const { value } = parseCookieString(cookie)
  return value
}

const getCookiesFromJwt = async (jwt, cookies) =>
  jwt ? verifyJwtSync(jwt) : cookies

const getJWTCookies = async (httpResponse) => {
  const allResponseCookies = getCookiesFromHeader(httpResponse)
  const jwt = getJWT(allResponseCookies)
  const cookies = await getCookiesFromJwt(jwt, allResponseCookies)
  return cookies
}

export const getJessionIdFromResponse = async (httpResponse) => {
  const responseCookies = await getCookiesFromHeader(httpResponse)
  const jsessionid = getJSessionIdFromCookies(responseCookies)
  return `jsessionid=${jsessionid}; `
}

export const getResponseAndSessionCookies = async (
  httpResponse,
  jsessionid
) => {
  const jwtCookies = await getJWTCookies(httpResponse)
  const allClientCookies = await getCookiesFromHeader(httpResponse)
  if (!jsessionid) {
    jsessionid = getJSessionIdFromCookies(allClientCookies)
  } else {
    jsessionid = jsessionid.split('=')[1]
  }
  const session = await getSession(jsessionid)
  return {
    session,
    responseCookies: jwtCookies,
  }
}
