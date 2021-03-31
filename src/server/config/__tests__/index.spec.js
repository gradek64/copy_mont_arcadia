import { uniq } from 'ramda'
import nock from 'nock'
import {
  getSiteConfigs,
  getBrandConfig,
  buildConfigs,
  getSiteConfigByPreferredISO,
  getConfigByStoreCode,
  getWCSDomainFromConfig,
  getSiteConfig,
  getAllBrandHostnames,
  getBrandHostnames,
  getBrandThirdPartySiteUrls,
  isMDotDomain,
  getEnvDomainsFromConfig,
  extractHostName,
  extractBrandCodeFromHeader,
  resetConfigsForTesting,
  getTrustArcDomain,
  filterConfigsByBrandName,
  getFirstNonMobileDomain,
  createHrefLangs,
  filterHrefLangOptions,
  constructHrefLangOptions,
  getLangAndDomainsByBrandName,
  getBrandThirdPartySiteConfigs,
} from '../'
import * as apiUtils from '../../api/utils'
import topshop from '../brands/topshop'
import burton from '../brands/burton'
import dp from '../brands/dorothy-perkins'
import ev from '../brands/evans'
import paymentSchema from '../../../shared/constants/paymentSchema'
import customerDetailsSchema from '../../../shared/constants/customerDetailsSchema'
import checkoutAddressFormRules from '../../../shared/constants/checkoutAddressFormRules'
import qasCountries from '../../../shared/constants/qasCountries'

jest.spyOn(apiUtils, 'getDestinationHostFromStoreCode')

const fakeWCSConfigResponse = {
  siteConfigs: {
    12556: {
      deliveryISOs: ['GB', 'AQ'],
      trustArcDomain: 'topshop.com',
    },
    13052: {
      deliveryISOs: ['US'],
      trustArcDomain: 'topshop.com',
    },
    13056: {
      deliveryISOs: ['DE'],
      trustArcDomain: 'topshop.com',
    },
    13057: {
      deliveryISOs: ['FR'],
      trustArcDomain: 'topshop.com',
    },
    13058: {
      deliveryISOs: ['DE', 'FR', 'ES'],
      trustArcDomain: 'topshop.com',
    },
    12555: {
      deliveryISOs: ['DE', 'FR', 'ES'],
      trustArcDomain: 'topman.com',
    },
    12551: {
      deliveryISOs: ['DE', 'FR', 'ES'],
      trustArcDomain: 'burton.co.uk',
    },
    12553: {
      deliveryISOs: ['FR'],
      trustArcDomain: 'evans.co.uk',
    },
    12552: {
      deliveryISOs: ['DE'],
      trustArcDomain: 'dorothyperkins.com',
    },
    13065: {
      deliveryISOs: ['FR'],
      trustArcDomain: 'dorothyperkins.com',
    },
    13079: {
      deliveryISOs: ['SG'],
    },
  },
}
const fakeTSDeliveryCountries = [
  { iso: 'AQ', name: 'Antarctica' },
  { iso: 'FR', name: 'France' },
  { iso: 'DE', name: 'Germany' },
  { iso: 'SG', name: 'Singapore' },
  { iso: 'ES', name: 'Spain' },
  { iso: 'GB', name: 'United Kingdom' },
  { iso: 'US', name: 'United States' },
]

