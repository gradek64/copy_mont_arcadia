import { sampleOne } from 'testcheck'

import * as geoIPUtils from '../geo-ip-utils'
import topshop from '../../../server/config/brands/topshop'
import topman from '../../../server/config/brands/topman'
import wallis from '../../../server/config/brands/wallis'
import burton from '../../../server/config/brands/burton'
import dorothyPerkins from '../../../server/config/brands/dorothy-perkins'
import evans from '../../../server/config/brands/evans'
import missSelfidge from '../../../server/config/brands/miss-selfridge'
import { ALL_FEATURES } from '../../constants/features'
import {
  getSiteConfigByPreferredISO,
  getEnvDomainsFromConfig,
} from '../../../server/config'

const { FEATURE_GEOIP } = ALL_FEATURES

describe('GeoIPUtils', () => {
  describe('getUserISOPreference', () => {
    it('returns the geoISO` if both values are provided', () => {
      expect(geoIPUtils.getUserISOPreference('US', 'GB')).toBe('US')
    })
    it('returns the geoISO if only geoISO is provided', () => {
      expect(geoIPUtils.getUserISOPreference('ZA', undefined)).toBe('ZA')
    })
  })

  describe('getURLPath', () => {
    const testData = [
      ['http://m.us.lel.lol.topshop.com/i/am/a/path', '/i/am/a/path'],
      ['m.us.lel.lol.topshop.com/i/am/a/path', '/i/am/a/path'],
      [
        'm.us.lel.lol.topshop.com/i/am/a/path#hashstringappeared',
        '/i/am/a/path#hashstringappeared',
      ],
      [
        'm.us.lel.lol.topshop.com/i/am/a/path?query=string&key=value',
        '/i/am/a/path?query=string&key=value',
      ],
      ['m.us.lel.lol.topshop.co.uk/i/am/a/path', '/i/am/a/path'],
      ['topshop.com', '/'],
      ['https://us.subdomain.topshop.com', '/'],
      ['https://philip.es', '/'],
      ['topshop.co.uk', '/'],
      ['topshop.london', '/'],
      ['smellyurl', false],
      ['localhost:8080', false],
    ]
    it.each(testData)('when given %s returns the url %s', (url, result) => {
      expect(geoIPUtils.getURLPath(url)).toBe(result)
    })
  })

  describe('getPDPURLPath', () => {
    const testData = [
      [
        'https://fr.topshop.com/fr/tsfr/produit/sacs-et-accessoires-1702233/%C3%A9charpe-l%C3%A9g%C3%A8re-rose-%C3%A0-carreaux-10128222',
        '/fr/tsfr/produit/sacs-et-accessoires-1702233/%C3%A9charpe-l%C3%A9g%C3%A8re-rose-%C3%A0-carreaux-10128222',
      ],
      [
        'https://www.topshop.com/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
      ],
      [
        'www.topshop.com/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
      ],
      [
        'www.topshop.com/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965#hashstringappeared',
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965#hashstringappeared',
      ],
      [
        'www.topshop.com/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965?query=string&key=value',
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965?query=string&key=value',
      ],
      [
        'm.us.lel.lol.topshop.com/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
      ],
      [
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
        '/en/tsuk/product/jeans-6877054/black-bootcut-jeans-10115965',
      ],
    ]

    it.each(testData)('when given %s returns the url %s', (url, result) => {
      expect(geoIPUtils.getPDPURLPath(url)).toBe(result)
    })
  })

  describe('appendGTMParams()', () => {
    it('returns default url if no search arg was passed', () => {
      expect(
        geoIPUtils.appendGTMParams(
          'http://www.topshop.com/blouse/?param1=456783'
        )
      ).toEqual('http://www.topshop.com/blouse/?param1=456783')
    })
    it('returns url with gtm params appended at the end', () => {
      expect(
        geoIPUtils.appendGTMParams(
          'http://www.topshop.com/blouse/?param1=456783',
          '?gh=hjf&utm=098765432'
        )
      ).toEqual('http://www.topshop.com/blouse/?param1=456783&utm=098765432')
    })
    it("returns url without any additional params if utm wasn't found", () => {
      expect(
        geoIPUtils.appendGTMParams(
          'http://www.topshop.com/blouse/?param1=456783',
          '?gh=0987654'
        )
      ).toEqual('http://www.topshop.com/blouse/?param1=456783')
    })
  })

  describe('getRedirectURL', () => {
    const configs = [
      ...topshop,
      ...topman,
      ...wallis,
      ...burton,
      ...dorothyPerkins,
      ...evans,
      ...missSelfidge,
    ]

    /*
     * What lies ahead is some generative testing. See full-monty/docs/testcheck.md for info
     * Don't be afraid, give it a good read first.
     *
     * check.it() comes from 'jasmine-check' package, a Jasmine wrapper around 'testcheck-js' package.
     */
    const genCapitalLetter = gen
      .intWithin(65, 90)
      .then((int) => String.fromCharCode(int))
    const combine = (a, b, combinator) =>
      a.then((x) => b.then((y) => combinator(x, y)))
    const gen2CapitalLetters = combine(
      genCapitalLetter,
      genCapitalLetter,
      (a, b) => `${a}${b}`
    )
    const genConfig = ({ preferredISO, allowedRegions }) => {
      const redirectableConfigs = configs.filter(
        (conf) =>
          !conf.preferredISOs.includes(preferredISO) &&
          (!allowedRegions || allowedRegions.includes(conf.region))
      )
      return gen
        .intWithin(0, redirectableConfigs.length - 1)
        .then((i) => redirectableConfigs[i])
    }
    const genMainDevEnvDomain = ({ config, hostnameIndex, preferredISO }) =>
      hostnameIndex === 0
        ? gen.oneOf([
            `stage.${config.domains.prod[hostnameIndex]}`,
            `showcase.${config.domains.prod[hostnameIndex]}`,
            `preprod.${config.domains.prod[hostnameIndex]}`,
            `perf.${config.domains.prod[hostnameIndex]}`,
            `integration.${config.domains.prod[hostnameIndex]}`,
            `local.${config.domains.prod[hostnameIndex]}`,
          ])
        : gen.return(
            `${config.brandCode}.stage.arcadiagroup.ltd.uk${
              config.region !== 'uk' ? `?prefShipCtry=${preferredISO}` : ''
            }`
          )
    const genAWSDomain = ({ config, hostnameIndex }) =>
      gen.alphaNumString
        .notEmpty()
        .then(
          (env) =>
            `${env}-${config.domains.prod[hostnameIndex].replace(
              /\./g,
              '-'
            )}.digital.arcadiagroup.co.uk`
        )
    const genConfigAndDomain = ({
      domainType,
      devEnv,
      preferredISO,
      allowedRegions,
    }) =>
      genConfig({ preferredISO, allowedRegions }).then((config) => {
        const genHostnameIndex =
          domainType === 'mobile'
            ? gen.return(0)
            : domainType === 'desktop'
              ? gen.return(1)
              : gen.intWithin(0, config.domains.prod.length - 1)

        return genHostnameIndex.then((index) => ({
          config,
          domain:
            devEnv === 'main'
              ? genMainDevEnvDomain({
                  config,
                  hostnameIndex: index,
                  preferredISO,
                })
              : devEnv === 'aws'
                ? genAWSDomain({ config, hostnameIndex: index })
                : config.domains.prod[index],
          preferredISO,
        }))
      })

    const genRedirectableISO = (input) => {
      const config = configs
        .filter((conf) => conf.brandCode === input.config.brandCode)
        .find((conf) => conf.domains.prod[0] !== input.config.domains.prod[0])

      return gen
        .intWithin(0, config.preferredISOs.length - 1)
        .then((i) => config.preferredISOs[i])
    }

    const genPreferredISO = (preferredISOOverride) => {
      if (preferredISOOverride === null) {
        return gen2CapitalLetters
      }
      return Promise.resolve(preferredISOOverride)
    }

    const genInput = ({
      domainType = null,
      geoIpEnabled = true,
      preferredISOOverride = null,
      redirectURL,
      devEnv = false,
      allowedRegions,
    } = {}) => {
      return genPreferredISO(preferredISOOverride).then((preferredISO) =>
        genConfigAndDomain({
          domainType,
          devEnv,
          preferredISO,
          allowedRegions,
        }).then(({ config, domain, preferredISO }) =>
          gen.object({
            config,
            domain,
            preferredISO,
            geoIpEnabled,
            redirectURL,
          })
        )
      )
    }

    const testGetRedirectURL = ({
      config,
      domain,
      redirectURL,
      geoISO,
      preferredISO,
      storedGeoPreference,
      geoIpEnabled = false,
      isDesktopMainDev = false,
      isMobileMainDev = false,
    }) => {
      const state = {
        geoIP: {
          redirectURL: redirectURL || '',
          hostname: domain,
          geoISO: geoISO || '',
          userISOPreference: preferredISO || '',
          storedGeoPreference: storedGeoPreference || '',
        },
        config,
        features: {
          status: {
            [FEATURE_GEOIP]: geoIpEnabled,
          },
        },
        hostname: { isDesktopMainDev, isMobileMainDev },
      }

      return geoIPUtils.getRedirectURL(state)
    }

    it('returns `redirectURL` if set', () => {
      const input = sampleOne(genInput())
      input.redirectURL = 'foo'

      expect(testGetRedirectURL(input)).toBe(input.redirectURL)
    })

    const genInput1 = genInput({ geoIpEnabled: false })
    check.it(
      'feature flag disabled never returns a redirect URL',
      genInput1,
      (input) => {
        expect(testGetRedirectURL(input)).toBe(undefined)
      }
    )

    const genDirtyISO = gen.string.suchThat(
      (x) => x !== '' && !geoIPUtils.isValidISO2(x)
    )
    const genDirtyInput = genInput({
      preferredISOOverride: genDirtyISO,
    })
    check.it(
      'dirty userISOPreference should disable the feature',
      genDirtyInput,
      (input) => {
        expect(testGetRedirectURL(input)).toBe(undefined)
      }
    )

    const genInput2 = genInput({ preferredISOOverride: '' })
    check.it(
      'if no userISOPreference (eg if akamai GeoIP disabled and so geoISO is not set) then never return a redirect URL',
      genInput2,
      (input) => {
        expect(testGetRedirectURL(input)).toBe(undefined)
      }
    )

    const genRedirectURLWithDirtyInputs = genDirtyInput.then((input) => ({
      ...input,
      redirectURL: 'foo',
    }))
    check.it(
      'redirectURL should not be returned if feature is disabled or no userISOPreference or dirty data',
      genRedirectURLWithDirtyInputs,
      (input) => {
        expect(testGetRedirectURL(input)).toBe(undefined)
      }
    )

    const genInputLocationPreferringCurrentSite = (opts) =>
      genInput(opts).then((input) => {
        return gen.oneOf(input.config.preferredISOs).then((geoISO) =>
          gen.object({
            ...input,
            geoISO,
          })
        )
      })

    const genInputCookiePreferringCurrentSite = (opts) =>
      genInput(opts).then((input) => {
        return gen
          .oneOf(input.config.preferredISOs)
          .then((storedGeoPreference) =>
            gen.object({
              ...input,
              storedGeoPreference,
            })
          )
      })

    check.it(
      'user requests preferred site',
      genInputLocationPreferringCurrentSite,
      (input) => {
        expect(testGetRedirectURL(input)).toBe(undefined)
      }
    )

    const genInputRedirectableHeader = genInput().then((input) =>
      gen.object({ ...input, preferredISO: genRedirectableISO(input) })
    )
    check.it(
      'user requesting a foreign site',
      genInputRedirectableHeader,
      (input) => {
        expect(testGetRedirectURL(input)).toEqual(expect.any(String))
      }
    )

    const genRedirectableInput = (opts) =>
      genInput(opts).then((input) =>
        genRedirectableISO(input).then((redirectableISO) =>
          gen.object({
            ...input,
            preferredISO: redirectableISO,
          })
        )
      )

    check.it(
      'if requested with "m." domain then `redirectDomain` should be mobile',
      genRedirectableInput({ domainType: 'mobile' }),
      (input) => {
        const userGeoPreference = input.preferredISO
        const preferredSiteConfig = getSiteConfigByPreferredISO(
          userGeoPreference,
          input.config.brandCode
        )

        const [mobileDomain] = getEnvDomainsFromConfig(
          preferredSiteConfig,
          input.domain
        )
        expect(testGetRedirectURL(input)).toBe(
          `${mobileDomain}?internationalRedirect=geoIPModal-${
            input.config.storeCode
          }`
        )
      }
    )

    check.it(
      'if requested with "www." domain then `redirectDomain` should be desktop',
      genRedirectableInput({ domainType: 'desktop' }),
      (input) => {
        const userGeoPreference = input.preferredISO

        const preferredSiteConfig = getSiteConfigByPreferredISO(
          userGeoPreference,
          input.config.brandCode
        )

        const [, wwwDomain] = getEnvDomainsFromConfig(
          preferredSiteConfig,
          input.domain
        )

        const redirectURL = testGetRedirectURL(input)

        expect(redirectURL).toBe(
          `${wwwDomain}?internationalRedirect=geoIPModal-${
            input.config.storeCode
          }`
        )
      }
    )

    describe('GEOIP cookie and location logic', () => {
      check.it(
        'returns `undefined` if GEOIP cookie matches current site',
        genInputCookiePreferringCurrentSite(),
        (input) => {
          expect(testGetRedirectURL(input)).toBe(undefined)
        }
      )

      check.it(
        'returns `undefined` if user location matches current site',
        genInputLocationPreferringCurrentSite(),
        (input) => {
          expect(testGetRedirectURL(input)).toBe(undefined)
        }
      )

      const genInputShouldNotRedirectFromEUSites = (opts) =>
        genInput(opts).then((input) => {
          return gen.oneOf(geoIPUtils.euSiteAgnosticISOs).then((geoISO) =>
            gen.object({
              ...input,
              geoISO,
            })
          )
        })
      check.it(
        'returns `undefined` if the user is visiting an eu site and their geoISO is listed in euSiteAgnosticISOs',
        genInputShouldNotRedirectFromEUSites({
          allowedRegions: ['eu', 'fr', 'de'],
        }),
        (input) => {
          expect(testGetRedirectURL(input)).toBe(undefined)
        }
      )

      check.it(
        "returns redirect url, if the cookie or location doesn't match as a preferredISO",
        genRedirectableInput({
          domainType: 'desktop',
        }),
        (input) => {
          const userGeoPreference = input.preferredISO

          const preferredSiteConfig = getSiteConfigByPreferredISO(
            userGeoPreference,
            input.config.brandCode
          )

          const [, wwwDomain] = getEnvDomainsFromConfig(
            preferredSiteConfig,
            input.domain
          )
          const redirectURL = testGetRedirectURL(input)
          expect(redirectURL).toBe(
            `${wwwDomain}?internationalRedirect=geoIPModal-${
              input.config.storeCode
            }`
          )
        }
      )
    })

    it('returns `undefined` when requested site is the same as the user geo', () => {
      const input = {
        config: topshop[0],
        domain: 'm.topshop.com',
        redirectURL: '',
        preferredISO: 'GB',
        geoIpEnabled: true,
      }
      expect(testGetRedirectURL(input)).toBe(undefined)
    })

    // // stage.m.fr.topshop.com
    const genInputWithMainDevMobile = genInput({
      devEnv: 'main',
      domainType: 'mobile',
      cookieOverride: '',
    }).then((input) =>
      gen.object({
        ...input,
        preferredISO: genRedirectableISO(input),
      })
    )
    check.it(
      'if request is from a main dev environment then redirect URL should also be',
      genInputWithMainDevMobile,
      (input) => {
        const env = input.domain.match(/^([^.]+)\./)[1]
        expect(testGetRedirectURL(input)).toMatch(env)
      }
    )

    const genUKSiteMainDevEnv = genInput({
      devEnv: 'main',
      domainType: 'mobile',
      cookieOverride: '',
      allowedRegions: ['uk'],
      // HACK: this test relies on JP not being listed as a preferredISO for
      // any of the site configs
      preferredISOOverride: 'JP',
    })
    check.it(
      'if request is from a main dev environment, for UK site from ROW location',
      genUKSiteMainDevEnv,
      (input) => {
        expect(testGetRedirectURL(input)).toBe(undefined)
      }
    )

    // // // ts.stage.arcadiagroup.ltd.uk?prefShipCtry=FR
    const genInputWithMainDevDesktop = genInput({
      devEnv: 'main',
      domainType: 'desktop',
      desktopDevOverride: true,
    }).then((input) =>
      gen.object({
        ...input,
        preferredISO: genRedirectableISO(input),
        isDesktopMainDev: true,
      })
    )
    check.it(
      'if request is from a desktop main dev environment then redirect URL should also be',
      genInputWithMainDevDesktop,
      (input) => {
        const env = input.domain.match(/^[a-z]{2}\.([^.]+)/)[1]
        const redirectURL = testGetRedirectURL(input)
        expect(redirectURL).toMatch(env)
        expect(redirectURL).toMatch(`?prefShipCtry=${input.preferredISO}`)
        expect(redirectURL).toMatch('.arcadiagroup.ltd.uk')
      }
    )

    // // // foo-m-fr-topshop-com.digitial.arcadiagroup.co.uk
    const genInputWithAWSMobile = genInput({
      devEnv: 'aws',
      domainType: 'mobile',
      isMobileMainDev: true,
    }).then((input) =>
      gen.object({
        ...input,
        preferredISO: genRedirectableISO(input),
        isMobileMainDev: true,
      })
    )
    check.it(
      'if request is from an AWS dev environment then redirect URL should also be',
      genInputWithAWSMobile,
      (input) => {
        const env = input.domain.match(/^([^-]+)-/)[1]
        const res = testGetRedirectURL(input)
        expect(res).toMatch(env)
        expect(res).toMatch('.digital.arcadiagroup.co.uk')
      }
    )
  })

  describe('shouldRedirectForDelivery()', () => {
    it('should return true if the country is not included in the list of ISOs', () => {
      expect(geoIPUtils.shouldRedirectForDelivery('France', [])).toBe(true)
    })

    it('should return false if the country is included in the list of ISOs', () => {
      expect(geoIPUtils.shouldRedirectForDelivery('France', ['FR'])).toBe(false)
    })
  })
})
