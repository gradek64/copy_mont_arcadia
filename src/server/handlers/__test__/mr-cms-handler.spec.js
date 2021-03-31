import * as mrCmsHandlerModule from '../mr-cms-handler'
import * as mrCmsUtilsModule from '../../lib/mrcms-utils'
import * as mrCmsHandlerCacheModule from '../mr-cms-cache-handler'
import superagent from 'superagent'
import qs from 'qs'

jest.mock('../../lib/mrcms-utils', () => ({
  sanitizeResponseAndReply: jest.fn(),
  logMrCmsRequest: jest.fn(),
  logMrCmsResponse: jest.fn(),
}))

jest.mock('superagent', () => ({
  get: jest.fn(),
}))

describe('mr-cms-handler', () => {
  const randStr = (len = Math.floor(Math.random() * 10), { withUni } = {}) => {
    let str = ''
    for (let i = 0; i < len; i++)
      str += String.fromCharCode(Math.floor(Math.random() * 100))

    if (withUni) str = `${str.slice(0, str.length - 1)}\uD83D\uDCA9`

    return str
  }

  const manglers = {
    storeCode: () => randStr(3),
    brandName: () => randStr(10),
    siteId: () => randStr(3),
    cmsPageName: () => randStr(5, { withUni: true }),
  }

  const genQueryParams = ({ exclude = [], mangle = [], add = {} }) => {
    const params = {
      storeCode: 'tsuk',
      brandName: 'topshop',
      cmsPageName: 'home',
      viewportMedia: 'mobile',
      siteId: '12556',
      ...add,
    }

    exclude.forEach((ex) => delete params[ex])
    mangle.forEach((m) => {
      params[m] = manglers[m]()
    })

    return params
  }

  const mockReply = jest.fn()
  mockReply.proxy = jest.fn()

  const request = {
    query: genQueryParams({}),
    url: {
      pathname: '/cmscontent',
    },
  }

  beforeAll(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    global.process.env.CMS_TEST_MODE = false
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('#mrCmsContentHandler', () => {
    const { mrCmsContentHandler } = mrCmsHandlerModule
    const reply = jest.fn()
    reply.proxy = jest.fn()
    const expectReplyWithError = (output) => {
      expect(reply).toHaveBeenCalled()
      expect(reply.mock.calls[0][0].output).toEqual(
        expect.objectContaining(output)
      )
    }
    const expectReplyOk = () => {
      expect(reply).not.toHaveBeenCalled()
      expect(reply.proxy).toHaveBeenCalled()
    }

    test.each([
      [{ noQuery: true }, 400],
      [{ exclude: ['storeCode'] }, 400],
      [{ exclude: ['brandName'] }, 400],
      [{ exclude: ['siteId'] }, 400],
      [{ mangle: ['storeCode'] }, 400],
      [{ mangle: ['brandName'] }, 400],
      [{ mangle: ['siteId'] }, 400],
      [{ mangle: ['cmsPageName'] }, 400],
      [{ exclude: ['cmsPageName'] }, 400],
      [
        {
          exclude: ['cmsPageName'],
          add: { seoUrl: '/a/b/ć%24' },
        },
        200,
      ],
      [
        {
          exclude: ['cmsPageName'],
          add: { 'location[pathname]': '/a/b/c' },
        },
        200,
      ],
      [
        {
          exclude: ['cmsPageName'],
          add: { seoUrl: `${randStr(10)}\\` },
        },
        400,
      ],
      [
        {
          exclude: ['cmsPageName'],
          add: { 'location[search]': '%3FTS=158480479761' },
        },
        400,
      ],
      [
        {
          exclude: ['cmsPageName'],
          add: {
            'location[pathname]': '/a/b/c',
            'location[search]': '%3FTS=158480479761',
          },
        },
        200,
      ],
      [
        {
          add: {
            'location[hash]': '12345',
          },
        },
        200,
      ],
      [
        {
          add: {
            viewportMedia: 'foo',
          },
        },
        400,
      ],
      [
        {
          add: {
            viewportMedia: 'console',
          },
        },
        200,
      ],
      [
        {
          add: {
            formEmail: 'foo@bar-baéz.com',
          },
        },
        200,
      ],
      [
        {
          add: {
            formEmail: 'foobar.com',
          },
        },
        400,
      ],
      [
        {
          add: {
            forceMobile: 'true',
          },
        },
        200,
      ],
      [
        {
          add: {
            forceMobile: ";' Drop table Products;",
          },
        },
        400,
      ],
      [
        {
          add: {
            lazyLoad: 'true',
          },
        },
        200,
      ],
      [
        {
          add: {
            lazyLoad: ";' Drop table Products;",
          },
        },
        400,
      ],
      [
        {
          add: {
            'catHeaderProps[isMobile]': 'true',
          },
        },
        200,
      ],
      [
        {
          add: {
            'catHeaderProps[isMobile]': 'foo',
          },
        },
        400,
      ],
      [
        {
          add: {
            'catHeaderProps[totalProducts]': '100',
          },
        },
        200,
      ],
      [
        {
          add: {
            'catHeaderProps[totalProducts]': 'foo',
          },
        },
        400,
      ],
      [
        {
          add: {
            'catHeaderProps[truncateDescription]': 'true',
          },
        },
        200,
      ],
      [
        {
          add: {
            'catHeaderProps[truncateDescription]': 'foo',
          },
        },
        400,
      ],
      [
        {
          add: {
            'catHeaderProps[categoryHeaderShowMoreDesktopEnabled]': 'true',
          },
        },
        200,
      ],
      [
        {
          add: {
            'catHeaderProps[categoryHeaderShowMoreDesktopEnabled]': 'foo',
          },
        },
        400,
      ],
    ])('validation: %j expect %j', (inputs, statusCode) => {
      delete global.process.env.REDIS_URL

      const query = inputs.noQuery ? {} : genQueryParams(inputs)
      mrCmsContentHandler(
        {
          query,
          url: {
            pathname: '/cmscontent',
            href: `/cmscontent${
              inputs.noQuery ? '' : `?${qs.stringify(query)}`
            }`,
          },
        },
        reply
      )

      if (statusCode !== 200) expectReplyWithError({ statusCode })
      else expectReplyOk()
    })

    it('sanitisation: location[search] is sanitised before forwarded', () => {
      const query = genQueryParams({
        exclude: ['cmsPageName'],
        add: {
          'location[pathname]': '/a/b/c',
          'location[search]': "%3FTS=158480479761;'DROP table Users;",
        },
      })
      const req = { query, url: { pathname: '/cmscontent' } }
      mrCmsContentHandler(req, reply)
      expect(req.url.href).toBe(
        '/cmscontent?storeCode=tsuk&brandName=topshop&viewportMedia=mobile&siteId=12556&location%5Bpathname%5D=%2Fa%2Fb%2Fc'
      )
    })

    it('sanitiation: missing viewportMedia defaults to desktop', () => {
      const query = genQueryParams({
        exclude: ['viewportMedia'],
      })
      const req = { query, url: { pathname: '/cmscontent' } }
      mrCmsContentHandler(req, reply)
      expect(req.url.href).toBe(
        '/cmscontent?storeCode=tsuk&brandName=topshop&cmsPageName=home&siteId=12556&viewportMedia=desktop'
      )
    })

    it('executes reply.proxy if redis is not enabled', () => {
      delete global.process.env.REDIS_URL
      mrCmsHandlerModule.mrCmsContentHandler(request, mockReply)
      expect(mockReply.proxy).toHaveBeenCalledWith({
        host: global.process.env.MR_CMS_URL,
        port: global.process.env.MR_CMS_PORT,
        protocol: global.process.env.MR_CMS_PROTOCOL,
        timeout: 20000,
        onResponse: mrCmsUtilsModule.sanitizeResponseAndReply,
      })
    })

    it('executes reply.proxy in case of global.process.env.CMS_TEST_MODE set to "false"', () => {
      mrCmsHandlerModule.mrCmsContentHandler(request, mockReply)

      expect(mrCmsUtilsModule.logMrCmsRequest).toHaveBeenCalledWith(request)
      expect(mockReply.proxy).toHaveBeenCalledWith({
        host: global.process.env.MR_CMS_URL,
        port: global.process.env.MR_CMS_PORT,
        protocol: global.process.env.MR_CMS_PROTOCOL,
        timeout: 20000,
        onResponse: mrCmsUtilsModule.sanitizeResponseAndReply,
      })
    })

    it('does not execute reply.proxy in case of global.process.env.CMS_TEST_MODE set to "true"', () => {
      global.process.env.CMS_TEST_MODE = 'true'

      mrCmsHandlerModule.mrCmsContentHandler(request, mockReply)

      expect(mrCmsUtilsModule.logMrCmsRequest).toHaveBeenCalledTimes(0)
      expect(mockReply.proxy).toHaveBeenCalledTimes(0)
      expect(mockReply).toHaveBeenCalledWith(null, { cmsTestMode: true })
    })

    it('does not execute reply.proxy in case of global.process.env.CMS_TEST_MODE set to "true"', () => {
      global.process.env.CMS_TEST_MODE = 'true'

      mrCmsHandlerModule.mrCmsContentHandler(request, mockReply)

      expect(mrCmsUtilsModule.logMrCmsRequest).toHaveBeenCalledTimes(0)
      expect(mockReply.proxy).toHaveBeenCalledTimes(0)
      expect(mockReply).toHaveBeenCalledWith(null, { cmsTestMode: true })
    })

    it('calls cache404MrCmsResponseHandler if REDIS_URL is enabled && CMS_TEST_MODE set to true', async () => {
      global.process.env.REDIS_URL = 'http://redis_url'
      mrCmsHandlerCacheModule.cache404MrCmsResponseHandler = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve({ response: 'hello mock' })
        })
      const mockReply = jest.fn(() => ({
        header: jest.fn(),
      }))

      await mrCmsHandlerModule.mrCmsContentHandler(request, mockReply)
      expect(
        mrCmsHandlerCacheModule.cache404MrCmsResponseHandler
      ).toHaveBeenCalled()
      expect(mockReply).toHaveBeenCalledWith('hello mock')
    })

    it('calls cache404MrCmsResponseHandler if REDIS_URL is enabled && CMS_TEST_MODE set to true', async () => {
      global.process.env.REDIS_URL = 'http://redis_url'
      const bodyRes = { body: { header: jest.fn(), statusCode: 404 } }
      const response = { response: bodyRes }
      mrCmsHandlerCacheModule.cache404MrCmsResponseHandler = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve(response)
        })
      const mockReply = jest.fn(() => ({
        header: jest.fn(),
      }))

      await mrCmsHandlerModule.mrCmsContentHandler(request, mockReply)
      expect(mockReply).toHaveBeenCalledWith(bodyRes)
    })

    describe('##responseCacheContentHandler', () => {
      const header = jest.fn()

      it('responseCacheContentHandler returns from 404 from cache and x-redis-cache header has been set', () => {
        const bodyRes = {
          statusCode: 404,
          cache: true,
          message: 'didnt go well',
          header: jest.fn(),
        }
        const promiseResponse = {
          fromCache: true,
          response: bodyRes,
        }
        const mockReply = jest.fn().mockImplementationOnce(() => ({
          header,
        }))
        mrCmsHandlerModule.responseCacheContentHandler(
          promiseResponse,
          mockReply
        )
        expect(mockReply).toBeCalledWith(bodyRes)
        expect(header).toBeCalledWith('x-redis-cache', true)
      })

      it('responseCacheContentHandler returns x-redis-cache ==="false" if cached for first time', () => {
        const bodyRes = {
          statusCode: 404,
          cache: true,
          message: 'didnt go well',
          header: jest.fn(),
        }
        const promiseResponse = {
          fromCache: false,
          response: bodyRes,
        }
        const mockReply = jest.fn().mockImplementationOnce(() => ({
          header,
        }))

        mrCmsHandlerModule.responseCacheContentHandler(
          promiseResponse,
          mockReply
        )
        expect(mockReply).toBeCalledWith(bodyRes)
        expect(header).toBeCalledWith('x-redis-cache', false)
      })

      it('responseCacheContentHandler returns response from cache if cache is enabled and not to set 404 ', () => {
        const bodyRes = {
          statusCode: 200,
          cache: true,
          message: 'didnt go well',
          header: jest.fn(),
        }
        const promiseResponse = {
          fromCache: true,
          response: bodyRes,
        }
        const mockReply = jest.fn().mockImplementationOnce(() => ({
          header,
        }))

        mrCmsHandlerModule.responseCacheContentHandler(
          promiseResponse,
          mockReply
        )

        expect(header).toHaveBeenCalled()
        expect(mockReply).toBeCalledWith(bodyRes)
      })

      it('responseCacheContentHandler returns body response if cache is set to false', () => {
        const bodyRes = {
          statusCode: 200,
          cache: true,
          message: 'went well',
          header: () => {},
        }
        const mockReply = jest.fn().mockImplementationOnce(() => ({
          header,
        }))
        const promiseResponse = {
          fromCache: false,
          response: { body: bodyRes },
        }
        mrCmsHandlerModule.responseCacheContentHandler(
          promiseResponse,
          mockReply
        )
        expect(header).toHaveBeenCalled()
      })

      it('responseCacheContentHandler returns from body if not from cache ', () => {
        const mockReply = jest.fn().mockImplementationOnce(() => ({
          header,
        }))
        const promiseResponse = { response: { statusCode: 200 } }
        mrCmsHandlerModule.responseCacheContentHandler(
          promiseResponse,
          mockReply
        )
        expect(header).toHaveBeenCalled()
        expect(mockReply).toBeCalledWith({ statusCode: 200 })
      })
    })

    describe('#mrCmsAssetsHandler', () => {
      it('reply.proxy gets called in case of global.process.env.CMS_TEST_MODE set to "false" and redis is not enabled ', () => {
        delete global.process.env.REDIS_URL
        mrCmsHandlerModule.mrCmsAssetsHandler(request, mockReply)
        expect(mrCmsUtilsModule.logMrCmsRequest).toHaveBeenCalledWith(request)
        expect(mockReply.proxy).toHaveBeenCalledWith({
          host: global.process.env.MR_CMS_URL,
          port: global.process.env.MR_CMS_PORT,
          protocol: global.process.env.MR_CMS_PROTOCOL,
          timeout: 20000,
          onResponse: expect.any(Function),
        })
      })

      it('reply.proxy gets called when condition asset is passed into mrCmsHandler', () => {
        mrCmsHandlerModule.mrCmsAssetsHandler(
          request,
          mockReply,
          true,
          jest.fn(),
          'asset'
        )
        expect(mrCmsUtilsModule.logMrCmsRequest).toHaveBeenCalledWith(request)
        expect(mockReply.proxy).toHaveBeenCalledWith({
          host: global.process.env.MR_CMS_URL,
          port: global.process.env.MR_CMS_PORT,
          protocol: global.process.env.MR_CMS_PROTOCOL,
          timeout: 20000,
          onResponse: expect.any(Function),
        })
      })

      it('does not execute reply.proxy in case of global.process.env.CMS_TEST_MODE set to "true"', () => {
        global.process.env.CMS_TEST_MODE = 'true'
        mrCmsHandlerModule.mrCmsAssetsHandler(request, mockReply)

        expect(mrCmsUtilsModule.logMrCmsRequest).toHaveBeenCalledTimes(0)
        expect(mockReply.proxy).toHaveBeenCalledTimes(0)
        expect(mockReply).toHaveBeenCalledWith(null, { cmsTestMode: true })
      })

      it('logs the response and processes it when reply.proxy executes the onResponse parameter', () => {
        const onResponseParams = ['error', 'response', request, jest.fn()]
        const mockReply2 = jest.fn()
        mockReply2.proxy = jest.fn((p) => p.onResponse(...onResponseParams))
        mrCmsHandlerModule.mrCmsAssetsHandler(request, mockReply2)

        expect(mockReply2.proxy).toHaveBeenCalledTimes(1)
        expect(mrCmsUtilsModule.logMrCmsResponse).toHaveBeenCalledWith(
          onResponseParams[2],
          onResponseParams[1],
          onResponseParams[0]
        )
        expect(onResponseParams[3]).toHaveBeenCalledWith(
          onResponseParams[0],
          onResponseParams[1]
        )
      })
    })

    describe('#mrCmsHealthHandler', () => {
      const reply = (body) => {
        if (body.status && body.status !== 200) {
          return body.status
        }
        return {
          code: (replyCode) => replyCode,
        }
      }

      beforeAll(() => {
        global.process.env.MR_CMS_PROTOCOL = 'http'
        global.process.env.MR_CMS_URL = 'cms'
        global.process.env.MR_CMS_PORT = '123'
      })

      afterAll(() => {
        global.process.env.MR_CMS_PROTOCOL = null
        global.process.env.MR_CMS_URL = null
        global.process.env.MR_CMS_PORT = null
      })

      it('return 200 if the requests completes successfully', async () => {
        superagent.get.mockImplementationOnce(() =>
          Promise.resolve({
            text: 'ok',
          })
        )
        const result = await mrCmsHandlerModule.mrCmsHealthHandler({}, reply)
        expect(superagent.get).toHaveBeenCalledWith('http://cms:123/health')
        expect(result).toEqual(200)
      })

      it('return the error code if the requests fails', async () => {
        superagent.get.mockImplementationOnce(() =>
          Promise.reject({ error: 'failed', status: 404 })
        )
        const result = await mrCmsHandlerModule.mrCmsHealthHandler({}, reply)
        expect(result).toEqual(404)
      })
    })
  })
})