describe('buildConfigs', () => {
  beforeEach(() => {
    apiUtils.getDestinationHostFromStoreCode.mockImplementation(
      () => 'https://wcs.com'
    )
    process.env.FUNCTIONAL_TESTS = ''
  })

  afterEach(() => {
    jest.resetAllMocks()
    resetConfigsForTesting()
  })

  describe('siteConfigs: siteDeliveryISOs', () => {
    it('should set the appropriate deliveryISOs in each siteConfigs', async () => {
      const nockScope = nock('https://wcs.com')
        .get(
          '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
        )
        .reply(200, fakeWCSConfigResponse)
      await buildConfigs()

      const tsukConfig = getConfigByStoreCode('tsuk')
      expect(tsukConfig.siteDeliveryISOs).toEqual(['GB', 'AQ'])

      expect(nockScope.isDone()).toBe(true)
    })

    it('should be empty array if wcs does not return an entry for the given store', async () => {
      const nockScope = nock('https://wcs.com')
        .get(
          '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
        )
        .reply(200, fakeWCSConfigResponse)
      await buildConfigs()

      const tsukConfig = getConfigByStoreCode('msuk')
      expect(tsukConfig.siteDeliveryISOs).toEqual([])

      expect(nockScope.isDone()).toBe(true)
    })
  })

  describe('brandConfigs: brandDeliveryCountries', () => {
    it('should map deliveryISOs to their names, and concatenate, remove duplicates & sort all entries', async () => {
      expect(getBrandConfig('ts').deliveryCountries).toBeUndefined()

      const nockScope = nock('https://wcs.com')
        .get(
          '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
        )
        .reply(200, fakeWCSConfigResponse)
      await buildConfigs()

      expect(getBrandConfig('ts').deliveryCountries).toEqual(
        fakeTSDeliveryCountries
      )
      expect(nockScope.isDone()).toBe(true)
    })
  })

  it('should throw if the request to WCS is unsuccessful', () => {
    const nockScope = nock('https://wcs.com')
      .get(
        '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
      )
      .reply(401)
    expect.assertions(2)
    return buildConfigs().catch((e) => {
      expect(e).not.toBeUndefined()
      expect(nockScope.isDone()).toBe(true)
    })
  })
})

describe('getConfigByStoreCode', () => {
  beforeAll(async () => {
    apiUtils.getDestinationHostFromStoreCode.mockImplementation(
      () => 'https://wcs.com'
    )
    nock('https://wcs.com')
      .get(
        '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
      )
      .reply(200, fakeWCSConfigResponse)
    await buildConfigs()
  })
  afterAll(resetConfigsForTesting)

  it('should return the config object for the given store code', () => {
    const hardCodedTSUKConfig = topshop.find(
      (siteConfig) => siteConfig.storeCode === 'tsuk'
    )
    const expectedTSUKDeliveryISOs = ['GB', 'AQ']
    expect(getConfigByStoreCode('tsuk')).toEqual(
      expect.objectContaining({
        ...hardCodedTSUKConfig,
        siteDeliveryISOs: expectedTSUKDeliveryISOs,
      })
    )
  })

  it('should append default properties', () => {
    const defaultProperties = {
      paymentSchema,
      customerDetailsSchema,
      checkoutAddressFormRules,
      qasCountries,
      logoVersion: '19102018',
    }
    expect(getConfigByStoreCode('tsuk')).toEqual(
      expect.objectContaining(defaultProperties)
    )
  })

  it('should append the deliveryCountries property', () => {
    expect(getConfigByStoreCode('tsuk').deliveryCountries).toEqual(
      fakeTSDeliveryCountries
    )
  })
})

describe('getSiteConfig', () => {
  it('check that correct evans brand is matched for m.euro.evansfashion.com url.', () => {
    const site = getSiteConfig('m.euro.evansfashion.com')
    expect('Evans EU').toEqual(site.name)
  })
  it('check that correct evans brand is matched for www.evansfashion.com url.', () => {
    const site = getSiteConfig('www.evansfashion.com')
    expect('Evans UK').toEqual(site.name)
  })
  it('check that correct evans brand is matched for evansfashion.com url.', () => {
    const site = getSiteConfig('evansfashion.com')
    expect('Evans UK').toEqual(site.name)
  })
  it('check that default brand given is dp if no match.', () => {
    const site = getSiteConfig('www.example.com')
    expect('Dorothy Perkins UK').toEqual(site.name)
  })
  it('check if i receive the correct brand name for DP de', () => {
    const site = getSiteConfig('de.dorothyperkins.com')
    expect('Dorothy Perkins DE').toEqual(site.name)
  })
  it('check that develop url still works with perf-m-topman-com.digital.arcadiagroup.co.uk.', () => {
    const site = getSiteConfig('perf-m-topman-com.digital.arcadiagroup.co.uk')
    expect('Topman UK').toEqual(site.name)
  })
  it('check that production url still works with perf-m-topman-com.digital-prod.arcadiagroup.co.uk.', () => {
    const site = getSiteConfig(
      'perf-m-topman-com.digital-prod.arcadiagroup.co.uk'
    )
    expect('Topman UK').toEqual(site.name)
  })
  it('check that searching for develop environment that does not exist still returns dp.', () => {
    const site = getSiteConfig('perf-m-example-com.digital.arcadiagroup.co.uk')
    expect('Dorothy Perkins UK').toEqual(site.name)
  })
  it('check that Akamai environments for perf topshop still returns topman.', () => {
    const site = getSiteConfig('perf.m.topman.com')
    expect('Topman UK').toEqual(site.name)
  })
  it('check that integration.m.euro.evansfashion.com returns the correct brand.', () => {
    const site = getSiteConfig('integration.m.euro.evansfashion.com')
    expect('Evans EU').toEqual(site.name)
  })
})

