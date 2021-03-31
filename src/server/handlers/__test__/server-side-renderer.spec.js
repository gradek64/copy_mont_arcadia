import {
  serverSideRenderer,
  setCriticalCssFiles,
  getCriticalCssFiles,
  getAsyncChunks,
} from '../server-side-renderer'

import cmsMocks from '../mocks/cms.json'
import mrCmsMocks from '../mocks/mr-cms.json'
import { signJwt } from '../../lib/auth'
import nock from 'nock'
import { clone } from 'ramda'
import Helmet from 'react-helmet'
import { SUPPORTED_FEATURES } from '../../../shared/constants/features'
import { jsessionidCookieOptions } from '../../api/constants/session'
import { getJsessionidCookieOptions } from '../../api/constants/jsessionid-cookie-opts'
import * as configs from '../../config/index'
import { getScripts, getPreloadScripts } from '../../lib/get-assets'
import {
  isFeatureQubitHiddenEnabled,
  isFeatureBrandlockEnabled,
  isFeatureYextEnabled,
} from '../../../shared/selectors/featureSelectors'
import { getFeatures } from '../../lib/features-service'
import paymentsHelper from '../../lib/payments-helper'
import * as localisationUtils from '../../../shared/lib/localisation'
import {
  getRedirect,
  getLocation,
} from '../../../shared/selectors/routingSelectors'
import * as modalActions from '../../../shared/actions/common/modalActions'
import * as storeLocatorActions from '../../../shared/actions/components/StoreLocatorActions'
import * as shoppingBagActions from '../../../shared/actions/common/shoppingBagActions'
import * as productViewActions from '../../../shared/actions/common/productViewsActions'
import * as accountActions from '../../../shared/actions/common/accountActions'
import * as debugActions from '../../../shared/actions/components/debugActions'
import * as klarnaActions from '../../../shared/actions/common/klarnaActions'
import * as hostnameActions from '../../../shared/actions/common/hostnameActions'
import * as authActions from '../../../shared/actions/common/authActions'
import * as montyNewrelic from '../../lib/newrelic'
import * as serverSideAnalytics from '../../api/mapping/mappers/order/server_side_analytics'
import { BACKEND_JWT } from '../../api/constants/cookies'
// import { isSameSiteNoneCompatible } from 'should-send-same-site-none'

jest.mock('../../lib/newrelic', () => ({
  addCustomAttribute: jest.fn(),
  getBrowserScript: jest.fn(),
}))

jest.mock('react-helmet')
// jest.mock('should-send-same-site-none', () => ({
//   isSameSiteNoneCompatible: jest.fn(),
// }))

jest.mock('../../lib/get-assets', () => ({
  getScripts: jest.fn(),
  getPreloadScripts: jest.fn(),
}))

jest.mock('../../../shared/actions/common/authActions', () => ({
  authLogin: jest.fn(() => ({
    type: 'MOCK_AUTH_LOGIN',
  })),
  setAuthentication: jest.fn(() => ({
    type: 'MOCK_SET_AUTH',
  })),
}))

jest.mock('../../../shared/lib/fetch-component-data', () =>
  jest.fn(() => Promise.resolve())
)

jest.mock(
  '../../../../public/generated-assets.json',
  () => ({
    chunks: {
      testManifest: 'test',
    },
    js: {
      'common/polyfill-ie11.js': 'common/polyfill-ie11.js',
      'common/Home.js': 'common/Home.js',
    },
  }),
  {
    virtual: true,
  }
)

jest.mock('../../../shared/selectors/featureSelectors')

jest.mock('../../../shared/selectors/routingSelectors', () => ({
  getRedirect: jest.fn(),
  getRoutePath: jest.fn(),
  isRestrictedPath: jest.fn(),
  isHomePage: () => false,
  isInCheckout: () => false,
  isOrderComplete: () => false,
  isOrderSuccess: () => false,
  isCheckout: () => false,
  getLocationQuery: () => ({}),
  getLocation: jest.fn(() => ({
    pathname: '/',
  })),
  getPageStatusCode: jest.fn(),
  getCurrentCountry: () => undefined,
  isNotFound: jest.fn(),
  getRouteSearch: jest.fn(),
}))

jest.mock('../../../shared/lib/localisation', () => ({
  getLocaleDictionary: () => {},
  localise: () => 'en',
  translateGeoIPTextInPreferredLanguage: () => 'fr',
  getGeoIPDictionary: jest.fn(),
}))

jest.mock('../../../shared/selectors/ddpSelectors', () => ({
  isDDPUserInPreExpiryWindow: () => {},
  isDDPActiveUserPreRenewWindow: () => {},
  isDDPUser: () => {},
  isDDPOrder: () => {},
  isDDPRenewablePostWindow: () => {},
  ddpSavingsValue: () => {},
  ddpExpressDeliveryPrice: () => {},
  ddpEndDate: () => {},
  getDDPDefaultName: () => {},
  ddpLogoSrc: () => {},
}))

jest.mock('../../lib/logger')

