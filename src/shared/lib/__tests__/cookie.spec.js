import {
  getTraceIdFromCookie,
  extractCookie,
  getDRETValue,
  addToCookiesString,
  getCookieValue,
  parseCookieString,
} from '../cookie'

describe('getCookieValue', () => {
  const cookies =
    'productIsActive=false; WC_pickUpStore=TS0001; WC_physicalStores=TS0001; userId=4038970; dual-run=MDirect; __utma=102700036.1604311270.1529404813.1534248026.1536056188.4; __utmz=102700036.1536056188.4.2.utmcsr=local.m.topshop.com:8080|utmccn=(referral)|utmcmd=referral|utmcct=/en/tsuk/category/clothing-427/suits-co-ords-4062329; s_nr=1536314986294-Repeat; s_lv=1536314986296;'

  it('returns the value of a specified cookie key', () => {
    expect(getCookieValue(cookies, 'WC_pickUpStore')).toBe('TS0001')
    expect(getCookieValue(cookies, 'dual-run')).toBe('MDirect')
  })

  it('returns the value of a specified cookie key that includes an `=`', () => {
    expect(
      getCookieValue(cookies, '__utmz=102700036.1536056188.4.2.utmcsr')
    ).toBe(
      'local.m.topshop.com:8080|utmccn=(referral)|utmcmd=referral|utmcct=/en/tsuk/category/clothing-427/suits-co-ords-4062329'
    )
  })

  it('returns undefined if a cookie cannot be found', () => {
    expect(getCookieValue(cookies, 'iDontExist')).toBe(undefined)
  })
})

describe('getTraceIdFromCookie', () => {
  it('Handle not defined cookies', () => {
    expect(getTraceIdFromCookie()).toEqual(undefined)
  })

  it('Handle cookies with no traceId', () => {
    expect(getTraceIdFromCookie('abc=def;123=456')).toEqual(undefined)
  })

  it('Handle cookies with traceId', () => {
    expect(getTraceIdFromCookie('abc=def;123=456;traceId=V2')).toEqual(
      undefined
    )
  })

  it('Handle cookies with traceId2', () => {
    expect(getTraceIdFromCookie('abc=def;123=456;traceId2=foo')).toEqual('foo')
  })
})
describe('#extractCookie', () => {
  describe('invalid arguments', () => {
    it('returns null if no arguments provided', () => {
      expect(extractCookie()).toBe(null)
    })
    it('returns null if "cookie" is not an array', () => {
      expect(extractCookie('cookieName', 'abc')).toBe(null)
    })
    it('returns null if "cookie" is an empty array', () => {
      expect(extractCookie('cookieName', [])).toBe(null)
    })
    it('returns null if "cookies" does not contain the cookie we are looking for', () => {
      expect(extractCookie('cookieName', ['cookieA=a', 'cookieB=b'])).toBe(null)
    })
    it('returns the value of the cookie searched', () => {
      expect(extractCookie('cookieName', ['cookieName=cookieValue'])).toBe(
        'cookieValue'
      )
      expect(
        extractCookie('cookieName', ['cookieA=a', 'cookieName=cookieValue'])
      ).toBe('cookieValue')
      expect(extractCookie('cookieName', ['cookieName=123'])).toBe('123')
      expect(
        extractCookie('paymentCallBackUrl', [
          'paymentCallBackUrl="https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0"; Expires=Fri, 26-Jan-18 12:33:51 GMT; Path=/',
        ])
      ).toEqual(
        'https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPay…n_id=774794&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0'
      )
    })
    it('handles correctly session key cookie', () => {
      const cookies = [
        'jsessionid=eyJhbGciOiJIUzI1NiJ9.ODg2Mjc1OTAtOGQ4My00Y2IxLTk3ZmMtNTk0MDA3ZGNiZDgz.HmbqhKj1tleBXzWDar2WPodBj8DhNELMGOSVwtPLLWI; Max-Age=1800; Expires=Mon, 26 Mar 2018 14:35:08 GMT; HttpOnly; Path=/',
        'source=CoreAPI; Path=/',
        'tempsession=true; Max-Age=1800; Expires=Mon, 26 Mar 2018 14:35:08 GMT; HttpOnly; Path=/',
      ]

      expect(extractCookie('jsessionid', cookies)).toBe(
        'eyJhbGciOiJIUzI1NiJ9.ODg2Mjc1OTAtOGQ4My00Y2IxLTk3ZmMtNTk0MDA3ZGNiZDgz.HmbqhKj1tleBXzWDar2WPodBj8DhNELMGOSVwtPLLWI'
      )
    })
  })
})

describe('getDRETValue', () => {
  it('should return undefined if called without params', () => {
    expect(getDRETValue()).toBe(undefined)
  })

  it('should return undefined if called without params', () => {
    expect(getDRETValue({ cookies: 'cookie=monster' })).toBe(undefined)
  })

  it("should return 'OLD' when 'akaas_DRET' is set to ScrAPI/CheckoutV1 group", () => {
    expect(
      getDRETValue({ cookies: 'cookie=monster;akaas_DRET=123764578723=OLD' })
    ).toBe('OLD')
  })

  it("should return 'NEW' when 'akaas_DRET' is set to CoreAPI/CheckoutV2 group", () => {
    expect(
      getDRETValue({ cookies: 'cookie=monster;akaas_DRET=123764578723=NEW' })
    ).toBe('NEW')
  })
})

describe('addToCookieString', () => {
  it('returns empty string in case of invalid arguments', () => {
    expect(addToCookiesString()).toEqual('')
  })
  it('returns the value of "cookie" if the "cookieString" is empty', () => {
    expect(addToCookiesString('abc=123', '')).toEqual('abc=123')
  })
  it('returns the value of "cookiesString" if the "cookie" is empty', () => {
    expect(addToCookiesString('', 'abc=123')).toEqual('abc=123')
  })
  it('concatenates the "cookie" value at the end of "cookiesString"', () => {
    expect(addToCookiesString('abc=123', 'def=456')).toEqual('def=456; abc=123')
  })
})

describe('parseCookieString', () => {
  const cookieStringFalseyValue =
    'bvToken=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/'
  const cookieStringTruthyValue =
    'bvToken=abc1234; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/'

  it('should parse null for falsey values', () => {
    const [, value] = parseCookieString(cookieStringFalseyValue)

    expect(value).toBe(null)
  })

  it('should parse the value if it is not falsey', () => {
    const [, value] = parseCookieString(cookieStringTruthyValue)

    expect(value).toBe('abc1234')
  })

  it('should parse the cookie options into an object', () => {
    const [, , options] = parseCookieString(cookieStringTruthyValue)

    const expected = {
      'Max-Age': 0,
      Expires: 0,
      HttpOnly: true,
      Path: '/',
    }

    expect(options).toEqual(expected)
  })

  it('should parse number options', () => {
    const cookie = 'bvToken=abc1234; Max-Age=1234;'
    const [, , options] = parseCookieString(cookie)

    expect(options['Max-Age']).toBe(1234)
  })

  it('should parse date options', () => {
    const cookie = 'bvToken=abc1234; Expires=Thu, 31 Oct 2028 00:00:00 GMT;'
    const [, , options] = parseCookieString(cookie)

    expect(options.Expires).toBe(1856563200000)
  })
})
