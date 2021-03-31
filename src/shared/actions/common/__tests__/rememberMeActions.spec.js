import * as actions from '../rememberMeActions'

jest.mock('../../../components/containers/SignIn/SignIn', () =>
  jest.fn(() => null)
)

jest.mock('../../../selectors/shoppingBagSelectors', () => ({
  isMinibagOpen: jest.fn(() => true),
}))

jest.mock('../../../selectors/featureSelectors', () => ({
  isFeatureDDPEnabled: () => false,
  isFeatureDDPActiveBannerEnabled: () => false,
  isFeatureRememberMeEnabled: jest.fn(),
  isFeatureDDPPromoEnabled: jest.fn(),
  isFeatureDDPRenewable: () => false,
  isFeatureApplePayEnabled: jest.fn(() => false),
  isFeatureClearPayEnabled: jest.fn(() => false),
}))
import { isFeatureRememberMeEnabled } from '../../../selectors/featureSelectors'

jest.mock('../authActions', () => ({
  setAuthentication: jest.fn(() => () => {}),
}))
import { setAuthentication } from '../authActions'

jest.mock('../shoppingBagActions', () => ({
  updateBag: jest.fn(() => () => {}),
  closeMiniBag: jest.fn(() => () => {}),
  openMiniBag: jest.fn(() => () => {}),
}))
import { updateBag } from '../shoppingBagActions'

jest.mock('../../../selectors/userAuthSelectors', () => ({
  isUserPartiallyAuthenticated: jest.fn(() => true),
}))
import { isUserPartiallyAuthenticated } from '../../../selectors/userAuthSelectors'

import {
  createStore,
  getReduxContext,
} from '../../../../../test/unit/helpers/get-redux-mock-store'

jest.mock('../sessionActions', () => ({
  openSessionTimeoutModal: jest.fn(() => () => {}),
}))

describe('rememberMeActions', () => {
  let store
  const { setCookies, setRedirect } = getReduxContext()

  const getMockStoreForLocation = (pathname) =>
    createStore({
      routing: {
        location: {
          pathname,
        },
      },
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rememberMeRedirect', () => {
    const mockReponse = {
      headers: {
        'set-cookie': [
          'authenticated=partial;Max-Age=123;Domain=.local.m.topshop.com;Path=/',
        ],
      },
    }

    it('should return a thunk', () => {
      const thunk = actions.rememberMeRedirect(mockReponse)

      expect(typeof thunk).toBe('function')
    })

    it('should set cookies if on the server for restricted routes', () => {
      store = getMockStoreForLocation('/checkout/delivery')
      store.dispatch(actions.rememberMeRedirect(mockReponse))

      expect(setCookies).toHaveBeenCalledWith([
        [
          'authenticated',
          'partial',
          {
            path: '/',
            ttl: 123 * 1000,
            domain: '.local.m.topshop.com',
          },
        ],
      ])
    })

    it('should not set cookies in the browser', () => {
      const isBrowser = process.browser
      process.browser = true
      store = getMockStoreForLocation('/checkout/delivery')
      store.dispatch(actions.rememberMeRedirect(mockReponse))
      process.browser = isBrowser

      expect(setCookies).not.toHaveBeenCalled()
    })

    it('redirects correctly inside checkout', () => {
      store = getMockStoreForLocation('/checkout/delivery')
      store.dispatch(actions.rememberMeRedirect(mockReponse))

      expect(setRedirect).toHaveBeenCalledWith('/checkout/login', 307)
    })

    it('In my Account and redirects to login', () => {
      store = getMockStoreForLocation('/my-account')
      store.dispatch(actions.rememberMeRedirect(mockReponse))

      expect(setRedirect).toHaveBeenCalled()
    })

    it('Should not redirect if the page is not my-account or checkout ', () => {
      store = getMockStoreForLocation(
        '/en/tsuk/category/jeans-6877054/joni-jeans-6906608t'
      )
      store.dispatch(actions.rememberMeRedirect(mockReponse))
      expect(setRedirect).not.toHaveBeenCalled()
    })
  })

  describe('handleRestrictedActionResponse', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('set authentication to partial', async () => {
      isFeatureRememberMeEnabled.mockReturnValueOnce(true)

      const resp = {
        status: 401,
        headers: {},
        body: {
          isRestrictedActionResponse: true,
          account: {
            rememberMe: true,
          },
        },
      }

      store.dispatch(actions.handleRestrictedActionResponse(resp))

      expect(setAuthentication).toHaveBeenCalledWith('partial')
    })

    it('updates bag', async () => {
      isFeatureRememberMeEnabled.mockReturnValueOnce(true)

      const basket = {
        orderId: 0,
        subTotal: '0.00',
        total: '0.00',
        totalBeforeDiscount: '0.00',
        deliveryOptions: [],
        promotions: [],
        discounts: [],
        products: [],
        savedProducts: [],
        ageVerificationRequired: false,
        inventoryPositions: {},
      }

      const resp = {
        status: 401,
        headers: {},
        body: {
          isRestrictedActionResponse: true,
          account: {
            rememberMe: true,
          },
          basket,
        },
      }

      store.dispatch(actions.handleRestrictedActionResponse(resp))

      expect(updateBag).toHaveBeenCalledWith(basket)
    })

    it('redirects on SSR', async () => {
      isFeatureRememberMeEnabled.mockReturnValueOnce(true)
      isUserPartiallyAuthenticated.mockReturnValueOnce(false)

      const res = {
        status: 401,
        headers: {
          'set-cookie': ['authenticated=partial;Max-Age=1234;Path=/'],
        },
        body: {
          isRestrictedActionResponse: true,
          account: {
            rememberMe: true,
          },
        },
      }

      store = getMockStoreForLocation('/my-account')
      store.dispatch(actions.handleRestrictedActionResponse(res))

      expect(store.getActions()).toEqual([
        {
          type: 'USER_ACCOUNT',
          user: {
            email: '',
            basketItemCount: 0,
          },
        },
      ])
      expect(setAuthentication).toHaveBeenCalledWith('partial')
    })

    it('does not redirect on SSR if already partially authenticated', async () => {
      isFeatureRememberMeEnabled.mockReturnValueOnce(true)
      isUserPartiallyAuthenticated.mockReturnValueOnce(true)

      const resp = {
        status: 401,
        headers: {},
        body: {
          isRestrictedActionResponse: true,
          account: {
            rememberMe: true,
          },
        },
      }

      store = getMockStoreForLocation('/my-account')

      const redirectSpy = jest.spyOn(actions, 'rememberMeRedirect')
      store.dispatch(actions.handleRestrictedActionResponse(resp))

      expect(redirectSpy).not.toHaveBeenCalled()
    })
  })
})
