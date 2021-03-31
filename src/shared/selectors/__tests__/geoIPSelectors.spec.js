import * as geoIPSelectors from '../geoIPSelectors'

describe('geoIPSelectors', () => {
  const state = {
    geoIP: {
      userISOPreference: 'US',
      userRegionPreference: 'us',
      userLanguagePreference: 'en-us',
      geoISO: 'JP',
    },
  }

  describe('getGeoIPUserISOPreference', () => {
    it('should get the `userISOPreference` from state', () => {
      expect(geoIPSelectors.getGeoIPUserISOPreference(state)).toBe('US')
    })
  })

  describe('getGeoIPUserRegionPreference', () => {
    it('should get the `userRegionPreference` from state', () => {
      expect(geoIPSelectors.getGeoIPUserRegionPreference(state)).toBe('us')
    })
  })

  describe('getGeoIPUserLanguagePreference', () => {
    it('should get the `userLanguagePreference` from state', () => {
      expect(geoIPSelectors.getGeoIPUserLanguagePreference(state)).toBe('en-us')
    })
  })

  describe('getGeoIPGeoISO', () => {
    it('should get the `geoISO` from state', () => {
      expect(geoIPSelectors.getGeoIPGeoISO(state)).toBe('JP')
    })
  })
})
