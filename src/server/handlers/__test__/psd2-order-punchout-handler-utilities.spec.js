import nock from 'nock'
import { BACKEND_JWT } from '../../api/constants/cookies'
import { signJwtSync } from '../../lib/auth'
import {
  buildMontyHeader,
  sendWcsRequest,
  getQueryParams,
  serialiseQueryParams,
  punchoutSequence,
  failureSequence,
} from '../psd2-order-punchout-handler'

jest.mock('@ag-digital/pantry', () => jest.fn())
import pantry from '@ag-digital/pantry'

const signJwtCookies = (cookies) => signJwtSync(JSON.stringify(cookies))

describe('buildMontyHeader', () => {
  it('should return the device type as mapped when not a mobile hostname', () => {
    const isMobileHostname = 'false'

    expect(
      buildMontyHeader({
        deviceType: 'desktop',
        isMobileHostname,
      })
    ).toEqual('desktop')

    expect(
      buildMontyHeader({
        deviceType: 'apps',
        isMobileHostname,
      })
    ).toEqual('apps')
  })

  it('should return the device type with mobile prefix when it is a mobile hostname, except for apps', () => {
    const isMobileHostname = 'true'

    expect(
      buildMontyHeader({
        deviceType: 'desktop',
        isMobileHostname,
      })
    ).toEqual('mdesktop')

    expect(
      buildMontyHeader({
        deviceType: 'apps',
        isMobileHostname,
      })
    ).toEqual('apps')
  })
})

