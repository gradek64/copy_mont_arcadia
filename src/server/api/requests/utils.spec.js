import moment from 'moment-timezone'
import MockDate from 'mockdate'

import {
  getJSessionId,
  mergeCookiesResponse,
  getNewDestination,
  canRequestHaveBody,
  mergeCookies,
  combineCookies,
  genCookieString,
  getGeoCookies,
  parseOption,
  parseOptions,
  parseCookieString,
  extractAndParseCookie,
  getMontyHeaderDeviceType,
  removeExpiredCookies,
  mergeWcsCookies,
  getCookiesOnWcsResponse,
} from './utils'

import { deviceTypes } from './constants'

const oldCookies = [
  'usergeo=GB; path=/',
  'JSESSIONID=0000fyAMAadGxpebiLzvAL52jiH:live_792.04; Path=/',
]
const newCookies = [
  'Apache=80.239.234.172.1493724001402700; path=/',
  'JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/',
  'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
]
const mergedCookies = [
  'usergeo=GB; path=/',
  'Apache=80.239.234.172.1493724001402700; path=/',
  'JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/',
  'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
]

describe('utils', () => {
  beforeAll(() => {
    MockDate.set(moment('Sat, 21 Oct 2028 13:14:55 GMT'))
  })
  afterAll(() => {
    MockDate.reset()
  })
  describe('getJSessionId', () => {
    it('gets the JSESSIONID', () => {
      const cookies = [
        'Apache=80.239.234.172.1493724001402700; path=/',
        'JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/',
        'WC_PERSISTENT=vJy27BjJsmeqwFRLum173dXaSho%3D%0A%3B2017-05-02+12%3A20%3A01.406_1493724001406-1352318_0; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
        'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
        'cartValue=1|15.00; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
        'WC_SESSION_ESTABLISHED=true; Path=/',
        'WC_PERSISTENT=KqN5We4xPyckSYJKtlzKQ7i581o%3D%0A%3B2017-05-02+12%3A20%3A01.572_1493724001406-1352318_12556_642832601%2C-1%2CGBP%2C1UKxocI%2F9JVdPZJJPxFLtgOG6mkdVjd8rWjSlZNrZzLhZGeI0pe7Wo8xGL3Dlk1QEx1vKSBe6Ni3B%2F5LjoYzDQ%3D%3D_12556; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
        'WC_ACTIVEPOINTER=-1%2C12556; Path=/',
        'WC_USERACTIVITY_642832601=642832601%2C12556%2Cnull%2Cnull%2C1493724001572%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2CFkzuWBHtljOLqSigUb20Nyady4qhNVISLebyLm2PtMgNIzkrsLXitk5SOPZFTW9nyrFVa0GmMaaR7WSI8CykXBMbt8R0xZEBsLaFiy1lYEnB%2BQEBpm9YvTasEM5p1Fdsrznridp29cReCT%2BnZ%2B0CuFp48iVGqeVR7wEKCpUbT74pjhWnkXjeMB7qq2g7Yh1527bdEOQq1o1AFujHS4yGjaAWGm4MTy%2BUyq3A9OWI9eM%3D; Path=/',
        'akavpau_VP_TS=1493724301~id=9864767c500ff5313fea11f3cf0763f0; Path=/',
      ]
      const key = getJSessionId(cookies)
      expect(key).toBe('0000lB6WWCq8X98Y2gOwk4vQcCA')
    })
    it('returns an empty string if no JSESSIONID is found', () => {
      const cookies = []
      const key = getJSessionId(cookies)
      expect(key).toBe('')
    })
  })
  describe('getCookiesOnWcsResponse', () => {
    it('should return cookie array from response headers if available', () => {
      const cookieArray = ['test=cookie']
      const response = {
        headers: {
          'set-cookie': cookieArray,
        },
      }
      const cookies = getCookiesOnWcsResponse(response)
      expect(cookies).toEqual(cookieArray)
    })
    it('should return empty array if response is undefined', () => {
      const cookies = getCookiesOnWcsResponse()
      expect(cookies).toEqual([])
    })
    it('should return empty array if response.headers is undefined', () => {
      const cookies = getCookiesOnWcsResponse({})
      expect(cookies).toEqual([])
    })
    it("should return empty array if response.headers['set-cookie'] is undefined", () => {
      const cookies = getCookiesOnWcsResponse({ headers: {} })
      expect(cookies).toEqual([])
    })
  })
  describe('mergeCookiesResponse', () => {
    const cookies = [
      'Apache=80.239.234.172.1493724001402700; path=/',
      'JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/',
    ]
    it('merges cookies from a response with other cookies', () => {
      const mergedCookies = [
        'Apache=80.239.234.172.1493724001402700; path=/',
        'JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/',
        'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
      ]
      const response = {
        headers: {
          'set-cookie': [
            'JSESSIONID=0000lB6WWCq8X98Y2gOwk4vQcCA:live_7c2.01; Path=/',
            'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
          ],
        },
      }
      const newCookies = mergeCookiesResponse(response, cookies)
      expect(newCookies).toEqual(mergedCookies)
    })
    it('overwrites old cookies with new cookies', () => {
      const mergedCookies = [
        'Apache=80.239.234.172.1493724001402700; path=/',
        'JSESSIONID=newjsessionid:live_7c2.01; Path=/',
        'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
      ]
      const response = {
        headers: {
          'set-cookie': [
            'JSESSIONID=newjsessionid:live_7c2.01; Path=/',
            'cartId=333163198; Expires=Thu, 01-Jun-17 11:20:01 GMT; Path=/',
          ],
        },
      }
      const newCookies = mergeCookiesResponse(response, cookies)
      expect(newCookies).toEqual(mergedCookies)
    })
    it('return the old cookies if no new cookies are set in the reponse', () => {
      const response = {
        headers: {},
      }
      const newCookies = mergeCookiesResponse(response, cookies)
      expect(newCookies).toEqual(cookies)
    })
  })
  describe('getNewDestination', () => {
    it('returns the new destination from the response', () => {
      const location = 'http://www.topshop.com/api/different?option=5'
      const response = {
        headers: {
          location,
        },
      }
      const destination = getNewDestination(response)
      expect(destination).toBe(location)
    })
    it('return an empty string if no location is found', () => {
      const response = {
        headers: {},
      }
      const destination = getNewDestination(response)
      expect(destination).toBe('')
    })
  })
  describe('canRequestHaveBody', () => {
    it('return true for request methods that can have a body', () => {
      expect(canRequestHaveBody('post')).toBeTruthy()
      expect(canRequestHaveBody('put')).toBeTruthy()
      expect(canRequestHaveBody('patch')).toBeTruthy()
      expect(canRequestHaveBody('delete')).toBeTruthy()
      expect(canRequestHaveBody('options')).toBeTruthy()
      expect(canRequestHaveBody('link')).toBeTruthy()
      expect(canRequestHaveBody('unlink')).toBeTruthy()
      expect(canRequestHaveBody('lock')).toBeTruthy()
      expect(canRequestHaveBody('propfind')).toBeTruthy()
      expect(canRequestHaveBody('view')).toBeTruthy()
    })
    it('return false for request methods that can not have a body', () => {
      expect(canRequestHaveBody('get')).toBeFalsy()
      expect(canRequestHaveBody('copy')).toBeFalsy()
      expect(canRequestHaveBody('head')).toBeFalsy()
      expect(canRequestHaveBody('purge')).toBeFalsy()
      expect(canRequestHaveBody('unlock')).toBeFalsy()
    })
  })
  describe('mergeCookies', () => {
    it('merges two cookies arrays', () => {
      const cookies = mergeCookies(newCookies, oldCookies)
      expect(cookies).toEqual(mergedCookies)
    })
    it('only contains each cookie once', () => {
      const cookies = mergeCookies(newCookies, oldCookies)
      const cookieNames = cookies.map((cookie) =>
        cookie.slice(0, cookie.indexOf('='))
      )
      const unique = cookieNames.filter(
        (cookie) =>
          cookieNames.indexOf(cookie) === cookieNames.lastIndexOf(cookie)
      )
      expect(unique.length).toBe(cookies.length)
    })
    it('uses the newCookies value if there is a duplicate', () => {
      const cookies = mergeCookies(newCookies, oldCookies)
      const jSessionId = cookies.find((item) => item.startsWith('JSESSIONID='))
      expect(jSessionId).toBe(newCookies[1])
    })
  })
  describe('combineCookies', () => {
    it('should return the original list, if no name is supplied', () => {
      const cookies = combineCookies([], oldCookies)
      expect(cookies).toEqual(oldCookies)
    })
    it('should insert the cookie at the end of the list', () => {
      const cookieOne = 'one=true; Path=/'
      const cookieTwo = 'two=true; Path=/'
      const cookies = combineCookies(
        [
          {
            name: 'one',
            value: true,
            path: '/',
          },
          {
            name: 'two',
            value: true,
            path: '/',
          },
        ],
        oldCookies
      )
      expect(cookies[cookies.length - 2]).toEqual(cookieOne)
      expect(cookies[cookies.length - 1]).toEqual(cookieTwo)
    })
  })
  describe('genCookieString', () => {
    it('should return the original list, if no name is supplied', () => {
      const cookies = genCookieString({}, oldCookies)
      expect(cookies).toEqual(undefined)
    })
    it('should insert the cookie at the end of the list', () => {
      const newCookie = 'newCookie=true; Path=/'
      const cookie = genCookieString(
        {
          name: 'newCookie',
          value: 'true',
          path: '/',
        },
        oldCookies
      )
      expect(cookie).toEqual(newCookie)
    })
  })

  describe('getGeoCookies', () => {
    it('should return store default iso, if x-user-geo not supplied', () => {
      expect(getGeoCookies()).toEqual([
        {
          name: 'userCountry',
          value: 'United%20Kingdom',
        },
      ])
    })
    it('should set the userCountry based upon x-user-geo', () => {
      expect(
        getGeoCookies({
          'x-user-geo': 'FR',
        })
      ).toEqual([
        {
          name: 'userCountry',
          value: 'France',
        },
      ])
    })
    it('should set prefShipCtry based upon x-pref-ship', () => {
      expect(
        getGeoCookies({
          'x-user-geo': 'FR',
          'x-pref-ship': 'DE',
        })
      ).toEqual([
        {
          name: 'userCountry',
          value: 'France',
        },
        {
          name: 'prefShipCtry',
          value: 'DE',
        },
      ])
    })
  })

  describe('parseOption', () => {
    it('should return an empty object if it has no equals sign', () => {
      expect(parseOption('no-equals-here')).toEqual({})
    })
    it('should trim a whitespace character before the cookie name', () => {
      expect(parseOption(' name=value')).toEqual({ name: 'value' })
    })
    it('should not trim any characters which are not whitespace', () => {
      expect(parseOption('name=value')).toEqual({ name: 'value' })
    })
    it('should translate Path to path when provided as cookie name', () => {
      const parsedPathOption = parseOption(' Path=somepath')
      expect(parsedPathOption).not.toEqual({ Path: 'somepath' })
      expect(parsedPathOption).toEqual({ path: 'somepath' })
    })
    it('should translate Expires argument into ttl', () => {
      const parsedExpiresOption = parseOption(
        ' Expires=Sat, 21 Oct 2028 13:14:56 GMT'
      )
      expect(parsedExpiresOption).toEqual({ ttl: 1000 })
    })
  })
  describe('parseOptions', () => {
    it('should parse all semi-colon separated options and then merge them into one object', () => {
      const optionString1 = ' Expires=Sat, 21 Oct 2028 13:14:56 GMT'
      const optionString2 = ' Path=/'
      const option1 = parseOption(optionString1)
      const option2 = parseOption(optionString2)
      expect(parseOptions(`${optionString1};${optionString2}`)).toEqual({
        ...option1,
        ...option2,
      })
    })
  })
  describe('parseCookieString', () => {
    it('should return an empty object if the cookie string is not a string', () => {
      expect(parseCookieString({ notString: true })).toEqual({})
    })
    it('should return an empty object if the cookie string contains no equals sign', () => {
      expect(parseCookieString('something-invalid')).toEqual({})
    })
    it('should return an object with name and value undefined for an empty string', () => {
      const parsedEmptyString = parseCookieString('')
      expect(parsedEmptyString).toHaveProperty('name', undefined)
      expect(parsedEmptyString).toHaveProperty('value', undefined)
    })
    it('should parse string into object with name, value and option keys', () => {
      const cookieString =
        'userSeg=VklQIFNoaXBwaW5nIEp1bHkgMTU=; Expires=Sat, 21 Oct 2028 13:14:56 GMT; Path=/'
      expect(parseCookieString(cookieString)).toEqual({
        name: 'userSeg',
        value: 'VklQIFNoaXBwaW5nIEp1bHkgMTU=',
        options: parseOptions(' Expires=Sat, 21 Oct 2028 13:14:56 GMT; Path=/'),
      })
    })
    it('should handle the case where only name and value provided by returning options as empty string', () => {
      const cookieString = 'userSeg=VklQIFNoaXBwaW5nIEp1bHkgMTU='
      expect(parseCookieString(cookieString)).toEqual({
        name: 'userSeg',
        value: 'VklQIFNoaXBwaW5nIEp1bHkgMTU=',
        options: {},
      })
    })
    it('should handle cookie names where - is present in the cookie string', () => {
      const cookieString =
        'WC_AUTHENTICATION_-1002=DEL; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/; Secure'
      expect(parseCookieString(cookieString)).toEqual({
        name: 'WC_AUTHENTICATION_-1002',
        value: 'DEL',
        options: {
          ttl: -1069449295000,
          path: '/',
        },
      })
    })
  })
  describe('extractAndParseCookie', () => {
    it('should return undefined if cookies arg is not provided', () => {
      expect(extractAndParseCookie()).toBeUndefined()
    })
    it('should return undefined if cookies is not an array', () => {
      expect(extractAndParseCookie('some-string')).toBeUndefined()
    })
    it('should return undefined if cookies is an empty array', () => {
      expect(extractAndParseCookie([])).toBeUndefined()
    })
    it('should return undefined if name is not provided', () => {
      expect(extractAndParseCookie(['name=value'])).toBeUndefined()
    })
    it('should return undefined if name is not a string', () => {
      expect(extractAndParseCookie(['name=value'], {})).toBeUndefined()
    })
    it('should return undefined if cookies does not contain a string beginning with the name', () => {
      expect(
        extractAndParseCookie(['included=value'], 'not_included')
      ).toBeUndefined()
    })
    it('should return the parsed cookie if it is included', () => {
      const validExample = extractAndParseCookie(
        ['userSeg=12345678'],
        'userSeg'
      )
      expect(validExample).not.toBeUndefined()
      expect(validExample).toEqual(parseCookieString('userSeg=12345678'))
    })
  })

  describe('#getMontyHeaderDeviceType', () => {
    it('returns mobile device type', () => {
      expect(getMontyHeaderDeviceType('mobile')).toBe(deviceTypes.mobileWcs)
    })
    it('returns apps device type', () => {
      expect(getMontyHeaderDeviceType('apps')).toBe(deviceTypes.apps)
    })
    it('returns desktop device type', () => {
      expect(getMontyHeaderDeviceType('desktop')).toBe(deviceTypes.desktop)
    })
    it('returns tablet device type', () => {
      expect(getMontyHeaderDeviceType('tablet')).toBe(deviceTypes.tablet)
    })
    it('returns desktop device type as fallback device type if argument device type is not recognised', () => {
      expect(getMontyHeaderDeviceType('smarttv')).toBe(deviceTypes.desktop)
    })
    it('returns mobile device type for falsy arguments', () => {
      expect(getMontyHeaderDeviceType('')).toBe(deviceTypes.mobileWcs)
      expect(getMontyHeaderDeviceType(0)).toBe(deviceTypes.mobileWcs)
      expect(getMontyHeaderDeviceType(null)).toBe(deviceTypes.mobileWcs)
      expect(getMontyHeaderDeviceType(undefined)).toBe(deviceTypes.mobileWcs)
    })
  })
  describe('removeExpiredCookies', () => {
    it('should remove cookies with value set to DEL', () => {
      const cookies = [
        'WC_SESSION_ESTABLISHED=true; Path=/',
        'qubit_platform=WCS; expires=Fri, 29-Oct-28 13:45:12 GMT; path=/; secure',
        'cartSize=""; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/',
        'WC_AUTHENTICATION_4802005=DEL; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/; Secure',
        'WC_USERACTIVITY_4802005=DEL; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/',
        'WC_PERSISTENT=19z3DQivnETt4gP8uQ3ZEta0ZF0%3D%0A%3B2019-12-09+15%3A10%3A39.271_1568276575801-519_12556; Expires=Wed, 08-Jan-29 15:10:38 GMT; Path=/',
        'tempUser=N; Expires=Thu, 19-Dec-19 15:10:38 GMT; Path=/',
        'userCountry=United%20Kingdom; Path=/',
        'prefShipCtry=United%20Kingdom; Path=/',
      ]
      const expectedCookies = [
        'WC_SESSION_ESTABLISHED=true; Path=/',
        'qubit_platform=WCS; expires=Fri, 29-Oct-28 13:45:12 GMT; path=/; secure',
        'cartSize=""; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/',
        'WC_PERSISTENT=19z3DQivnETt4gP8uQ3ZEta0ZF0%3D%0A%3B2019-12-09+15%3A10%3A39.271_1568276575801-519_12556; Expires=Wed, 08-Jan-29 15:10:38 GMT; Path=/',
        'tempUser=N; Expires=Thu, 19-Dec-19 15:10:38 GMT; Path=/',
        'userCountry=United%20Kingdom; Path=/',
        'prefShipCtry=United%20Kingdom; Path=/',
      ]

      const result = removeExpiredCookies(cookies)
      expect(result).toEqual(expectedCookies)
    })
  })
  describe('mergeWcsCookies', () => {
    it('should remove cookies that have value of DEL, and new cookie values should update old cookies', () => {
      // Mock date set to "Sat, 21 Oct 2028 13:14:55 GMT"
      const oldCookies = [
        'WC_SESSION_ESTABLISHED=true; Path=/', // unchanged
        'qubit_platform=WCS; expires=Fri, 29-Oct-20 13:45:12 GMT; path=/; secure', // expired
        'cartSize=""; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/', // expired
        'WC_AUTHENTICATION_4802005=test; Path=/; Secure', // delete
        'WC_USERACTIVITY_4802005=value; Path=/', // delete
        'WC_PERSISTENT=oldvalue; Expires=Wed, 08-Jan-29 15:10:38 GMT; Path=/', // changes
        'tempUser=N; Expires=Thu, 19-Dec-28 15:10:38 GMT; Path=/', // unchanged
        'userCountry=United%20Kingdom; Path=/', // unchanged
        'prefShipCtry=United%20Kingdom; Path=/', // unchanged
      ]
      const newCookies = [
        'WC_SESSION_ESTABLISHED=true; Path=/', // unchanged
        'WC_AUTHENTICATION_4802005=DEL; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/; Secure', // delete
        'WC_USERACTIVITY_4802005=DEL; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/', // delete
        'WC_PERSISTENT=updatedvalue; Expires=Wed, 08-Jan-29 15:10:38 GMT; Path=/', // change value
        'new=cookie', // new
      ]
      const expected = [
        'qubit_platform=WCS; expires=Fri, 29-Oct-20 13:45:12 GMT; path=/; secure', // expired
        'cartSize=""; Expires=Thu, 01-Dec-94 16:00:00 GMT; Path=/', // expired
        'tempUser=N; Expires=Thu, 19-Dec-28 15:10:38 GMT; Path=/', // unchanged
        'userCountry=United%20Kingdom; Path=/', // unchanged
        'prefShipCtry=United%20Kingdom; Path=/', // unchanged
        // new and updated cookies
        'WC_SESSION_ESTABLISHED=true; Path=/', // unchanged
        'WC_PERSISTENT=updatedvalue; Expires=Wed, 08-Jan-29 15:10:38 GMT; Path=/', // changes
        'new=cookie', // new
      ]
      const result = mergeWcsCookies(newCookies, oldCookies)
      expect(result).toEqual(expected)
    })
  })
})
