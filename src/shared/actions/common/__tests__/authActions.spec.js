import { path } from 'ramda'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'

import * as authActions from '../authActions'
import { post, del } from '../../../lib/api-service'
import {
  setCacheData,
  clearCacheData,
  isStorageSupported,
} from '../../../../client/lib/storage'

import * as accountSelectors from '../../../selectors/common/accountSelectors'

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
  post: jest.fn(),
  del: jest.fn(),
}))

jest.mock('../wishlistActions', () => ({
  getDefaultWishlist: jest.fn(),
  clearWishlist: jest.fn(),
}))
import { getDefaultWishlist, clearWishlist } from '../wishlistActions'

jest.mock('../shoppingBagActions', () => ({
  getBag: jest.fn(),
  checkForMergedItemsInBag: jest.fn(),
  synchroniseBagPostLogin: jest.fn(),
  updateShoppingBagBadgeCount: jest.fn(),
  clearMiniBagMessages: jest.fn(),
  resetShoppingBag: jest.fn(),
}))
import {
  getBag,
  synchroniseBagPostLogin,
  checkForMergedItemsInBag,
  updateShoppingBagBadgeCount,
  clearMiniBagMessages,
  resetShoppingBag,
} from '../shoppingBagActions'

jest.mock('../checkoutActions', () => ({
  emptyOrderSummary: jest.fn(),
}))

import { emptyOrderSummary } from '../checkoutActions'

jest.mock('../navigationActions', () => ({
  updateMenuForUnauthenticatedUser: jest.fn(),
  updateMenuForAuthenticatedUser: jest.fn(),
}))
import {
  updateMenuForUnauthenticatedUser,
  updateMenuForAuthenticatedUser,
} from '../navigationActions'

jest.mock('../paymentMethodsActions', () => ({
  getAllPaymentMethods: jest.fn(),
}))
import { getAllPaymentMethods } from '../paymentMethodsActions'

const setRedirect = jest.fn()
const middlewares = [
  thunk.withExtraArgument({
    setRedirect,
  }),
]
const mockStore = configureMockStore(middlewares)
const dispatch = jest.fn()
const getState = jest.fn()
const snapshot = (action) => expect(action).toMatchSnapshot()

// Mocks for the actions called by logging in / out
const logonResponse = {
  body: {},
  headers: {
    bvtoken: '1234',
  },
}
const logonMock = Promise.resolve(logonResponse)
logonMock.type = 'LOGON_MOCK'

const logoutMock = Promise.resolve({
  body: {},
})
logoutMock.type = 'LOGOUT_MOCK'

function cachePartialAuth() {
  const cached_auth =
    isStorageSupported('localStorage') &&
    JSON.parse(localStorage.getItem('cached_auth'))

  return path(['authentication'], cached_auth) === 'partial'
}

