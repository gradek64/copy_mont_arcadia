import { clone } from 'ramda'
import deepFreeze from 'deep-freeze'
import * as ConfigSelectors from '../configSelectors'
import breakpoints from '../../constants/responsive'

describe('config selectors', () => {
  const state = deepFreeze({
    config: {
      brandCode: 'TS',
      currencySymbol: '£',
      currencyCode: 'GBP',
      logoVersion: '19102018',
      brandName: 'brand name',
      brandDisplayName: 'Brand Name',
      defaultLanguage: 'English',
      langHostnames: {
        default: {
          defaultLanguage: 'English',
        },
      },
      thirdPartySiteUrls: { Singapore: 'sg.topshop.com' },
      hrefLanguages: [
        {
          href: 'www.brandname.com',
          hreflang: 'en-gb',
        },
        {
          href: 'fr.brandname.com',
          hreflang: 'fr-fr',
        },
      ],
      region: 'uk',
      siteId: 'VALID_SITE_ID',
      storeCode: 'tsuk',
      lang: 'en',
      language: 'en-gb',
      sizeTileMaximumDesktop: 7,
      siteDeliveryISOs: ['GB', 'AU', 'DK', 'SE'],
      domains: { prods: ['m.domain.com', 'www.brand.com'] },
      staticAmplienceHost: 'static.brand.com',
      socialProof: {},
      dressipiBaseUrl: 'https://dressipi-staging.topshop.com',
      googleRecaptchaSiteKey: '6LcqQaYZAAAAAEe2nFbrF4jJzWPANxn4-TYI8zFx',
      paypalSDKClientId: '6Le9CK8ZAAAAAHwoWdfdfmeQYKt5IjY',
    },
  })

  describe('selectConfig', () => {
    it('returns config state', () => {
      expect(ConfigSelectors.selectConfig(state)).toBe(state.config)
    })
  })

  describe('getHrefLanguages()', () => {
    it('returns hrefLanguages state', () => {
      expect(ConfigSelectors.getHrefLanguages(state)).toBe(
        state.config.hrefLanguages
      )
    })
  })

  describe('getCurrencyCode', () => {
    it('returns currency code', () => {
      expect(ConfigSelectors.getCurrencyCode(state)).toBe(
        state.config.currencyCode
      )
    })
  })

  describe('getBrandName', () => {
    it('returns brand name', () => {
      expect(ConfigSelectors.getBrandName(state)).toBe(state.config.brandName)
    })
  })

  describe('getBrandDisplayName', () => {
    it('returns brand display name', () => {
      expect(ConfigSelectors.getBrandDisplayName(state)).toBe(
        state.config.brandDisplayName
      )
    })
  })

  describe('getCurrencySymbol', () => {
    it('returns currency symbol', () => {
      expect(ConfigSelectors.getCurrencySymbol(state)).toBe(
        state.config.currencySymbol
      )
    })
  })

  describe('getSiteDeliveryISOs', () => {
    it('returns siteDeliveryISOs', () => {
      expect(ConfigSelectors.getSiteDeliveryISOs(state)).toBe(
        state.config.siteDeliveryISOs
      )
    })
  })

  describe('getBrandCode', () => {
    it('returns brandCode', () => {
      expect(ConfigSelectors.getBrandCode(state)).toBe(state.config.brandCode)
    })
  })

  describe('getStoreCode', () => {
    it('returns storeCode', () => {
      expect(ConfigSelectors.getStoreCode(state)).toBe(state.config.storeCode)
    })
  })

  describe('getLangHostnames', () => {
    it('returns langHostnames', () => {
      expect(ConfigSelectors.getLangHostnames(state)).toEqual(
        state.config.langHostnames
      )
    })
  })

  describe('getThirdPartySiteUrls', () => {
    it('returns thirdPartySiteUrls', () => {
      expect(ConfigSelectors.getThirdPartySiteUrls(state)).toEqual(
        state.config.thirdPartySiteUrls
      )
    })
  })

  describe('getLogoVersion', () => {
    it('returns logoVersion', () => {
      expect(ConfigSelectors.getLogoVersion(state)).toEqual(
        state.config.logoVersion
      )
    })
  })

  describe('getLang', () => {
    it('returns lang', () => {
      expect(ConfigSelectors.getLang(state)).toEqual(state.config.lang)
    })
  })

  describe('getLanguage', () => {
    it('returns defaultLanguage', () => {
      expect(ConfigSelectors.getLanguage(state)).toBe(
        state.config.defaultLanguage
      )
    })
  })

  describe('getLanguageRegion', () => {
    it('should return language', () => {
      expect(ConfigSelectors.getLanguageRegion(state)).toEqual(
        state.config.language
      )
    })
  })

  describe('getDefaultLanguage', () => {
    it('returns default language', () => {
      expect(ConfigSelectors.getDefaultLanguage(state)).toBe(
        state.config.langHostnames.default.defaultLanguage
      )
    })
  })

  describe('getStoreId', () => {
    it('returns storeId', () => {
      expect(ConfigSelectors.getStoreId(state)).toBe(state.config.siteId)
    })
  })

  describe('getBaseUrlPath', () => {
    it('returns baseUrlPath', () => {
      expect(ConfigSelectors.getBaseUrlPath(state)).toBe(
        `/${state.config.storeCode}/${state.config.lang}`
      )
    })
  })

  describe('getMaximumNumberOfSizeTiles', () => {
    describe('with mobile viewport', () => {
      it('returns MOBILE_MAXIMUM_NUMBER_SIZE_TILE in mobile viewport', () => {
        expect(
          ConfigSelectors.getMaximumNumberOfSizeTiles({
            ...state,
            viewport: {
              media: 'mobile',
            },
          })
        ).toBe(8)
      })
    })
    describe('with viewport different than mobile', () => {
      it('returns config.sizeTileMaximumDesktop value', () => {
        expect(ConfigSelectors.getMaximumNumberOfSizeTiles(state)).toBe(7)
      })
      it('returns DEFAULT_DESKTOP_MAXIMUM_NUMBER_SIZE_TILE', () => {
        expect(
          ConfigSelectors.getMaximumNumberOfSizeTiles({ config: {} })
        ).toBe(8)
      })
    })
  })

  describe('getCountry', () => {
    it('returns country', () => {
      const state = {
        config: {
          country: 'France',
        },
      }
      expect(ConfigSelectors.getCountry(state)).toBe('France')
    })
  })

  describe('getSiteDeliveryISOs', () => {
    it('returns siteDeliveryISOs', () => {
      expect(ConfigSelectors.getSiteDeliveryISOs(state)).toBe(
        state.config.siteDeliveryISOs
      )
    })
  })

  describe('getDomain', () => {
    it('should return a prod domain array', () => {
      expect(ConfigSelectors.getDomain(state)).toBe(state.config.domains)
    })
  })

  const pdpSocialProofConfig = {
    counter: 'default_counter',
    k: '789',
    timePeriod: 5,
  }
  const defaultSocialProofConfig = {
    counter: 'pdp_counter',
    k: '250',
    timePeriod: 24 * 60,
  }
  const socialProofState = {
    config: {
      socialProof: {
        views: {
          PDP: pdpSocialProofConfig,
          default: defaultSocialProofConfig,
        },
      },
    },
  }

  describe('getSocialProofConfigForView', () => {
    it('should return the socialProof config object for the specified view if it exists', () => {
      expect(
        ConfigSelectors.getSocialProofConfigForView(socialProofState, 'PDP')
      ).toBe(pdpSocialProofConfig)
    })

    it('should return the default config if the specified view does not have its own config', () => {
      expect(
        ConfigSelectors.getSocialProofConfigForView(socialProofState, 'PLP')
      ).toBe(defaultSocialProofConfig)
    })

    it('should return an empty object there is no default config object', () => {
      const state = { config: {} }
      expect(ConfigSelectors.getSocialProofConfigForView(state, 'PLP')).toEqual(
        {}
      )
    })
  })

  describe('getDistinctSocialProofConfigs', () => {
    it('should return an array of the different social proof view config objects', () => {
      expect(
        ConfigSelectors.getDistinctSocialProofConfigs(socialProofState)
      ).toEqual([pdpSocialProofConfig, defaultSocialProofConfig])
    })

    it('should return an empty array if the social proof state is undefined', () => {
      const state = {}
      expect(ConfigSelectors.getDistinctSocialProofConfigs(state)).toEqual([])
    })
  })

  describe('getSocialProofBannersCMSPageID', () => {
    it('should return the bannersCMSPageId if it exists', () => {
      const state = {
        config: {
          socialProof: {
            views: {
              default: {
                counter: 'some_fake_counter',
                k: '250',
                timePeriod: 24 * 60,
              },
            },
            bannersCMSPageId: '0000163857',
          },
        },
      }

      expect(ConfigSelectors.getSocialProofBannersCMSPageID(state)).toBe(
        '0000163857'
      )
    })

    it('should return undefined if bannersCMSPageId doesnt exist', () => {
      const state = {
        config: {
          socialProof: {
            views: {
              default: {
                counter: 'some_fake_counter',
                k: '250',
                timePeriod: 24 * 60,
              },
            },
          },
        },
      }

      expect(ConfigSelectors.getSocialProofBannersCMSPageID(state)).toBe(
        undefined
      )
    })
  })

  describe('getSocialProofMaximumPDPMessageViewsPerSession', () => {
    it('returns the maximum views per session for social proof', () => {
      const state = {
        config: {
          socialProof: {
            views: {},
            maximumPDPMessageViewsPerSession: 3,
          },
        },
      }

      expect(
        ConfigSelectors.getSocialProofMaximumPDPMessageViewsPerSession(state)
      ).toBe(3)
    })
    it('returns undefined if the maximum views per session for social proof isnt in the config', () => {
      const state = {
        config: {
          socialProof: {
            views: {
              PDP: {
                counter: 'cats',
              },
            },
          },
        },
      }

      expect(
        ConfigSelectors.getSocialProofMaximumPDPMessageViewsPerSession(state)
      ).toBe(undefined)
    })
  })

  describe('getStaticAmplienceHost', () => {
    it('should return the brand amplience host name ', () => {
      expect(ConfigSelectors.getStaticAmplienceHost(state)).toBe(
        state.config.staticAmplienceHost
      )
    })
  })

  describe('getStylesheetProps', () => {
    const state = {
      config: {
        brandName: 'topshop',
        assets: {
          css: {
            'topshop/styles.css': '/assets/topshop/styles.css',
            'topshop/styles-tablet.css': '/assets/topshop/styles-tablet.css',
            'topshop/styles-laptop.css': '/assets/topshop/styles-laptop.css',
            'topshop/styles-desktop.css': '/assets/topshop/styles-desktop.css',
          },
        },
      },
      features: {
        status: {
          FEATURE_RESPONSIVE: true,
        },
      },
    }

    const styles = [
      {
        rel: 'stylesheet',
        href: '/assets/topshop/styles.css',
        media: `(min-width: ${breakpoints.mobile.min}px)`,
      },
      {
        rel: 'stylesheet',
        href: '/assets/topshop/styles-tablet.css',
        media: `(min-width: ${breakpoints.tablet.min}px)`,
      },
      {
        rel: 'stylesheet',
        href: '/assets/topshop/styles-laptop.css',
        media: `(min-width: ${breakpoints.laptop.min}px)`,
      },
      {
        rel: 'stylesheet',
        href: '/assets/topshop/styles-desktop.css',
        media: `(min-width: ${breakpoints.desktop.min}px)`,
      },
    ]

    it('should return an array of style objects', () => {
      expect(ConfigSelectors.getStylesheetProps(state)).toEqual(styles)
    })

    it('should return an empty array if feature responsive is disabled', () => {
      const stateWithDisabledResponsiveFeature = clone(state)
      stateWithDisabledResponsiveFeature.features.status.FEATURE_RESPONSIVE = false
      expect(
        ConfigSelectors.getStylesheetProps(stateWithDisabledResponsiveFeature)
      ).toEqual([])
    })

    it('should return an empty array if there are no css assets in the config', () => {
      const stateWithoutAssets = clone(state)
      stateWithoutAssets.config.assets.css = null
      expect(ConfigSelectors.getStylesheetProps(stateWithoutAssets)).toEqual([])
    })
  })

  describe('getShowSingleProductOverlayBannerOnPLP', () => {
    it('returns showSingleProductOverlayBannerOnPLP if present', () => {
      const state = {
        config: {
          socialProof: {
            views: {},
            showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
          },
        },
      }

      expect(
        ConfigSelectors.getShowSingleProductOverlayBannerOnPLP(state)
      ).toBe('socialProofBanner')
    })

    it('return false if showSingleProductOverlayBannerOnPLP is false', () => {
      const state = {
        config: {
          socialProof: {
            views: {},
            showSingleProductOverlayBannerOnPLP: false,
          },
        },
      }

      expect(
        ConfigSelectors.getShowSingleProductOverlayBannerOnPLP(state)
      ).toBe(false)
    })

    it('return false if showSingleProductOverlayBannerOnPLP is not defined', () => {
      expect(
        ConfigSelectors.getShowSingleProductOverlayBannerOnPLP(state)
      ).toBe(false)
    })
  })

  describe('getBrandName selector', () => {
    it('extract brandName from config', () => {
      expect(ConfigSelectors.getBrandName(state)).toMatchSnapshot()
    })
  })

  describe('getDressipiBaseUrl', () => {
    it('returns dressipi base url', () => {
      expect(ConfigSelectors.getDressipiBaseUrl(state)).toBe(
        state.config.dressipiBaseUrl
      )
    })
  })

  describe('getGoogleRecaptchaSiteKey', () => {
    it('returns the google recaptcha site key', () => {
      expect(ConfigSelectors.getGoogleRecaptchaSiteKey(state)).toBe(
        state.config.googleRecaptchaSiteKey
      )
    })
  })

  describe('getPaypalSDKClientId', () => {
    it('returns the paypal sdk client id', () => {
      expect(ConfigSelectors.getPaypalSDKClientId(state)).toBe(
        state.config.paypalSDKClientId
      )
    })
  })
})
