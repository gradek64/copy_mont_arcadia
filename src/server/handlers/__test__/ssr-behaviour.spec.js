import nock from 'nock'
import * as Router from 'react-router'
import Helmet from 'react-helmet'

import {
  createUnauthedReq,
  createAuthenticatedReq,
} from './testHelpers/request'
import { createReplyMocks } from './testHelpers/reply'

import { logoutCookies } from '../../api/mapping/mappers/account/cookies'
import { setHostnameProperties } from '../../../shared/actions/common/hostnameActions'
import * as logger from '../../lib/logger'
import { serverSideRenderer } from '../server-side-renderer'

jest.mock('../../../shared/actions/common/hostnameActions', () => ({
  setHostnameProperties: jest.fn(() => () => {}),
}))
jest.mock('../../lib/logger')

function getCookiesAsStrings() {
  return logoutCookies().map(({ name, value, options }) => {
    const optionsString = Object.keys(options).reduce((result, key) => {
      const value = options[key]

      return `${result}${key}=${value}; `
    }, '')

    return `${name}=${value}; ${optionsString}`.trim()
  })
}

describe('Server side rendering', () => {
  beforeAll(() => {
    Helmet.canUseDOM = false
  })

  afterAll(() => {
    Helmet.canUseDOM = false
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('ssr session timeout', () => {
    it('results in 307 redirect to login with cleared cookies', async () => {
      const cookieStrings = getCookiesAsStrings()

      nock('http://localhost:3000')
        .get('/api/navigation/categories')
        .reply(
          200,
          {},
          {
            'session-expired': true,
          }
        )

      nock('http://localhost:3000')
        .delete('/api/account/logout')
        .reply(
          200,
          {},
          {
            'set-cookie': cookieStrings,
          }
        )

      nock('http://localhost:3000')
        .persist()
        .get(/.*/)
        .reply(200, {})

      const fakeReq = createAuthenticatedReq('/my-account')

      const { mockReply, mockRedirect, mockRewritable } = createReplyMocks()

      await serverSideRenderer(fakeReq, mockReply)

      expect(mockRedirect).toHaveBeenCalledWith('/login')
      expect(mockRewritable).toHaveBeenCalledWith(false)
    })

    it('session timeout on non-authenticated pages does not redirect and renders a modal', async () => {
      const cookieStrings = getCookiesAsStrings()

      nock('http://localhost:3000')
        .get('/api/navigation/categories')
        .reply(
          200,
          {},
          {
            'session-expired': true,
          }
        )

      nock('http://localhost:3000')
        .delete('/api/account/logout')
        .reply(
          200,
          {},
          {
            'set-cookie': cookieStrings,
          }
        )

      nock('http://localhost:3000')
        .persist()
        .get(/.*/)
        .reply(200, {})

      const nonAuthedPage = '/'
      const fakeReq = createAuthenticatedReq(nonAuthedPage)

      const { mockReply, mockRedirect, mockCode, mockView } = createReplyMocks()

      await serverSideRenderer(fakeReq, mockReply)

      expect(mockRedirect).not.toHaveBeenCalled()
      expect(mockCode).toHaveBeenCalledWith(200)
      const viewData = mockView.mock.calls[0][1]
      const { html: htmlString } = viewData
      expect(htmlString.includes('Modal Modal--sessionTimeout'))
    })
  })

  describe('ssr error handling', () => {
    it('handles errors from react-router', async () => {
      const errorMessage = 'Something bad happened in the router'
      const error = new Error(errorMessage)

      jest
        .spyOn(Router, 'match')
        .mockImplementationOnce((params, callback) => callback(error))

      const fakeReq = createUnauthedReq()

      const { mockReply } = createReplyMocks()

      await serverSideRenderer(fakeReq, mockReply)

      expect(mockReply).toHaveBeenCalledWith(error)
    })

    describe('logging errors thrown on SSR', () => {
      const { NODE_ENV } = global.process.env
      beforeEach(jest.clearAllMocks)
      afterEach(() => {
        global.process.env.NODE_ENV = NODE_ENV
      })

      it('should log errors when running in development', async () => {
        global.process.env.NODE_ENV = 'development'

        const errorMessage = 'Something bad happened in the router'
        const error = new Error(errorMessage)

        jest
          .spyOn(Router, 'match')
          .mockImplementationOnce((params, callback) => callback(error))

        const fakeReq = createUnauthedReq()

        const { mockReply } = createReplyMocks()

        await serverSideRenderer(fakeReq, mockReply)

        expect(logger.error).toHaveBeenCalledWith('server-side-renderer', {
          loggerMessage: error.stack,
        })
      })

      it('should not log errors when running in production', async () => {
        global.process.env.NODE_ENV = 'production'

        const errorMessage = 'Something bad happened in the router'
        const error = new Error(errorMessage)

        jest
          .spyOn(Router, 'match')
          .mockImplementationOnce((params, callback) => callback(error))

        const fakeReq = createUnauthedReq()

        const { mockReply } = createReplyMocks()

        await serverSideRenderer(fakeReq, mockReply)

        expect(logger.error).not.toHaveBeenCalled()
      })
    })

    describe('setRedirect', () => {
      it('throws if called more than once', async () => {
        nock('http://localhost:3000')
          .persist()
          .get(/.*/)
          .reply(200, {})

        setHostnameProperties.mockReturnValueOnce((dispatch) => {
          dispatch((thunkDispatch, getState, { setRedirect }) => {
            setRedirect('1')
            setRedirect('2')
          })
        })

        const fakeReq = createUnauthedReq()

        const { mockReply } = createReplyMocks()

        await serverSideRenderer(fakeReq, mockReply)

        const error = mockReply.mock.calls[0][0]

        expect(error instanceof Error).toBe(true)
        expect(error.message).toBe(
          'Attempts to set redirect location multiple times are not allowed'
        )
      })
    })
  })

  describe('403 Forbidden', () => {
    test.each([
      // /**/category/**/home
      '/-1%20OR%202+204-204-1=0+0+0+1/category/the-wedding-shop-9641440/home',
      '/en/-1%20OR%202+204-204-1=0+0+0+1/category/the-wedding-shop-9641440/home',
      '/en/tsuk/category/-1%20OR%202+204-204-1=0+0+0+1/the-wedding-shop-9641440/home',
      '/en/tsuk/category/foo||bar/v%C3%AAtements-415222/pantalons-415242/home',
      // /**/category/your-details**/:hygieneType-**
      '/-1%20OR%202+204-204-1=0+0+0+1/category/your-details/something-here',
      '/en/-1%20OR%202+204-204-1=0+0+0+1/category/your-details/the-wedding-shop-9641440',
      '/en/tsuk/category/your-details/-1%20OR%202+204-204-1=0+0+0+1/the-wedding-shop-9641440',
      '/en/tsuk/category/your-details/foo||bar/v%C3%AAtements-415222/pantalons-415242',
      // /**/category/help-information**/tcs**
      '/-1%20OR%202+204-204-1=0+0+0+1/category/help-information/tcs',
      '/en/-1%20OR%202+204-204-1=0+0+0+1/category/help-information/tcs/the-wedding-shop-9641440',
      '/en/tsuk/category/help-information/tcs/-1%20OR%202+204-204-1=0+0+0+1/the-wedding-shop-9641440',
      '/en/tsuk/category/help-information/tcs/foo||bar/v%C3%AAtements-415222/pantalons-415242',
      // /**/category/help-information**/:hygieneType-**
      '/-1%20OR%202+204-204-1=0+0+0+1/category/help-information-5593456/privacy-policy-5757922',
      '/en/-1%20OR%202+204-204-1=0+0+0+1/category/help-information-5593456/privacy-policy-5757922',
      '/en/tsuk/category/help-information-5593456/privacy-policy-5757922/-1%20OR%202+204-204-1=0+0+0+1/the-wedding-shop-9641440',
      '/en/tsuk/category/help-information-5593456/privacy-policy-5757922/foo||bar/v%C3%AAtements-415222/pantalons-415242',
      // /size-guide/:cmsPageName
      '/size-guide/-1%20OR%202+204-204-1=0+0+0+1',
      '/size-guide/foo||bar',
      // /cms-preview/*
      '/cms-preview/-1%20OR%202+204-204-1=0+0+0+1',
      '/cms-preview/foo||bar',
    ])('%j should return 403 Forbidden', async (pathname) => {
      nock('http://localhost:3000')
        .persist()
        .get(/.*/)
        .reply(400, {})

      const { mockReply } = createReplyMocks()

      await serverSideRenderer(createUnauthedReq(pathname), mockReply)

      expect(mockReply.mock.calls[0][0].output.statusCode).toBe(403)
      expect(nock.isDone()).toBeFalsy() // No requests should have been made
    })
  })
})
