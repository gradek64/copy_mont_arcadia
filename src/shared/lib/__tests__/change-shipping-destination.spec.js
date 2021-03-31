import {
  findHostnameByDefaultLanguage,
  findRedirectUrl,
  findShippingDestination,
  getShippingDestinationRedirectURL,
  getTransferBasketParameters,
  isEUCountry,
  shippingDestinationRedirect,
} from '../change-shipping-destination'
import { changeURL } from '../window'
import { mockLangHostnames } from '../../../../test/mocks/change-shipping-destination'
import { allLanguages, euCountries } from '../../constants/languages'
import qs from 'querystring'
import countryList from 'country-list'

jest.mock('../window', () => ({
  changeURL: jest.fn(),
  getOrigin: () => 'https://www.topshop.com',
  getProtocol: () => 'https:',
}))

jest.mock('../../../client/lib/cookie', () => ({
  setItem: jest.fn(),
}))

const langHostnames = {
  France: { hostname: 'm.fr.topshop.com', defaultLanguage: 'French' },
  Germany: { hostname: 'm.de.topshop.com', defaultLanguage: 'German' },
  'United Kingdom': { hostname: 'm.topshop.com', defaultLanguage: 'English' },
  'United States': {
    hostname: 'm.us.topshop.com',
    defaultLanguage: 'English',
  },
  default: { hostname: 'm.eu.topshop.com', defaultLanguage: 'English' },
  nonEU: { hostname: 'm.topshop.com', defaultLanguage: 'English' },
}

