import {
  pollForGoogleService,
  latLngOrMarkersHaveChanged,
} from '../google-utils'
import { maps } from 'test/mocks/google'

jest.useFakeTimers()

global.process.browser = true
describe('Google Utils', () => {
  describe('pollForGoogleService', () => {
    beforeEach(() => {
      global.google = { maps }
    })

    it('should return if service available immediately', () => {
      return pollForGoogleService(['Geocoder'])
    })

    it('should return if service available within 30 seconds', () => {
      global.google.maps = {}
      const promise = pollForGoogleService(['Geocoder'])
      jest.advanceTimersByTime(3000)
      global.google.maps.Geocoder = true
      jest.advanceTimersByTime(3001)
      return promise
    })

    describe('Error states', () => {
      it('Rejects if servicePath is not an array', async () => {
        try {
          await pollForGoogleService('foo')
        } catch (err) {
          expect(err).toEqual('No google service specified')
        }
      })

      it('Rejects if an empty array is provided', async () => {
        try {
          await pollForGoogleService([])
        } catch (err) {
          expect(err).toEqual('No google service specified')
        }
      })

      it('Rejects if google is not found in 30 seconds', async () => {
        global.google = undefined
        try {
          const promise = pollForGoogleService(['foo'])
          jest.advanceTimersByTime(33000)
          await promise
        } catch (err) {
          expect(err).toEqual('Google object not found in time')
        }
      })

      it('Rejects if google maps is not found in 30 seconds', async () => {
        global.google.maps = undefined
        try {
          const promise = pollForGoogleService(['foo'])
          jest.advanceTimersByTime(33000)
          await promise
        } catch (err) {
          expect(err).toEqual('Google maps object not found in time')
        }
      })

      it('Rejects if google service is not found in 30 seconds', async () => {
        global.google.maps = {}
        try {
          const promise = pollForGoogleService(['foo'])
          jest.advanceTimersByTime(33000)
          await promise
        } catch (err) {
          expect(err).toEqual(`No Google service 'foo' found in time`)
        }
      })
    })
  })

  describe('latLngOrMarkersHaveChanged()', () => {
    const prevProps = {
      currentLat: 50,
      currentLng: 70,
      markers: [[1, 2], [3, 4]],
    }

    it('should return true when currentLat has changed', () => {
      const nextProps = {
        ...prevProps,
        currentLat: 60,
      }
      expect(latLngOrMarkersHaveChanged(nextProps, prevProps)).toBe(true)
    })
    it('should return true when currentLng has changed', () => {
      const nextProps = {
        ...prevProps,
        currentLng: 60,
      }
      expect(latLngOrMarkersHaveChanged(nextProps, prevProps)).toBe(true)
    })
    it('should return true length of markers has changed has changed', () => {
      const nextProps = {
        ...prevProps,
        markers: [],
      }
      expect(latLngOrMarkersHaveChanged(nextProps, prevProps)).toBe(true)
    })
    it('should return false if nothing has changed', () => {
      const nextProps = {
        ...prevProps,
      }
      expect(latLngOrMarkersHaveChanged(nextProps, prevProps)).toBe(false)
    })
  })
})