describe('getSiteConfigByPreferredISO', () => {
  ;[topshop, burton, dp, ev].forEach((brand) => {
    it(`gets the relevant brand config from the preferred ISO code provided (${brand[0].brandName})`, () => {
      const expected = brand[0]
      expected.trustArcDomain =
        fakeWCSConfigResponse.siteConfigs[expected.siteId].trustArcDomain

      const actual = getSiteConfigByPreferredISO('GB', brand[0].brandCode)
      expect(actual).toEqual(expected)
    })
  })
  ;[topshop, dp].forEach((brand) => {
    it(`gets the US brand config from the preferred ISO code provided (${brand[0].brandName})`, () => {
      const preferredISO = 'US'
      const expected = brand.find(({ preferredISOs }) =>
        preferredISOs.includes(preferredISO)
      )
      expected.trustArcDomain =
        fakeWCSConfigResponse.siteConfigs[expected.siteId].trustArcDomain
      const actual = getSiteConfigByPreferredISO(
        preferredISO,
        expected.brandCode
      )
      expect(actual).toEqual(expected)
    })
  })

  it('gets the default config for missing preferred ISO', () => {
    expect(getSiteConfigByPreferredISO('tv', 'ts')).toEqual(topshop[0])
    expect(getSiteConfigByPreferredISO('RUBBISH_ISO', 'ts')).toEqual(topshop[0])
  })

  it('invalid brand code returns null', () => {
    expect(getSiteConfigByPreferredISO('GB', 'FOO')).toEqual(null)
  })
})

describe('getWCSDomainFromConfig', () => {
  it('returns the WCS domain given a brand config object', () => {
    expect(getWCSDomainFromConfig(topshop[0])).toBe('www.topshop.com')
    expect(getWCSDomainFromConfig(burton[0])).toBe('www.burton.co.uk')
  })

  it('throws an error if not passed a config object', () => {
    ;[undefined, 1, [], new Map(), ''].forEach((arg) => {
      expect(() => getWCSDomainFromConfig(arg)).toThrow(
        'Expected a brand config object'
      )
    })
  })
})

