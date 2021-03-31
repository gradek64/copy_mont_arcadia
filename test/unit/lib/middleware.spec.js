import JWT from 'jsonwebtoken'
import {
  session,
  cacheHeaders,
  decodeJwt,
} from '../../../src/server/lib/middleware'
import { cookieOptions } from '../../../src/server/lib/auth'

const { JWT_SECRET = 'some secret' } = process.env

const createReply = (t, message, state, withCallback) => {
  const reply = () => {}
  reply.continue = () => {
    t.pass(message)
    if (withCallback) t.end()
  }
  reply.state = state
  return reply
}

test.skip('if the session header is equal to the cookie session key do not do anything', (t) => {
  const request = {
    arcadiaSessionKey: '28490403827648',
    path: '/api',
    state: {
      token: JWT.sign({ 'arcadia-session-key': '28490403827648' }, JWT_SECRET, {
        algorithm: 'HS256',
      }),
    },
    response: { header() {}, isBoom: false },
  }

  const reply = createReply(
    t,
    'header session key is equal to the decoded cookie session key'
  )
  session(request, reply)
  t.end()
})

test.skip('on first page load a temporary cookie must be set', (t) => {
  const request = {
    path: '/api',
    state: {},
    response: { header() {} },
  }
  const stateFn = (cookie, truethy, options) => {
    expect(cookie).toBe('tempsession')
    expect(truethy).toBe('true')
    expect(options).toEqual(cookieOptions)
  }
  const reply = createReply(t, 'temporarary cookie is set', stateFn)
  session(request, reply)
  t.end()
})

test.skip('if the header session key is not equal to the cookie session key reset the cookie', (t) => {
  const token = JWT.sign(
    { 'arcadia-session-key': '28490403827648' },
    JWT_SECRET,
    { algorithm: 'HS256' }
  )
  const stateFn = (cookie, value, options) => {
    if (cookie === 'token') {
      expect(cookie).toBe('token')
      expect(value).toBe(token)
      expect(options).toEqual(cookieOptions)
    } else {
      expect(cookie).toBe('bagCount')
      expect(value).toBe('0')
      expect(options).toEqual(cookieOptions)
    }
  }
  const request = {
    arcadiaSessionKey: '28490403827648',
    path: '/api',
    state: {
      token: JWT.sign({ 'arcadia-session-key': '91237427071239' }, JWT_SECRET, {
        algorithm: 'HS256',
      }),
    },
    response: {
      header(header, value) {
        if (header === 'session-expired') {
          expect(header).toBe('session-expired')
          expect(value).toBe('true')
        } else if (header === 'x-frame-options') {
          expect(header).toBe('x-frame-options')
          expect(value).toBe('SAMEORIGIN')
        }
      },
    },
  }

  const reply = createReply(t, 'cookie was successfully reset', stateFn, true)
  session(request, reply)
})

test.skip('if a cached url has expired chachHeaders resets the cached url', (t) => {
  const request = {
    response: {
      ttl(expiration) {
        expect(expiration).toBe(600 * 1000)
      },
      statusCode: 200,
    },
    url: {
      path: '/api/cms/test',
    },
  }
  const reply = createReply(t, 'timeout was efectivley reset')
  cacheHeaders(request, reply)
  t.end()
})

test.skip('if a non-cached url has been passed to cacheHeaders ttl is not set', (t) => {
  let time = 0
  const request = {
    response: {
      ttl() {
        time += 1
      },
      statusCode: 200,
    },
    url: {
      path: '/api/cms/test',
    },
  }
  const reply = createReply(t, 'timeout not set')
  cacheHeaders(request, reply)
  expect(time).toBe(1)
  t.end()
})

test('decodeJwt() sets decoded payload in request if token is valid', (done) => {
  const jwt = JWT.sign({ data: 'random data' }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
  })
  const request = {
    path: '/api/cms/test',
    state: {
      token: jwt,
    },
  }
  decodeJwt(request, {
    continue() {
      expect(request.jwtPayload.data).toBe('random data')
      done()
    },
  })
})
