import { type } from 'ramda'
import { getPlatformHealthCheckHandler } from '../platform-healthcheck'

import HealthCheck from '../lib/healthcheck'
import snsHandler from '../../sns-server'
import routeHandler from '../../api/handler'
import * as cms from '../mr-cms-handler'
import * as featuresService from '../../lib/features-service'
import getVersion from '../version-handler'

const mockreply = (servicesStatus) => ({
  code: (statusCode) => ({
    servicesStatus,
    statusCode,
  }),
})
const mockBuildInfo = {
  version: '3.10.0 (package.json)',
  tag: 'v3.10.0',
  date: 'Wed, 25 Jul 2018 20:52:08 +0100',
  hash: '11f204c17b1f917cc69f35d499a969a0a8a78093',
}
jest.mock('../lib/healthcheck')
jest.mock('../../api/handler')
jest.mock('../version-handler')
jest.mock('../../sns-server', () => ({
  info: {
    started: 323213213123,
  },
}))
jest.mock('../../../shared/lib/superagent', () => ({
  cache: {
    db: 'redis',
  },
}))

describe('#Platform Healthcheck Handler', () => {
  beforeEach(() => {
    HealthCheck.mockImplementation(() => ({
      isHealthCheckSuccessful: () => true,
    }))

    routeHandler.mockImplementation((request, reply) => {
      return Promise.resolve(reply({}).code(200))
    })

    jest.spyOn(cms, 'mrCmsHealthHandler').mockReturnValue(Promise.resolve(200))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('redis status', () => {
    it('should be set to "good" when redis is running', async () => {
      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.redis).toEqual('good')
    })

    it('should be set to "not running" when redis is not running', async () => {
      HealthCheck.mockImplementationOnce(() => ({
        isHealthCheckSuccessful: () => false,
      }))

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.redis).toEqual('not running')
    })

    it('set "not running" when the cache is not set', async () => {
      jest.resetModules()
      jest.doMock('../../../shared/lib/superagent', () => ({}))
      const {
        getPlatformHealthCheckHandler,
      } = require('../platform-healthcheck')

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.redis).toEqual('not running')
    })
  })

  describe('SNS status', () => {
    afterAll(() => {
      snsHandler.info.started = 323213213123
    })

    it('should be set to "good" when SNS is running', async () => {
      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.sns).toEqual('good')
    })

    it('should be set to "not running" when SNS is not running', async () => {
      snsHandler.info.started = 0

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.sns).toEqual('not running')
    })
  })

  describe('WCS status', () => {
    it('should be set to "good" when WCS is running', async () => {
      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.wcs).toEqual('good')
    })

    it('should be set to the error number when wcs returns and error', async () => {
      routeHandler.mockImplementationOnce((request, reply) => {
        return Promise.resolve(
          reply({
            status: '404',
          })
        )
      })

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.wcs).toEqual(404)
    })

    it('should be set to "could not retrieve the status" when wcs does not reply', async () => {
      routeHandler.mockReturnValueOnce({})

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.wcs).toEqual('could not retrieve the status')
    })
  })

  describe('CMS status', () => {
    it('should be set to "good" when WCS is running', async () => {
      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.cms).toEqual('good')
    })

    it('should be set to the error number when wcs returns and error', async () => {
      jest
        .spyOn(cms, 'mrCmsHealthHandler')
        .mockReturnValueOnce(Promise.resolve(404))

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.cms).toEqual(404)
    })

    it('should be set to "could not retrieve the status" when cms does not reply', async () => {
      jest.spyOn(cms, 'mrCmsHealthHandler').mockReturnValueOnce({})

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.cms).toEqual('could not retrieve the status')
    })
  })

  describe('Build info', () => {
    it('should be set', async () => {
      getVersion.mockReturnValueOnce(mockBuildInfo)

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.buildInfo).toEqual(mockBuildInfo)
    })
  })

  describe('Feature Flags', () => {
    it('should be set', async () => {
      const features = {
        ts: {
          uk: ['feature'],
        },
      }

      jest
        .spyOn(featuresService, 'getAllFeatures')
        .mockReturnValueOnce(features)

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.servicesStatus.featureFlags).toEqual(features)
    })
  })

  describe('apps feature flags', () => {
    it('should be set', async () => {
      const result = await getPlatformHealthCheckHandler({}, mockreply)
      expect(type(result.servicesStatus.appFeatureFlags)).toBe('Object')
    })
  })

  describe('overall status code', () => {
    it('should be set to "200" when all services are running', async () => {
      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.statusCode).toEqual(200)
    })

    it('should be set to "500" when one of the services is not running', async () => {
      HealthCheck.mockImplementationOnce(() => ({
        isHealthCheckSuccessful: () => false,
      }))

      const result = await getPlatformHealthCheckHandler({}, mockreply)

      expect(result.statusCode).toEqual(500)
    })
  })
})