describe('getAllBrandHostnames', () => {
  it('returns all hostnames for a given brand', () => {
    expect(getAllBrandHostnames('topshop', 'm.topshop.com')).toEqual([
      'm.topshop.com',
      'www.topshop.com',
      'm.us.topshop.com',
      'us.topshop.com',
      'm.de.topshop.com',
      'de.topshop.com',
      'm.fr.topshop.com',
      'fr.topshop.com',
      'm.eu.topshop.com',
      'eu.topshop.com',
    ])
  })

  it('returns all mobile hostnames for a given brand when visiting its mobile domain, with empty feature flags', () => {
    const enableGeoIPDesktopPixelRequest = {}
    expect(
      getAllBrandHostnames(
        'topshop',
        'm.topshop.com',
        enableGeoIPDesktopPixelRequest
      )
    ).toEqual([
      'm.topshop.com',
      'm.us.topshop.com',
      'm.de.topshop.com',
      'm.fr.topshop.com',
      'm.eu.topshop.com',
    ])
  })

  it('returns all mobile hostnames for a given brand when visiting its mobile domain, with feature flags irrelevent to the brand', () => {
    const enableGeoIPDesktopPixelRequest = { br: ['uk'] }
    expect(
      getAllBrandHostnames(
        'topshop',
        'm.topshop.com',
        enableGeoIPDesktopPixelRequest
      )
    ).toEqual([
      'm.topshop.com',
      'm.us.topshop.com',
      'm.de.topshop.com',
      'm.fr.topshop.com',
      'm.eu.topshop.com',
    ])
  })

  it('returns all mobile hostnames for a given brand, and all desktop domains for which GeoIP pixels are enabled for that brand, when visiting a desktop domain', () => {
    const enableGeoIPDesktopPixelRequest = { ts: ['uk', 'de', 'fr'] }
    expect(
      getAllBrandHostnames(
        'topshop',
        'www.topshop.com',
        enableGeoIPDesktopPixelRequest
      )
    ).toEqual([
      'm.topshop.com',
      'www.topshop.com',
      'm.us.topshop.com',
      'm.de.topshop.com',
      'de.topshop.com',
      'm.fr.topshop.com',
      'fr.topshop.com',
      'm.eu.topshop.com',
    ])
  })

  it('invalid brandName', () => {
    expect(() => getAllBrandHostnames()).toThrow(
      'Missing `brandName` parameter'
    )
    expect(() => getAllBrandHostnames('asos')).toThrow(
      'Invalid `brandName` given of asos'
    )
  })

  it('domain missing in configuration returns prod domains', () => {
    expect(getAllBrandHostnames('topshop', 'foobar.m.topshop.com')).toEqual([
      'm.topshop.com',
      'www.topshop.com',
      'm.us.topshop.com',
      'us.topshop.com',
      'm.de.topshop.com',
      'de.topshop.com',
      'm.fr.topshop.com',
      'fr.topshop.com',
      'm.eu.topshop.com',
      'eu.topshop.com',
    ])
  })

  it('returns prod DP domains', () => {
    expect(
      getAllBrandHostnames('dorothyperkins', 'foobar.m.dorothyperkins.com')
    ).toEqual([
      'm.dorothyperkins.com',
      'www.dorothyperkins.com',
      'm.euro.dorothyperkins.com',
      'euro.dorothyperkins.com',
      'm.us.dorothyperkins.com',
      'us.dorothyperkins.com',
      'm.de.dorothyperkins.com',
      'de.dorothyperkins.com',
    ])
  })
})