jest.mock('../../lib/features-service', () => ({
  getFeatures: jest.fn(),
}))

jest.mock('../../lib/payments-helper', () => jest.fn())

jest.mock('../../api/api', () => ({
  generateNewSessionKey: () => '__new_jsessionid__',
}))

jest.mock('../../../shared/actions/common/paymentMethodsActions')

jest.mock('../../api/mapping/mappers/order/server_side_analytics', () => ({
  logSsrOrderComplete: jest.fn(),
}))

jest.mock('../../../client/lib/reporter')

const { FEATURE_GEOIP } = SUPPORTED_FEATURES
// Basic request DO NOT MUTATE.
// Will render homepage with no state.
const BASE_REQUEST = {
  info: {
    hostname: 'dorothyperkins',
  },
  url: {
    pathname: '/',
    query: {},
  },
  headers: {
    cookie: '',
  },
  state: {},
}

// Helper method for nocking many endpoints on a single API url
const nockAll = (api, endpoints) => {
  Object.keys(endpoints).forEach((url) => {
    nock(api)
      .get(url)
      .reply(200, endpoints[url])
  })
}
const API_URL = 'http://localhost:3000'
// Nock all the cms endpoints
const nockCms = () => {
  Object.keys(cmsMocks).forEach((key) => {
    nock(API_URL)
      .get(`/api/cms/pages/${key}`)
      .reply(200, cmsMocks[key])
  })

  // mrCMS
  Object.keys(mrCmsMocks).forEach((pageName) => {
    nock(API_URL)
      .get(
        `/cmscontent?location=&storeCode=tsuk&brandName=dorothyperkins&cmsPageName=${pageName}`
      )
      .reply(200, mrCmsMocks[pageName])
  })
}
// Creates a fake reply method to pass to ssr
// provides promise like methods to use in tests
// Also parses initialState for convenience
const getFakeReply = () => {
  let exposedResolve
  let exposedReject

  const replyPromise = new Promise((resolve, reject) => {
    exposedResolve = resolve
    exposedReject = reject
  })

  const reply = jest.fn((error) => {
    exposedReject(error)

    return reply
  })

  reply.view = (page, renderPayload) => {
    exposedResolve({
      ...renderPayload,
      initialState: JSON.parse(renderPayload.initialState),
    })
    reply.initialState = JSON.parse(renderPayload.initialState)
    return reply
  }

  reply.then = (fn) => {
    replyPromise.then(fn)
    return reply
  }

  reply.catch = (fn) => {
    replyPromise.catch(fn)
    return reply
  }

  reply.state = jest.fn(() => reply)

  reply.code = jest.fn()

  reply.redirect = jest.fn(() => {
    exposedResolve()
    return reply
  })

  reply.permanent = jest.fn(() => {
    exposedResolve()
    return reply
  })

  return reply
}
// Mock out some standard dependencies for a ssr call
const mockStandardDependencies = () => {
  nockAll(API_URL, {
    '/api/navigation/categories': {},
    '/api/site-options': { creditCardOptions: [] },
    '/api/cms/pages/mobileTacticalMessageESpotPos1': {},
  })
  nockCms()
}

const getFakeAuthenticatedToken = () =>
  new Promise((resolve) =>
    signJwt(
      {
        'arcadia-session-key': 'testSessionKey',
        email: 'test@test.com',
        userTrackingId: 'testTrackingId',
        exists: true,
        hasCardNumberHash: true,
        hasPayPal: true,
        hasDeliveryDetails: true,
        hasBillingDetails: true,
      },
      (err, token) => resolve(token)
    )
  )

let reply

const buildHelmetObject = (props = {}) => ({
  toComponent: jest.fn(() => [
    {
      props,
    },
  ]),
})

