require('@babel/register')

jest.unmock('superagent')
import chai from 'chai'
import superagent from 'superagent'
import eps from './../routes_tests'
import { arrayType, headers, objectType } from '../utilis'
import moment from 'moment-timezone'

chai.use(require('chai-json-schema'))

const validateServiceStatus = (service) => {
  const serviceStatusSchema = {
    title: 'Service Status Schema',
    type: 'string',
    pattern: /(good|not running)/,
  }
  chai.assert.jsonSchema(service, serviceStatusSchema)
}

const validateServiceStatusWithPossibleResponseCode = (service) => {
  const serviceStatusSchema = {
    title: 'Service Status Schema with possible response code',
    type: ['string', 'number'],
    pattern: /(good|could not retrieve the status)/,
  }
  chai.assert.jsonSchema(service, serviceStatusSchema)
}

describe('Platform health check endpoint', () => {
  describe('When I hit the endpoint', () => {
    let response = {}
    beforeAll(async () => {
      try {
        response = await superagent.get(eps.platformHealth.path).set(headers)
      } catch (error) {
        response = error.response
      }
    }, 30000)

    it('Then there is information about redis', () =>
      validateServiceStatus(response.body.redis))

    it('Then there is information about sns', () =>
      validateServiceStatus(response.body.sns))

    it('Then there is information about wcs', () =>
      validateServiceStatusWithPossibleResponseCode(response.body.wcs))

    it('Then there is information about cms', () =>
      validateServiceStatusWithPossibleResponseCode(response.body.cms))

    it('Then there is information about feature flags', () => {
      const featureFlagsSchema = {
        title: 'Feature Flags Key Schema',
        type: 'object',
        properties: {
          br: objectType,
          ts: objectType,
          ms: objectType,
          dp: objectType,
          ev: objectType,
          tm: objectType,
          wl: objectType,
          common: arrayType,
        },
        required: ['br', 'ts', 'ms', 'dp', 'ev', 'tm', 'wl', 'common'],
      }
      expect(response.body.featureFlags).toMatchSchema(featureFlagsSchema)
    })

    it('Then there is information about the buildInfo', () => {
      expect(response.body.buildInfo).toBeDefined()
      expect(typeof response.body.buildInfo).toBe('object')
    })

    it('And the buildInfo contains the version', () => {
      expect(response.body.buildInfo.version).toBeDefined()
      expect(typeof response.body.buildInfo.version).toBe('string')
      expect(
        response.body.buildInfo.version.match(
          /^[0-9]*.[0-9]*.[0-9]* \(package\.json\)$/
        )
      ).toHaveLength(1)
    })

    it('And the buildInfo contains the tag', () => {
      expect(response.body.buildInfo.tag).toBeDefined()
      expect(typeof response.body.buildInfo.tag).toBe('string')
      expect(response.body.buildInfo.tag.length).toBeGreaterThan(1)
    })

    it('And the buildInfo contains the date', () => {
      expect(response.body.buildInfo.date).toBeDefined()
      expect(typeof response.body.buildInfo.date).toBe('string')
      expect(moment(response.body.buildInfo.date).isValid()).toBe(true)
    })

    it('And the buildInfo contains the hash', () => {
      expect(response.body.buildInfo.hash).toBeDefined()
      expect(typeof response.body.buildInfo.hash).toBe('string')
      expect(response.body.buildInfo.hash).toHaveLength(40)
    })

    it('Then I get a status code 500 if one of the services is not running', () => {
      Object.keys(response.body).forEach((serviceStatus) => {
        if (response.body[serviceStatus] === 'not running') {
          expect(response.statusCode).toBe(500)
        }
      })
    })

    it('Then I get a status code 200 if all services are running', () => {
      const stats = Object.keys(response.body).filter(
        (serviceStatus) => typeof response.body[serviceStatus] === 'string'
      )
      const notRunningServices = stats.filter((service) => {
        return response.body[service] === 'good'
      })
      if (notRunningServices === []) {
        expect(response.statusCode).toBe(200)
      }
    })
  })
})
