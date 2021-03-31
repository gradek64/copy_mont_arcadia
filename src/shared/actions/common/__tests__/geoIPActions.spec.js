import * as geoIPActions from '../geoIPActions'
import { get } from '../../../lib/api-service'
import { error } from '../../../../server/lib/logger'
import topshop from '../../../../server/config/brands/topshop'
import { SUPPORTED_FEATURES } from '../../../constants/features'
import * as geoIPUtils from '../../../lib/geo-ip-utils'

jest.mock('../../../lib/api-service')
jest.mock('../../../../server/lib/logger')

const { FEATURE_GEOIP } = SUPPORTED_FEATURES

describe('geoIPActions', () => {
  let originalProcessBrowser
  beforeEach(() => {
    jest.clearAllMocks()
    originalProcessBrowser = process.browser
    process.browser = false
  })

  afterEach(() => {
    process.browser = originalProcessBrowser
  })

  it('setGeoIPRequestData', () => {
    expect(
      geoIPActions.setGeoIPRequestData({
        hostname: 'foo',
        geoISO: 'GB',
        storedGeoPreference: 'US',
        userISOPreference: 'US',
        userRegionPreference: 'us',
        userLanguagePreference: 'en-us',
      })
    ).toEqual({
      type: 'SET_GEOIP_REQUEST_DATA',
      hostname: 'foo',
      geoISO: 'GB',
      storedGeoPreference: 'US',
      userISOPreference: 'US',
      userRegionPreference: 'us',
      userLanguagePreference: 'en-us',
    })
  })

  it('setGeoIPRedirectInfo action creator', () => {
    const redirectURL = 'http://philip.es'
    expect(geoIPActions.setGeoIPRedirectInfo(redirectURL)).toEqual({
      type: 'SET_GEOIP_REDIRECT_URL',
      redirectURL,
    })
  })

  describe('setRedirectURLForPDP', () => {
    it('only works on the server', async () => {
      process.browser = true
      const dispatch = jest.fn()
      await geoIPActions.setRedirectURLForPDP('123')(dispatch, () => {})
      expect(dispatch).not.toHaveBeenCalled()
      expect(get).not.toHaveBeenCalled()
    })

    it('does nothing if `partNumber` is falsy', async () => {
      const dispatch = jest.fn()
      await geoIPActions.setRedirectURLForPDP(undefined)(dispatch, () => {})
      expect(dispatch).not.toHaveBeenCalled()
      expect(get).not.toHaveBeenCalled()
    })

    it("should resolve early if the user's pref ISO is included in the site's preferredISOs", async () => {
      const partNumber = 'TS26K31NGRY'
      const dispatch = jest.fn()
      const fakeConfig = { preferredISOs: ['US'] }
      const getState = () => ({
        config: fakeConfig,
        geoIP: {
          hostname: 'm.topshop.com',
          userISOPreference: 'US',
        },
        features: { status: { [FEATURE_GEOIP]: true } },
      })
      jest
        .spyOn(geoIPUtils, 'getRedirectURL')
        .mockReturnValue('fakeredirect.com')

      await geoIPActions.setRedirectURLForPDP(partNumber)(dispatch, getState)

      expect(get).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      geoIPUtils.getRedirectURL.mockRestore()
    })

    it('sets a redirect url for a PDP page', async () => {
      const iso = 'US'
      const partNumber = 'TS26K31NGRY'
      const dispatch = jest.fn((x) => x)
      const getState = () => ({
        config: topshop.find((conf) => conf.storeCode === 'tsuk'),
        geoIP: {
          hostname: 'm.topshop.com',
          userISOPreference: 'US',
        },
        features: { status: { [FEATURE_GEOIP]: true } },
        hostname: {},
      })
      get.mockReturnValueOnce(
        Promise.resolve({
          body: {
            sourceUrl:
              'http://ts.stage.arcadiagroup.ltd.uk/en/tsus/product/old-skool-trainers-by-vans-supplied-by-office-6914580',
          },
        })
      )

      await geoIPActions.setRedirectURLForPDP(partNumber)(dispatch, getState)

      expect(get).toHaveBeenCalledWith(`/${iso}/products/${partNumber}`)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_GEOIP_REDIRECT_URL',
        redirectURL: `m.us.topshop.com/en/tsus/product/old-skool-trainers-by-vans-supplied-by-office-6914580?internationalRedirect=geoIPModal-tsuk`,
      })
    })

    it('does not dispatch a request to get a PDP page if the user is already on their preferred site and returns a resolved promise', async () => {
      const partNumber = 'TS26K31NGRY'
      const dispatch = jest.fn((x) => x)
      const getState = () => ({
        config: topshop.find((conf) => conf.storeCode === 'tsus'),
        geoIP: {
          hostname: 'm.topshop.com',
          userISOPreference: 'US',
        },
        features: { status: { [FEATURE_GEOIP]: true } },
        hostname: {},
      })

      await geoIPActions.setRedirectURLForPDP(partNumber)(dispatch, getState)

      expect(get).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('sets a 404 redirect url for a missing PDP page', async () => {
      const iso = 'FR'
      const partNumber = 'TS26K31NGRY'
      const dispatch = jest.fn((x) => x)
      const getState = () => ({
        config: topshop.find((conf) => conf.storeCode === 'tsuk'),
        geoIP: {
          hostname: 'm.topshop.com',
          userISOPreference: iso,
        },
        features: { status: { [FEATURE_GEOIP]: true } },
        hostname: {},
      })
      get.mockReturnValueOnce(Promise.reject({ success: false }))

      await geoIPActions.setRedirectURLForPDP(partNumber)(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_GEOIP_REDIRECT_URL',
        redirectURL: 'm.fr.topshop.com/404',
      })
    })

    it('does not blow up if returned source url is not a valid url and logs an error', async () => {
      const iso = 'US'
      const partNumber = 'TS26K31NGRY'
      const dispatch = jest.fn((x) => x)
      const getState = () => ({
        config: topshop.find((conf) => conf.storeCode === 'tsuk'),
        geoIP: {
          hostname: 'm.topshop.com',
          userISOPreference: iso,
        },
        features: { status: { [FEATURE_GEOIP]: true } },
        hostname: {},
      })
      get.mockReturnValueOnce(
        Promise.resolve({
          body: {
            sourceUrl: 'smelliestofurls',
          },
        })
      )

      await geoIPActions.setRedirectURLForPDP(partNumber)(dispatch, getState)

      expect(error).toHaveBeenCalledWith('GeoIP', {
        message: 'Invalid `sourceUrl` returned in foreign PDP response',
        apiUrl: '/US/products/TS26K31NGRY',
        queryString: '?internationalRedirect=geoIPModal-tsuk',
        redirectURL: 'm.us.topshop.com',
        sourceUrl: 'smelliestofurls',
        request: {
          partNumber,
          iso,
        },
        state: {
          geoIPRedirectURL:
            'm.us.topshop.com?internationalRedirect=geoIPModal-tsuk',
        },
      })
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_GEOIP_REDIRECT_URL',
        redirectURL: 'm.us.topshop.com/404',
      })
    })
  })
})