describe('Authentication actions', () => {
  browserHistory.replace = jest.fn()
  browserHistory.push = jest.fn()

  const defaultState = {
    routing: {
      location: 'test',
    },
    config: {
      language: 'english',
      brandName: 'Topshop',
      langHostnames: {
        default: {
          defaultLanguage: 'English',
        },
      },
    },
    pageType: 'login',
  }
  const store = mockStore(defaultState)

  beforeEach(() => {
    jest.resetAllMocks()
    store.clearActions()

    post.mockReturnValueOnce(logonMock)

    del.mockReturnValueOnce(logoutMock)

    getBag.mockReturnValue({
      type: 'GET_BAG_MOCK',
    })

    getDefaultWishlist.mockReturnValue({
      type: 'GET_WISHLIST_MOCK',
    })

    updateShoppingBagBadgeCount.mockImplementation((count) => ({
      type: 'UPDATE_BADGE_COUNT_MOCK',
      count,
    }))

    clearMiniBagMessages.mockReturnValue({
      type: 'CLEAR_MINIBAG_MOCK',
    })

    updateMenuForAuthenticatedUser.mockReturnValue({
      type: 'UPDATE_MENU_MOCK',
    })

    getAllPaymentMethods.mockReturnValue({
      type: 'ALL_PAYMENT_METHODS_MOCK',
    })

    checkForMergedItemsInBag.mockReturnValue({
      type: 'BAG_MERGE_MOCK',
    })

    synchroniseBagPostLogin.mockReturnValue({
      type: 'BAG_SYNCHRONISE_MOCK',
    })

    clearWishlist.mockReturnValue({
      type: 'CLEAR_WISHLIST_MOCK',
    })

    updateMenuForUnauthenticatedUser.mockReturnValue({
      type: 'UPDATE_MENU_MOCK',
    })

    emptyOrderSummary.mockReturnValue({
      type: 'EMPTY_ORDER_SUMMARY',
    })

    resetShoppingBag.mockReturnValue({
      type: 'RESET_SHOPPING_BAG',
    })
  })

  describe('loginRequest', () => {
    describe('login', () => {
      it('login request - success, password NOT reset', async () => {
        const nextRoute = '/my-account'
        const loginArgs = {
          credentials: { username: 'lol', password: '' },
          getNextRoute: jest.fn().mockReturnValue(nextRoute),
          formName: 'login',
          successCallback: jest.fn(),
        }
        const expectedActions = [
          { type: 'AUTH_PENDING', loading: true },
          { type: 'AJAXCOUNTER_INCREMENT' },
          {
            type: 'SET_FORM_MESSAGE',
            formName: 'login',
            message: { message: '' },
            key: null,
          },
          { type: 'LOGIN', bvToken: '1234', loginLocation: 'test' },
          { type: 'UPDATE_BADGE_COUNT_MOCK' },
          { type: 'AUTH_PENDING', loading: false },
          { type: 'AJAXCOUNTER_DECREMENT' },
          { type: 'USER_ACCOUNT', user: {} },
          { type: 'SET_AUTHENTICATION', authentication: 'full' },
          { type: 'UPDATE_MENU_MOCK' },
          { type: 'ALL_PAYMENT_METHODS_MOCK' },
          { type: 'BAG_MERGE_MOCK' },
          { type: 'BAG_SYNCHRONISE_MOCK' },
        ]

        await store.dispatch(authActions.loginRequest(loginArgs))
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
        expect(synchroniseBagPostLogin).toHaveBeenCalledTimes(1)
        expect(synchroniseBagPostLogin).toHaveBeenCalledWith(defaultState)
        expect(browserHistory.replace).toHaveBeenCalledWith(nextRoute)
        expect(loginArgs.successCallback).toHaveBeenCalled()
      })

      it('login request - success, password reset', async () => {
        post.mockReset()
        browserHistory.push = jest.fn()
        const mockResponse = {
          body: {
            isPwdReset: true,
          },
          headers: {
            bvtoken: 'mocktoken',
          },
        }
        const loginSuccess = Promise.resolve(mockResponse)
        loginSuccess.type = 'POST_MOCK'
        post.mockReturnValueOnce(loginSuccess)
        const loginArgs = {
          credentials: { username: 'lol', password: 'hello' },
          getNextRoute: () => '/next',
          formName: 'login',
          successCallback: jest.fn(),
        }
        const expectedActions = [
          { type: 'AUTH_PENDING', loading: true },
          { type: 'AJAXCOUNTER_INCREMENT' },
          {
            type: 'SET_FORM_MESSAGE',
            formName: 'login',
            message: { message: '' },
            key: null,
          },
          { type: 'AUTH_PENDING', loading: false },
          { type: 'AJAXCOUNTER_DECREMENT' },
          { type: 'USER_ACCOUNT', user: { isPwdReset: true } },
          { type: 'SET_AUTHENTICATION', authentication: 'full' },
          { type: 'UPDATE_MENU_MOCK' },
          { type: 'BAG_SYNCHRONISE_MOCK' },
        ]

        await store.dispatch(authActions.loginRequest(loginArgs))
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
        expect(browserHistory.push).toHaveBeenCalledWith('/reset-password')
        expect(loginArgs.successCallback).toHaveBeenCalled()
        expect(synchroniseBagPostLogin).toHaveBeenCalledTimes(1)
        expect(synchroniseBagPostLogin).toHaveBeenCalledWith(defaultState)
      })

      it('login request - success, defaults to /my-account', async () => {
        post.mockReset()
        browserHistory.push = jest.fn()
        const mockResponse = {
          body: {
            isPwdReset: false,
          },
          headers: {
            bvtoken: 'mocktoken',
          },
        }
        const loginSuccess = Promise.resolve(mockResponse)
        loginSuccess.type = 'POST_MOCK'
        post.mockReturnValueOnce(loginSuccess)
        const loginArgs = {
          credentials: { username: 'lol', password: 'hello' },
          getNextRoute: () => '/my-account',
          formName: 'login',
          successCallback: jest.fn(),
        }

        await store.dispatch(authActions.loginRequest(loginArgs))
        expect(browserHistory.replace).toHaveBeenCalledWith('/my-account')
        expect(loginArgs.successCallback).toHaveBeenCalled()
      })

      it('login request - success, updates bag and does not redirect', async () => {
        post.mockReset()
        browserHistory.push = jest.fn()
        const mockResponse = {
          body: {
            isPwdReset: false,
          },
          headers: {
            bvtoken: 'mocktoken',
          },
        }
        const loginSuccess = Promise.resolve(mockResponse)
        loginSuccess.type = 'POST_MOCK'
        post.mockReturnValueOnce(loginSuccess)
        const loginArgs = {
          credentials: { username: 'lol', password: 'hello' },
          formName: 'login',
          successCallback: jest.fn(),
        }
        const expected = 'GET_BAG_MOCK'
        const actions = store.getActions()
        const compareType = (action) => action.type === expected

        await store.dispatch(authActions.loginRequest(loginArgs))
        expect(actions.filter(compareType)[0].type).toEqual(expected)
        expect(browserHistory.replace).not.toHaveBeenCalled()
        expect(loginArgs.successCallback).toHaveBeenCalled()
      })

      it('login request - fail', async () => {
        post.mockReset()
        const loginRejected = Promise.reject({
          response: { body: { message: 'error' } },
        })
        loginRejected.type = 'POST_MOCK'
        post.mockReturnValueOnce(loginRejected)
        const loginArgs = {
          credentials: { username: 'lol', password: 'hello' },
          getNextRoute: () => '/next',
          formName: 'login',
          successCallback: jest.fn(),
          errorCallback: jest.fn(),
        }
        const expectedActions = [
          { type: 'AUTH_PENDING', loading: true },
          { type: 'AJAXCOUNTER_INCREMENT' },
          {
            type: 'SET_FORM_MESSAGE',
            formName: 'login',
            message: { message: '' },
            key: null,
          },
          {
            type: 'SET_FORM_MESSAGE',
            formName: 'login',
            message: { type: 'error', message: 'error' },
            key: null,
          },
          { type: 'AUTH_PENDING', loading: false },
          { type: 'AJAXCOUNTER_DECREMENT' },
        ]

        await store.dispatch(authActions.loginRequest(loginArgs))
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
        expect(loginArgs.errorCallback).toHaveBeenCalled()
        expect(loginArgs.successCallback).not.toHaveBeenCalled()
      })

      it('should call getBag with isMergeRequest = true if not on checkout login', async () => {
        const loginArgs = {
          credentials: { username: 'lol', password: 'hello' },
          getNextRoute: () => '/next',
          formName: 'login',
          successCallback: undefined,
        }
        const expectedActions = [
          { type: 'AUTH_PENDING', loading: true },
          { type: 'AJAXCOUNTER_INCREMENT' },
          { type: 'GET_BAG_MOCK' },
          { type: 'UPDATE_BADGE_COUNT_MOCK', count: undefined },
          { type: 'LOGIN', bvToken: '1234', loginLocation: 'test' },
          { type: 'AUTH_PENDING', loading: false },
          { type: 'AJAXCOUNTER_DECREMENT' },
          { type: 'USER_ACCOUNT', user: {} },
          { type: 'SET_AUTHENTICATION', authentication: 'full' },
          { type: 'UPDATE_MENU_MOCK' },
          { type: 'ALL_PAYMENT_METHODS_MOCK' },
          { type: 'BAG_MERGE_MOCK' },
          { type: 'BAG_SYNCHRONISE_MOCK' },
        ]

        await store.dispatch(authActions.loginRequest(loginArgs))
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })

      it('should clear out order state before setting state for changed user', async () => {
        const userEmail = 'test@testing.com'
        post.mockReset()
        post.mockReturnValueOnce(() =>
          Promise.resolve({
            body: {
              email: 'some@other.email.com',
            },
            headers: {
              bvtoken: 'mocktoken',
            },
          })
        )

        const getUserEmailSpy = jest.spyOn(accountSelectors, 'getUserEmail')
        getUserEmailSpy.mockReturnValue(userEmail)

        const loginArgs = {
          credentials: { username: userEmail, password: 'hello' },
          getNextRoute: () => '/next',
          formName: 'login',
          successCallback: undefined,
        }

        await store.dispatch(authActions.loginRequest(loginArgs))

        expect(resetShoppingBag).toHaveBeenCalled()
        expect(emptyOrderSummary).toHaveBeenCalled()
      })

      it('should not clear out order state if the same user logs in', async () => {
        const userEmail = 'test@testing.com'
        post.mockReset()
        post.mockReturnValueOnce(() =>
          Promise.resolve({
            body: {
              email: userEmail,
            },
            headers: {
              bvtoken: 'mocktoken',
            },
          })
        )

        const getUserEmailSpy = jest.spyOn(accountSelectors, 'getUserEmail')
        getUserEmailSpy.mockReturnValue(userEmail)

        const loginArgs = {
          credentials: { username: userEmail, password: 'hello' },
          getNextRoute: () => '/next',
          formName: 'login',
          successCallback: undefined,
        }

        await store.dispatch(authActions.loginRequest(loginArgs))

        expect(resetShoppingBag).not.toHaveBeenCalled()
        expect(emptyOrderSummary).not.toHaveBeenCalled()
      })
    })

    describe('Wishlist enabled', () => {
      it('should dispatch the action to get the wishlist after login', async () => {
        const store = mockStore({
          ...defaultState,
          features: {
            status: {
              FEATURE_WISHLIST: true,
            },
          },
        })

        const expectedActions = [
          {
            type: 'GET_WISHLIST_MOCK',
          },
        ]

        await store.dispatch(
          authActions.loginRequest({
            successCallback: false,
          })
        )
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('Wishlist disabled', () => {
      it('should not dispatch the action to get the wishlist after login', async () => {
        const store = mockStore(defaultState)
        await store.dispatch(
          authActions.loginRequest({
            getNextRoute: false,
          })
        )
        const expectedActions = [
          {
            type: 'GET_WISHLIST_MOCK',
          },
        ]
        expect(store.getActions()).not.toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('login via WishlistLoginModal', () => {
      it('should dispatch getBag on login', async () => {
        const expectedAction = [{ type: 'GET_BAG_MOCK' }]
        const authArgs = {
          formData: {},
          formName: 'wishlistLoginModal',
        }
        await store.dispatch(authActions.loginRequest(authArgs))
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
      })
    })

    describe('login error', () => {
      it('sets error message on login form', async () => {
        post.mockReset()
        const loginRejected = Promise.reject({
          response: {
            body: {
              message: 'error message',
            },
          },
        })
        loginRejected.type = 'LOGIN_MOCK'
        post.mockReturnValueOnce(loginRejected)

        const store = mockStore(defaultState)
        await store.dispatch(
          authActions.loginRequest({
            getNextRoute: false,
          })
        )

        const expectedAction = [
          {
            type: 'SET_FORM_MESSAGE',
            formName: 'login',
            message: {
              type: 'error',
              message: 'error message',
            },
            key: null,
          },
        ]

        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
      })
    })
  })

  describe('logout', () => {
    it('dispatches a chain of actions', () => {
      const expectedActions = [{ type: 'LOGOUT' }, { type: 'UPDATE_MENU_MOCK' }]
      store.dispatch(authActions.logout())
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })
  })

  // @TODO to complete test coverage
  describe('logoutRequest', () => {
    beforeEach(() => {
      process.browser = true
    })

    it('calls browserHistory with default `home` path', async () => {
      await store.dispatch(authActions.logoutRequest())
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith({ pathname: '/' })
    })

    it('calls browserHistory with specified route', async () => {
      const routeLocation = '/test'

      await store.dispatch(authActions.logoutRequest(routeLocation))
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith({
        pathname: routeLocation,
      })
    })

    it('calls for a redirect to the specified path when called during SSR', async () => {
      process.browser = false

      const redirectPath = '/login'

      await store.dispatch(authActions.logoutRequest(redirectPath))
      expect(setRedirect).toHaveBeenCalledTimes(1)
      expect(setRedirect).toHaveBeenCalledWith(redirectPath, 307)
    })

    it('sets shopping Bag Badge Count to 0', async () => {
      const expectedAction = {
        type: 'UPDATE_BADGE_COUNT_MOCK',
        count: 0,
      }

      await store.dispatch(authActions.logoutRequest())
      expect(store.getActions()).toEqual(
        expect.arrayContaining([expectedAction])
      )
    })

    it('clears messages in minibag', async () => {
      const expectedActions = [{ type: 'CLEAR_MINIBAG_MOCK' }]
      await store.dispatch(authActions.logoutRequest())

      expect(clearMiniBagMessages).toHaveBeenCalledTimes(1)
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    describe('Wishlist enabled', () => {
      it('should dispatch the action to clear the wishlist after logout', async () => {
        const store = mockStore({
          ...defaultState,
          features: {
            status: {
              FEATURE_WISHLIST: true,
            },
          },
        })

        const expectedActions = [
          {
            type: 'CLEAR_WISHLIST_MOCK',
          },
        ]

        await store.dispatch(authActions.logoutRequest())
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('Wishlist not enabled', () => {
      it('should not call the action to clear the wishlist', async () => {
        const store = mockStore(defaultState)

        const expectedActions = [
          {
            type: 'CLEAR_WISHLIST_MOCK',
          },
        ]

        await store.dispatch(authActions.logoutRequest())
        expect(store.getActions()).not.toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })
  })

  describe('authentication', () => {
    it('authPending - true', () => {
      snapshot(authActions.authPending(true))
    })

    it('authPending - false', () => {
      snapshot(authActions.authPending(false))
    })

    it('authLogin', () => {
      const mockBvToken = 'abcd45'
      getState.mockReturnValueOnce({ routing: { location: '/somewhere' } })

      authActions.authLogin(mockBvToken)(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'LOGIN',
        bvToken: mockBvToken,
        loginLocation: '/somewhere',
      })
    })

    it('setAuthentication - fully authenticated', () => {
      snapshot(authActions.setAuthentication('full'))
    })

    it('setAuthentication - partially authenticated', () => {
      snapshot(authActions.setAuthentication('partial'))
    })

    it('setAuthentication - false (not authenticated)', () => {
      snapshot(authActions.setAuthentication(false))
    })
  })

  describe('registerRequest', () => {
    it('register success action', () => {
      snapshot(authActions.registerSuccess({ user: 'user thing' }))
    })

    it('register error action', () => {
      snapshot(authActions.registerError({ error: 'i am an error' }))
    })

    it('register success, wishlist DISABLED', async () => {
      post.mockReset()
      const mockSuccessResponse = {
        ...logonResponse,
        body: { success: true },
      }
      const postMock = Promise.resolve(mockSuccessResponse)
      postMock.type = 'LOGIN'
      post.mockReturnValueOnce(postMock)

      const nextRoute = '/nextRoute'
      const expectedActions = [
        { type: 'AUTH_PENDING', loading: true },
        { type: 'AJAXCOUNTER_INCREMENT' },
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: { message: '' },
          key: null,
        },
        { type: 'LOGIN', bvToken: '1234', loginLocation: 'test' },
        { type: 'USER_ACCOUNT', user: { success: true } },
        { type: 'SET_AUTHENTICATION', authentication: 'full' },
        { type: 'AUTH_PENDING', loading: false },
        { type: 'AJAXCOUNTER_DECREMENT' },
        { type: 'UPDATE_MENU_MOCK' },
      ]

      await store.dispatch(
        authActions.registerRequest({
          formData: {},
          getNextRoute: () => nextRoute,
        })
      )
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
      expect(browserHistory.push).toHaveBeenCalledWith(nextRoute)
    })

    it('register success, no next route, defaults to /my-account', async () => {
      post.mockReset()
      const mockSuccessResponse = {
        ...logonResponse,
        body: { success: true },
      }
      const postMock = Promise.resolve(mockSuccessResponse)
      postMock.type = 'LOGIN'
      post.mockReturnValueOnce(postMock)

      await store.dispatch(
        authActions.registerRequest({
          formData: {},
          getNextRoute: () => null,
        })
      )
      expect(browserHistory.push).toHaveBeenCalledWith('/my-account')
    })

    it('register success, wishlist ENABLED', async () => {
      post.mockReset()
      const mockSuccessResponse = {
        ...logonResponse,
        body: { success: true },
      }
      const postMock = Promise.resolve(mockSuccessResponse)
      postMock.type = 'LOGIN'
      post.mockReturnValueOnce(postMock)

      const nextRoute = '/nextRoute'
      const store = mockStore({
        ...defaultState,
        features: {
          status: {
            FEATURE_WISHLIST: true,
          },
        },
      })

      const expectedActions = [
        { type: 'AUTH_PENDING', loading: true },
        { type: 'AJAXCOUNTER_INCREMENT' },
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: { message: '' },
          key: null,
        },
        { type: 'LOGIN', bvToken: '1234', loginLocation: 'test' },
        { type: 'USER_ACCOUNT', user: { success: true } },
        { type: 'SET_AUTHENTICATION', authentication: 'full' },
        { type: 'AUTH_PENDING', loading: false },
        { type: 'AJAXCOUNTER_DECREMENT' },
        { type: 'UPDATE_MENU_MOCK' },
        { type: 'GET_WISHLIST_MOCK' },
      ]

      await store.dispatch(
        authActions.registerRequest({
          formData: {},
          getNextRoute: () => nextRoute,
        })
      )
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
      expect(browserHistory.push).toHaveBeenCalledWith(nextRoute)
    })

    it('register error', async () => {
      post.mockReset()
      const mockErrorResponse = { response: { body: { message: 'error' } } }
      const postMock = Promise.reject(mockErrorResponse)
      postMock.type = 'POST_MOCK'
      post.mockReturnValueOnce(postMock)
      const expectedActions = [
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: { message: '' },
          key: null,
        },
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: { type: 'error', message: 'error' },
          key: null,
        },
      ]

      await store.dispatch(authActions.registerRequest({}, '/anotherRoute'))
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
      expect(browserHistory.push).not.toHaveBeenCalled()
    })

    it('register error, user logged in when registering', async () => {
      post.mockReset()
      const mockErrorResponse = {
        response: {
          body: {
            originalMessage:
              'Unable to create account while user logged in, please logout',
          },
        },
      }
      const delMock = Promise.resolve({})
      delMock.type = 'DELETE_MOCK'
      const postMock = Promise.reject(mockErrorResponse)
      postMock.type = 'POST_MOCK'

      del.mockReturnValueOnce(delMock)
      post.mockReturnValue(postMock)
      getState.mockReturnValueOnce({ routing: { location: '/somewhere' } })
      const expectedActions = [
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: { message: '' },
          key: null,
        },
      ]

      await store.dispatch(authActions.registerRequest({}, '/anotherRoute'))
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
      expect(del).toHaveBeenCalledWith('/account/logout')
      expect(
        store
          .getActions()
          .filter((action) => action.type === 'SET_FORM_MESSAGE').length
      ).toEqual(1)
    })

    it('register error with a successful response', async () => {
      post.mockReset()
      const mockSuccessResponse = {
        ...logonResponse,
        body: { success: false },
      }
      const postMock = Promise.resolve(mockSuccessResponse)
      postMock.type = 'LOGIN'
      post.mockReturnValueOnce(postMock)

      const expectedActions = [
        { type: 'AUTH_PENDING', loading: true },
        { type: 'AJAXCOUNTER_INCREMENT' },
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: { message: '' },
          key: null,
        },
        { type: 'AUTH_PENDING', loading: false },
        { type: 'AJAXCOUNTER_DECREMENT' },
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'register',
          message: {
            type: 'error',
            message:
              'There was an error submitting the form. Please try again.',
          },
          key: null,
        },
      ]

      await store.dispatch(
        authActions.registerRequest({
          formData: {},
        })
      )

      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    describe('register via WishlistLoginModal', () => {
      it('should dispatch getBag on register', async () => {
        post.mockReset()
        const mockSuccessResponse = {
          ...logonResponse,
          body: { success: true },
        }
        const postMock = Promise.resolve(mockSuccessResponse)
        postMock.type = 'LOGIN'
        post.mockReturnValueOnce(postMock)

        const expectedAction = [{ type: 'GET_BAG_MOCK' }]
        const authArgs = {
          formData: {},
          formName: 'wishlistLoginModal',
        }
        await store.dispatch(authActions.registerRequest(authArgs))
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
      })
    })
  })

  describe('registerUser', () => {
    describe('user is partially authenticated', () => {
      it('should logout before register', async () => {
        const store = mockStore({
          ...defaultState,
          auth: { authentication: 'partial' },
          routing: { location: '/random' },
        })
        await store.dispatch(
          authActions.registerUser({
            formData: {},
            getNextRoute: () => '/next',
          })
        )
        const expectedActions = store
          .getActions()
          .filter(({ type }) => type === 'LOGOUT_MOCK' || type === 'LOGON_MOCK')

        expect(expectedActions[0]).toEqual(logoutMock)
        expect(expectedActions[1]).toEqual(logonMock)
      })
    })

    describe('partial authentication persisted in localStorage', () => {
      it('should logout before register', async () => {
        setCacheData('auth', { authentication: 'partial' })

        const store = mockStore({
          ...defaultState,
          auth: {},
          routing: { location: '/random' },
        })
        await store.dispatch(
          authActions.registerUser({
            formData: {},
            getNextRoute: () => '/next',
          })
        )
        const expectedActions = store
          .getActions()
          .filter(({ type }) => type === 'LOGOUT_MOCK' || type === 'LOGON_MOCK')

        expect(expectedActions[0]).toEqual(logoutMock)
        expect(expectedActions[1]).toEqual(logonMock)

        clearCacheData('auth')
      })
    })

    describe('when logout is expected before registration', () => {
      it('should not call successCallback if defined', async () => {
        post.mockReturnValueOnce(Promise.resolve())
        const store = mockStore({
          ...defaultState,
          auth: { authentication: 'partial' },
          routing: { location: '/random' },
        })

        const registerArgs = {
          formData: {},
          getNextRoute: () => '/next',
          successCallback: jest.fn(),
        }

        await store.dispatch(authActions.registerUser(registerArgs))
        expect(registerArgs.successCallback).not.toHaveBeenCalled()
      })
    })

    describe('user is not partially authenticated', () => {
      it('should register without logout', async () => {
        const store = mockStore(defaultState)
        await store.dispatch(
          authActions.registerUser({
            formData: {},
            getNextRoute: () => '/next',
          })
        )

        expect(store.getActions()).toEqual(expect.arrayContaining([logonMock]))
        expect(store.getActions()).toEqual(
          expect.not.arrayContaining([logoutMock])
        )
      })
    })
  })

  describe('continueAsGuest', () => {
    describe('user is partially authenticated', () => {
      it('should logout and redirect to homepage', async () => {
        setCacheData('auth', { authentication: 'partial' })
        getState.mockReturnValue({
          auth: {
            authentication: 'partial',
          },
          routing: { location: '/somewhere' },
        })

        expect(cachePartialAuth()).toBe(true)
        await authActions.continueAsGuest()(dispatch, getState)
        expect(cachePartialAuth()).toBe(false)
        expect(dispatch).toHaveBeenCalledTimes(1)
      })
    })

    describe('partial authentication persisted in localStorage', () => {
      it('should logout and redirect to homepage', async () => {
        setCacheData('auth', { authentication: 'partial' })
        getState.mockReturnValue({
          auth: {},
          routing: { location: '/somewhere' },
        })

        expect(cachePartialAuth()).toBe(true)
        await authActions.continueAsGuest()(dispatch, getState)
        expect(cachePartialAuth()).toBe(false)
        expect(dispatch).toHaveBeenCalledTimes(1)
      })
    })

    describe('user is not partially authenticated', () => {
      describe('there are items in the shopping bag', () => {
        it('should continue to delivery', async () => {
          getState.mockReturnValue({
            auth: {},
            routing: { location: '/somewhere' },
            shoppingBag: {
              totalItems: 2,
            },
          })

          await authActions.continueAsGuest()(dispatch, getState)
          expect(dispatch).not.toHaveBeenCalled()
          expect(browserHistory.push).toHaveBeenCalledWith(
            '/guest/checkout/delivery'
          )
        })
      })

      describe('shopping bag is empty', () => {
        it('should redirect to homepage', async () => {
          getState.mockReturnValue({
            auth: {},
            routing: { location: '/somewhere' },
            shoppingBag: {},
          })

          await authActions.continueAsGuest()(dispatch, getState)
          expect(dispatch).not.toHaveBeenCalled()
          expect(browserHistory.push).toHaveBeenCalledWith('/')
        })
      })
    })
  })

  describe('setInitialWishlist', () => {
    const getDefaultWishlistMock = () => {
      const p = Promise.resolve({})
      p.type = 'GET_DEFAULT_WISHLIST_MOCK'
      return p
    }
    const expectedActions = [
      { type: 'AJAXCOUNTER_INCREMENT' },
      getDefaultWishlistMock(),
      { type: 'AJAXCOUNTER_DECREMENT' },
    ]

    it('should get the default wishlist', async () => {
      getDefaultWishlist.mockReturnValue(getDefaultWishlistMock())
      await store.dispatch(authActions.setInitialWishlist())
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should resolve the success callback if passed', async () => {
      const successCallbackMock = jest.fn(() => Promise.resolve())
      getDefaultWishlist.mockReturnValue(getDefaultWishlistMock())
      await store.dispatch(authActions.setInitialWishlist(successCallbackMock))
      expect(store.getActions()).toEqual(expectedActions)
      expect(successCallbackMock).toHaveBeenCalled()
    })

    it('should wait if the callback returns a promise and then reset loader', async () => {
      const promise = Promise.resolve()
      const promiseSpy = jest.spyOn(promise, 'then')
      const successCallbackMock = jest.fn(() => promise)
      getDefaultWishlist.mockReturnValue(getDefaultWishlistMock())

      try {
        await store.dispatch(
          authActions.setInitialWishlist(successCallbackMock)
        )
      } catch (error) {
        global.fail(
          `Expected setInitialWishlist not to throw. Error: ${error.message}`
        )
      }

      expect(store.getActions()).toEqual(expectedActions)
      expect(successCallbackMock).toHaveBeenCalled()
      expect(promiseSpy).toHaveBeenCalled()
    })

    it('should not wait if the callback does not return a promise and then reset loader', async () => {
      const successCallbackMock = jest.fn(() => 'Im a string not a promise')
      getDefaultWishlist.mockReturnValue(getDefaultWishlistMock())

      try {
        await store.dispatch(
          authActions.setInitialWishlist(successCallbackMock)
        )
      } catch (error) {
        global.fail(
          `Expected setInitialWishlist not to throw. Error: ${error.message}`
        )
      }

      expect(store.getActions()).toEqual(expectedActions)
      expect(successCallbackMock).toHaveBeenCalled()
    })
  })
})