describe('getBrandHostnames', () => {
  const configs = getSiteConfigs()
  const genBrandName = gen.oneOf(uniq(configs.map((conf) => conf.brandName)))
  const genBrandNameAndDomain = genBrandName.then((brandName) =>
    gen.object({
      brandName,
      domain: gen
        .oneOf(configs.filter((conf) => conf.brandName === brandName))
        .then((conf) => gen.oneOf(Object.values(conf.domains)))
        .then((envDomains) => gen.oneOf(envDomains)),
    })
  )

  check.it(
    'each have a hostname and defaultLanguage',
    genBrandNameAndDomain,
    ({ brandName, domain }) => {
      Object.values(getBrandHostnames(brandName, domain)).forEach(
        (langHostname) => {
          expect(langHostname.hostname).toMatch(/.+/)
          expect(langHostname.defaultLanguage).toMatch(/.+/)
        }
      )
    }
  )

  check.it(
    'supported languages only',
    genBrandNameAndDomain,
    ({ brandName, domain }) => {
      Object.values(getBrandHostnames(brandName, domain)).forEach(
        (langHostname) => {
          expect(langHostname.defaultLanguage).toBeInArray([
            'English',
            'German',
            'French',
          ])
        }
      )
    }
  )

  check.it('must have UK', genBrandNameAndDomain, ({ brandName, domain }) => {
    const langHostnames = getBrandHostnames(brandName, domain)
    expect(langHostnames['United Kingdom']).toBeInstanceOf(Object)
  })

  check.it(
    'unique country keys',
    genBrandNameAndDomain,
    ({ brandName, domain }) => {
      const countries = Object.keys(getBrandHostnames(brandName, domain))
      expect(uniq(countries)).toEqual(countries)
    }
  )

  check.it(
    'has default property where English is the defaultLanguage',
    genBrandNameAndDomain,
    ({ brandName, domain }) => {
      const langHostnames = getBrandHostnames(brandName, domain)
      expect(langHostnames.default).toBeInstanceOf(Object)
      expect(langHostnames.default.defaultLanguage).toBe('English')
    }
  )

  check.it(
    'had nonEU property where English is the defaultLanguage',
    genBrandNameAndDomain,
    ({ brandName, domain }) => {
      const langHostnames = getBrandHostnames(brandName, domain)
      expect(langHostnames.nonEU).toBeInstanceOf(Object)
      expect(langHostnames.nonEU.defaultLanguage).toBe('English')
    }
  )

  const genBrandNameAndMobileDomain = genBrandName.then((brandName) =>
    gen.object({
      brandName,
      domain: gen
        .oneOf(configs.filter((conf) => conf.brandName === brandName))
        .then((conf) =>
          conf.domains.prod.find((domain) => isMDotDomain(domain))
        ),
    })
  )
  check.it(
    'matches m.* domains',
    genBrandNameAndMobileDomain,
    ({ brandName, domain }) => {
      Object.values(getBrandHostnames(brandName, domain)).forEach(
        (langHostname) => {
          expect(isMDotDomain(langHostname.hostname)).toBe(true)
        }
      )
    }
  )

  const genBrandNameAndDesktopDomain = genBrandName.then((brandName) =>
    gen.object({
      brandName,
      domain: gen
        .oneOf(configs.filter((conf) => conf.brandName === brandName))
        .then((conf) =>
          conf.domains.prod.find((domain) => !isMDotDomain(domain))
        ),
    })
  )
  check.it(
    'matches non m.* domains',
    genBrandNameAndDesktopDomain,
    ({ brandName, domain }) => {
      Object.values(getBrandHostnames(brandName, domain)).forEach(
        (langHostname) => {
          expect(isMDotDomain(langHostname.hostname)).toBe(false)
        }
      )
    }
  )

  const genBrandNameAndMobileAkamaiDevDomain = genBrandName.then((brandName) =>
    gen.object({
      brandName,
      domain: gen
        .oneOf(configs.filter((conf) => conf.brandName === brandName))
        .then(
          (conf) =>
            `stage.${conf.domains.prod.find((domain) => isMDotDomain(domain))}`
        ),
    })
  )
  check.it(
    'produces prod mobile hostnames for local and mobile akamai dev domains',
    genBrandNameAndMobileAkamaiDevDomain,
    ({ brandName, domain }) => {
      Object.values(getBrandHostnames(brandName, domain)).forEach(
        (langHostname) => {
          expect(langHostname.hostname).toMatch(/^m\./)
        }
      )
    }
  )

  const genBrandNameAndMobileAWSDomain = genBrandName.then((brandName) =>
    gen.object({
      brandName,
      domain: gen
        .oneOf(configs.filter((conf) => conf.brandName === brandName))
        .then(
          (conf) =>
            `${conf.domains.prod
              .find((domain) => isMDotDomain(domain))
              .replace(/\./g, '-')}.arcadiagroup.co.uk`
        ),
    })
  )
  check.it(
    'produces prod mobile hostnames for mobile aws dev domains',
    genBrandNameAndMobileAWSDomain,
    ({ brandName, domain }) => {
      Object.values(getBrandHostnames(brandName, domain)).forEach(
        (langHostname) => {
          expect(langHostname.hostname).toMatch(/^m\./)
        }
      )
    }
  )
})

describe('getBrandThirdPartySiteConfigs', () => {
  describe('A given brand has third party domain/s', () => {
    it('should return a collection of domain related object', () => {
      const brand = 'topshop'
      const output = [
        {
          name: 'Topshop SG',
          siteId: 13079,
          brandName: 'topshop',
          brandCode: 'ts',
          country: 'Singapore',
          url: 'sg.topshop.com',
          siteDeliveryISOs: ['SG'],
        },
        {
          name: 'Topshop MY',
          siteId: 13088,
          brandName: 'topshop',
          brandCode: 'ts',
          country: 'Malaysia',
          url: 'my.topshop.com',
          siteDeliveryISOs: [],
        },
      ]

      expect(getBrandThirdPartySiteConfigs(brand)).toEqual(output)
    })
  })

  describe('A given brand does not have third party domain/s', () => {
    it('should return an empty array ', () => {
      const brand = 'dorothyperkins'
      const output = []

      expect(getBrandThirdPartySiteConfigs(brand)).toEqual(output)
    })
  })
})

