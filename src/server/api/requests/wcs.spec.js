import Boom from 'boom'
import request from 'superagent'
import extendWithProxy from 'superagent-proxy'
import * as utils from './utils'

import WcsCookieCaptureMock from '../__mocks__/cookie-capture.mock'

const WCS_REQUESTS_THROUGH_PROXY_old =
  global.process.env.WCS_REQUESTS_THROUGH_PROXY

global.process.env.WCS_REQUESTS_THROUGH_PROXY = 'true'

const wcs = require('./wcs').default

jest.mock('superagent', () => ({
  get: jest.fn(),
  post: jest.fn(),
  serialize: {
    'application/x-www-form-urlencoded': jest.fn(),
  },
}))
jest.mock('superagent-proxy', () => jest.fn())

const cookies = ['JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/']
const query = { queryOption: 'x' }
const payload = { payloadOption: 'y' }
const destination = 'http://www.topshop.com/api/call'
const HTTP_REDIRECT_302 = 302

describe('WCS Request', () => {
  const cookieCaptureMock = new WcsCookieCaptureMock()
  const mock = jest.fn()
  const requestRespondsOnceWith = (res) => {
    mock.redirects.mockReturnValueOnce(res)
  }
  const requestRespondsWith = (res) => {
    mock.redirects.mockReturnValue(res)
  }

  beforeEach(() => {
    jest.resetAllMocks()

    mock.query = jest.fn().mockReturnValue(mock)
    mock.set = jest.fn().mockReturnValue(mock)
    mock.redirects = jest.fn().mockReturnValue(mock)
    mock.send = jest.fn().mockReturnValue(mock)
    mock.proxy = jest.fn()
    mock.timeout = jest.fn().mockReturnValue(mock)

    request.get.mockReturnValue(mock)
    request.post.mockReturnValue(mock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.process.env.WCS_REQUESTS_THROUGH_PROXY = WCS_REQUESTS_THROUGH_PROXY_old
  })

  describe('Apps', () => {
    it('returns the text response parsed to JSON', () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      request.post.mockReturnValue(mock)

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'apps',
        null,
        '123sessionKey123',
        '123trace123',
        null,
        cookieCaptureMock
      ).then((data) => {
        expect(data.cookies).toEqual(cookies)
        expect(data.body.success).toBe(true)

        expect(request.post).toHaveBeenCalledTimes(1)
        expect(request.post).toHaveBeenCalledWith(destination)
        expect(mock.query).toHaveBeenCalledTimes(1)
        expect(mock.query).toHaveBeenCalledWith(query)
        expect(mock.set).toHaveBeenCalledWith('Cookie', [])
        expect(mock.set).toHaveBeenCalledWith(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
        expect(mock.set).toHaveBeenCalledWith('monty', 'apps')
        expect(mock.set).toHaveBeenCalledWith('traceId', '123trace123')
        expect(mock.set).toHaveBeenCalledWith('sessionKey', '123sessionKey123')
        expect(mock.redirects).toHaveBeenCalledTimes(1)
        expect(mock.redirects).toHaveBeenCalledWith(0)
        expect(mock.send).toHaveBeenCalledTimes(1)
        expect(mock.send).toHaveBeenCalledWith(payload)
      })
    })

    it('returns the response body received from WCS', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          body: {
            content: 'content',
          },
        })
      )
      request.post.mockReturnValue(mock)

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'apps',
        null,
        null,
        null,
        null,
        cookieCaptureMock
      ).then((data) => {
        expect(data.body.content).toEqual('content')
      })
    })
  })

  describe('Mobile device', () => {
    it('returns a response', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      request.post.mockReturnValue(mock)

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'mobile',
        null,
        '123sessionKey123',
        '123trace123',
        null,
        cookieCaptureMock
      ).then((data) => {
        expect(data.cookies).toEqual(cookies)
        expect(data.body.success).toBe(true)

        expect(request.post).toHaveBeenCalledTimes(1)
        expect(request.post).toHaveBeenCalledWith(destination)
        expect(mock.query).toHaveBeenCalledTimes(1)
        expect(mock.query).toHaveBeenCalledWith(query)
        expect(mock.set).toHaveBeenCalledWith('Cookie', [])
        expect(mock.set).toHaveBeenCalledWith(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
        expect(mock.set).toHaveBeenCalledWith('monty', 'true')
        expect(mock.set).toHaveBeenCalledWith('traceId', '123trace123')
        expect(mock.set).toHaveBeenCalledWith('sessionKey', '123sessionKey123')
        expect(mock.redirects).toHaveBeenCalledTimes(1)
        expect(mock.redirects).toHaveBeenCalledWith(0)
        expect(mock.send).toHaveBeenCalledTimes(1)
        expect(mock.send).toHaveBeenCalledWith(payload)
      })
    })

    it('returns a response following a redirect', () => {
      const redirect = 'http://www.topshop.com/api/different?option=5'
      requestRespondsOnceWith(
        Promise.reject({
          status: HTTP_REDIRECT_302,
          response: {
            headers: {
              location: redirect,
              'set-cookie': cookies,
            },
          },
        })
      )
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': [],
          },
          text: '{ "success": true }',
        })
      )

      return wcs(
        {
          destination,
          query: { queryOption: 'x' },
          method: 'post',
          payload: { payloadOption: 'y' },
        },
        [],
        'mobile',
        null,
        '123sessionKey123',
        '123trace123',
        null,
        cookieCaptureMock
      ).then((data) => {
        expect(data.cookies).toEqual(cookies)
        expect(data.body.success).toBe(true)

        expect(request.post).toHaveBeenCalledTimes(2)
        expect(request.post).toHaveBeenCalledWith(destination)
        expect(request.post).toHaveBeenCalledWith(redirect)

        expect(mock.query).toHaveBeenCalledTimes(2)
        expect(mock.query).toHaveBeenCalledWith(query)
        expect(mock.query).toHaveBeenCalledWith({})

        expect(mock.set).toHaveBeenCalledWith('Cookie', [])
        expect(mock.set).toHaveBeenCalledWith(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
        expect(mock.set).toHaveBeenCalledWith('monty', 'true')
        expect(mock.set).toHaveBeenCalledWith('traceId', '123trace123')
        expect(mock.set).toHaveBeenCalledWith('sessionKey', '123sessionKey123')

        expect(mock.redirects).toHaveBeenCalledTimes(2)
        expect(mock.redirects).toHaveBeenCalledWith(0)

        expect(mock.send).toHaveBeenCalledTimes(2)
        expect(mock.send).toHaveBeenCalledWith(payload)
      })
    })

    it('throws an error in case of more than 4 redirections', () => {
      requestRespondsWith(
        Promise.reject({
          status: HTTP_REDIRECT_302,
          response: {
            headers: {
              location: 'http://www.topshop.com/api/different',
            },
          },
        })
      )

      return wcs(
        {
          destination,
          query: {},
          method: 'get',
          payload: {},
        },
        [],
        'mobile',
        null,
        null,
        null,
        null,
        cookieCaptureMock
      ).catch((err) => {
        expect(err).toEqual(
          Boom.badGateway(
            'Maximum number of WCS response redirections exceeded'
          )
        )
        expect(request.get).toHaveBeenCalledTimes(17)
      })
    })

    it('Calls WCS passing the header monty="mtrue"', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'mobile',
        'true',
        null,
        null,
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('monty', 'mtrue')
      })
    })

    it('Calls WCS passing the header sessionKey', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'mobile',
        'true',
        '123abc321',
        null,
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('sessionKey', '123abc321')
      })
    })

    it('Calls WCS passing the header traceId', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'mobile',
        'true',
        null,
        '123abc321',
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('traceId', '123abc321')
      })
    })

    it('Calls WCS passing the header montyDeviceType mobile', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'mobile',
        'true',
        null,
        '123abc321',
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('montyDeviceType', 'mobile')
      })
    })

    it('Calls WCS passing the header montyDeviceType as empty string if deviceType argument is undefined', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        undefined,
        'true',
        null,
        '123abc321',
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('montyDeviceType', '')
      })
    })
  })

  describe('Non mobile device(tablet/desktop)', () => {
    it('Calls WCS passing the header monty="desktop"', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'desktop',
        null,
        null,
        null,
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('monty', 'desktop')
      })
    })

    it('Calls WCS passing the header montyDeviceType desktop', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'desktop',
        'true',
        null,
        '123abc321',
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('montyDeviceType', 'desktop')
      })
    })

    it('Calls WCS passing the header monty="mdesktop"', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'desktop',
        'true',
        null,
        null,
        null,
        cookieCaptureMock
      ).then(() => {
        expect(mock.set).toHaveBeenCalledWith('monty', 'mdesktop')
      })
    })
  })

  describe('Proxy is enabled', () => {
    beforeAll(() => {
      jest.spyOn(utils, 'canRequestHaveBody').mockReturnValue(false)
    })

    afterAll(() => {
      utils.canRequestHaveBody.restore()
    })

    it('should proxy the request', () => {
      requestRespondsWith(
        Promise.resolve({
          headers: {
            'set-cookie': cookies,
          },
          text: '{ "success": true }',
        })
      )
      request.post.mockReturnValue(mock)

      return wcs(
        {
          destination,
          query,
          method: 'post',
          payload,
        },
        [],
        'mobile',
        null,
        null,
        null,
        null,
        cookieCaptureMock
      ).then(() => {
        expect(extendWithProxy).toHaveBeenCalled()
        expect(mock.proxy).toHaveBeenCalled()
      })
    })
  })

  it('should not encode a redirected url', () => {
    const location =
      'http://www.topshop.com/api/different?option=5%2BM%3D&ddkey=https%3AOrderCalculate'
    requestRespondsOnceWith(
      Promise.reject({
        status: HTTP_REDIRECT_302,
        response: {
          headers: {
            location,
            'set-cookie': cookies,
          },
        },
      })
    )
    requestRespondsWith(
      Promise.resolve({
        headers: {
          'set-cookie': [],
        },
        text: '{ "success": true }',
      })
    )

    return wcs(
      {
        destination,
        query: { queryOption: 'x' },
        method: 'post',
        payload: { payloadOption: 'y' },
      },
      [],
      null,
      null,
      null,
      null,
      null,
      cookieCaptureMock
    ).then(() => {
      expect(request.post).toHaveBeenCalledWith(location)
    })
  })

  it('throws a Bad Gateway error if it can not parse the json', async () => {
    const err = {
      headers: {
        'set-cookie': [],
      },
      text: ' "success": true }',
    }
    requestRespondsWith(Promise.resolve(err))

    await wcs(
      {
        destination,
        query: { queryOption: 'x' },
        method: 'post',
        payload: { payloadOption: 'y' },
      },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cookieCaptureMock
    ).catch((err) => {
      expect(err).toEqual(Boom.badGateway('Error parsing upstream data', err))
    })
  })

  it('for all other error responses, pass along the WCS error', async () => {
    requestRespondsWith(
      Promise.reject({
        status: 500,
        message: 'Internal server error',
      })
    )

    await wcs(
      {
        destination,
        query: { queryOption: 'x' },
        method: 'post',
        payload: { payloadOption: 'y' },
      },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cookieCaptureMock
    ).catch((err) => {
      expect(err).toEqual(Boom.badGateway('Internal server error'))
    })
  })

  describe('error handling', () => {
    const arg = {
      destination,
      query: {},
      method: 'get',
      payload: {},
    }
    const defaultArgs = [
      arg,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cookieCaptureMock,
    ]

    it('should throw an error created using Boom.create for any 400+ errors', () => {
      const statusCode = 500
      const message = 'Whoops'
      const error = { status: statusCode, message }
      const boomError = { foo: 'bar' }
      jest.spyOn(Boom, 'create').mockReturnValue(boomError)
      requestRespondsWith(Promise.reject(error))

      return wcs(...defaultArgs)
        .then(
          () => {
            throw new Error("Promise didn't reject as expected")
          },
          (err) => {
            expect(Boom.create).toHaveBeenCalled()
            expect(err).toBe(boomError)
          }
        )
        .then(Boom.create.mockRestore)
    })

    it('should propagate any errors without a status property', () => {
      const error = { foo: 'bar' }
      requestRespondsWith(Promise.reject(error))

      return wcs(...defaultArgs).then(
        () => {
          throw new Error("Promise didn't reject as expected")
        },
        (err) => {
          expect(err).toBe(error)
        }
      )
    })

    it('should propagate any errors without a status less than 400 (not 301, 302 or 307)', () => {
      const error = { status: 304 }
      requestRespondsWith(Promise.reject(error))

      return wcs(...defaultArgs).then(
        () => {
          throw new Error("Promise didn't reject as expected")
        },
        (err) => {
          expect(err).toBe(error)
        }
      )
    })
  })
})
