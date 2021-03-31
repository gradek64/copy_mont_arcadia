import moment from 'moment-timezone'
import MockDate from 'mockdate'

import WcsCookieCapture from '../wcs-cookie-capture'
import { BACKEND_JWT } from '../../api/constants/cookies'
import * as logger from '../logger'

jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  setCustomAttribute: jest.fn(),
}))

const generateCookies = (jwt) => ({
  [BACKEND_JWT]: jwt,
})

// JWT tokens generated and modified using tool at https://jwt.io/
describe('WcsCookieCapture()', () => {
  beforeAll(() => {
    jest.clearAllMocks()
    MockDate.set(moment('Sat, 21 Oct 2028 13:14:55 GMT'))
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    describe('invalid cookies provided', () => {
      it('should set cookies to empty array if passed client cookies are undefined', () => {
        const cookieCapture = new WcsCookieCapture()
        expect(cookieCapture.readForServer()).toEqual([])
      })
      it('should call setCustomAttribute with `cookiesFromClient, false` arguments', () => {
        // eslint-disable-next-line no-unused-vars
        const cookieCapture = new WcsCookieCapture()
        expect(logger.setCustomAttribute).toHaveBeenCalledWith(
          'cookiesFromClient',
          false
        )
      })
      it('should set cookies to empty array if passed cookies have no matching key', () => {
        const cookies = {
          random: 'value',
        }
        const cookieCapture = new WcsCookieCapture(cookies)
        expect(cookieCapture.readForServer()).toEqual([])
      })

      describe('Invalid JWT provided', () => {
        // key used is "test12" instead of "test123"
        const invalidKeyJwt =
          'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPWZhbHNlOyBQYXRoPS8iLCJxdWJpdF9wbGF0Zm9ybT1XQ1M7IGV4cGlyZXM9U2F0LCAwOC1Ob3YtMjAyOCAxMTo0MTo0OCBHTVQ7IHBhdGg9Lzsgc2VjdXJlIiwiSlNFU1NJT05JRD0wMDAwdVhnSTU5UDZES1BUVGg1VDZhREFlSWg6cHJkMXN0YWdlX2ZlMS53Y3MwMjsgUGF0aD0vIiwidGVtcFVzZXI9TjsgRXhwaXJlcz1GcmksIDIwLURlYy0yOCAxMzowMDozOCBHTVQ7IFBhdGg9LyIsInVzZXJDb3VudHJ5PVVuaXRlZCUyMEtpbmdkb207IFBhdGg9LyIsInByZWZTaGlwQ3RyeT1Vbml0ZWQlMjBLaW5nZG9tOyBQYXRoPS8iXQ.TMI6E0We1TmRfmfZQrxxDPGzc9LXDKxzD2XnJZFhGf8'
        // payload has been modified which invalidates the signature
        const invalidPayloadJwt =
          'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyIsInF1Yml0X3BsYXRmb3JtPVdDUzsgZXhwaXJlcz1TYXQsIDA4LU5vdi0yMDI4IDExOjQxOjQ4IEdNVDsgcGF0aD0vOyBzZWN1cmUiLCJKU0VTU0lPTklEPTAwMDB1WGdJNTlQNkRLUFRUaDVUNmFEQWVJaDpwcmQxc3RhZ2VfZmUxLndjczAyOyBQYXRoPS8iLCJ0ZW1wVXNlcj1OOyBFeHBpcmVzPUZyaSwgMjAtRGVjLTI4IDEzOjAwOjM4IEdNVDsgUGF0aD0vIiwidXNlckNvdW50cnk9VW5pdGVkJTIwS2luZ2RvbTsgUGF0aD0vIiwicHJlZlNoaXBDdHJ5PVVuaXRlZCUyMEtpbmdkb207IFBhdGg9LyJd.NvusOCSTA1NIbejoozCXJd1oaBz-GFHbhLAKqThazjk'
        const malformedJwt = 'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVN'

        it('should throw error if jwt is invalid', () => {
          const cookies = generateCookies(invalidKeyJwt)
          let error
          try {
            // eslint-disable-next-line no-unused-vars
            const cookieCapture = new WcsCookieCapture(cookies)
          } catch (e) {
            error = e
          }
          expect(error.message).toEqual('Invalid JWT received')
        })

        it('should throw error if jwt payload is modified', () => {
          const cookies = generateCookies(invalidPayloadJwt)
          let error
          try {
            // eslint-disable-next-line no-unused-vars
            const cookieCapture = new WcsCookieCapture(cookies)
          } catch (e) {
            error = e
          }
          expect(error.message).toEqual('Invalid JWT received')
        })

        it('should call logger.error with expected parameters', () => {
          try {
            const cookies = generateCookies(invalidPayloadJwt)
            // eslint-disable-next-line no-unused-vars
            const cookieCapture = new WcsCookieCapture(cookies)
          } catch (e) {
            // error not used
          }
          expect(logger.error).toHaveBeenCalledWith('security:jwt', {
            message:
              'error verifying JWT. header length: 20, payload length: 428, signature length: 43',
            jwtHasSignature: true,
            errorMessage: 'invalid signature',
          })
        })

        it('should detect malformed (truncated) jwt', () => {
          try {
            const cookies = generateCookies(malformedJwt)
            // eslint-disable-next-line no-unused-vars
            const cookieCapture = new WcsCookieCapture(cookies)
          } catch (e) {
            // error not used
          }
          expect(logger.error).toHaveBeenCalledWith('security:jwt', {
            message:
              'error verifying JWT. header length: 20, payload length: 11',
            jwtHasSignature: false,
            errorMessage: 'jwt malformed',
          })
        })
      })
    })

    describe('valid cookies provided', () => {
      const expectedPayload = [
        'WC_SESSION_ESTABLISHED=true; Path=/',
        'qubit_platform=WCS; expires=Sat, 08-Nov-2028 11:41:48 GMT; path=/; secure',
        'JSESSIONID=0000uXgI59P6DKPTTh5T6aDAeIh:prd1stage_fe1.wcs02; Path=/',
        'tempUser=N; Expires=Fri, 20-Dec-28 13:00:38 GMT; Path=/',
        'userCountry=United%20Kingdom; Path=/',
        'prefShipCtry=United%20Kingdom; Path=/',
      ]

      it('should call setCustomAttribute with `cookiesFromClient, true` arguments', () => {
        const allValidJwt =
          'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyIsInF1Yml0X3BsYXRmb3JtPVdDUzsgZXhwaXJlcz1TYXQsIDA4LU5vdi0yMDI4IDExOjQxOjQ4IEdNVDsgcGF0aD0vOyBzZWN1cmUiLCJKU0VTU0lPTklEPTAwMDB1WGdJNTlQNkRLUFRUaDVUNmFEQWVJaDpwcmQxc3RhZ2VfZmUxLndjczAyOyBQYXRoPS8iLCJ0ZW1wVXNlcj1OOyBFeHBpcmVzPUZyaSwgMjAtRGVjLTI4IDEzOjAwOjM4IEdNVDsgUGF0aD0vIiwidXNlckNvdW50cnk9VW5pdGVkJTIwS2luZ2RvbTsgUGF0aD0vIiwicHJlZlNoaXBDdHJ5PVVuaXRlZCUyMEtpbmdkb207IFBhdGg9LyJd.HEbKQWHTv4yoUgFIw-HdcYekMdO4PwxEV2bAHV-ow8M'
        const cookies = generateCookies(allValidJwt)
        // eslint-disable-next-line no-unused-vars
        const cookieCapture = new WcsCookieCapture(cookies)
        expect(logger.setCustomAttribute).toHaveBeenCalledWith(
          'cookiesFromClient',
          true
        )
      })

      it('should set captured cookies to those passed in the constructor', () => {
        const allValidJwt =
          'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyIsInF1Yml0X3BsYXRmb3JtPVdDUzsgZXhwaXJlcz1TYXQsIDA4LU5vdi0yMDI4IDExOjQxOjQ4IEdNVDsgcGF0aD0vOyBzZWN1cmUiLCJKU0VTU0lPTklEPTAwMDB1WGdJNTlQNkRLUFRUaDVUNmFEQWVJaDpwcmQxc3RhZ2VfZmUxLndjczAyOyBQYXRoPS8iLCJ0ZW1wVXNlcj1OOyBFeHBpcmVzPUZyaSwgMjAtRGVjLTI4IDEzOjAwOjM4IEdNVDsgUGF0aD0vIiwidXNlckNvdW50cnk9VW5pdGVkJTIwS2luZ2RvbTsgUGF0aD0vIiwicHJlZlNoaXBDdHJ5PVVuaXRlZCUyMEtpbmdkb207IFBhdGg9LyJd.HEbKQWHTv4yoUgFIw-HdcYekMdO4PwxEV2bAHV-ow8M'
        const cookies = generateCookies(allValidJwt)
        const cookieCapture = new WcsCookieCapture(cookies)
        expect(cookieCapture.readForServer()).toEqual(expectedPayload)
      })

      it('if doNotGenerateSession that is passed to constructor is true, readForClient should set payload of jwt to empty array (W10)', () => {
        const allValidJwt =
          'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyIsInF1Yml0X3BsYXRmb3JtPVdDUzsgZXhwaXJlcz1TYXQsIDA4LU5vdi0yMDI4IDExOjQxOjQ4IEdNVDsgcGF0aD0vOyBzZWN1cmUiLCJKU0VTU0lPTklEPTAwMDB1WGdJNTlQNkRLUFRUaDVUNmFEQWVJaDpwcmQxc3RhZ2VfZmUxLndjczAyOyBQYXRoPS8iLCJ0ZW1wVXNlcj1OOyBFeHBpcmVzPUZyaSwgMjAtRGVjLTI4IDEzOjAwOjM4IEdNVDsgUGF0aD0vIiwidXNlckNvdW50cnk9VW5pdGVkJTIwS2luZ2RvbTsgUGF0aD0vIiwicHJlZlNoaXBDdHJ5PVVuaXRlZCUyMEtpbmdkb207IFBhdGg9LyJd.HEbKQWHTv4yoUgFIw-HdcYekMdO4PwxEV2bAHV-ow8M'
        const cookies = generateCookies(allValidJwt)
        const cookieCapture = new WcsCookieCapture(cookies, true)
        const { name, value } = cookieCapture.readForClient()[0]
        expect(name).toEqual(BACKEND_JWT)
        expect(value.split('.')[1]).toBe('W10')
      })

      describe('should remove any cookies that have value set to DEL', () => {
        it('should remove cookies set that have "DEL" set as their value', () => {
          const withDELCookieJwt =
            'eyJhbGciOiJIUzI1NiJ9.WyJleHBpcmVzPURFTDsgUGF0aD0vIiwiV0NfU0VTU0lPTl9FU1RBQkxJU0hFRD10cnVlOyBQYXRoPS8iLCJxdWJpdF9wbGF0Zm9ybT1XQ1M7IGV4cGlyZXM9U2F0LCAwOC1Ob3YtMjAyOCAxMTo0MTo0OCBHTVQ7IHBhdGg9Lzsgc2VjdXJlIiwiSlNFU1NJT05JRD0wMDAwdVhnSTU5UDZES1BUVGg1VDZhREFlSWg6cHJkMXN0YWdlX2ZlMS53Y3MwMjsgUGF0aD0vIiwidGVtcFVzZXI9TjsgRXhwaXJlcz1GcmksIDIwLURlYy0yOCAxMzowMDozOCBHTVQ7IFBhdGg9LyIsInVzZXJDb3VudHJ5PVVuaXRlZCUyMEtpbmdkb207IFBhdGg9LyIsInByZWZTaGlwQ3RyeT1Vbml0ZWQlMjBLaW5nZG9tOyBQYXRoPS8iXQ.LR9dSgxUIHmz12nc8BZmZvrGmYsy4uBl6ZyvhdEzv50'
          const cookies = generateCookies(withDELCookieJwt)
          const cookieCapture = new WcsCookieCapture(cookies)
          expect(cookieCapture.readForServer()).toEqual(expectedPayload)
        })
      })
    })
  })

  describe('hasWcsCookies', () => {
    const oneCookieJwt =
      'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyJd.g3t_m2e6_Pa7wdjOy319ZR_EI9WDPXyOdAXCRE0_Z6c'
    const twoCookiesJwt =
      'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyIsIlRXTz1jb29raWVzOyBQYXRoPS8iXQ.IlFj6_zor-EtZf6g1_EvGISNSXgWlfNDQVI_wNWy0wk'

    it('should return true if there is one cookie', () => {
      const cookies = generateCookies(oneCookieJwt)
      const cookieCapture = new WcsCookieCapture(cookies)
      expect(cookieCapture.hasWcsCookies()).toEqual(true)
    })
    it('should return false if doNotGenerateSession is set to true, even with cookies present', () => {
      const cookies = generateCookies(oneCookieJwt)
      const doNotGenerateSession = true
      const cookieCapture = new WcsCookieCapture(cookies, doNotGenerateSession)
      expect(cookieCapture.hasWcsCookies()).toEqual(false)
    })
    it('should return true if there is more than one cookie', () => {
      const cookies = generateCookies(twoCookiesJwt)
      const cookieCapture = new WcsCookieCapture(cookies)
      expect(cookieCapture.hasWcsCookies()).toEqual(true)
    })
    it('should return false when no cookies are present', () => {
      const cookieCapture = new WcsCookieCapture()
      expect(cookieCapture.hasWcsCookies()).toEqual(false)
    })
  })

  describe('capture', () => {
    const oneCookieJwt =
      'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyJd.g3t_m2e6_Pa7wdjOy319ZR_EI9WDPXyOdAXCRE0_Z6c'
    let cookieCapture

    beforeEach(() => {
      const cookies = generateCookies(oneCookieJwt)
      cookieCapture = new WcsCookieCapture(cookies)
    })

    it('should replace any cookies passed to it', () => {
      const additionalCookies = ['new=cookies; Path=/']
      cookieCapture.capture(additionalCookies)
      expect(cookieCapture.readForServer()).toEqual(additionalCookies)
    })
  })

  describe('readForServer', () => {
    const oneCookieJwt =
      'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyJd.g3t_m2e6_Pa7wdjOy319ZR_EI9WDPXyOdAXCRE0_Z6c'
    let cookieCapture

    beforeEach(() => {
      const cookies = generateCookies(oneCookieJwt)
      cookieCapture = new WcsCookieCapture(cookies)
    })

    it('should return the currently available cookies as an array', () => {
      expect(Array.isArray(cookieCapture.readForServer())).toBe(true)
    })

    it('should pass cookies as empty array if no cookies present', () => {
      const noCookieJwt =
        'eyJhbGciOiJIUzI1NiJ9.W10.biQRVFAFLbuKT6CrtkQz_aDfvByBAltvckVLgneKWbw'
      const cookies = generateCookies(noCookieJwt)
      cookieCapture = new WcsCookieCapture(cookies)
      expect(cookieCapture.readForServer()).toEqual([])
    })

    it('should pass unique object to prevent accidental mutation of original cookies', () => {
      expect(cookieCapture.readForServer()).not.toBe(cookieCapture.cookies)
    })
  })

  describe('readForClient', () => {
    const oneCookieJwt =
      'eyJhbGciOiJIUzI1NiJ9.WyJXQ19TRVNTSU9OX0VTVEFCTElTSEVEPXRydWU7IFBhdGg9LyJd.g3t_m2e6_Pa7wdjOy319ZR_EI9WDPXyOdAXCRE0_Z6c'
    let cookieCapture
    let cookiesForClient
    let cookie

    beforeEach(() => {
      const cookies = generateCookies(oneCookieJwt)
      cookieCapture = new WcsCookieCapture(cookies)
      cookiesForClient = cookieCapture.readForClient()
      cookie = cookiesForClient[0]
    })

    it('returns an array with a single entry', () => {
      expect(cookiesForClient.length).toEqual(1)
    })
    it('should have expected cookie name', () => {
      expect(cookie.name).toEqual(BACKEND_JWT)
    })
    it('cookie value should be a valid JWT', () => {
      expect(cookie.value).toEqual(oneCookieJwt)
    })
    it('generates expected jwt after an update', () => {
      const updatedCookieJwt =
        'eyJhbGciOiJIUzI1NiJ9.WyJDb29raWU9WXVtOyBQYXRoPS8iXQ.VzuBTgdP_wMhy28KWuuOAKFqNwuZtJFny73vicVrMec'
      const newCookies = ['Cookie=Yum; Path=/']
      cookieCapture.capture(newCookies)
      const newCookieForClient = cookieCapture.readForClient()
      const jwt = newCookieForClient[0] && newCookieForClient[0].value
      expect(jwt).toEqual(updatedCookieJwt)
    })
  })

  describe('removeKey()', () => {
    it('should remove the cookie with the specified name', () => {
      const startCookies =
        'eyJhbGciOiJIUzI1NiJ9.WyJDb29raWU9WXVtOyBQYXRoPS8iLCJSZW1vdmVNZT1zaG91bGRub3RiZWhlcmUiXQ.sTkmVP82xFDC-qBxkWBMu6QgdZexhhal-cog4I9kyJY'
      const cookies = generateCookies(startCookies)
      const cookieCapture = new WcsCookieCapture(cookies)

      cookieCapture.removeCookieByName('RemoveMe')

      const newCookieForClient = cookieCapture.readForClient()[0].value
      const updatedCookieJwt =
        'eyJhbGciOiJIUzI1NiJ9.WyJDb29raWU9WXVtOyBQYXRoPS8iXQ.VzuBTgdP_wMhy28KWuuOAKFqNwuZtJFny73vicVrMec'
      expect(newCookieForClient).toEqual(updatedCookieJwt)
    })
  })
})