describe('getBrandThirdPartySiteUrls', () => {
  describe('A given brand has third party domain/s', () => {
    it('should return a lookup table', () => {
      const brand = 'topshop'
      const output = { Singapore: 'sg.topshop.com', Malaysia: 'my.topshop.com' }
      expect(getBrandThirdPartySiteUrls(brand)).toEqual(output)
    })
  })

  describe('A given brand does not have third party domain/s', () => {
    it('should return an empty object', () => {
      const brand = 'dorothyperkins'
      const output = {}
      expect(getBrandThirdPartySiteUrls(brand)).toEqual(output)
    })
  })
})

describe('getEnvDomainsFromConfig', () => {
  const config = topshop[0]
  const domain = 'm.topshop.com'
  it("gets the domains relating to a particular domain's environment", () => {
    expect(getEnvDomainsFromConfig(config, domain)).toEqual([
      'm.topshop.com',
      'www.topshop.com',
    ])
  })

  it('throws for missing args', () => {
    const config = topshop[0]
    expect(() => getEnvDomainsFromConfig()).toThrow('Invalid config: undefined')
    expect(() => getEnvDomainsFromConfig(config)).toThrow(
      'Invalid domain: undefined'
    )
  })

  it('returns prod domains for unconfigured domain', () => {
    expect(getEnvDomainsFromConfig(config, 'foobar.m.topshop.com')).toEqual([
      'm.topshop.com',
      'www.topshop.com',
    ])
  })
})

describe('extractHostName', () => {
  it('should not throw when host is undefined', () => {
    expect(() => extractHostName()).not.toThrow()
  })

  it('should return undefined when no hostname can be extracted', () => {
    const testHostName = 'malformed/host/name'
    expect(extractHostName(testHostName)).toBeUndefined()
  })

  it('should return a hostname when host is well formed with no port number', () => {
    const testHostName = 'wellformed.host.example.com'
    expect(extractHostName(testHostName)).toBe(testHostName)
  })

  it('should return a hostname when host is well formed with a port number', () => {
    const testHostName = 'wellformed.host.example.com'
    const testHost = `${testHostName}:30001`
    expect(extractHostName(testHost)).toBe(testHostName)
  })
})

describe('extractBrandCodeFromHeader', () => {
  it('should not throw when header is undefined', () => {
    expect(() => extractBrandCodeFromHeader()).not.toThrow()
  })

  it('should return undefined when no brand code can be extracted', () => {
    const unknownBrand = 'qpuk'
    expect(extractBrandCodeFromHeader(unknownBrand)).toBeUndefined()
  })

  it("should return 'ts' for Topshop", () => {
    const header = 'tsuk'
    expect(extractBrandCodeFromHeader(header)).toBe('ts')
  })

  it("should return 'tm' for Topman", () => {
    const header = 'tmus'
    expect(extractBrandCodeFromHeader(header)).toBe('tm')
  })

  it("should return 'ev' for Evans", () => {
    const header = 'eveu'
    expect(extractBrandCodeFromHeader(header)).toBe('ev')
  })

  it("should return 'br' for Burton", () => {
    const header = 'brde'
    expect(extractBrandCodeFromHeader(header)).toBe('br')
  })

  it("should return 'wl' for Wallis", () => {
    const header = 'wlus'
    expect(extractBrandCodeFromHeader(header)).toBe('wl')
  })

  it("should return 'dp' for Dorothy Perkins", () => {
    const header = 'dpde'
    expect(extractBrandCodeFromHeader(header)).toBe('dp')
  })

  it("should return 'ms' for Miss Selfridge", () => {
    const header = 'mseu'
    expect(extractBrandCodeFromHeader(header)).toBe('ms')
  })
})

