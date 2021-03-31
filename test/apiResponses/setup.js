import chai from 'chai'
import { compareResponse } from './coreapi/utilis/compareResponseLength'
import { parseCookieString } from '../../src/server/api/requests/utils'

chai.use(require('chai-json-schema'))

if (!global.process.env.JWT_SECRET) {
  global.process.env.JWT_SECRET = 'montysomestupidsecret'
}

const toMatchSession = (responseCookies, sessionCookies) => {
  if (!responseCookies) {
    return {
      pass: false,
      message: () => 'No response cookies passed',
    }
  }
  if (!sessionCookies) {
    return {
      pass: false,
      message: () => 'No session cookies passed',
    }
  }

  const parsedSessionCookies = sessionCookies.map((cookie) =>
    parseCookieString(cookie)
  )
  const parsedResponseCookies = responseCookies.map((cookie) =>
    parseCookieString(cookie)
  )
  const missingCookies = parsedSessionCookies.filter(({ name, value }) => {
    const matchingCookie = parsedResponseCookies.find((cookie) => {
      if (cookie.name === name) {
        if (value === '' && cookie.value === '""') return true
        return cookie.value === value
      }
      return false
    })
    return !matchingCookie
  })

  if (missingCookies.length > 0) {
    return {
      pass: false,
      message: () =>
        `Missing Cookies: \n${missingCookies
          .map(({ name, value }) => `${name}: ${value}`)
          .join('\n')}`,
    }
  }

  return {
    pass: true,
  }
}

expect.extend({
  toMatchSchema: (received, schema) => {
    let chaiError
    try {
      chai.assert.jsonSchema(received, schema)
    } catch (e) {
      // catching the e instead of letting it propagate so that the stack trace
      //  points at the use of this matcher in the test rather than this file
      chaiError = e
    }

    if (chaiError) {
      return {
        pass: false,
        message: () => `${chaiError.name}: ${chaiError.message}`,
      }
    }

    const missingFieldsError = compareResponse(
      received,
      schema.properties,
      schema.title
    )

    return missingFieldsError
      ? {
          pass: false,
          message: () => missingFieldsError,
        }
      : {
          pass: true,
          message: () =>
            'expected response to include properties not listed in schema',
        }
  },
  toMatchSession,
})