describe('sendWcsRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sends PaRes and MD to the given url', async () => {
    const origin = 'http://wcs.example.com'
    const pathname = '/x/y/z'
    const paRes = 'test-pares'
    const md = 'test-md'
    const montyHeader = 'test-header'
    const cookies = ['test-cookie=biscuit']
    const jsessionid = 'test-session-id'
    const body = { answer: 'test-answer' }

    const nockScope = nock(origin, {
      reqheader: {
        monty: montyHeader,
        Cookie: cookies.join(''),
        sessionKey: jsessionid,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .post(pathname, `PaRes=${paRes}&MD=${md}`)
      .reply(200, body)

    const reply = await sendWcsRequest({
      wcsUrl: `${origin}${pathname}`,
      orderPayload: { paRes, md },
      montyHeader,
      cookies,
      jsessionid,
    })

    expect(nockScope.isDone()).toBe(true)
    expect(reply).toEqual(body)
  })
})

describe('getQueryParams', () => {
  it('extracts an empty object when there are no query parameters', () => {
    expect(getQueryParams('http://www.example.com')).toEqual({})
  })

  it('extracts query parameters as an object', () => {
    expect(getQueryParams('http://www.example.com?foo=bar')).toEqual({
      foo: 'bar',
    })
    expect(getQueryParams('http://www.example.com?foo=bar&boz=baz')).toEqual({
      foo: 'bar',
      boz: 'baz',
    })
  })
})

describe('serialiseQueryParams', () => {
  it('takes an empty object and returns an empty string', () => {
    expect(serialiseQueryParams({})).toEqual('')
  })

  it('takes an object with a single entry and creates a string with no ampersand', () => {
    const params = {
      foo: 'alpha',
    }

    expect(serialiseQueryParams(params)).toEqual('foo=alpha')
  })

  it('takes an object with multiple entries and joins them with an ampersand', () => {
    const params = {
      foo: 'alpha',
      bar: 10,
      baz: 'beta',
    }

    expect(serialiseQueryParams(params)).toEqual('foo=alpha&bar=10&baz=beta')
  })

  it('uri encodes entries', () => {
    const params = {
      foo: 'alpha:/?',
      bar: 10,
      baz: 'beta',
    }

    expect(serialiseQueryParams(params)).toEqual(
      'foo=alpha%3A%2F%3F&bar=10&baz=beta'
    )
  })
})

describe('punchoutSequence', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws when there is no order payload in the request', async () => {
    return expect(punchoutSequence()({})).rejects.toThrow()
  })

  it('uses wcs cookies provided from client when punching out to /psd2-order-confirm', async () => {
    const origin = 'http://wcs.example.com'
    const pathname = '/x/y/z'
    const cookies = [`paymentCallBackUrl=${origin}${pathname}`, 'test=value']
    const jwtToken = signJwtCookies(cookies)
    const paRes = 'test-pares'
    const md = 'test-md'
    const montyHeader = 'desktop'
    const jsessionid = 'test-session-id'
    const title = 'test-title'
    const param1 = 'param1=alpha'
    const param2 = 'param2=beta'
    const body = {
      title,
      redirectURL: `http://wcs.example.com/punchout?${param1}&${param2}`,
    }

    const nockScope = nock(origin, {
      reqheader: {
        monty: montyHeader,
        Cookie: cookies.join(''),
        sessionKey: jsessionid,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .post(pathname, `PaRes=${paRes}&MD=${md}`)
      .reply(200, body)

    // retrieveSession is only called when BACKEND_JWT cookie doesn't provide
    // cookies
    const session = { cookies: [] }
    const retrieveSession = jest.fn(() => Promise.resolve(session))
    pantry.mockReturnValue({ retrieveSession })

    const request = {
      headers: {
        'monty-client-device-type': 'desktop',
        'monty-mobile-hostname': 'false',
      },
      state: {
        jsessionid,
        [BACKEND_JWT]: jwtToken,
      },
      query: {
        MD: 'test-md',
        PaRes: 'test-pares',
        ga: 'test-ga',
        orderId: 'test-order-id',
      },
      info: {
        hostname: 'test-hostname',
      },
    }

    const context = await punchoutSequence()(request)
    expect(nockScope.isDone()).toBe(true)
    expect(context).toEqual({
      lang: 'en',
      title,
      nextUrl: expect.any(String),
    })
    expect(retrieveSession).not.toHaveBeenCalled()
  })

  it('creates a handlebars context that punches out to /psd2-order-confirm', async () => {
    const origin = 'http://wcs.example.com'
    const pathname = '/x/y/z'
    const paRes = 'test-pares'
    const md = 'test-md'
    const montyHeader = 'desktop'
    const cookies = ['test-cookie=biscuit']
    const jsessionid = 'test-session-id'
    const title = 'test-title'
    const param1 = 'param1=alpha'
    const param2 = 'param2=beta'
    const body = {
      title,
      redirectURL: `http://wcs.example.com/punchout?${param1}&${param2}`,
    }

    const nockScope = nock(origin, {
      reqheader: {
        monty: montyHeader,
        Cookie: cookies.join(''),
        sessionKey: jsessionid,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .post(pathname, `PaRes=${paRes}&MD=${md}`)
      .reply(200, body)

    const session = { cookies: [`paymentCallBackUrl=${origin}${pathname}`] }
    const retrieveSession = jest.fn(() => Promise.resolve(session))
    pantry.mockReturnValue({ retrieveSession })

    const request = {
      headers: {
        'monty-client-device-type': 'desktop',
        'monty-mobile-hostname': 'false',
      },
      state: {
        jsessionid,
      },
      query: {
        MD: 'test-md',
        PaRes: 'test-pares',
        ga: 'test-ga',
        orderId: 'test-order-id',
      },
      info: {
        hostname: 'test-hostname',
      },
    }

    const context = await punchoutSequence()(request)
    expect(nockScope.isDone()).toBe(true)
    expect(context).toEqual({
      lang: 'en',
      title,
      nextUrl: expect.any(String),
    })

    expect(/^\/psd2-order-confirm\?/.test(context.nextUrl)).toBe(true)
    expect(/param1=alpha/.test(context.nextUrl)).toBe(true)
    expect(/param2=beta/.test(context.nextUrl)).toBe(true)
    expect(/ga=test-ga/.test(context.nextUrl)).toBe(true)
    expect(/hostname=test-hostname/.test(context.nextUrl)).toBe(true)
    expect(/\?(:?(:?\w+=[-\w]+)&)+(:?\w+=[-\w]+)$/.test(context.nextUrl)).toBe(
      true
    )
  })
})

describe('failureSequence', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a handlebars context that punches out to /psd2-order-failure', async () => {
    const request = {
      query: {},
    }
    const error = null
    const context = await failureSequence(request, error)
    expect(context).toEqual({
      lang: 'en',
      title: 'Punchout Error',
      nextUrl: '/psd2-order-failure',
    })
  })

  it("passes an error object's message as a query parameter", async () => {
    const request = {
      query: {},
    }
    const errorMessage = 'test-failure'
    const error = new Error(errorMessage)
    const context = await failureSequence(request, error)
    expect(context).toEqual({
      lang: 'en',
      title: 'Punchout Error',
      nextUrl: `/psd2-order-failure?error=${errorMessage}`,
    })
  })

  it('passes an error message as a query parameter', async () => {
    const request = {
      query: {},
    }
    const errorMessage = 'test-failure'
    const context = await failureSequence(request, errorMessage)
    expect(context).toEqual({
      lang: 'en',
      title: 'Punchout Error',
      nextUrl: `/psd2-order-failure?error=${errorMessage}`,
    })
  })

  it('passes the paymentMethod and orderId as query parameters', async () => {
    const paymentMethod = 'VISA'
    const orderId = '12345'
    const request = {
      query: {
        paymentMethod,
        orderId,
      },
    }
    const error = null
    const context = await failureSequence(request, error)
    expect(context).toEqual({
      lang: 'en',
      title: 'Punchout Error',
      nextUrl: `/psd2-order-failure?paymentMethod=${paymentMethod}&orderId=${orderId}`,
    })
  })
})