describe('getTrustArcDomain', () => {
  describe('when passing `tsuk` as storeCode', () => {
    it('should return `topshop.com`', () => {
      expect(getTrustArcDomain('tsuk')).toBe('topshop.com')
    })
  })

  describe('when passing `tmuk` as storeCode', () => {
    it('should return `topman.com`', () => {
      expect(getTrustArcDomain('tmuk')).toBe('topman.com')
    })
  })

  describe('when passing a storeCode that does not exist', () => {
    it('should return `undefined`', () => {
      expect(getTrustArcDomain('dfdfdfd')).toBeUndefined()
    })
  })
})

describe('filterConfigsByBrandName()', () => {
  const mockConfigs = [
    {
      brandName: 'dorothyperkins',
    },
    {
      brandName: 'topshop',
    },
    {
      brandName: 'topman',
    },
    {
      brandName: 'dorothyperkins',
    },
  ]

  it('should return all configs that match the given brandName', () => {
    const filteredConfigs = filterConfigsByBrandName(
      'dorothyperkins',
      mockConfigs
    )
    expect(filteredConfigs.length).toEqual(2)
    expect(filteredConfigs[0].brandName).toEqual('dorothyperkins')
    expect(filteredConfigs[1].brandName).toEqual('dorothyperkins')
  })
})

describe('getFirstNonMobileDomain', () => {
  describe('valid domain name is present', () => {
    it('returns first value if no mobile domain present', () => {
      const domains = ['www.topshop.com', 'topshop.com']
      const domain = getFirstNonMobileDomain(domains)
      expect(domain).toEqual(`https://${domains[0]}`)
    })
    it('returns first non-mobile domain if mobile-domains present', () => {
      const domains = ['m.dorothyperkins.com', 'www.dorothyperkins.com']
      const domain = getFirstNonMobileDomain(domains)
      expect(domain).toEqual(`https://${domains[1]}`)
    })
  })

  describe('invalid parameteres', () => {
    it('should return empty string when domains param is undefined', () => {
      const domain = getFirstNonMobileDomain()
      expect(domain).toEqual('')
    })

    it('should return an empty string if empty array provided', () => {
      const domain = getFirstNonMobileDomain([])
      expect(domain).toEqual('')
    })

    it('should return empty string if no non-mobile domain found', () => {
      const domain = getFirstNonMobileDomain(['m.dorothyperkins.com'])
      expect(domain).toEqual('')
    })
  })
})

describe('createHrefLangs()', () => {
  it('should correctly merge preferredISOs with passed language', () => {
    const lang = 'en'
    const preferredISOs = ['AD', 'FR', 'MC', 'BE']
    const mergedLangIsos = ['en-ad', 'en-fr', 'en-mc', 'en-be']
    const result = createHrefLangs(lang, preferredISOs)
    expect(result).toEqual(mergedLangIsos)
  })
  it("defaults to lang of 'en' if undefined", () => {
    const lang = undefined
    const preferredISOs = ['tt', 'aa', 'bb']
    const mergedLangIsos = ['en-tt', 'en-aa', 'en-bb']
    const result = createHrefLangs(lang, preferredISOs)
    expect(result).toEqual(mergedLangIsos)
  })

  it('returns empty array if preferredISOs is undefined', () => {
    const result = createHrefLangs()
    expect(result).toEqual([])
  })
})

const expectedTopshopHrefLangOptions = [
  {
    href: 'https://www.topshop.com',
    hreflang: 'en-gb',
  },
  {
    href: 'https://us.topshop.com',
    hreflang: 'en-us',
  },
  {
    href: 'https://de.topshop.com',
    hreflang: 'de-de',
  },
  {
    href: 'https://de.topshop.com',
    hreflang: 'de-li',
  },
  {
    href: 'https://de.topshop.com',
    hreflang: 'de-at',
  },
  {
    href: 'https://fr.topshop.com',
    hreflang: 'fr-fr',
  },
  {
    href: 'https://fr.topshop.com',
    hreflang: 'fr-mc',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-ad',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-be',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-ee',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-fi',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-ie',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-gr',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-va',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-it',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-lu',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-lv',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-me',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-nl',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-pt',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-sm',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-sk',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-es',
  },
  {
    href: 'https://eu.topshop.com',
    hreflang: 'en-ch',
  },
]

