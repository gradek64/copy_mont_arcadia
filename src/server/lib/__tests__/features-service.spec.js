import AWS from 'aws-sdk'
import {
  getFeatures,
  updateFeatures,
  getAllFeatures,
} from '../features-service'

jest.mock('../../lib/logger')

const brandRegionSchema = {
  ts: ['uk', 'us', 'fr', 'de', 'eu'],
  tm: ['uk', 'us', 'fr', 'de', 'eu'],
  ms: ['uk', 'us', 'fr', 'de', 'eu'],
  dp: ['uk', 'us', 'eu'],
  ev: ['uk', 'us', 'de', 'eu'],
  br: ['uk', 'eu'],
  wl: ['uk', 'us', 'de', 'eu'],
}

AWS.S3 = jest.fn(() => ({
  getObject: jest.fn((params, cb) => {
    return cb(null, {
      Body: JSON.stringify(require('./mocks/features.json')),
    })
  }),
}))

describe('Feature service', () => {
  it('should not have null or undefined features', () => {
    const features = getFeatures({
      brandCode: 'ts',
      region: 'uk',
    })
    expect(features.includes(undefined)).toBeFalsy()
    expect(features.includes(null)).toBeFalsy()
  })

  describe('updates', () => {
    it('the local feature set', () => {
      updateFeatures()
      expect(getFeatures({ brandCode: 'ts', region: 'uk' })).not.toEqual([])
    })
  })

  describe('returns', () => {
    beforeEach(() => {
      updateFeatures()
    })

    it('should return a non-empty array for each brand-region configuration', () => {
      Object.entries(brandRegionSchema).forEach(([brandCode, regions]) => {
        regions.forEach((region) => {
          expect(getFeatures({ brandCode, region })).not.toEqual(0)
        })
      })
    })
  })

  describe('getAllFeatures', () => {
    it('returns all the feature flags', () => {
      const features = getAllFeatures()

      expect(features).toEqual(
        require('packages/monty-feature-flags/features.json')
      )
    })
  })
})