describe('server-side-render', () => {
  const criticalCssMock = { dorothyperkins: '.body { color: "red"; } ' }

  beforeEach(() => {
    nock.cleanAll()
    setCriticalCssFiles(criticalCssMock)
    mockStandardDependencies()
    jest.resetAllMocks()
    reply = getFakeReply()
    getFeatures.mockImplementation(() => [])

    global.process.env.API_URL = 'https://some.fake.url/api'

    getLocation.mockReturnValueOnce({
      pathname: '/',
    })

    Helmet.rewind.mockImplementation(() => {
      return { title: '', meta: '', link: '', script: buildHelmetObject() }
    })
  })

  describe('@render', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('If the user lands on the homepage, outputs the initialState with no personal data', async () => {
      const token = await getFakeAuthenticatedToken()

      serverSideRenderer(
        {
          ...BASE_REQUEST,
          jwtPayload: {
            exists: true,
            isPwdReset: false,
          },
          state: {
            token,
          },
        },
        reply
      )

      const { html, initialState } = await reply

      // User State is removed
      expect(initialState.account.user).toEqual({})
      expect(initialState.auth.authentication).toBeFalsy()

      // No instances of it anywhere else
      const stringState = JSON.stringify(initialState)
      expect(stringState.includes('testSessionKey')).toBeFalsy()
      expect(stringState.includes('test@test.com')).toBeFalsy()
      expect(stringState.includes('testTrackingId')).toBeFalsy()

      // Or in the markup
      expect(html.includes('testSessionKey')).toBeFalsy()
      expect(html.includes('test@test.com')).toBeFalsy()
      expect(html.includes('testTrackingId')).toBeFalsy()
    })

    describe('Critical css', () => {
      it('should return critical css to server side renderer', async () => {
        serverSideRenderer(BASE_REQUEST, reply)
        const { criticalCss } = await reply

        expect(criticalCss).toEqual(criticalCssMock.dorothyperkins)
      })

      it('should not return critical css property if critical css is not found', async () => {
        setCriticalCssFiles({})
        serverSideRenderer(BASE_REQUEST, reply)
        const { criticalCss } = await reply
        expect(criticalCss).toEqual(undefined)
      })

      it('should get critical Css files once been set', () => {
        const cssFiles = { dorothyperkins: '' }
        setCriticalCssFiles(cssFiles)
        expect(getCriticalCssFiles()).toEqual(cssFiles)
      })
    })

    it('should output helmet noscript', async () => {
      const noscriptData = 'noscript-data'
      Helmet.rewind.mockImplementation(() => {
        return {
          title: '',
          meta: '',
          link: '',
          script: '',
          noscript: noscriptData,
        }
      })

      serverSideRenderer(BASE_REQUEST, reply)

      const { noscript } = await reply
      expect(noscript).toEqual(noscriptData)
    })

    it('outputs an html string for rendering', async () => {
      serverSideRenderer(BASE_REQUEST, reply)

      const { html } = await reply
      expect(typeof html).toBe('string')
    })

    it('calls postStorePopulation sequence helper when supplied', async () => {
      const postStorePopulation = jest.fn()
      serverSideRenderer(BASE_REQUEST, reply, { postStorePopulation })

      await reply
      expect(postStorePopulation).toHaveBeenCalledWith(
        BASE_REQUEST,
        expect.anything()
      )
    })

    it('outputs the newrelic script response as nreum', async () => {
      serverSideRenderer(BASE_REQUEST, reply)

      const { initialState } = await reply
      expect(typeof initialState).toBe('object')
    })

    it('outputs the assets for the app to inject', async () => {
      getScripts.mockImplementation(() => 'string')
      serverSideRenderer(BASE_REQUEST, reply)

      const { scripts } = await reply
      expect(typeof scripts).toBe('string')
    })

    it('outputs meta data for the page', async () => {
      serverSideRenderer(BASE_REQUEST, reply)

      const {
        brandName,
        lang,
        title,
        meta,
        link,
        version,
        webpackManifest,
        isRedAnt,
      } = await reply
      expect(typeof brandName).toBe('string')
      expect(typeof lang).toBe('string')
      expect(typeof title).toBe('string')
      expect(typeof meta).toBe('string')
      expect(typeof link).toBe('string')
      expect(typeof version).toBe('string')
      expect(typeof webpackManifest).toBe('string')
      expect(typeof isRedAnt).toBe('boolean')
    })

    describe('brandlock', () => {
      it("should output the site's brandlockId if FEATURE_BRANDLOCK enabled", async () => {
        isFeatureBrandlockEnabled.mockReturnValue(true)
        serverSideRenderer(BASE_REQUEST, reply)

        const { brandlockId } = await reply
        expect(brandlockId).toBe('69ef9f11')
      })

      it("should not output the site's brandlockId if FEATURE_BRANDLOCK is disabled", async () => {
        isFeatureBrandlockEnabled.mockReturnValue(false)
        serverSideRenderer(BASE_REQUEST, reply)

        const { brandlockId } = await reply
        expect(brandlockId).toBeFalsy()
      })
    })

    describe('Server side analyics', () => {
      it('should use server side analytics to log a purchase', async () => {
        paymentsHelper.mockImplementation(() => 'data')

        const request = clone(BASE_REQUEST)
        request.url.pathname = '/order-complete'

        serverSideRenderer(request, reply)
        await reply
        expect(serverSideAnalytics.logSsrOrderComplete).toHaveBeenCalled()
      })

      it('should not use server side analytics if not in /order-complete', async () => {
        paymentsHelper.mockImplementation(() => 'data')

        const request = clone(BASE_REQUEST)
        request.url.pathname = '/somewhere-else'

        serverSideRenderer(request, reply)
        await reply
        expect(serverSideAnalytics.logSsrOrderComplete).not.toHaveBeenCalled()
      })

      it('should not use server side analytics to log a purchase from an app', async () => {
        paymentsHelper.mockImplementation(() => 'data')

        const request = clone(BASE_REQUEST)
        request.url.pathname = '/order-complete'
        request.headers['monty-client-device-type'] = 'apps'

        serverSideRenderer(request, reply)
        await reply
        expect(serverSideAnalytics.logSsrOrderComplete).not.toHaveBeenCalled()
      })
    })

    describe('GeoIP', () => {
      modalActions.toggleModal = jest.fn()

      beforeEach(() => {
        jest.clearAllMocks()
        getFeatures.mockImplementation(() => [])
      })

      describe('when a redirect URL should not be provided', () => {
        it('sets the Geo IP state when a request comes in and does not call the toggle modal to display the content overlay', async () => {
          modalActions.toggleModal.mockReturnValueOnce({})
          const info = {
            hostname: 'm.dorothyperkins.com',
          }
          const headers = {
            cookie: '',
            'x-user-geo': 'GB',
          }
          const state = {
            featuresOverride: JSON.stringify({
              [FEATURE_GEOIP]: true,
            }),
          }
          const request = { ...BASE_REQUEST, headers, state, info }

          serverSideRenderer(request, reply)
          const { initialState } = await reply

          expect(initialState.geoIP).toMatchObject({
            redirectURL: '',
            hostname: 'm.dorothyperkins.com',
            geoISO: 'GB',
            storedGeoPreference: '',
            userISOPreference: 'GB',
            userRegionPreference: 'uk',
            userLanguagePreference: 'en-gb',
          })
          expect(modalActions.toggleModal).not.toHaveBeenCalled()
        })
      })

      describe('when a redirect URL should be provided', () => {
        it('should set the Geo IP state to storedGeoPreference when userGeo is unavailable when a request comes in and calls toggle modal to display the content overlay', async () => {
          modalActions.toggleModal.mockReturnValueOnce({
            type: 'IGNORE', // middleware require type but for the purpose of this test we don't care
          })
          const info = {
            hostname: 'm.dorothyperkins.com',
          }
          const headers = {
            cookie: 'GEOIP=US',
            'x-user-geo': '',
          }
          const state = {
            featuresOverride: JSON.stringify({
              [FEATURE_GEOIP]: true,
            }),
          }
          const request = { ...BASE_REQUEST, headers, state, info }

          serverSideRenderer(request, reply)
          const { initialState } = await reply

          expect(initialState.geoIP).toMatchObject({
            redirectURL: '',
            hostname: 'm.dorothyperkins.com',
            geoISO: '',
            storedGeoPreference: 'US',
            userISOPreference: 'US',
            userRegionPreference: 'us',
            userLanguagePreference: 'en-us',
          })
          expect(modalActions.toggleModal).toHaveBeenCalled()
        })

        it('should try to construct a mini dictionary for the GeoIP modal and set it in initial state', async () => {
          const fakeGeoIPDictionary = { foo: 'bar' }
          const headers = {
            cookie: 'GEOIP=FR',
            'x-user-geo': 'GB',
          }
          modalActions.toggleModal.mockReturnValueOnce({
            type: 'IGNORE', // middleware require type but for the purpose of this test we don't care
          })
          localisationUtils.getGeoIPDictionary.mockReturnValue(
            fakeGeoIPDictionary
          )
          const hostname = 'm.dorothyperkins.com'
          const info = { hostname }

          const state = {
            featuresOverride: JSON.stringify({
              [FEATURE_GEOIP]: true,
            }),
          }
          const request = { ...BASE_REQUEST, headers, state, info }

          expect(localisationUtils.getGeoIPDictionary).not.toHaveBeenCalled()

          serverSideRenderer(request, reply)
          const { initialState } = await reply

          expect(localisationUtils.getGeoIPDictionary).toHaveBeenCalled()
          const [
            brandConfig,
            language,
          ] = localisationUtils.getGeoIPDictionary.mock.calls[0]
          expect(brandConfig.domains.prod).toContain(hostname)
          expect(language).toBe('en-gb')
          expect(initialState.localisation.geoIPDictionary).toEqual(
            fakeGeoIPDictionary
          )
        })
      })
    })

    describe('pathname', () => {
      it('should set the store locator country', async () => {
        jest.spyOn(storeLocatorActions, 'selectCountry')

        const request = clone(BASE_REQUEST)
        request.url.pathname = '/store-locator'
        isFeatureYextEnabled.mockReturnValueOnce(true)

        serverSideRenderer(request, reply)
        await reply

        expect(storeLocatorActions.selectCountry).toHaveBeenCalledTimes(0)
      })
    })

    describe('bagCount', () => {
      it('should update the shopping bag count', async () => {
        jest.spyOn(shoppingBagActions, 'updateShoppingBagBadgeCount')

        const request = clone(BASE_REQUEST)
        request.state.bagCount = 2

        serverSideRenderer(request, reply)

        await reply

        expect(
          shoppingBagActions.updateShoppingBagBadgeCount
        ).toHaveBeenCalledWith(2)
      })
    })

    describe('product view', () => {
      it('should display the product view', async () => {
        jest.spyOn(productViewActions, 'selectView')

        const request = clone(BASE_REQUEST)
        request.state.productIsActive = 'true'

        serverSideRenderer(request, reply)

        await reply

        expect(productViewActions.selectView).toHaveBeenCalledWith('Product')
      })

      it('should display the outfit view', async () => {
        jest.spyOn(productViewActions, 'selectView')

        const request = clone(BASE_REQUEST)
        request.state.productIsActive = 'false'

        serverSideRenderer(request, reply)

        await reply

        expect(productViewActions.selectView).toHaveBeenCalledWith('Outfit')
      })
    })

    describe('password reset', () => {
      it('should dispatch the USER_ACCOUNT action', async () => {
        jest.spyOn(accountActions, 'userAccount')

        const request = clone(BASE_REQUEST)
        request.jwtPayload = {
          isPwdReset: true,
        }

        serverSideRenderer(request, reply)

        await reply

        expect(accountActions.userAccount).toHaveBeenCalledWith(
          request.jwtPayload
        )
      })
    })

    describe('monty debug', () => {
      it('should allow debugging if monty debugging cookie is set', async () => {
        jest.spyOn(debugActions, 'allowDebug')

        const request = clone(BASE_REQUEST)
        request.state = {
          montydebug: true,
        }

        serverSideRenderer(request, reply)

        await reply

        expect(debugActions.allowDebug).toHaveBeenCalled()
      })

      it('should allow debugging if query string parameter is set', async () => {
        jest.spyOn(debugActions, 'allowDebug')

        const request = clone(BASE_REQUEST)
        request.url = {
          query: {
            montydebug: '',
          },
          pathname: '/',
        }

        serverSideRenderer(request, reply)

        await reply

        expect(debugActions.allowDebug).toHaveBeenCalled()
      })
    })

    describe('klarna', () => {
      it('should set the klarna client token', async () => {
        jest.spyOn(klarnaActions, 'setKlarnaClientToken')

        const request = clone(BASE_REQUEST)
        request.state = {
          klarnaClientToken: 'token',
        }

        serverSideRenderer(request, reply)

        await reply

        expect(klarnaActions.setKlarnaClientToken).toHaveBeenCalledWith('token')
      })
    })
  })

  describe('Qubit experience smartserve IDs', () => {
    const qubit_disabled = global.process.env.QUBIT_DISABLED
    const qubit_environment = global.process.env.QUBIT_ENVIRONMENT
    beforeEach(() => {
      process.env.QUBIT_DISABLED = 'false'
      isFeatureQubitHiddenEnabled.mockReturnValue(false)
      process.env.WCS_ENVIRONMENT = undefined
    })

    afterEach(() => {
      global.process.env.QUBIT_DISABLED = qubit_disabled
      process.env.QUBIT_ENVIRONMENT = qubit_environment
    })

    it('should call getScripts with no smartserve IDs when FEATURE_QUBIT_HIDDEN feature flag is on', async () => {
      isFeatureQubitHiddenEnabled.mockReturnValue(true)
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledTimes(1)
      expect(getPreloadScripts).toHaveBeenCalledTimes(1)
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: undefined,
        })
      )
    })

    it('should call getScripts with no smartserve IDs when QUBIT_DISABLED environment flag is set to "true"', async () => {
      global.process.env.QUBIT_DISABLED = 'true'
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledTimes(1)
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: undefined,
        })
      )
    })

    it('should call getScripts with smartserve IDs when QUBIT_DISABLED environment flag is anything but "true"', async () => {
      process.env.QUBIT_DISABLED = 'some silly spelling mistake'
      isFeatureQubitHiddenEnabled.mockImplementationOnce(() => false)
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledTimes(1)
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: 5671,
        })
      )
    })

    it('should call getScripts with smartserve IDs when FEATURE_QUBIT_HIDDEN feature flag is not on', async () => {
      isFeatureQubitHiddenEnabled.mockReturnValue(false)
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledTimes(1)
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: 5671,
        })
      )
    })

    it("should call getScripts with prod smartServeId when QUBIT_ENVIRONMENT = 'prod'", async () => {
      global.process.env.QUBIT_ENVIRONMENT = 'prod'
      isFeatureQubitHiddenEnabled.mockReturnValue(false)
      const request = clone(BASE_REQUEST)

      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: 5671,
        })
      )
    })

    it("should call getScripts with stage smartServeId when QUBIT_ENVIRONMENT = 'stage'", async () => {
      global.process.env.QUBIT_ENVIRONMENT = 'stage'
      isFeatureQubitHiddenEnabled.mockReturnValue(false)
      const request = clone(BASE_REQUEST)

      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: 5695,
        })
      )
    })

    it('should handle the case where the given config is missing a smartServe property', async () => {
      const getFakeSiteConfig = jest.spyOn(configs, 'getSiteConfig')
      getFakeSiteConfig.mockImplementationOnce(() => ({
        locale: 'en',
        language: 'en',
        region: 'uk',
        brandCode: 'ts',
        qubit: { smartserveIds: {} },
        brandName: 'dorothyperkins',
        currencyCode: 'GBP',
        domains: { prod: [''] },
        preferredISOs: [],
        googleTagManager: {
          id: 'TEST',
          environment: {
            default: {
              auth: 'auth',
              preview: 'preview',
              cookiesWin: 'cookiesWin',
            },
          },
        },
      }))

      const request = clone(BASE_REQUEST)

      serverSideRenderer(request, reply)
      await reply
      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          smartServeId: false,
        })
      )
      getFakeSiteConfig.mockRestore()
    })
  })

  describe('GEOIP', () => {
    it('cookie with value "GEOIP" set if no GEOIP cookie present', async () => {
      const request = clone({
        ...BASE_REQUEST,
        info: {
          ...BASE_REQUEST.info,
          hostname: 'de.dorothyperkins.com',
        },
      })
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith('GEOIP', 'DE', { path: '/' })
    })
  })

  describe('deviceType', () => {
    it('is set as cookie with value "desktop" if no request property "monty-client-device-type"', async () => {
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state.mock.calls[2]).toEqual([
        'deviceType',
        'desktop',
        { path: '/' },
      ])
    })
    it('is set as cookie with value "desktop" in case of request property "monty-client-device-type" set to desktop', async () => {
      const request = clone(BASE_REQUEST)
      request.headers['monty-client-device-type'] = 'desktop'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state.mock.calls[2]).toEqual([
        'deviceType',
        'desktop',
        { path: '/' },
      ])
    })
    it('is set as cookie with value "mobile" in case of request property "monty-client-device-type" set to mobile', async () => {
      const request = clone(BASE_REQUEST)
      request.headers['monty-client-device-type'] = 'mobile'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state.mock.calls[2]).toEqual([
        'deviceType',
        'mobile',
        { path: '/' },
      ])
    })
  })

  describe('Session Jwt', () => {
    const sessionJwtValue = 'session.jwt.test'
    it('sets state if in cookie', async () => {
      const request = clone(BASE_REQUEST)
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        BACKEND_JWT,
        sessionJwtValue,
        jsessionidCookieOptions
      )
    })

    it('should set SameSite:None cookie policy if browser is compatible', async () => {
      const request = {
        ...BASE_REQUEST,

        headers: {
          // Chrome 80 on macOS
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
        },
      }
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(BACKEND_JWT, sessionJwtValue, {
        ...getJsessionidCookieOptions(request.headers['user-agent']),
        isSameSite: 'None',
        isSecure: true,
      })
    })

    it('should not set SameSite:None cookie policy if browser is not compatible', async () => {
      const request = {
        ...BASE_REQUEST,
        headers: {
          // Chrome 46 on Windows 7
          'user-agent':
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
        },
      }
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        BACKEND_JWT,
        sessionJwtValue,
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('should not set SameSite:None cookie policy if browser rejects "SameSite=None"', async () => {
      const request = {
        ...BASE_REQUEST,

        /* NOTE:
         * Versions of Chrome from Chrome 51 to Chrome 66 (inclusive on both ends).
         * These Chrome versions will reject a cookie with SameSite=None.
         *
         *  */

        headers: {
          // Chrome 60 on Windows 10
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        },
      }
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        BACKEND_JWT,
        sessionJwtValue,
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('should not set SameSite:None cookie policy and return default payload if user-agent is broken', async () => {
      const request = {
        ...BASE_REQUEST,

        headers: {
          // This user-agent has been edited to fail
          'user-agent':
            'Moz/5.0 (X11; OpenBSD ) AppleWebKit (KHTML, like Gecko) Chrome/6',
        },
      }
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        BACKEND_JWT,
        sessionJwtValue,
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('should not set "SameSite:None" cookie policy and return default payload if user agent is an empty string', async () => {
      const request = {
        ...BASE_REQUEST,

        headers: {
          'user-agent': '',
        },
      }
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        BACKEND_JWT,
        sessionJwtValue,
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it("doesn't set session jwt if none provided on request", async () => {
      const request = clone(BASE_REQUEST)
      request.state[BACKEND_JWT] = ''
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).not.toHaveBeenCalledWith(
        BACKEND_JWT,
        '',
        jsessionidCookieOptions
      )
    })

    it('clears state', async () => {
      const request = clone(BASE_REQUEST)
      request.state[BACKEND_JWT] = sessionJwtValue
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state[BACKEND_JWT]).toEqual(undefined)
    })
  })

  describe('State property hostname -> mobile', () => {
    it('is set to true for mobile hostname', async () => {
      const request = {
        ...BASE_REQUEST,
        info: { hostname: 'm.dorothyperkins.com' },
      }
      const spy = jest.spyOn(hostnameActions, 'setHostnameProperties')

      serverSideRenderer(request, reply)
      await reply

      expect(hostnameActions.setHostnameProperties).toHaveBeenCalledWith(
        'm.dorothyperkins.com'
      )

      spy.mockRestore()
    })
    it('is set to false for desktop hostname', async () => {
      const request = {
        ...BASE_REQUEST,
        info: { hostname: 'www.dorothyperkins.com' },
      }
      const spy = jest.spyOn(hostnameActions, 'setHostnameProperties')

      serverSideRenderer(request, reply)
      await reply

      expect(hostnameActions.setHostnameProperties).toHaveBeenCalledWith(
        'www.dorothyperkins.com'
      )

      spy.mockRestore()
    })
  })

  describe('authenticated state', () => {
    process.env.USE_NEW_HANDLER = 'true'
    it('dispatch SET_AUTHENTICATION as partial if user is partially authenticated ', async () => {
      authActions.setAuthentication.mockReturnValueOnce({
        type: 'IGNORE',
      })
      authActions.authLogin.mockReturnValueOnce({
        type: 'IGNORE',
      })
      const request = clone(BASE_REQUEST)
      request.state.authenticated = 'partial'
      serverSideRenderer(request, reply)
      await reply
      expect(authActions.setAuthentication).toBeCalledWith('partial')
    })

    it('dispatch SET_AUTHENTICATION as full if user is fully authenticated ', async () => {
      authActions.setAuthentication.mockReturnValueOnce({
        type: 'IGNORE',
      })
      authActions.authLogin.mockReturnValue({
        type: 'IGNORE',
      })
      const request = clone(BASE_REQUEST)
      request.state.authenticated = 'yes'
      serverSideRenderer(request, reply)
      await reply
      expect(authActions.setAuthentication).toBeCalledWith('full')
    })

    it('should not dispatch SET_AUTHENTICATION if user is not authenticated', async () => {
      const request = clone(BASE_REQUEST)
      request.state.authenticated = 'false'
      serverSideRenderer(request, reply)
      await reply
      expect(authActions.setAuthentication).not.toBeCalledWith()
    })
  })

  describe('Jsession', () => {
    it('sets state if in cookie', async () => {
      const request = clone(BASE_REQUEST)
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        'AAAAA',
        jsessionidCookieOptions
      )
    })

    it('should set SameSite:None cookie policy if browser is compatible', async () => {
      const request = {
        ...BASE_REQUEST,

        headers: {
          // Chrome 80 on macOS
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
        },
      }
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith('jsessionid', 'AAAAA', {
        ...getJsessionidCookieOptions(request.headers['user-agent']),
        isSameSite: 'None',
        isSecure: true,
      })
    })

    it('should not set SameSite:None cookie policy if browser is not compatible', async () => {
      const request = {
        ...BASE_REQUEST,
        headers: {
          // Chrome 46 on Windows 7
          'user-agent':
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
        },
      }
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        'AAAAA',
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('should not set SameSite:None cookie policy if browser rejects "SameSite=None"', async () => {
      const request = {
        ...BASE_REQUEST,

        /* NOTE:
         * Versions of Chrome from Chrome 51 to Chrome 66 (inclusive on both ends).
         * These Chrome versions will reject a cookie with SameSite=None.
         *
         *  */

        headers: {
          // Chrome 60 on Windows 10
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        },
      }
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        'AAAAA',
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('should not set SameSite:None cookie policy and return default payload if user-agent is broken', async () => {
      const request = {
        ...BASE_REQUEST,

        headers: {
          // This user-agent has been edited to fail
          'user-agent':
            'Moz/5.0 (X11; OpenBSD ) AppleWebKit (KHTML, like Gecko) Chrome/6',
        },
      }
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        'AAAAA',
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('should not set "SameSite:None" cookie policy and return default payload if user agent is an empty string', async () => {
      const request = {
        ...BASE_REQUEST,

        headers: {
          'user-agent': '',
        },
      }
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        'AAAAA',
        getJsessionidCookieOptions(request.headers['user-agent'])
      )
    })

    it('sets a new jsessionid if not in cookie', async () => {
      const request = clone(BASE_REQUEST)
      request.state.jsessionid = undefined
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state).toHaveBeenCalledWith(
        'jsessionid',
        '__new_jsessionid__',
        jsessionidCookieOptions
      )
    })

    it('clears state', async () => {
      const request = clone(BASE_REQUEST)
      request.state.jsessionid = 'AAAAA'
      serverSideRenderer(request, reply)
      await reply
      expect(reply.state.jsessionid).toEqual(undefined)
    })
  })

  describe('IE11 Polyfill', () => {
    it('should be included in the page', async () => {
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      const { iePolyFill } = await reply
      expect(iePolyFill).toBe('common/polyfill-ie11.js')
    })
  })

  describe('debug environment', () => {
    const apiUrl = global.process.env.API_URL
    const coreEnv = global.process.env.WCS_ENVIRONMENT
    const wcsHandlder = global.process.env.USE_NEW_HANDLER

    afterEach(() => {
      global.process.env.API_URL = apiUrl
      global.process.env.WCS_ENVIRONMENT = coreEnv
      global.process.env.USE_NEW_HANDLER = wcsHandlder
    })

    it('should handle core API', async () => {
      global.process.env.USE_NEW_HANDLER = true
      global.process.env.WCS_ENVIRONMENT = 'prod'
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      const { initialState } = await reply
      expect(initialState.debug.environment).toBe('prod')
    })

    it('should handle Scrapi', async () => {
      global.process.env.USE_NEW_HANDLER = false
      global.process.env.API_URL = 'https://prod.api.arcadiagroup.co.uk/api'
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      const { initialState } = await reply
      expect(initialState.debug.environment).toBe('prod')
    })
  })

  describe('Redirect', () => {
    it('does not redirect if routing redirect is not present', async () => {
      serverSideRenderer(clone(BASE_REQUEST), reply)
      await reply

      expect(reply.redirect).not.toHaveBeenCalled()
      expect(reply.permanent).not.toHaveBeenCalled()
    })

    it('does redirect if routing redirect is present', async () => {
      const redirect = 'redirect.com/redirect-pathname'
      getRedirect.mockImplementation(() => ({
        url: redirect,
      }))

      serverSideRenderer(clone(BASE_REQUEST), reply)
      await reply

      expect(reply.redirect).toHaveBeenCalledTimes(1)
      expect(reply.redirect).toHaveBeenCalledWith(redirect)

      expect(reply.permanent).not.toHaveBeenCalled()
    })

    it('does permanently redirect if routing redirect is present and permanent flag is true', async () => {
      const redirect = 'redirect.com/redirect-pathname'
      getRedirect.mockImplementation(() => ({
        url: redirect,
        permanent: true,
      }))

      serverSideRenderer(clone(BASE_REQUEST), reply)
      await reply

      expect(reply.redirect).toHaveBeenCalledTimes(1)
      expect(reply.redirect).toHaveBeenCalledWith(redirect)

      expect(reply.permanent).toHaveBeenCalledTimes(1)
      expect(reply.permanent).toHaveBeenCalledWith(true)
    })
  })

  describe('Google Tag Manager Id', () => {
    const tagManager = global.process.env.GOOGLE_TAG_MANAGER_OVERRIDE

    afterEach(() => {
      global.process.env.GOOGLE_TAG_MANAGER_OVERRIDE = tagManager
    })

    it('uses brandConfig if no environment varialble', async () => {
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      const { initialState } = await reply
      expect(initialState.config.googleTagManagerId).toBe('GTM-5MZP3Z4')
    })

    it('uses environment variable if environment varialble provided over brandconfig', async () => {
      global.process.env.GOOGLE_TAG_MANAGER_OVERRIDE = 'hello'
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      const { initialState } = await reply
      expect(initialState.config.googleTagManagerId).toBe('hello')
    })
  })

  describe('Preloading', () => {
    it('should call getPreloadScripts', async () => {
      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply
      expect(getPreloadScripts).toHaveBeenCalledTimes(1)
    })
  })

  describe('Deferring MCR script', () => {
    it('should defer the MCR script', async () => {
      const script = buildHelmetObject({ src: 'foo' })
      Helmet.rewind.mockImplementation(() => {
        return { title: '', meta: '', link: '', script }
      })

      const request = clone(BASE_REQUEST)
      serverSideRenderer(request, reply)
      await reply

      expect(getScripts).toHaveBeenCalledWith(
        expect.objectContaining({
          mcrScript: [
            {
              src: 'foo',
            },
          ],
        })
      )
    })
  })
})

describe('Server routing', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    getFeatures.mockImplementation(() => [])
  })

  it('redirects a guest user to login if they try to hit a protected path', async () => {
    const reply = getFakeReply()
    const request = {
      ...BASE_REQUEST,
      url: {
        pathname: '/my-account',
        query: {},
      },
    }

    getLocation.mockReturnValueOnce({
      pathname: '/my-account',
      query: {},
    })

    serverSideRenderer(clone(request), reply)
    await reply

    expect(reply.redirect).toHaveBeenCalledTimes(1)
    expect(reply.redirect).toHaveBeenCalledWith('/login')
  })
})

describe('getAsynsChunks', () => {
  it('should return array of chunks with correct path to chunk file', () => {
    const comps = [
      {
        webpackChunkName: 'Home',
      },
    ]

    const getChunks = getAsyncChunks(comps)
    expect(getChunks).toEqual(['common/Home.js'])
  })

  it('should return empty asyncChunks array if webpackChunkName is not set', () => {
    const comps = [
      {
        webpackChunkName: null,
      },
    ]

    const getChunks = getAsyncChunks(comps)
    expect(getChunks).toEqual([])
  })

  it('should return empty asyncChunks array if no chunk exists for components chunk name', () => {
    const comps = [
      {
        webpackChunkName: 'LoginRegisterContainer',
      },
    ]
    const getChunks = getAsyncChunks(comps)
    expect(getChunks).toEqual([])
  })
})

describe('Newrelic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the sessionKey custom attribute when a new session key is generated', async () => {
    serverSideRenderer(
      {
        ...BASE_REQUEST,
        state: {
          jsessionid: null,
        },
      },
      reply
    )

    await reply

    expect(montyNewrelic.addCustomAttribute).toHaveBeenCalledWith(
      'sessionKey',
      expect.any(String)
    )
  })

  it('does not set the sessionKey custom attribute if a session key exists', async () => {
    serverSideRenderer(
      {
        ...BASE_REQUEST,
        state: {
          jsessionid: 'alreadySet',
        },
      },
      reply
    )

    await reply

    expect(montyNewrelic.addCustomAttribute).not.toHaveBeenCalled()
  })
})