const expectedDPHrefLangOptions = [
  {
    href: 'https://www.dorothyperkins.com',
    hreflang: 'en-gb',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-ad',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-fr',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-mc',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-be',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-ee',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-fi',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-ie',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-gr',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-va',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-it',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-lu',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-lv',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-me',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-nl',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-pt',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-sm',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-sk',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-es',
  },
  {
    href: 'https://euro.dorothyperkins.com',
    hreflang: 'en-ch',
  },
  {
    href: 'https://us.dorothyperkins.com',
    hreflang: 'en-us',
  },
  {
    href: 'https://de.dorothyperkins.com',
    hreflang: 'de-de',
  },
  {
    href: 'https://de.dorothyperkins.com',
    hreflang: 'de-li',
  },
  {
    href: 'https://de.dorothyperkins.com',
    hreflang: 'de-at',
  },
]

describe('constructHrefLangOptions()', () => {
  it('should return flat array of HrefLangOptions', () => {
    const topshopConfigs = [...topshop]
    const generatedHrefLangs = constructHrefLangOptions(topshopConfigs)
    expect(generatedHrefLangs).toEqual(expectedTopshopHrefLangOptions)
  })

  it('should return empty array if no valid href found', () => {
    const mockConfigs = [{}, {}]
    const generatedHrefLangs = constructHrefLangOptions(mockConfigs)
    expect(generatedHrefLangs).toEqual([])
  })

  it('should handle config with missing domains entry', () => {
    const mockConfigs = [
      {
        domains: {
          prod: ['test.domain'],
        },
        preferredISOs: ['GB'],
      },
      {},
    ]
    const generatedHrefLangs = constructHrefLangOptions(mockConfigs)
    expect(generatedHrefLangs).toEqual([
      {
        href: 'https://test.domain',
        hreflang: 'en-gb',
      },
    ])
  })
})

describe('filterOptions', () => {
  describe('malformed input', () => {
    it('should return empty array if options parameter is undefined', () => {
      const result = filterHrefLangOptions()
      expect(result).toEqual([])
    })
    it('should return empty array if non array passed as options parameter', () => {
      const result = filterHrefLangOptions('naughty')
      expect(result).toEqual([])
    })
    it("should ignore input options that don't contain href properties", () => {
      const options = [
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-fr',
        },
        {
          hreflang: 'en-de',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'string.em.up',
          hreflang: 'en-de',
        },
      ]
      const expected = [
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-fr',
        },
        {
          href: 'string.em.up',
          hreflang: 'en-de',
        },
      ]
      const result = filterHrefLangOptions(options)
      expect(result).toEqual(expected)
    })
    it("should ignore input options that don't contain hreflang properties", () => {
      const options = [
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-fr',
        },
        {
          href: 'test.em.up',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'string.em.up',
          hreflang: 'en-de',
        },
      ]
      const expected = [
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-fr',
        },
        {
          href: 'string.em.up',
          hreflang: 'en-de',
        },
      ]
      const result = filterHrefLangOptions(options)
      expect(result).toEqual(expected)
    })
  })
  describe('proper input', () => {
    it('should filter options where the href and hreflangs are duplicated across different entries in the array', () => {
      const options = [
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-fr',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-de',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'string.em.up',
          hreflang: 'en-de',
        },
      ]
      const expected = [
        {
          href: 'test.em.up',
          hreflang: 'en-gb',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-fr',
        },
        {
          href: 'test.em.up',
          hreflang: 'en-de',
        },
        {
          href: 'string.em.up',
          hreflang: 'en-de',
        },
      ]
      const result = filterHrefLangOptions(options)
      expect(result).toEqual(expected)
    })
  })
})

describe('getLangAndDomainsByBrandName()', () => {
  it('should extract correct brand configs and return array of HrefLangOptions', () => {
    const dpHrefs = getLangAndDomainsByBrandName('dorothyperkins')
    expect(dpHrefs).toEqual(expectedDPHrefLangOptions)
  })
})
