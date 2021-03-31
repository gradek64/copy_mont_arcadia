import * as userLocatorSelectors from '../userLocatorSelectors'

describe('User locator selectors', () => {
  describe('getSelectedPlaceId()', () => {
    it('should return the selected place key if no location available (google) ', () => {
      const state = {
        userLocator: {
          selectedPlaceDetails: {
            key: 'abc123',
          },
        },
      }
      expect(userLocatorSelectors.getSelectedPlaceId(state)).toBe('abc123')
    })
    it('should return the selected place location if no key available (woosmap) ', () => {
      const state = {
        userLocator: {
          selectedPlaceDetails: {
            location: {
              lat: 1,
              long: 2,
            },
          },
        },
      }
      expect(userLocatorSelectors.getSelectedPlaceId(state)).toEqual({
        location: {
          lat: 1,
          long: 2,
        },
      })
    })
  })
  describe('getPreviousSelectedPlaceId()', () => {
    it('should return the previous selected place ID', () => {
      const state = {
        userLocator: {
          prevSelectedPlaceDetails: {
            key: '1234abc',
          },
        },
      }
      expect(userLocatorSelectors.getPreviousSelectedPlaceId(state)).toBe(
        '1234abc'
      )
    })
  })
  describe('getGeoLocationError()', () => {
    it('should return the geolocation error', () => {
      const state = {
        userLocator: {
          geoLocation: {
            geolocationError: 'Geolocation error',
          },
        },
      }
      expect(userLocatorSelectors.getGeoLocationError(state)).toBe(
        'Geolocation error'
      )
    })
  })
  describe('getUserInputGeoLocation()', () => {
    it('should return if the user has activated geolocation', () => {
      const state = {
        userLocator: {
          geoLocation: {
            userInputGeoLocation: true,
          },
        },
      }
      expect(userLocatorSelectors.getUserInputGeoLocation(state)).toBe(true)
    })
  })
  describe('getGeoLocatorCoordinatesLong()', () => {
    it('should return the longitude from the user locator', () => {
      const state = {
        userLocator: {
          geoLocation: {
            userGeoLongLat: {
              long: '1',
            },
          },
        },
      }
      expect(userLocatorSelectors.getGeoLocatorCoordinatesLong(state)).toBe('1')
    })
  })
  describe('getGeoLocatorCoordinatesLat()', () => {
    it('should return the latitude from the user locator', () => {
      const state = {
        userLocator: {
          geoLocation: {
            userGeoLongLat: {
              lat: '1',
            },
          },
        },
      }
      expect(userLocatorSelectors.getGeoLocatorCoordinatesLat(state)).toBe('1')
    })
  })
})