describe('change-shipping-destination', () => {
  beforeEach(() => jest.clearAllMocks())
  global.process.env.NODE_ENV = 'production'

  describe(shippingDestinationRedirect.name, () => {
    it('redirects to the expected', () => {
      shippingDestinationRedirect({
        shippingDestination: 'Ireland',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.eu.topshop.com?currentCountry=IE&prefShipCtry=IE&userLanguage=en'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Italy',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.eu.topshop.com?currentCountry=IT&prefShipCtry=IT&userLanguage=en'
      )
      shippingDestinationRedirect({
        shippingDestination: 'United Kingdom',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.topshop.com?currentCountry=GB&prefShipCtry=GB&userLanguage=en'
      )
      shippingDestinationRedirect({
        shippingDestination: 'United States',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.us.topshop.com?currentCountry=US&prefShipCtry=US&userLanguage=en'
      )
      shippingDestinationRedirect({
        shippingDestination: 'France',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'French',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.fr.topshop.com?currentCountry=FR&prefShipCtry=FR&userLanguage=fr'
      )
      shippingDestinationRedirect({
        shippingDestination: 'France',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'German',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.de.topshop.com?currentCountry=FR&prefShipCtry=FR&userLanguage=de'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Germany',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'German',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.de.topshop.com?currentCountry=DE&prefShipCtry=DE&userLanguage=de'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Germany',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'French',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.fr.topshop.com?currentCountry=DE&prefShipCtry=DE&userLanguage=fr'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Jamaica',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.topshop.com?currentCountry=JM&prefShipCtry=JM&userLanguage=en'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Italy',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
        optionalParameters: {
          optionalParam: 'optionalValue',
        },
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.eu.topshop.com?currentCountry=IT&prefShipCtry=IT&userLanguage=en&optionalParam=optionalValue'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Netherlands',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.eu.topshop.com?currentCountry=NL&prefShipCtry=NL&userLanguage=en'
      )
      shippingDestinationRedirect({
        shippingDestination: 'Netherlands',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.eu.topshop.com?currentCountry=NL&prefShipCtry=NL&userLanguage=en'
      )
    })

    describe('We have third party url/s and the shipping destination matches against one of them', () => {
      it('should redirect to third party destination', () => {
        shippingDestinationRedirect({
          shippingDestination: 'Singapore',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: { Singapore: 'sg.topshop.com' },
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://sg.topshop.com?currentCountry=SG&prefShipCtry=SG&userLanguage=en'
        )
      })
    })

    describe('We have third party url/s but the shipping destination is not within them', () => {
      it('should redirect to the .m shipping destination', () => {
        shippingDestinationRedirect({
          shippingDestination: 'United States',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: { Singapore: 'sg.topshop.com' },
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.us.topshop.com?currentCountry=US&prefShipCtry=US&userLanguage=en'
        )
      })
    })
  })

  describe('shipping redirect rules', () => {
    const siteKeys = Object.keys(mockLangHostnames)
    const numSites = siteKeys.length
    const genSiteCountry = gen
      .intWithin(0, numSites - 1)
      .then((i) => siteKeys[i])

    check.it(
      'if selected language = default language then redirect to destination site',
      genSiteCountry,
      (country) => {
        jest.clearAllMocks()
        const currentCountryISO = countryList.getCode(country)
        const selectedLanguage = mockLangHostnames[country].defaultLanguage
        shippingDestinationRedirect({
          shippingDestination: country,
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage,
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          `https://${mockLangHostnames[country].hostname}?${qs.stringify({
            currentCountry: currentCountryISO,
            prefShipCtry: currentCountryISO,
            userLanguage: allLanguages.find(
              ({ value }) => value === selectedLanguage
            ).isoCode,
          })}`
        )
      }
    )

    describe('redirects to eu sites', () => {
      it('should use the correct list of eu countries to calculate the redirect', () => {
        shippingDestinationRedirect({
          shippingDestination: 'Netherlands',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.eu.topshop.com?currentCountry=NL&prefShipCtry=NL&userLanguage=en'
        )

        shippingDestinationRedirect({
          shippingDestination: 'Greenland',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.topshop.com?currentCountry=GL&prefShipCtry=GL&userLanguage=en'
        )
      })
    })

    describe('Legacy parameters', () => {
      it('should not set legacy params, if no shippingDestination provided', () => {
        shippingDestinationRedirect({
          shippingDestination: null,
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'English',
        })
        expect(changeURL).not.toHaveBeenLastCalledWith(
          expect.stringMatching(/(prefShipCtry|userLanguage)/)
        )
      })

      it('should set the country ISO as prefShipCtry as a queryParam', () => {
        shippingDestinationRedirect({
          shippingDestination: 'France',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          expect.stringMatching(/prefShipCtry=FR/)
        )
      })

      it('should set the selected language as userLanguage, if provided', () => {
        shippingDestinationRedirect({
          shippingDestination: 'France',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'German',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          expect.stringMatching(/userLanguage=de/)
        )
      })

      it('should set the default language as userLanguage, if no lang provided', () => {
        shippingDestinationRedirect({
          shippingDestination: 'France',
          thirdPartySiteUrls: {},
          langHostnames: mockLangHostnames,
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          expect.stringMatching(/userLanguage=fr/)
        )
      })

      it('should set en  as userLanguage, if no default lang or lang provided', () => {
        shippingDestinationRedirect({
          shippingDestination: 'Tuvalu',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          expect.stringMatching(/userLanguage=en/)
        )
      })
    })

    describe('if selected shipping destination is a EU country with selectedLanguage !== defaultLanguage', () => {
      it('redirects to EU default site when selectedLanguage is English', () => {
        shippingDestinationRedirect({
          shippingDestination: 'France',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.eu.topshop.com?currentCountry=FR&prefShipCtry=FR&userLanguage=en'
        )

        shippingDestinationRedirect({
          shippingDestination: 'Liechtenstein',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'English',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.eu.topshop.com?currentCountry=LI&prefShipCtry=LI&userLanguage=en'
        )
      })

      it('redirects to custom Language site if exists', () => {
        shippingDestinationRedirect({
          shippingDestination: 'France',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'German',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.de.topshop.com?currentCountry=FR&prefShipCtry=FR&userLanguage=de'
        )

        shippingDestinationRedirect({
          shippingDestination: 'Germany',
          langHostnames: mockLangHostnames,
          thirdPartySiteUrls: {},
          selectedLanguage: 'French',
        })
        expect(changeURL).toHaveBeenLastCalledWith(
          'https://m.fr.topshop.com?currentCountry=DE&prefShipCtry=DE&userLanguage=fr'
        )
      })
    })

    it('redirect to non-eu site none of the other rules is satisfied', () => {
      shippingDestinationRedirect({
        shippingDestination: 'Vanuatu',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'German',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.topshop.com?currentCountry=VU&prefShipCtry=VU&userLanguage=de'
      )
    })

    it('redirect to non-eu site persisting existing query parameters', () => {
      delete global.window.location
      global.window = Object.create(window)
      global.window.location = {
        search: '?utm=NeedsToBeSaved',
      }
      shippingDestinationRedirect({
        shippingDestination: 'Vanuatu',
        langHostnames: mockLangHostnames,
        thirdPartySiteUrls: {},
        selectedLanguage: 'German',
      })
      expect(changeURL).toHaveBeenLastCalledWith(
        'https://m.topshop.com?currentCountry=VU&prefShipCtry=VU&userLanguage=de&utm=NeedsToBeSaved'
      )
    })
  })

  describe(getTransferBasketParameters.name, () => {
    const config = { siteId: 1234 }
    const shoppingBag = {
      bag: {
        orderId: 5678,
      },
    }
    const features = {
      status: {
        FEATURE_TRANSFER_BASKET: true,
      },
    }
    it(
      'returns a map containing the transfer basket parameters' +
        'when the TRANSFER_BASKET feature flag is enabled and the order id is valid',
      () => {
        const state = {
          config,
          shoppingBag,
          features,
        }
        expect(getTransferBasketParameters(state)).toEqual({
          transferStoreID: 1234,
          transferOrderID: 5678,
        })
      }
    )
    describe('returns empty object when', () => {
      it('the TRANSFER_BASKET feature flag is disabled', () => {
        const state = {
          config,
          features,
        }
        expect(getTransferBasketParameters(state)).toEqual({})
      })
      it('the order id is not valid', () => {
        const state = {
          config,
          features,
        }
        expect(getTransferBasketParameters(state)).toEqual({})
      })
    })
  })

  describe('@methods', () => {
    describe('isEUCountry()', () => {
      it('should return true if it is an EU country', () => {
        const country = 'Spain'
        expect(isEUCountry(euCountries, country)).toBeTruthy()
      })

      it('should return false if it is not an EU country', () => {
        const country = 'Trinidad'
        expect(isEUCountry(euCountries, country)).toBeFalsy()
      })
    })

    describe('findHostnameByDefaultLanguage()', () => {
      it('should return French hostname and language', () => {
        const language = 'French'
        const expected = {
          defaultLanguage: 'French',
          hostname: 'm.fr.topshop.com',
        }
        expect(findHostnameByDefaultLanguage(langHostnames, language)).toEqual(
          expected
        )
      })

      it('should return German hostname and language', () => {
        const language = 'German'
        const expected = {
          defaultLanguage: 'German',
          hostname: 'm.de.topshop.com',
        }
        expect(findHostnameByDefaultLanguage(langHostnames, language)).toEqual(
          expected
        )
      })

      it('should return international hostname and English language', () => {
        const language = 'English'
        const expected = {
          defaultLanguage: 'English',
          hostname: 'm.topshop.com',
        }
        expect(findHostnameByDefaultLanguage(langHostnames, language)).toEqual(
          expected
        )
      })

      it('should return to a default option "m.eu.topshop" if language is not supported', () => {
        const language = 'Spanish'
        const expected = {
          defaultLanguage: 'English',
          hostname: 'm.eu.topshop.com',
        }
        expect(findHostnameByDefaultLanguage(langHostnames, language)).toEqual(
          expected
        )
      })
    })

    describe('findShippingDestination()', () => {
      it('should return m.fr.topshop hostname if language is French', () => {
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'French'
        const expected = {
          hostname: 'm.fr.topshop.com',
          defaultLanguage: 'French',
        }
        expect(
          findShippingDestination(
            langHostnames,
            shippingDestination,
            selectedLanguage
          )
        ).toEqual(expected)
      })

      it('should return m.de.topshop hostname if language is German', () => {
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'German'
        const expected = {
          hostname: 'm.de.topshop.com',
          defaultLanguage: 'German',
        }
        expect(
          findShippingDestination(
            langHostnames,
            shippingDestination,
            selectedLanguage
          )
        ).toEqual(expected)
      })

      it('should return m.eu.topshop hostname if destination is an EU country and language is English', () => {
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'English'
        const expected = {
          hostname: 'm.eu.topshop.com',
          defaultLanguage: 'English',
        }
        expect(
          findShippingDestination(
            langHostnames,
            shippingDestination,
            selectedLanguage
          )
        ).toEqual(expected)
      })

      it('should return m.topshop hostname if destination is a non EU country', () => {
        const shippingDestination = 'Japan'
        const selectedLanguage = 'English'
        const expected = {
          hostname: 'm.topshop.com',
          defaultLanguage: 'English',
        }
        expect(
          findShippingDestination(
            langHostnames,
            shippingDestination,
            selectedLanguage
          )
        ).toEqual(expected)
      })
    })

    describe('findRedirectUrl()', () => {
      it('should return', () => {
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'French'
        const expected = {
          hostname: 'm.fr.topshop.com',
          defaultLanguage: 'French',
        }
        expect(
          findRedirectUrl(langHostnames, shippingDestination, selectedLanguage)
        ).toEqual(expected)
      })
    })

    describe('getShippingDestinationRedirectURL()', () => {
      beforeEach(() => {
        global.process.env.NODE_ENV = ''
      })

      it('should return a redirect URL for production', () => {
        global.process.env.NODE_ENV = 'production'
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'French'
        const hostname = 'm.fr.topshop.com'
        const expected = 'm.fr.topshop.com'
        expect(
          getShippingDestinationRedirectURL(
            shippingDestination,
            langHostnames,
            selectedLanguage,
            hostname
          )
        ).toEqual(expected)
      })

      it('should return a redirect URL for development', () => {
        global.process.env.NODE_ENV = 'development'
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'French'
        const hostname = 'local.m.fr.topshop.com'
        const expected = 'local.m.fr.topshop.com:8080'
        expect(
          getShippingDestinationRedirectURL(
            shippingDestination,
            langHostnames,
            selectedLanguage,
            hostname
          )
        ).toEqual(expected)
      })

      it('should return a redirect URL for showcase', () => {
        global.process.env.NODE_ENV = 'showcase'
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'French'
        const hostname = 'showcase.m.fr.topshop.com'
        const expected = 'showcase.m.fr.topshop.com'
        expect(
          getShippingDestinationRedirectURL(
            shippingDestination,
            langHostnames,
            selectedLanguage,
            hostname
          )
        ).toEqual(expected)
      })

      it('should return a redirect URL for local', () => {
        global.process.env.NODE_ENV = 'local'
        const shippingDestination = 'Belgium'
        const selectedLanguage = 'French'
        const hostname = 'local.m.fr.topshop.com:8080'
        const expected = 'local.m.fr.topshop.com:8080'
        expect(
          getShippingDestinationRedirectURL(
            shippingDestination,
            langHostnames,
            selectedLanguage,
            hostname
          )
        ).toEqual(expected)
      })
    })
  })
})
