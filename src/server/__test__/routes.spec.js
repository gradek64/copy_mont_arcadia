import { compose, map, uniq } from 'ramda'
import routes from '../routes'
import routeHandler from '../api/handler'
import orderCompleteHandler from '../handlers/order-complete-handler'
import psd2OrderPunchoutHandler from '../handlers/psd2-order-punchout-handler'
import applepayValidationHandler from '../handlers/applepay-validation-handler'
import applepaySessionHandler from '../handlers/applepay-session-handler'

jest.mock('../api/utils', () => ({
  extractCookieValue: jest.fn(() => 'AAA'),
  getDestinationHostFromStoreCode: () =>
    'https://ts-prd1stage.prd.digital.arcadiagroup.co.uk',
}))

jest.mock('../lib/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
}))

jest.mock('../api/handler')
jest.mock('../handlers/order-complete-handler')
jest.mock('../handlers/psd2-order-punchout-handler')
jest.mock('../handlers/server-side-renderer', () => {})
jest.mock('../handlers/applepay-validation-handler')
jest.mock('../handlers/applepay-session-handler')

const mockReply = {
  code: jest.fn(),
  redirect: jest.fn(() => ({
    permanent: jest.fn(),
  })),
}
const replyMock = jest.fn(() => mockReply)

function sendFakeRequest(
  route,
  req = {},
  reply = jest.fn() // eslint-disable-line prefer-arrow-callback
) {
  req = {
    method: 'get',
    url: {
      query: '',
      ...(req.url || {}),
    },
    query: {
      ...(req.query || {}),
    },
    ...req,
  }

  route.handler(req, reply)
  return { req, reply }
}

describe('Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('no duplicate routes', () => {
    const uniqueRoutes = compose(
      uniq,
      map((route) => `${route.method}#${route.path}`)
    )(routes)

    expect(routes.length).toBe(uniqueRoutes.length)
  })

  describe('api', () => {
    it('calls CoreAPI by default', () => {
      const plpRoute = routes.find((route) => route.path === '/api/products')
      sendFakeRequest(plpRoute)
      expect(routeHandler).toHaveBeenCalled()
    })
  })

  describe('wcsstore', () => {
    const wcsRoute = routes.find((route) => /^\/wcsstore\//.test(route.path))

    const env = process.env.WCS_ENVIRONMENT
    const cmsUrl = process.env.MR_CMS_URL

    afterAll(() => {
      process.env.WCS_ENVIRONMENT = env
      process.env.MR_CMS_URL = cmsUrl
    })

    it('301 redirect to media host', () => {
      process.env.WCS_ENVIRONMENT = 'tst1'
      process.env.MR_CMS_URL = 'cms-showcase.digital.arcadiagroup.co.uk'
      sendFakeRequest(
        wcsRoute,
        {
          url: { pathname: '/wcsstore/yoursummer.gif' },
          info: { hostname: 'm.topshop.com' },
        },
        replyMock
      )

      expect(mockReply.redirect).toHaveBeenCalledWith(
        'https://ts-prd1stage.prd.digital.arcadiagroup.co.uk/wcsstore/yoursummer.gif'
      )
    })

    it('errors with 400 Bad Request for all other environments', () => {
      process.env.WCS_ENVIRONMENT = 'acc1'
      process.env.MR_CMS_URL = 'cms-showcase.digital.arcadiagroup.co.uk'
      sendFakeRequest(
        wcsRoute,
        {
          url: '/wcsstore/yoursummer.gif',
          info: { hostname: 'm.topshop.com' },
        },
        replyMock
      )

      expect(replyMock).toHaveBeenCalledWith('Invalid WCS URL')
      expect(mockReply.code).toHaveBeenCalledWith(400)
    })
  })

  describe('navigation', () => {
    it('should call CoreAPI by default', () => {
      const navigationRoute = routes.find(
        (route) => route.path === '/api/desktop/navigation'
      )
      sendFakeRequest(
        navigationRoute,
        { url: '/api/desktop/navigation' },
        replyMock
      )
      expect(routeHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('order-complete', () => {
    describe('GET', () => {
      it('should call orderCompleteHandler', () => {
        const getOrderCompleteRoute = routes.find(
          (route) => route.path === '/order-complete' && route.method === 'GET'
        )

        sendFakeRequest(
          getOrderCompleteRoute,
          {
            url: { pathname: '/order-complete' },
            info: { hostname: 'm.topshop.com' },
            params: { param: 'xyz' },
          },
          replyMock
        )
        expect(orderCompleteHandler).toHaveBeenCalled()
      })
    })

    describe('POST', () => {
      it('should call orderCompleteHandler', () => {
        const postOrderCompleteRoute = routes.find(
          (route) => route.path === '/order-complete' && route.method === 'POST'
        )

        sendFakeRequest(
          postOrderCompleteRoute,
          {
            url: { pathname: '/order-complete' },
          },
          replyMock
        )
        expect(orderCompleteHandler).toHaveBeenCalled()
      })
    })
  })

  describe('psd2-order-punchout', () => {
    describe('POST', () => {
      it('renders into the punchout handlebars template', () => {
        const postPSD2OrderPunchoutRoute = routes.find(
          (route) =>
            route.path === '/psd2-order-punchout' && route.method === 'POST'
        )

        sendFakeRequest(
          postPSD2OrderPunchoutRoute,
          {
            url: { pathname: '/psd2-order-punchout' },
          },
          replyMock
        )

        expect(psd2OrderPunchoutHandler).toHaveBeenCalled()
      })
    })
  })

  describe('apple-pay-validation route', () => {
    describe('GET', () => {
      it('returns a validation file for ApplePay', () => {
        const path =
          '/.well-known/apple-developer-merchantid-domain-association.txt'

        const applepayValidationRoute = routes.find(
          (route) => route.path === path && route.method === 'GET'
        )

        sendFakeRequest(
          applepayValidationRoute,
          {
            info: {
              hostname: 'm.topshop.com',
            },
            url: { pathname: path },
          },
          replyMock
        )

        expect(applepayValidationHandler).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('apple-pay-session route', () => {
    describe('GET', () => {
      it('calls ApplePay to validate current session', () => {
        const path = '/api/checkout/applepay_session'

        const applepayValidationRoute = routes.find(
          (route) => route.path === path && route.method === 'GET'
        )

        sendFakeRequest(
          applepayValidationRoute,
          {
            info: {
              hostname: 'm.topshop.com',
            },
            url: { pathname: path },
          },
          replyMock
        )

        expect(applepaySessionHandler).toHaveBeenCalledTimes(1)
      })
    })
  })
})
