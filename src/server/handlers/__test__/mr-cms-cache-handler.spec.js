import * as mrCmsHandlerCacheModule from '../mr-cms-cache-handler'
import superagent from 'superagent'
import CsRedis from 'cache-service-redis'

jest.mock('cache-service-redis', () => {
  class CsRedis {
    get() {}
    set() {}
  }
  return CsRedis
})

jest.mock('superagent', () => {
  const superagent = {
    get: jest.fn(() => superagent),
    timeout: jest.fn(() => superagent),
  }
  return superagent
})

describe('mr-cms-cache-handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.process.env.MR_CMS_PROTOCOL = 'https://'
    global.process.env.MR_CMS_URL = 'mock/url'
  })

  describe('#cache404MrCmsResponseHandler', () => {
    const status404 = { status: 404, body: { statusCode: 404 } }
    const status200 = { status: 200, body: { statusCode: 200 } }
    const statusCode404 = { statusCode: status404.status }

    it('cache hit 404 response', async () => {
      jest
        .spyOn(CsRedis.prototype, 'get')
        .mockImplementation((key, cb) => cb(null, { statusCode: 404 }))
      jest.spyOn(CsRedis.prototype, 'set')
      const mockReply = {
        url: {
          href: '?content/digitalfile=etc',
        },
      }
      const result = await mrCmsHandlerCacheModule.cache404MrCmsResponseHandler(
        mockReply
      )
      expect(CsRedis.prototype.get).toHaveBeenCalledWith(
        'https://://mock/url?content/digitalfile=etc-404',
        expect.anything()
      )
      expect(superagent.get).not.toHaveBeenCalled()
      expect(CsRedis.prototype.set).not.toHaveBeenCalled()
      expect(result.fromCache).toBe(true)
      expect(result.response).toEqual(statusCode404)
    })

    it('cache miss 404 response', async () => {
      jest
        .spyOn(CsRedis.prototype, 'get')
        .mockImplementation((key, cb) => cb(null, null))
      jest.spyOn(CsRedis.prototype, 'set')
      superagent.timeout.mockImplementationOnce(() =>
        Promise.reject({ response: status404 })
      )
      const mockReply = {
        url: {
          href: '?content/digitalfile=etc',
        },
      }
      const result = await mrCmsHandlerCacheModule.cache404MrCmsResponseHandler(
        mockReply
      )

      expect(superagent.get).toHaveBeenCalledWith(
        'https://://mock/url?content/digitalfile=etc'
      )
      expect(CsRedis.prototype.set).toBeCalled()
      expect(CsRedis.prototype.set).toHaveBeenCalledWith(
        'https://://mock/url?content/digitalfile=etc-404',
        statusCode404,
        300
      )
      expect(result.fromCache).toBe(false)
      expect(result.response).toEqual(status404.body)
    })

    it('cache miss 200 response', async () => {
      jest
        .spyOn(CsRedis.prototype, 'get')
        .mockImplementation((key, cb) => cb(null, null))
      jest.spyOn(CsRedis.prototype, 'set')
      superagent.timeout.mockImplementationOnce(() =>
        Promise.resolve(status200)
      )
      const mockReply = {
        url: {
          href: '?content/digitalfile=etc',
        },
      }
      const result = await mrCmsHandlerCacheModule.cache404MrCmsResponseHandler(
        mockReply
      )

      expect(superagent.get).toHaveBeenCalledWith(
        'https://://mock/url?content/digitalfile=etc'
      )
      expect(CsRedis.prototype.set).not.toHaveBeenCalled()
      expect(result.fromCache).toBe(false)
      expect(result.response).toEqual(status200.body)
    })

    it('cache error', async () => {
      jest
        .spyOn(CsRedis.prototype, 'get')
        .mockImplementation((key, cb) => cb({ message: 'Error!' }, null))
      jest.spyOn(CsRedis.prototype, 'set')
      const mockReply = {
        url: {
          href: '?content/digitalfile=etc',
        },
      }
      const result = await mrCmsHandlerCacheModule.cache404MrCmsResponseHandler(
        mockReply
      )

      expect(CsRedis.prototype.set).not.toHaveBeenCalled()
      expect(result.statusCode).toBe(500)
      expect(result.message).toEqual('Redis error')
      expect(result.error).toEqual({ message: 'Error!' })
    })
  })
})
