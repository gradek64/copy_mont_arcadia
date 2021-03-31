import {
  translate,
  mapCookies,
  extractCookieValue,
  extractEncodedHTMLText,
  getDestinationHostFromStoreCode,
  getWcUserActivityId,
  getCookieByNamePrefix,
  sessionsClash,
  getBodyOnWcsResponse,
} from '../utils'

jest.mock('../../lib/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

jest.mock(
  '../hostsConfig/store_host_map.json',
  () => ({
    prod: { tsuk: 'https://www.topshop.com' },
  }),
  { virtual: true }
)
jest.mock(
  '../hostsConfig/store_host_map_new.json',
  () => ({
    prod: { tsuk: 'https://ts-prd1live.prd.arcadiagroup.co.uk' },
  }),
  { virtual: true }
)

describe('api utils', () => {
  describe('#getDestinationHostFromStoreCode', () => {
    describe('Invalid arguments', () => {
      it('returns false in case of missing argument', () => {
        expect(getDestinationHostFromStoreCode()).toBe(false)
        expect(getDestinationHostFromStoreCode('', '')).toBe(false)
        expect(getDestinationHostFromStoreCode('tst1', '')).toBe(false)
        expect(getDestinationHostFromStoreCode('', 'tsuk')).toBe(false)
      })
      it('returns false in case of unexpected value for argument "environment"', () => {
        expect(getDestinationHostFromStoreCode('notExistingEnv', 'tsuk')).toBe(
          false
        )
      })
      it('returns false in case of unexpected value for argument "storeCode"', () => {
        expect(
          getDestinationHostFromStoreCode('tst1', 'notExistingStoreCode')
        ).toBe(false)
      })
    })
    describe('Valid arguments', () => {
      afterEach(() => {
        global.process.env.USE_NEW_STORE_HOST_MAP = undefined
      })
      it('returns expected hostname when using standard host map', () => {
        global.process.env.USE_NEW_STORE_HOST_MAP = undefined
        expect(getDestinationHostFromStoreCode('prod', 'tsuk')).toEqual(
          'https://www.topshop.com'
        )
      })
      it('returns expected hostname when using new host map', () => {
        global.process.env.USE_NEW_STORE_HOST_MAP = 'true'
        expect(getDestinationHostFromStoreCode('prod', 'tsuk')).toEqual(
          'https://ts-prd1live.prd.arcadiagroup.co.uk'
        )
      })
    })
  })
  describe('#mapCookies', () => {
    // invalid argument
    //
    it('returns empty array if no argument is provided', () => {
      expect(mapCookies()).toEqual([])
      expect(mapCookies(null)).toEqual([])
      expect(mapCookies(undefined)).toEqual([])
      expect(mapCookies('')).toEqual([])
    })
    it('returns empty array if argument is not a string', () => {
      expect(mapCookies(['abc'])).toEqual([])
      expect(mapCookies({ a: 'a' })).toEqual([])
    })

    // valid argument
    //
    it('should split a cookies string into an array', () => {
      expect(mapCookies('jsessionid=foo; bar=baz')).toEqual([
        'jsessionid=foo',
        'bar=baz',
      ])
    })
  })

  describe('#extractCookieValue', () => {
    describe('when passed a cookie and a cookie string containing that cookie value', () => {
      it('should return the value', () => {
        expect(
          extractCookieValue(
            'cookieIWant',
            'cookieIWant=hereItIs; iDoNotWantThis=one;'
          )
        ).toBe('hereItIs')
      })
    })

    describe('when the first argument is not supplied', () => {
      it('should return an empty string', () => {
        expect(extractCookieValue(null, 'foo=bar;')).toBe('')
      })
    })

    describe('when the cookies string argument is not supplied', () => {
      it('should return an empty string', () => {
        expect(extractCookieValue('foo')).toBe('')
      })
    })

    describe('when the cookies argument is string with no separators', () => {
      it('returns an empty string if there are no cookies', () => {
        expect(extractCookieValue('cookie', '')).toBe('')
      })
      it('returns empty string for a cookie like "abc=def"', () => {
        expect(extractCookieValue('cookie', 'abc=def')).toBe('')
      })
      it('returns a cookie value if the specified cookie is contained in the cookie string', () => {
        expect(
          extractCookieValue('iWantThisCookie', 'iWantThisCookie=abc')
        ).toBe('abc')
      })
    })

    describe('when the cookies argument is string with separators', () => {
      it('returns empty string if the cookies argument is "; "', () => {
        expect(extractCookieValue('iWantThisCookie', '; ')).toBe('')
      })
      it('returns empty string if the cookies argument is "; abc" or "abc; "', () => {
        expect(extractCookieValue('iWantThisCookie', 'abc; ')).toBe('')
        expect(extractCookieValue('iWantThisCookie', 'abc; ')).toBe('')
      })
      it('returns a cookie value if the cookies argument is "; abc=def" or "abc=def; "', () => {
        expect(
          extractCookieValue('iWantThisCookie', '; iWantThisCookie=abc')
        ).toBe('abc')
        expect(
          extractCookieValue('iWantThisCookie', 'iWantThisCookie=abc; ')
        ).toBe('abc')
      })
      it('returns a cookie value if the cookies argument is "foo=abc; def" or "def; foo=abc" or "def; foo=abc; ghi"', () => {
        expect(
          extractCookieValue('iWantThisCookie', 'iWantThisCookie=abc; def')
        ).toBe('abc')
        expect(
          extractCookieValue('iWantThisCookie', 'def; iWantThisCookie=abc')
        ).toBe('abc')
        expect(
          extractCookieValue('iWantThisCookie', 'def; iWantThisCookie=abc; ghi')
        ).toBe('abc')
      })
      it('returns the first cookie value if argument contains 2 instances of the desired cookie', () => {
        expect(
          extractCookieValue(
            'iWantThisCookie',
            'cookie=123; iWantThisCookie=abc; iWantThisCookie=def'
          )
        ).toBe('abc')
      })
    })
  })

  describe('#extractEncodedHTMLText', () => {
    it('should return an emtpy string if the HTML argument is not a string', () => {
      expect(extractEncodedHTMLText({})).toBe('')
    })

    it('should decode the encoded characters, and remove the HTML tags.', () => {
      expect(
        extractEncodedHTMLText(
          '%3Cdd+class%3D%22home_del+std_del%22%3EStandard+%28UK+up+to+4+working+days%3B+worldwide+varies%29'
        )
      ).toEqual('Standard (UK up to 4 working days; worldwide varies)')
    })
  })

  describe('#tranlsate', () => {
    describe('no arguments', () => {
      it('returns empty string', () => {
        expect(translate()).toEqual('')
      })
    })
    describe('no "eng" argument', () => {
      it('returns empty string', () => {
        expect(translate({ a: { de: 'b', fr: 'c' } }, '')).toEqual('')
      })
    })
    describe('no "lang" argument', () => {
      it('returns "eng" argument value', () => {
        expect(translate({ a: { de: 'b', fr: 'c' } }, '', 'abc')).toEqual('abc')
      })
    })
    describe('no "dictionary" argument', () => {
      it('returns "eng" argument value', () => {
        expect(translate({ a: { de: 'b', fr: 'c' } }, '', 'abc')).toEqual('abc')
      })
    })
    describe('proper arguments and translation available', () => {
      it('returns translation', () => {
        expect(translate({ a: { de: 'b', fr: 'c' } }, 'de', 'a')).toEqual('b')
        expect(translate({ a: { de: 'b', fr: 'c' } }, 'fr', 'a')).toEqual('c')
      })
    })
    describe('proper arguments and translation not available', () => {
      it('returns "eng" value', () => {
        expect(translate({ a: { de: 'b', fr: 'c' } }, 'de', 'abc')).toEqual(
          'abc'
        )
      })
    })
  })
  describe('#getWcUserActivityId', () => {
    it('returns false for empty or malformed WCS_USERACTIVITY_{ID} argument', () => {
      expect(getWcUserActivityId()).toBe(false)
      expect(getWcUserActivityId(123)).toBe(false)
      expect(getWcUserActivityId('WC_USERACTIVITY')).toBe(false)
      expect(getWcUserActivityId('abcWC_USERACTIVITY_')).toBe(false)
      expect(getWcUserActivityId('WC_USERACTIVITY_123')).toBe(false)
    })
    it('returns the ID', () => {
      expect(getWcUserActivityId('WC_USERACTIVITY_123=')).toEqual('123')
      expect(
        getWcUserActivityId(
          'WC_USERACTIVITY_1571057=1571057%2C12556%2Cnull%2Cnull%2C1521556785967%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2CT0krdXI9QyVV7fdPwUts44TIvrS1DkIJGcuUCRbvieaKEOzXD18T9E%2BZxVbzsYCldoORH1GSFlxRydOpPknxhX%2FsrElCXmCTc9k6v0orbqg0dp38A6a%2BnZUf%2BR7N%2FM%2FzfIbRFGqsk%2FkbgUV4TGz%2BLdDILetjERJUnFQM8xJORYaFMXL96%2FyMU3ZFTEfB5mCuJ9MLsecnUQo0R7AEH0Ud3cx3HGy6Vt9Ucx16%2BEtwU%2Fc%3D'
        )
      ).toEqual('1571057')
    })
  })
  describe('#getCookieByNamePrefix', () => {
    it('returns false for invalid arguments', () => {
      expect(getCookieByNamePrefix()).toBe(false)
      expect(getCookieByNamePrefix(123)).toBe(false)
      expect(getCookieByNamePrefix(123, [])).toBe(false)
      expect(getCookieByNamePrefix('abc', 123)).toBe(false)
    })
    it('returns false if cookie not found', () => {
      expect(getCookieByNamePrefix('ABC', ['def'])).toBe(false)
      expect(getCookieByNamePrefix('ABC', ['defABC'])).toBe(false)
    })
    it('returns the cookie', () => {
      expect(getCookieByNamePrefix('ABC', ['ABCdef'])).toBe('ABCdef')
    })
  })
  describe('#sessionsClash', () => {
    it('returns false in case of no arguments', () => {
      expect(sessionsClash()).toBe(false)
    })
    it('returns false in case of empty cookies', () => {
      expect(sessionsClash([], [], '/abc')).toBe(false)
    })
    it('does not identify clash in case of clashing cookies and Logout/Login endpoint', () => {
      expect(
        sessionsClash(
          ['WC_USERACTIVITY_123=123', 'WC_AUTHENTICATION_123=123'],
          ['WC_USERACTIVITY_456=456', 'WC_AUTHENTICATION_456=456'],
          '/webapp/wcs/stores/servlet/NotUser'
        )
      ).toBe(false)

      expect(
        sessionsClash(
          ['WC_USERACTIVITY_123=123', 'WC_AUTHENTICATION_123=123'],
          ['WC_USERACTIVITY_456=456', 'WC_AUTHENTICATION_456=456'],
          '/webapp/wcs/stores/servlet/Logon'
        )
      ).toBe(false)
    })
    it('does not identify the clash for Generic User', () => {
      expect(
        sessionsClash(
          ['WC_USERACTIVITY_123=123'],
          ['WC_USERACTIVITY_456=456'],
          'abc'
        )
      ).toBe(false)
    })
    it('identifies the clash in case of clashing cookies and not Logout/Login endpoint', () => {
      expect(
        sessionsClash(
          ['WC_USERACTIVITY_123=123', 'WC_AUTHENTICATION_123=123'],
          ['WC_USERACTIVITY_456=123', 'WC_AUTHENTICATION_456=456'],
          '/abc'
        )
      ).toBe(true)
    })
  })

  describe('getBodyOnWcsResponse', () => {
    const cases = [
      [
        {
          body: { a: 1 },
        },
        { a: 1 },
      ],
      [
        {
          body: {},
          text: '{"b":1}',
        },
        { b: 1 },
      ],
      [
        {
          body: '{notParsed:true}',
          text: '{"c":1}',
        },
        { c: 1 },
      ],
      [
        {
          body: { parsed: true },
          text: '{"c":1}',
        },
        { parsed: true },
      ],
    ]

    test.each(cases)('given %p , returns %p', (response, expectedResult) => {
      const result = getBodyOnWcsResponse(response)
      expect(result).toEqual(expectedResult)
    })
  })
})
