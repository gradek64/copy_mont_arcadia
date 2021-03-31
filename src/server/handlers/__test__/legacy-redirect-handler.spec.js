import { stringify as queryToString } from 'querystring'
import {
  homeLegacyRedirectHandler,
  catalogLegacyRedirectHandler,
} from '../legacy-redirect-handler'
import * as logger from '../../../server/lib/logger'
import wcs from '../../../server/api/requests/wcs'

jest.mock('../../../server/lib/logger', () => ({
  generateTransactionId: () => 'STRTEST1234',
  info: jest.fn(),
  isTraceLoggingEnabled: () => false,
}))

jest.mock('../../../server/api/requests/wcs')

const constructRequest = (hostname, pathname, query) => ({
  url: {
    pathname,
    search: queryToString(query),
  },
  info: {
    hostname,
  },
  query,
})

describe('Legacy Redirect Handlers', () => {
  let permanent
  let redirect
  let reply
  let env

  beforeEach(() => {
    env = process.env
    process.env.WCS_ENVIRONMENT = 'tst1'
    jest.resetModules()
    jest.clearAllMocks()
    permanent = jest.fn()
    redirect = jest.fn(() => ({
      permanent,
    }))
    reply = jest.fn(() => {
      return {
        redirect,
      }
    })
  })

  afterEach(() => {
    process.env = env
  })

  describe('catalogLegacyRedirectHandler', () => {
    describe('hostname is correct', () => {
      it('should call topshop url when site is a topshop host', async () => {
        wcs.mockImplementationOnce(async () => ({
          body: {
            plpJSON: {
              canonicalUrl: 'test.url/en/tsuk/category/test',
            },
          },
        }))
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        const query = {
          test: 'url',
          another: 'queryparam',
        }
        const req = constructRequest(topshopUrl, path, query)

        await catalogLegacyRedirectHandler(req, reply)

        const wcsUrl = `https://ts-tst1.tst.digital.arcadiagroup.co.uk${path}`
        expect(wcs).toHaveBeenCalledWith(
          {
            destination: wcsUrl,
            method: 'get',
            query,
          },
          [],
          'mobile',
          true
        )
      })
      it('should call dp url when site is a dp host', async () => {
        wcs.mockImplementationOnce(async () => ({
          body: {
            plpJSON: {
              canonicalUrl: 'test.url/en/dpuk/category/test',
            },
          },
        }))
        const topshopUrl = 'm.dorothyperkins.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        const query = {
          test: 'url',
          another: 'queryparam',
        }
        const req = constructRequest(topshopUrl, path, query)

        await catalogLegacyRedirectHandler(req, reply)

        const wcsUrl = `https://dp-tst1.tst.digital.arcadiagroup.co.uk${path}`
        expect(wcs).toHaveBeenCalledWith(
          {
            destination: wcsUrl,
            method: 'get',
            query,
          },
          [],
          'mobile',
          true
        )
      })
    })

    describe('logger', () => {
      let wcsUrl
      let query

      beforeEach(async () => {
        wcs.mockImplementationOnce(async () => ({
          status: 200,
          cookies: [],
          body: {
            plpJSON: {
              canonicalUrl: 'test.url/en/tsuk/category/test',
            },
          },
        }))
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        query = {
          test: 'url',
          another: 'queryparam',
        }
        const req = constructRequest(topshopUrl, path, query)
        wcsUrl = `https://ts-tst1.tst.digital.arcadiagroup.co.uk${path}`
        await catalogLegacyRedirectHandler(req, reply)
      })

      it('should call logger twice', () => {
        expect(logger.info).toHaveBeenCalledTimes(2)
      })

      it('should log request as expected', () => {
        expect(logger.info).toHaveBeenNthCalledWith(1, 'wcs:redirect', {
          loggerMessage: 'request',
          transactionId: 'STRTEST1234',
          method: 'GET',
          url: wcsUrl,
          sessionKey: '',
          combinedCookies: [],
          query,
          deviceType: 'mobile',
          isMobileHostname: true,
        })
      })

      it('should log response as expected when wcs response is successful', () => {
        expect(logger.info).toHaveBeenNthCalledWith(2, 'wcs:redirect', {
          loggerMessage: 'response',
          transactionId: 'STRTEST1234',
          method: 'GET',
          url: wcsUrl,
          sessionKey: '',
          cookies: [],
          deviceType: 'mobile',
          isMobileHostname: true,
          statusCode: 200,
        })
      })
    })

    describe('WCS permanentRedirect', () => {
      let query
      let req

      beforeEach(async () => {
        wcs.mockImplementationOnce(async () => ({
          status: 200,
          cookies: [],
          body: {
            permanentRedirectUrl: 'test.url/en/tsuk/category/test',
          },
        }))
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        query = {
          test: 'url',
          another: 'queryparam',
        }
        req = constructRequest(topshopUrl, path, query)
        await catalogLegacyRedirectHandler(req, reply)
      })

      it('should call redirect with provided permanentRedirect and passed query params', () => {
        const {
          url: { search },
        } = req
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith(
          `test.url/en/tsuk/category/test${search}`
        )
      })

      it('should call permanent on redirect', () => {
        expect(permanent).toHaveBeenCalledTimes(1)
      })
    })

    describe('WCS plpJson.canonicalUrl', () => {
      let req
      beforeEach(async () => {
        wcs.mockImplementationOnce(async () => ({
          status: 200,
          cookies: [],
          body: {
            plpJSON: {
              canonicalURL: 'test.url/en/tsuk/category/test',
            },
          },
        }))
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        const query = {
          test: 'url',
          another: 'queryparam',
        }
        req = constructRequest(topshopUrl, path, query)
        await catalogLegacyRedirectHandler(req, reply)
      })

      it('should call redirect with provided canonicalUrl with query params', () => {
        const {
          url: { search },
        } = req
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith(
          `test.url/en/tsuk/category/test${search}`
        )
      })

      it('should call permanent on redirect', () => {
        expect(permanent).toHaveBeenCalledTimes(1)
      })
    })

    describe('WCS responds with unexpected response', () => {
      let req
      beforeEach(async () => {
        wcs.mockImplementationOnce(async () => ({
          status: 200,
          cookies: [],
          body: {
            random: 'structure',
          },
        }))
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        const query = {
          test: 'url',
          another: 'queryparam',
        }
        req = constructRequest(topshopUrl, path, query)
        await catalogLegacyRedirectHandler(req, reply)
      })
      it('should return redirect to homepage with passed query params', () => {
        const {
          url: { search },
        } = req
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith(`/${search}`)
      })
      it('should not call permanent on redirect', () => {
        expect(permanent).not.toHaveBeenCalled()
      })
    })

    describe('WCS Error', () => {
      let req
      let wcsUrl
      beforeEach(async () => {
        wcs.mockImplementationOnce(() =>
          Promise.reject({
            output: {
              statusCode: 500,
              headers: {
                cookie: ['test'],
              },
            },
          })
        )
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        const query = {
          test: 'url',
          another: 'queryparam',
        }
        wcsUrl = `https://ts-tst1.tst.digital.arcadiagroup.co.uk${path}`
        req = constructRequest(topshopUrl, path, query)
        await catalogLegacyRedirectHandler(req, reply)
      })
      it('should return redirect to homepage with passed query params', () => {
        const {
          url: { search },
        } = req
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith(`/${search}`)
      })
      it('should not call permanent on redirect', () => {
        expect(permanent).not.toHaveBeenCalled()
      })
      it('should call logger.info as expected when wcs returns an error', () => {
        expect(logger.info).toHaveBeenNthCalledWith(2, 'wcs:redirect', {
          loggerMessage: 'response',
          transactionId: 'STRTEST1234',
          method: 'GET',
          url: wcsUrl,
          sessionKey: '',
          cookies: ['test'],
          deviceType: 'mobile',
          isMobileHostname: true,
          statusCode: 500,
        })
      })
    })

    describe('Query Params', () => {
      it('should redirect to homepage with no query params if none provided', async () => {
        wcs.mockImplementationOnce(() =>
          Promise.reject({
            output: {
              statusCode: 500,
              headers: {
                cookie: ['test'],
              },
            },
          })
        )
        const topshopUrl = 'm.topshop.com'
        const path =
          '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
        const req = constructRequest(topshopUrl, path)
        await catalogLegacyRedirectHandler(req, reply)
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith('/')
      })
    })
  })

  describe('homeLegacyRedirectHandler', () => {
    describe('with query params', () => {
      const queryParams = '?everyone=should&love=spurs'
      const request = {
        url: {
          search: queryParams,
        },
      }

      beforeEach(async () => {
        await homeLegacyRedirectHandler(request, reply)
      })

      it('should calls reply once', () => {
        expect(reply).toHaveBeenCalledTimes(1)
      })

      it('should call redirect and route to home page with retained query params', () => {
        const expectedRedirect = `/${queryParams}`
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith(expectedRedirect)
      })

      it('should call permanent on redirect', () => {
        expect(permanent).toHaveBeenCalledTimes(1)
      })
    })
    describe('without query params', () => {
      const request = {
        url: {},
      }

      beforeEach(async () => {
        await homeLegacyRedirectHandler(request, reply)
      })

      it('should calls reply once', () => {
        expect(reply).toHaveBeenCalledTimes(1)
      })

      it('should call redirect and route to home page with no query params', () => {
        const expectedRedirect = `/`
        expect(redirect).toHaveBeenCalledTimes(1)
        expect(redirect).toHaveBeenCalledWith(expectedRedirect)
      })

      it('should call permanent on redirect', () => {
        expect(permanent).toHaveBeenCalledTimes(1)
      })
    })
  })
})
