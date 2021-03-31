import deepFreeze from 'deep-freeze'

jest.mock('../../lib/newrelic', () => {})
jest.mock('newrelic', () => ({
  addCustomAttribute: jest.fn(),
}))
import newrelic from 'newrelic'

import { serverSideRendererLite } from '../server-side-renderer'
import { jsessionidCookieOptions } from '../../api/constants/session'

const BASE_REQUEST = deepFreeze({
  info: {
    hostname: 'topshop',
  },
  url: {
    pathname: '/',
    query: {},
  },
  headers: {
    cookie: '',
  },
  state: {},
})

const getFakeReply = () => {
  const reply = jest.fn(() => reply)
  reply.view = jest.fn(() => reply)
  reply.state = jest.fn(() => reply)
  reply.code = jest.fn()
  return reply
}

describe('serverSideRendererLite', () => {
  let reply

  beforeEach(() => {
    jest.resetAllMocks()
    reply = getFakeReply()
  })

  describe('@render', () => {
    const context = deepFreeze({
      lang: 'en',
      title: 'Test Title',
      nextUrl: 'http://www.example.com',
    })

    it('passes the context to the named handlebars template', async () => {
      const template = 'punchout'
      await serverSideRendererLite({
        template,
        buildContext: async () => context,
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.view).toHaveBeenCalledWith(template, context)
    })

    it('has a response code of 200 OK for a succesful render', async () => {
      await serverSideRendererLite({
        template: 'punchout',
        buildContext: async () => context,
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.code).toHaveBeenCalledWith(200)
    })

    it('has an overrideable response code for a succesful render', async () => {
      const successCode = 201
      await serverSideRendererLite({
        template: 'punchout',
        buildContext: async () => context,
        successCode,
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.code).toHaveBeenCalledWith(successCode)
    })

    it('has a response code of 500 Internal Server Error for a failed render', async () => {
      await serverSideRendererLite({
        template: 'punchout',
        buildContext: async () => {
          throw new Error('failed to build context')
        },
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.code).toHaveBeenCalledWith(500)
    })

    it('reports additional error detail to New Relic during a failed render', async () => {
      const errorMessage = 'failed to build context'
      await serverSideRendererLite({
        template: 'punchout',
        buildContext: async () => {
          throw new Error(errorMessage)
        },
        request: BASE_REQUEST,
        reply,
      })
      expect(newrelic.addCustomAttribute).toHaveBeenCalledTimes(1)
      expect(newrelic.addCustomAttribute.mock.calls[0][0]).toBe('errorDetails')
      expect(
        newrelic.addCustomAttribute.mock.calls[0][1].includes(errorMessage)
      ).toBe(true)
    })

    it('has an overrideable response code for a failed render', async () => {
      const failureCode = 503
      await serverSideRendererLite({
        template: 'punchout',
        buildContext: async () => {
          throw new Error('failed to build context')
        },
        failureCode,
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.code).toHaveBeenCalledWith(failureCode)
    })

    it('passes the context to the named handlebars template for a failed render', async () => {
      const failureTemplate = 'failure-punchout'
      const failureContext = deepFreeze({
        lang: 'en',
        title: 'Failure Title',
        nextUrl: 'http://www.failure.com',
      })

      await serverSideRendererLite({
        template: 'punchout',
        buildContext: async () => {
          throw new Error('test error')
        },
        failureTemplate,
        failureBuildContext: async () => failureContext,
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.view).toHaveBeenCalledWith(failureTemplate, failureContext)
    })
  })

  describe('deviceType', () => {
    it('is set as cookie with value "desktop" if no request property "monty-client-device-type"', async () => {
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {},
        request: BASE_REQUEST,
        reply,
      })
      expect(reply.state.mock.calls[1]).toEqual([
        'deviceType',
        'desktop',
        { path: '/' },
      ])
    })

    it('is set as cookie with value "desktop" in case of request property "monty-client-device-type" set to desktop', async () => {
      const request = deepFreeze({
        ...BASE_REQUEST,
        headers: {
          'monty-client-device-type': 'desktop',
        },
      })
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {},
        request,
        reply,
      })
      expect(reply.state.mock.calls[1]).toEqual([
        'deviceType',
        'desktop',
        { path: '/' },
      ])
    })

    it('is set as cookie with value "mobile" in case of request property "monty-client-device-type" set to mobile', async () => {
      const request = deepFreeze({
        ...BASE_REQUEST,
        headers: {
          'monty-client-device-type': 'mobile',
        },
      })
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {},
        request,
        reply,
      })
      expect(reply.state.mock.calls[1]).toEqual([
        'deviceType',
        'mobile',
        { path: '/' },
      ])
    })
  })

  describe('Jsession', () => {
    const jsessionid = 'AAAAA'
    const request = deepFreeze({
      ...BASE_REQUEST,
      state: {
        jsessionid,
      },
    })

    it('sets state if in cookie on a succesful render', async () => {
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {},
        request,
        reply,
      })

      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        jsessionid,
        jsessionidCookieOptions
      )
    })

    it('sets state if in cookie on a failed render', async () => {
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {
          throw new Error('test error')
        },
        failureTemplate: 'failure-template',
        failureBuildContext: async () => {},
        request,
        reply,
      })

      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        jsessionid,
        jsessionidCookieOptions
      )
    })

    it('clears state on a succesful render', async () => {
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {},
        request,
        reply,
      })

      expect(reply.state.jsessionid).toEqual(undefined)
    })

    it('clears state on a failed render', async () => {
      await serverSideRendererLite({
        template: '',
        buildContext: async () => {
          throw new Error('test error')
        },
        failureTemplate: 'failure-template',
        failureBuildContext: async () => {},
        request,
        reply,
      })

      expect(reply.state.jsessionid).toEqual(undefined)
    })
  })
})
