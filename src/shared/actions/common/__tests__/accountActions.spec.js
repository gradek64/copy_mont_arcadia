import * as accountActions from '../accountActions'
import deepFreeze from 'deep-freeze'

// mocks
import { myCheckoutDetails } from '../../../../../test/mocks/forms/myCheckoutDetailsFormsMocks'
import userMock from '../../../../../test/mocks/myAccount-response.json'
import siteOptionsMock from '../../../../../test/mocks/siteOptions'
import { paymentMethodsList } from '../../../../../test/mocks/paymentMethodsMocks'
import { browserHistory } from 'react-router'
import { put, get, post } from '../../../lib/api-service'
import { setGenericError } from '../errorMessageActions'
import {
  updateOrderId,
  updateShoppingBagBadgeCount,
} from '../shoppingBagActions'
import { updateMenuForAuthenticatedUser } from '../navigationActions'
import {
  setFormMeta,
  setFormMessage,
  setFormSuccess,
  handleFormResponseErrorMessage,
  resetForm,
  resetFormPartial,
  clearFormErrors,
} from '../formActions'
import { ajaxCounter } from '../../components/LoaderOverlayActions'
import {
  setPostResetUrl,
  changePasswordSuccess,
} from '../../components/ChangePasswordActions'
import { removeDiacriticsDeep } from '../../../lib/checkout-utilities/klarna-utils'
// constants
import { formNames } from '../../../constants/forms'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as logger from '../../../../server/lib/logger'
import * as clientLogger from '../../../../client/lib/logger'

// mocking helpers
jest.mock('../../../lib/api-service', () => ({
  put: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
}))

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

jest.mock('../../../../client/lib/logger', () => ({
  nrBrowserLogError: jest.fn(),
}))

jest.mock('../../../../server/lib/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
}))

jest.mock('../shoppingBagActions', () => ({
  updateOrderId: jest.fn(() => () => {}),
  updateShoppingBagBadgeCount: jest.fn(() => () => {}),
}))

jest.mock('../navigationActions', () => ({
  updateMenuForAuthenticatedUser: jest.fn(() => () => {}),
}))

jest.mock('../formActions', () => ({
  setFormMeta: jest.fn(() => () => {}),
  setFormMessage: jest.fn(() => () => {}),
  resetForm: jest.fn(() => () => {}),
  resetFormPartial: jest.fn(() => () => {}),
  setFormSuccess: jest.fn(() => () => {}),
  handleFormResponseErrorMessage: jest.fn(() => () => {}),
  clearFormErrors: jest.fn(() => ({ type: 'FAKE_CLEAR_FORM_ERRORS' })),
}))

jest.mock('../../components/LoaderOverlayActions', () => ({
  ajaxCounter: jest.fn(() => () => {}),
}))

jest.mock('../errorMessageActions', () => ({
  setGenericError: jest.fn(() => () => {}),
}))

jest.mock('../../components/ChangePasswordActions', () => ({
  setPostResetUrl: jest.fn(() => () => {}),
  changePasswordSuccess: jest.fn(() => () => {}),
}))

jest.mock('../../../../shared/actions/common/modalActions', () => ({
  showErrorModal: jest.fn((message) => ({
    type: 'MOCK_ERROR_MODAL',
    message,
  })),
}))

jest.mock('../../../actions/common/paymentMethodsActions', () => ({
  getAllPaymentMethods: jest.fn(() => ({
    type: 'GET_ALL_PAYMENT_METHODS_MOCK',
  })),
  getPaymentMethods: jest.fn(),
}))
jest.mock('../../../lib/checkout-utilities/klarna-utils', () => ({
  removeDiacriticsDeep: jest.fn(),
}))

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Account Actions', () => {
  let store

  beforeEach(() => {
    jest.clearAllMocks()
    store = mockStore()
  })

  describe('userAccount', () => {
    it('should return an action with user in payload', () => {
      const dummyUserObject = {
        name: 'test',
      }
      const action = accountActions.userAccount(dummyUserObject)

      expect(typeof action).toBe('object')
      expect(action.type).toBe('USER_ACCOUNT')
      expect(action.user).toBe(dummyUserObject)
      expect(action).toMatchSnapshot()
    })
  })

  describe('closeCustomerDetailsModal', () => {
    it('should set form state to close the modal', () => {
      accountActions.closeCustomerDetailsModal()

      expect(setFormMeta).toHaveBeenCalledWith(
        'customerDetails',
        'modalOpen',
        false
      )
    })
  })

  describe('getAccount', () => {
    const initialState = {
      auth: {
        authentication: 'full',
      },
    }

    it('shows the loader while loading', () => {
      store = mockStore(initialState)
      const thunk = accountActions.getAccount()

      thunk(store.dispatch, store.getState)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const mock = {
        ...initialState,
        config: {
          locale: 'fr',
          brandCode: 'ts',
          storeCode: 'tsfr',
        },
      }
      store = mockStore(mock)
      const thunk = accountActions.getAccount()
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch, store.getState)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.getAccount()
      const error = new Error()

      store = mockStore(initialState)

      get.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch, store.getState)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(setGenericError).toHaveBeenCalledWith(error)
    })

    it('sets the user account with the response', async () => {
      const dummyUserObject = {
        name: 'tester',
      }
      const mock = {
        ...initialState,
        config: {
          locale: 'fr',
          brandCode: 'ts',
          storeCode: 'tsfr',
        },
      }

      store = mockStore(mock)

      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await store.dispatch(accountActions.getAccount())

      expect(get).toHaveBeenCalledWith('/account')
      expect(store.getActions()).toEqual([
        { type: 'USER_ACCOUNT', user: { name: 'tester' } },
      ])
    })

    it('calls `getPreferenceLink`', async () => {
      const mock = {
        ...initialState,
        account: {
          exponeaLink: '',
          user: {
            expId2: '00000a',
          },
        },
        routing: {
          location: {
            pathname: '/my-account',
          },
        },
        config: {
          locale: 'fr',
          brandCode: 'ts',
          storeCode: 'tsfr',
        },
        features: {
          status: {
            FEATURE_MY_PREFERENCES: true,
          },
        },
      }
      store = mockStore(mock)
      get.mockReturnValueOnce(() => Promise.resolve({ body: {} }))
      post.mockReturnValueOnce(() => Promise.resolve({ body: { link: '1' } }))

      await store.dispatch(accountActions.getAccount())

      const expectedActions = [
        { type: 'USER_ACCOUNT', user: {} },
        { type: 'FETCH_EXPONENA_LINK', link: '1?lang=fr' },
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('does not call `getPreferenceLink` if link is in the state', async () => {
      const mock = {
        ...initialState,
        account: {
          exponeaLink: 'www.mockLink.com',
        },
        routing: {
          location: {
            pathname: '/login',
          },
        },
        config: {
          locale: 'fr',
          brandCode: 'ts',
          storeCode: 'tsfr',
        },
        features: {
          status: {
            FEATURE_MY_PREFERENCES: true,
          },
        },
      }
      store = mockStore(mock)
      const thunk = accountActions.getAccount()
      get.mockReturnValueOnce(() => Promise.resolve({ body: {} }))
      const getPreferenceSpy = jest.spyOn(accountActions, 'getPreferenceLink')
      await thunk(store.dispatch, store.getState)
      expect(getPreferenceSpy).not.toHaveBeenCalled()
    })
    it('does not call `getPreferenceLink` if your not in my account', async () => {
      const mock = {
        ...initialState,
        account: {
          exponeaLink: '',
        },
        routing: {
          location: {
            pathname: '/login',
          },
        },
        config: {
          locale: 'fr',
          brandCode: 'ts',
          storeCode: 'tsfr',
        },
        features: {
          status: {
            FEATURE_MY_PREFERENCES: true,
          },
        },
      }
      store = mockStore(mock)
      const thunk = accountActions.getAccount()
      get.mockReturnValueOnce(() => Promise.resolve({ body: {} }))
      const getPreferenceSpy = jest.spyOn(accountActions, 'getPreferenceLink')
      await thunk(store.dispatch, store.getState)
      expect(getPreferenceSpy).not.toHaveBeenCalled()
    })
    it('does not call `getPreferenceLink` if feature flag is false', async () => {
      const mock = {
        ...initialState,
        account: {
          exponeaLink: '',
        },
        routing: {
          location: {
            pathname: '/my-account',
          },
        },
        config: {
          locale: 'fr',
          brandCode: 'ts',
          storeCode: 'tsfr',
        },
        features: {
          status: {
            FEATURE_MY_PREFERENCES: false,
          },
        },
      }
      store = mockStore(mock)
      const thunk = accountActions.getAccount()
      get.mockReturnValueOnce(() => Promise.resolve({ body: {} }))
      const getPreferenceSpy = jest.spyOn(accountActions, 'getPreferenceLink')
      await thunk(store.dispatch, store.getState)
      expect(getPreferenceSpy).not.toHaveBeenCalled()
    })

    it('should make the getAccount request for partially authenticated users', async () => {
      const mock = {
        auth: {
          authentication: 'partial',
        },
      }
      store = mockStore(mock)
      const thunk = accountActions.getAccount()
      get.mockReturnValueOnce(() => Promise.reject({ body: {} }))
      thunk(store.dispatch, store.getState)
      expect(get).toHaveBeenCalledTimes(1)
    })

    it('should not make the getAccount request if the user is not authenticated', async () => {
      const mock = {
        auth: {
          authentication: 'guest',
        },
      }
      store = mockStore(mock)
      const thunk = accountActions.getAccount()
      thunk(store.dispatch, store.getState)
      expect(get).not.toHaveBeenCalled()
    })
  })

  describe('updateAccount', () => {
    it('shows the loader while loading', () => {
      const thunk = accountActions.updateAccount()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.updateAccount()
      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.updateAccount()
      const error = new Error()

      put.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(setGenericError).toHaveBeenCalledWith(error)
    })

    it('sets the user account with the response', async () => {
      const dummyUserObject = {
        name: 'tester',
      }

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await store.dispatch(accountActions.updateAccount(dummyUserObject))

      expect(put).toHaveBeenCalledWith(
        '/account/customerdetails',
        dummyUserObject
      )
      expect(store.getActions()).toEqual([
        { type: 'USER_ACCOUNT', user: dummyUserObject },
      ])
    })

    it('sets form state', async () => {
      const dummyUserObject = {
        name: 'tester',
      }
      const thunk = accountActions.updateAccount(dummyUserObject)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await thunk(store.dispatch)

      const formName = 'customerDetails'

      expect(setFormMeta).toHaveBeenCalledWith(formName, 'modalOpen', true)
      expect(setFormSuccess).toHaveBeenCalledWith(formName, true)
    })
  })

  describe('changeShortProfileRequest', () => {
    const formName = 'customerShortProfile'
    it('shows the loader while loading', () => {
      const thunk = accountActions.changeShortProfileRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.changeShortProfileRequest()
      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.changeShortProfileRequest()
      const error = new Error()

      put.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(handleFormResponseErrorMessage).toHaveBeenCalledWith(
        formName,
        error
      )
    })

    it('sets the user account with the response', async () => {
      const dummyUserObject = {
        name: 'tester',
      }

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await store.dispatch(
        accountActions.changeShortProfileRequest(dummyUserObject)
      )

      expect(put).toHaveBeenCalledWith(
        '/account/shortdetails',
        removeDiacriticsDeep(dummyUserObject)
      )
      expect(store.getActions()).toEqual([
        { type: 'USER_ACCOUNT', user: dummyUserObject },
      ])
    })

    it('sets form state', async () => {
      const dummyUserObject = {
        name: 'tester',
      }
      const thunk = accountActions.changeShortProfileRequest(dummyUserObject)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await thunk(store.dispatch)

      expect(setFormMessage).toHaveBeenCalledWith(
        formName,
        expect.objectContaining({
          type: 'confirm',
          message: expect.any(String),
        })
      )
      expect(setFormMessage.mock.calls[0]).toMatchSnapshot()
      expect(setFormSuccess).toHaveBeenCalledWith(formName, true)
    })
  })

  describe('changePwdRequest', () => {
    const formName = 'changePassword'

    // TODO - does this actually do anything?
    it('shows the loader while loading', () => {
      const thunk = accountActions.changePwdRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    // TODO - does this actually do anything?
    it('hides the loader on success', async () => {
      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await store.dispatch(accountActions.changePwdRequest())

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.changePwdRequest()
      const error = new Error()

      put.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(handleFormResponseErrorMessage).toHaveBeenCalledWith(
        formName,
        error
      )
    })

    it('sets the user account with the response', async () => {
      const dummyUserObject = {
        name: 'tester',
      }

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await store.dispatch(accountActions.changePwdRequest(dummyUserObject))

      expect(put).toHaveBeenCalledWith(
        '/account/changepassword',
        dummyUserObject
      )

      expect(store.getActions()).toEqual([
        { type: 'USER_ACCOUNT', user: dummyUserObject },
      ])
    })

    it('sets form state', async () => {
      const dummyUserObject = {
        name: 'tester',
      }
      const thunk = accountActions.changePwdRequest(dummyUserObject)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await thunk(store.dispatch)

      expect(setFormMessage).toHaveBeenCalledWith(
        formName,
        expect.objectContaining({
          type: 'confirm',
          message: expect.any(String),
        })
      )
      expect(setFormMessage.mock.calls[0]).toMatchSnapshot()
      expect(setFormSuccess).toHaveBeenCalledWith(formName, true)
    })

    it('gets the user account if resetPassword is truthy', async () => {
      const dummyUserObject = {
        name: 'tester',
      }

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await store.dispatch(
        accountActions.changePwdRequest(dummyUserObject, true)
      )

      expect(store.getActions()).toEqual([
        { type: 'USER_ACCOUNT', user: dummyUserObject },
      ])
    })

    it('doesnt get the user account if resetPassword is falsy', async () => {
      const dummyUserObject = {
        name: 'tester',
      }
      const thunk = accountActions.changePwdRequest(dummyUserObject, false)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      const getAccountSpy = jest.spyOn(accountActions, 'getAccount')
      await thunk(store.dispatch)

      expect(getAccountSpy).not.toHaveBeenCalled()
    })

    it('dispatches meta actions', async () => {
      const dummyUserObject = {
        name: 'tester',
      }
      const thunk = accountActions.changePwdRequest(dummyUserObject, false)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: dummyUserObject,
        })
      )

      await thunk(store.dispatch)
      expect(changePasswordSuccess).toHaveBeenCalledWith(true)
    })
  })

  describe('setForgetPassword', () => {
    it('should return an action with the passed value set in payload', () => {
      const value = 'test'
      const result = accountActions.setForgetPassword(value)

      expect(typeof result).toBe('object')
      expect(result.type).toBe('TOGGLE_FORGET_PASSWORD')
      expect(result.value).toBe(value)
      expect(result).toMatchSnapshot()
    })
  })

  describe('resetPasswordLinkIsValid', () => {
    it('should return the action resetPasswordLinkIsValid', () => {
      const result = accountActions.resetPasswordLinkIsValid()
      expect(typeof result).toBe('object')
      expect(result.type).toBe('RESET_PASSWORD_LINK_VALID')
      expect(result).toMatchSnapshot()
    })
  })

  describe('resetPasswordLinkIsInvalid', () => {
    it('should return the action resetPasswordLinkIsInvalid', () => {
      const result = accountActions.resetPasswordLinkIsInvalid()
      expect(typeof result).toBe('object')
      expect(result.type).toBe('RESET_PASSWORD_LINK_INVALID')
      expect(result).toMatchSnapshot()
    })
  })

  describe('validateResetPasswordLinkExpiry', () => {
    const dummyLocation = {
      query: {
        storeId: '12556',
        token: '4733021',
        hash: 'WQOQ1RrJpXIiJNZY9mr27OBbz4s%3D%0A',
        catalogId: '33057',
        langId: '-1',
      },
    }

    it('should post the body derived from location to the server', () => {
      const dummyBody = {
        catalogId: '33057',
        email: '4733021',
        hash: 'WQOQ1RrJpXIiJNZY9mr27OBbz4s%3D%0A',
        langId: '-1',
        storeId: '12556',
      }
      const thunk = accountActions.validateResetPasswordLinkExpiry(
        dummyLocation
      )
      thunk(store.dispatch)

      expect(post).toHaveBeenCalledWith(
        '/account/validate_reset_password',
        dummyBody
      )
    })
    describe('when WCS returns an error', () => {
      it('should dispatch resetPasswordLinkInvalid', async () => {
        const thunk = accountActions.validateResetPasswordLinkExpiry(
          dummyLocation
        )
        const error = new Error()
        post.mockReturnValueOnce(() => Promise.reject(error))
        await thunk(store.dispatch)
        expect(store.getActions()).toEqual([
          { type: 'RESET_PASSWORD_LINK_INVALID' },
        ])
      })
    })
    describe('when WCS returns a resolved promise', () => {
      it('should dispatch resetPasswordLinkValid if response.body.isValidEmailLink is true', async () => {
        const thunk = accountActions.validateResetPasswordLinkExpiry(
          dummyLocation
        )
        post.mockReturnValueOnce(() =>
          Promise.resolve({
            body: {
              isValidEmailLink: true,
            },
          })
        )
        await thunk(store.dispatch)
        expect(store.getActions()).toEqual([
          { type: 'RESET_PASSWORD_LINK_VALID' },
        ])
      })
      it('should dispatch resetPasswordLinkInvalid if response.body.success is false', async () => {
        const thunk = accountActions.validateResetPasswordLinkExpiry(
          dummyLocation
        )
        post.mockReturnValueOnce(() =>
          Promise.resolve({
            body: {
              success: false,
            },
          })
        )
        await thunk(store.dispatch)
        expect(store.getActions()).toEqual([
          { type: 'RESET_PASSWORD_LINK_INVALID' },
        ])
      })
    })
  })
  describe('toggleForgetPassword', () => {
    it('should return an action with the correct type', () => {
      const result = accountActions.toggleForgetPassword()

      expect(typeof result).toBe('object')
      expect(result.type).toBe('TOGGLE_FORGET_PASSWORD')
      expect(result).toMatchSnapshot()
    })
  })

  describe('forgetPwdRequest', () => {
    const formName = 'forgetPassword'
    it('shows the loader while loading', () => {
      const thunk = accountActions.forgetPwdRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.forgetPwdRequest()
      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.forgetPwdRequest()
      const error = new Error()

      post.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(handleFormResponseErrorMessage).toHaveBeenCalledWith(
        formName,
        error
      )
    })

    it('should post the passed data to the server', () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.forgetPwdRequest(data)
      thunk(store.dispatch)

      expect(post).toHaveBeenCalledWith('/account/forgetpassword', data)
    })

    it('should set form state', async () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.forgetPwdRequest(data)
      const message = 'All is well this time'

      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {
            message,
          },
        })
      )

      await thunk(store.dispatch)

      expect(setFormMessage).toHaveBeenCalledWith(formName, {
        type: 'confirm',
        message,
      })
      expect(setFormSuccess).toHaveBeenCalledWith(formName, true)
    })

    it('should set resetUrl in checkout', async () => {
      const thunk = accountActions.forgetPwdRequest()

      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      const getStateSpy = jest.spyOn(store, 'getState')
      getStateSpy.mockReturnValueOnce({
        routing: {
          location: {
            pathname: '/checkout',
          },
        },
      })

      await thunk(store.dispatch, store.getState)

      expect(setPostResetUrl).toHaveBeenCalledWith('/checkout')
    })

    it('should set resetUrl in checkout', async () => {
      const thunk = accountActions.forgetPwdRequest()

      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      const getStateSpy = jest.spyOn(store, 'getState')
      getStateSpy.mockReturnValueOnce({
        routing: {
          location: {
            pathname: '/somewhereElse',
          },
        },
      })

      await thunk(store.dispatch, store.getState)

      expect(setPostResetUrl).toHaveBeenCalledWith('/my-account')
    })
  })

  describe('resetPasswordLinkRequest', () => {
    const formName = 'forgetPassword'
    it('shows the loader while loading', () => {
      const thunk = accountActions.resetPasswordLinkRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.resetPasswordLinkRequest()
      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.resetPasswordLinkRequest()
      const error = new Error()

      post.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(handleFormResponseErrorMessage).toHaveBeenCalledWith(
        formName,
        error
      )
    })

    it('should post the passed data to the server', () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.resetPasswordLinkRequest(data)
      thunk(store.dispatch)

      expect(post).toHaveBeenCalledWith('/account/reset_password_link', data)
    })

    it('should set form state', async () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.resetPasswordLinkRequest(data)
      const message = 'All is well this time'

      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {
            message,
          },
        })
      )

      await thunk(store.dispatch)

      expect(setFormMessage).toHaveBeenCalledWith(formName, {
        type: 'confirm',
        message,
      })
      expect(setFormSuccess).toHaveBeenCalledWith(formName, true)
    })

    it('should set resetUrl in checkout', async () => {
      const thunk = accountActions.resetPasswordLinkRequest()

      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      const getStateSpy = jest.spyOn(store, 'getState')
      getStateSpy.mockReturnValueOnce({
        routing: {
          location: {
            pathname: '/checkout',
          },
        },
      })

      await thunk(store.dispatch, store.getState)

      expect(setPostResetUrl).toHaveBeenCalledWith('/checkout')
    })

    it('should set resetUrl in checkout', async () => {
      const thunk = accountActions.resetPasswordLinkRequest()

      post.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      const getStateSpy = jest.spyOn(store, 'getState')
      getStateSpy.mockReturnValueOnce({
        routing: {
          location: {
            pathname: '/somewhereElse',
          },
        },
      })

      await thunk(store.dispatch, store.getState)

      expect(setPostResetUrl).toHaveBeenCalledWith('/my-account')
    })
  })

  describe('resetPasswordRequest', () => {
    const formName = 'resetPassword'
    it('shows the loader while loading', () => {
      const thunk = accountActions.resetPasswordRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.resetPasswordRequest()
      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.resetPasswordRequest()
      const error = new Error()

      put.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(store.getActions()).toEqual([
        {
          type: 'RESET_PASSWORD_LINK_INVALID',
        },
      ])
    })

    it('should put the passed data to the server', () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.resetPasswordRequest(data)
      thunk(store.dispatch)

      expect(put).toHaveBeenCalledWith('/account/reset_password', data)
    })

    it('should set form state', async () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.resetPasswordRequest(data)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(setFormMessage).toHaveBeenCalledWith(formName, {
        type: 'confirm',
        message: 'Your password has been successfully changed.',
      })
      expect(setFormSuccess).toHaveBeenCalledWith(formName, true)
    })

    it('should update orderId and bagCount if orderId provided', async () => {
      const orderId = 'test'
      const data = {
        orderId,
      }

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {
            basketItemCount: 1,
          },
        })
      )

      const thunk = accountActions.resetPasswordRequest(data)
      await thunk(store.dispatch)

      expect(updateOrderId).toHaveBeenCalledWith(orderId)
      expect(updateShoppingBagBadgeCount).toHaveBeenCalledWith(1)
    })
    it('should update mobile navigation to fully authenticated state', async () => {
      const data = {
        test: true,
      }
      const thunk = accountActions.resetPasswordRequest(data)

      put.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(updateMenuForAuthenticatedUser).toHaveBeenCalled()
    })

    it('should call `handleFormResponseErrorMessage` if WCS returns `.2260` error code', async () => {
      const thunk = accountActions.resetPasswordRequest()
      const data = {
        response: {
          body: {
            errorCode: '.2260',
            message: 'You have already used that password, try another',
          },
        },
      }
      const formName = 'resetPassword'

      put.mockReturnValueOnce(() => Promise.reject(data))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(handleFormResponseErrorMessage).toHaveBeenCalledWith(
        formName,
        data,
        data.response.body.message
      )
    })
  })

  describe('setOrderHistoryDetails', () => {
    it('should return an action with the correct type and payload', () => {
      const orderDetails = { orderLinesSortedByTracking: {}, test: true }

      const result = accountActions.setOrderHistoryDetails(orderDetails)

      expect(typeof result).toBe('object')
      expect(result.type).toBe('SET_ORDER_HISTORY_DETAILS')
      expect(result.orderDetails).toEqual(orderDetails)
      expect(result).toMatchSnapshot()
    })
  })

  describe('setOrderHistoryOrders', () => {
    it('should return an action with the correct type and payload', () => {
      const orders = [
        {
          test: true,
        },
      ]
      const result = accountActions.setOrderHistoryOrders(orders)

      expect(typeof result).toBe('object')
      expect(result.type).toBe('SET_ORDER_HISTORY_ORDERS')
      expect(result.orders).toBe(orders)
      expect(result).toMatchSnapshot()
    })
  })

  describe('orderHistoryRequest', () => {
    it('shows the loader while loading', () => {
      const thunk = accountActions.orderHistoryRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.orderHistoryRequest()
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.orderHistoryRequest()
      const error = new Error()

      get.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(setGenericError).toHaveBeenCalledWith(error)
    })

    it('should get from order-history url', async () => {
      const thunk = accountActions.orderHistoryRequest()
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(get).toHaveBeenCalledWith('/account/order-history')
    })

    it('should set order history orders with the successful response', async () => {
      const orders = [{ test: true }]

      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {
            orders,
          },
        })
      )

      await store.dispatch(accountActions.orderHistoryRequest())

      expect(store.getActions()).toEqual([
        {
          type: 'SET_ORDER_HISTORY_ORDERS',
          orders,
        },
      ])
    })

    it('should clear order history orders with the error response', async () => {
      get.mockReturnValueOnce(() => Promise.reject())

      await store.dispatch(accountActions.orderHistoryRequest())

      expect(store.getActions()).toEqual([
        { type: 'SET_ORDER_HISTORY_ORDERS', orders: {} },
      ])
    })
  })

  describe('orderHistoryDetailsRequest', () => {
    const orderId = 'abc123'
    it('shows the loader while loading', () => {
      const thunk = accountActions.orderHistoryDetailsRequest(orderId)

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.orderHistoryDetailsRequest(orderId)
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.orderHistoryDetailsRequest(orderId)
      const error = new Error()

      get.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(setGenericError).toHaveBeenCalledWith(error)
    })

    it('should get from order-history url with order id', async () => {
      const thunk = accountActions.orderHistoryDetailsRequest(orderId)
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(get).toHaveBeenCalledWith(`/account/order-history/${orderId}`)
    })

    it('should set order history details with the successful response', async () => {
      const body = {
        test: true,
      }

      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body,
        })
      )

      await store.dispatch(accountActions.orderHistoryDetailsRequest(orderId))

      expect(store.getActions()).toEqual([
        {
          type: 'SET_ORDER_HISTORY_DETAILS',
          orderDetails: {
            test: true,
            orderLinesSortedByTracking: {},
          },
        },
      ])
    })
  })

  describe('setReturnHistoryReturns', () => {
    it('returns an action with the correct type and payload', () => {
      const returns = [{ test: true }]
      const result = accountActions.setReturnHistoryReturns(returns)

      expect(typeof result).toBe('object')
      expect(result.type).toBe('SET_RETURN_HISTORY_RETURNS')
      expect(result.returns).toBe(returns)
      expect(result).toMatchSnapshot()
    })
  })

  describe('returnHistoryRequest', () => {
    it('shows the loader while loading', () => {
      const thunk = accountActions.returnHistoryRequest()

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.returnHistoryRequest()
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.returnHistoryRequest()
      const error = new Error()

      get.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      expect(setGenericError).toHaveBeenCalledWith(error)
    })

    it('should get from return-history url', async () => {
      const thunk = accountActions.returnHistoryRequest()
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(get).toHaveBeenCalledWith('/account/return-history')
    })

    it('should set order history orders with the successful response', async () => {
      const orders = [{ test: true }]

      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {
            orders,
          },
        })
      )

      await store.dispatch(accountActions.returnHistoryRequest())

      expect(store.getActions()).toEqual([
        {
          type: 'SET_RETURN_HISTORY_RETURNS',
          returns: [
            {
              test: true,
            },
          ],
        },
      ])
    })
  })

  describe('setReturnHistoryDetails', () => {
    it('returns an action with the correct type and payload', () => {
      const returnDetails = { test: true }
      const result = accountActions.setReturnHistoryDetails(returnDetails)

      expect(typeof result).toBe('object')
      expect(result.type).toBe('SET_RETURN_HISTORY_DETAILS')
      expect(result.returnDetails).toBe(returnDetails)
      expect(result).toMatchSnapshot()
    })
  })

  describe('returnHistoryDetailsRequest', () => {
    const orderId = 'abc'
    const rmaId = '123'

    it('shows the loader while loading', () => {
      const thunk = accountActions.returnHistoryDetailsRequest(orderId, rmaId)

      thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('increment')
    })

    it('hides the loader on success', async () => {
      const thunk = accountActions.returnHistoryDetailsRequest(orderId, rmaId)
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('hides the loader on failure', async () => {
      const thunk = accountActions.returnHistoryDetailsRequest(orderId, rmaId)
      const error = new Error()

      get.mockReturnValueOnce(() => Promise.reject(error))

      await thunk(store.dispatch)

      expect(ajaxCounter).toHaveBeenCalledWith('decrement')
    })

    it('should get from return-history url with orderId and rmaId', async () => {
      const thunk = accountActions.returnHistoryDetailsRequest(orderId, rmaId)
      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: {},
        })
      )

      await thunk(store.dispatch)

      expect(get).toHaveBeenCalledWith(
        `/account/return-history/${orderId}/${rmaId}`
      )
    })

    it('should set order history orders with the successful response', async () => {
      const returnDetails = { test: true }

      get.mockReturnValueOnce(() =>
        Promise.resolve({
          body: returnDetails,
        })
      )

      await store.dispatch(
        accountActions.returnHistoryDetailsRequest(orderId, rmaId)
      )

      expect(store.getActions()).toEqual([
        {
          type: 'SET_RETURN_HISTORY_DETAILS',
          returnDetails,
        },
      ])
    })

    it('should clear order history orders on error response', async () => {
      get.mockReturnValueOnce(() => Promise.reject())

      await store.dispatch(
        accountActions.returnHistoryDetailsRequest(orderId, rmaId)
      )

      expect(store.getActions()).toEqual([
        {
          type: 'SET_RETURN_HISTORY_DETAILS',
          returnDetails: {},
        },
      ])
    })
  })

  describe('setMyCheckoutDetailsInitialFocus', () => {
    it('setMyCheckoutDetailsInitialFocus() to true with initialFocus', () => {
      expect(
        accountActions.setMyCheckoutDetailsInitialFocus(
          '#initial-focus-selector'
        )
      ).toEqual({
        type: 'SET_MCD_INITIAL_FOCUS',
        initialFocus: '#initial-focus-selector',
      })
    })

    it('setMyCheckoutDetailsInitialFocus() to true without initialFocus', () => {
      expect(
        accountActions.setMyCheckoutDetailsInitialFocus(undefined)
      ).toEqual({
        type: 'SET_MCD_INITIAL_FOCUS',
      })
    })
  })

  describe('resetMyCheckoutDetailsForms', () => {
    const dispatch = jest.fn()
    const getState = () => {
      return {
        account: {
          user: userMock,
        },
        forms: {
          account: {
            myCheckoutDetails,
          },
        },
        siteOptions: siteOptionsMock,
        paymentMethods: paymentMethodsList,
      }
    }

    it('should dispatch RESET_FORM for delivery address', () => {
      accountActions.resetMyCheckoutDetailsForms()(dispatch, getState)
      expect(resetForm).toHaveBeenCalledWith(formNames.deliveryMCD.address, {
        address1: '7 Hannah Close',
        address2: 'Llanishen',
        city: 'CARDIFF',
        state: '',
        country: 'United Kingdom',
        postcode: 'se5 9hr',
        county: null,
        isManual: true,
      })
    })
    it('should dispatch RESET_FORM for delivery details', () => {
      accountActions.resetMyCheckoutDetailsForms()(dispatch, getState)
      expect(resetForm).toHaveBeenCalledWith(formNames.deliveryMCD.details, {
        title: 'Mrs',
        firstName: 'new first name',
        lastName: 'Williams',
        telephone: '07971134030',
      })
    })
    it('should dispatch RESET_FORM for billing address', () => {
      accountActions.resetMyCheckoutDetailsForms()(dispatch, getState)
      expect(resetForm).toHaveBeenCalledWith(formNames.billingMCD.address, {
        address1: '7 Hannah Close',
        address2: 'Llanishen',
        city: 'CARDIFF',
        state: '',
        country: 'United Kingdom',
        postcode: 'hp3 9fs',
        county: null,
        isManual: true,
      })
    })
    it('should dispatch RESET_FORM for billing details', () => {
      accountActions.resetMyCheckoutDetailsForms()(dispatch, getState)
      expect(resetForm).toHaveBeenCalledWith(formNames.billingMCD.details, {
        title: 'Mrs',
        firstName: 'new first name',
        lastName: 'Williams',
        telephone: '07971134030',
      })
    })
    it('should dispatch setFindAddressMode', () => {
      accountActions.resetMyCheckoutDetailsForms()(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_ADDRESS_MODE_TO_FIND',
      })
    })
    it('should dispatch RESET_FORM', () => {
      accountActions.resetMyCheckoutDetailsForms()(dispatch, getState)
      expect(resetForm).toHaveBeenCalledWith(
        formNames.payment.paymentCardDetailsMCD,
        {
          paymentType: 'PYPAL',
          cardNumber: '',
          expiryDate: expect.any(String),
          expiryMonth: expect.any(String),
          expiryYear: '',
          startMonth: '',
          startYear: '',
          cvv: '',
        }
      )
    })
  })

  describe('getMyCheckoutDetailsData', () => {
    describe('No Account state previously created', () => {
      it('calls getAccount and resetMyCheckoutDetailsForms when account.user.deliveryAddress does not exists', async () => {
        // TODO this needs expanding as certain selectors aren't mocked and therefore this action (getMyCheckoutDetailsData) hits the catch block eventually
        store = mockStore({
          auth: {
            authentication: 'full',
          },
          paymentMethods: [],
        })

        get.mockReturnValueOnce(() =>
          Promise.resolve({
            body: {
              name: '',
            },
          })
        )

        await store.dispatch(accountActions.getMyCheckoutDetailsData())

        expect(store.getActions()).toEqual([
          { type: 'USER_ACCOUNT', user: { name: '' } },
          { type: 'SET_ADDRESS_MODE_TO_FIND' },
          { type: 'GET_ALL_PAYMENT_METHODS_MOCK' },
        ])
      })

      describe('On failure', () => {
        it('should set form message to error on failure', async () => {
          const error = new Error('Something bad happened')

          store = mockStore({
            auth: {
              authentication: 'full',
            },
          })
          get.mockReturnValueOnce(() => Promise.reject(error))

          await store.dispatch(accountActions.getMyCheckoutDetailsData())
          expect(setGenericError).toHaveBeenCalledWith(error)
        })
      })
    })
  })

  describe('setDeliveryFormsFromBillingForms', () => {
    const dispatch = jest.fn()
    const getState = () => {
      return {
        forms: {
          account: {
            myCheckoutDetails,
          },
        },
      }
    }
    it('should dispatch reset the delivery forms with the billing form values', () => {
      accountActions.setDeliveryFormsFromBillingForms()(dispatch, getState)

      expect(resetForm).toHaveBeenCalledTimes(3)
      expect(clearFormErrors).toHaveBeenCalledTimes(3)
      expect(resetForm).toHaveBeenCalledWith('deliveryAddressMCD', {
        address1: '35 Britten Close',
        address2: '',
        city: 'LONDON',
        country: 'Samoa',
        county: null,
        postcode: 'NW11 7HQ',
        state: '',
      })
      expect(clearFormErrors).toHaveBeenCalledWith('deliveryAddressMCD')
      expect(resetForm).toHaveBeenCalledWith('deliveryDetailsAddressMCD', {
        firstName: 'Jose Billing',
        lastName: 'Quinto',
        telephone: '0980090980',
        title: 'Mrs',
      })
      expect(clearFormErrors).toHaveBeenCalledWith('deliveryDetailsAddressMCD')
      expect(resetForm).toHaveBeenCalledWith('deliveryFindAddressMCD', {
        findAddress: '',
        houseNumber: '',
        postCode: 'NW11 7HQ',
      })
      expect(clearFormErrors).toHaveBeenCalledWith('deliveryFindAddressMCD')
      expect(dispatch).toHaveBeenCalledTimes(6)
    })
  })

  describe('updateMyCheckoutDetails', () => {
    const dispatch = jest.fn()
    const getState = () => {
      return {
        config: {
          language: '',
          brandName: '',
        },
      }
    }
    const data = {
      billingDetails: {
        nameAndPhone: {
          title: 'Dr',
          firstName: 'Jose',
          lastName: 'Quinto',
          telephone: '01111111222',
        },
        address: {
          address1: '11 Britten Close',
          address2: '11111',
          city: 'LONDON',
          state: '',
          country: 'United Kingdom',
          postcode: 'NW11 7HQ',
        },
      },
      deliveryDetails: {
        nameAndPhone: {
          title: 'Dr',
          firstName: 'Jose Delivery',
          lastName: 'Quinto Delivery',
          telephone: '0980090911',
        },
        address: {
          address1: '6 Britten Close',
          address2: 'Nooo',
          city: 'LONDON',
          state: '',
          country: 'United Kingdom',
          postcode: 'NW11 7HQ',
        },
      },
      creditCard: {
        expiryYear: '2017',
        expiryMonth: '11',
        type: 'ACCNT',
        cardNumber: '1111222233334444',
      },
    }
    const formName = 'myCheckoutDetailsForm'

    describe('On success', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      put.mockImplementation(() => Promise.resolve({ body: '__MOCK_USER__' }))
      dispatch.mockImplementation((x) => x)

      it('should call put with /account/customerdetails', async () => {
        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(put).toHaveBeenCalledWith('/account/customerdetails', data)
        expect(dispatch).toHaveBeenCalledWith({
          type: 'USER_ACCOUNT',
          user: '__MOCK_USER__',
        })
      })

      it('should set form message confirming the success', async () => {
        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(setFormMessage).toHaveBeenCalledWith(formName, {
          message: 'Your changes have been saved',
          type: 'confirm',
        })
      })

      it('should set form message confirming the success', async () => {
        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(resetFormPartial).toHaveBeenCalledWith('paymentCardDetailsMCD', {
          cardNumber: '',
        })
      })

      it('should increment and decrement ajax counter', async () => {
        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(ajaxCounter).toHaveBeenCalledWith('increment')
        expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      })

      it('should call browserHistory.push', async () => {
        expect(browserHistory.push).toHaveBeenCalledTimes(0)

        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith('/my-account/details')
      })
    })

    describe('On failure', () => {
      // we are implementing a dispatch mock which sometimes act as Promise, sometimes not.
      // so in order to avoid (node:87324) UnhandledPromiseRejectionWarning: Unhandled promise rejection
      // we are implementing the mock like that
      const dispatch = jest.fn((param) => param)

      it('should increment and then decrement ajax counter on failure', async () => {
        const error = new Error({ message: 'Something bad happened' })
        put.mockReturnValueOnce(Promise.reject(error))

        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(ajaxCounter).toHaveBeenCalledWith('increment')
        expect(ajaxCounter).toHaveBeenCalledWith('decrement')
      })
      it('should set form message to error on failure', async () => {
        const error = new Error('Something bad happened')

        put.mockReturnValueOnce(Promise.reject(error))

        await accountActions.updateMyCheckoutDetails(data, formName)(
          dispatch,
          getState
        )

        expect(handleFormResponseErrorMessage).toHaveBeenCalledWith(
          formName,
          error,
          'An error has occurred. Please try again.'
        )
      })
    })
  })

  describe('resetPasswordSuccess', () => {
    it('should create an action to indicate password reset success', () => {
      expect(accountActions.resetPasswordSuccess({})).toEqual({
        type: 'RESET_PASSWORD_FORM_API_SUCCESS',
        payload: {},
      })
    })
  })

  describe('checkAccountExists', () => {
    let successCallback
    let failureCallback
    let mockData

    beforeEach(async () => {
      successCallback = jest.fn()
      failureCallback = jest.fn()
    })

    describe('onSuccess', () => {
      beforeEach(async () => {
        mockData = {
          body: {
            exists: true,
            email: 'mansnothot@smail.com',
            version: '1.6',
          },
        }

        const getMock = () => {
          const p = Promise.resolve(mockData)
          p.type = 'checkAccountExistsResolvedPromise'
          return p
        }

        get.mockImplementationOnce(getMock)
      })

      it('should do a get request on /account with an email query param', async () => {
        await store.dispatch(
          accountActions.checkAccountExists({
            email: 'mansnothot@gmail.com',
            successCallback,
            failureCallback,
          })
        )
        expect(get).toHaveBeenCalledWith('/account?email=mansnothot@gmail.com')
      })
      it('on success it should call the successCallback (if it exists) with the returned json object', async () => {
        await store.dispatch(
          accountActions.checkAccountExists({
            email: 'mansnothot@gmail.com',
            successCallback,
            failureCallback,
          })
        )
        expect(successCallback).toHaveBeenCalledWith(mockData)
      })
      it('should not fail if an email address is not passed to the action', async () => {
        store.dispatch(
          accountActions.checkAccountExists({
            successCallback,
            failureCallback,
          })
        )
        expect(get).toHaveBeenCalledWith('/account?email=')
      })

      it('should not call the success callback if it is not passed to the action', async () => {
        store.dispatch(
          accountActions.checkAccountExists({
            email: 'mansnothot@gmail.com',
            failureCallback,
          })
        )
        expect(successCallback).not.toHaveBeenCalled()
      })
    })

    describe('onFailure', () => {
      beforeEach(async () => {
        mockData = {
          // Given if the email param is missing entirely
          errorStatusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Must be logged in to perform this action',
          originalMessage: 'Must be logged in to perform this action',
        }

        const getMock = () => {
          const p = Promise.reject(mockData)
          p.type = 'checkAccountExistsRejectedPromise'
          return p
        }

        get.mockImplementationOnce(getMock)
      })

      it('on failure it should call failureCallback (if it exists) with the returned error object', async () => {
        await store.dispatch(
          accountActions.checkAccountExists({
            successCallback,
            failureCallback,
          })
        )

        expect(failureCallback).toHaveBeenCalledWith(mockData)
      })

      it('should not fail if a failure callback is not passed to the action', async () => {
        await store.dispatch(
          accountActions.checkAccountExists({ successCallback })
        )

        expect(failureCallback).not.toHaveBeenCalled()
      })

      it('should log an error message on failure', async () => {
        await store.dispatch(
          accountActions.checkAccountExists({
            successCallback,
            failureCallback,
          })
        )

        expect(logger.error).toHaveBeenCalledWith(mockData)
      })
    })
  })

  describe('getPreferenceLink', () => {
    const initialState = deepFreeze({
      config: {
        locale: 'fr',
        brandCode: 'ts',
        storeCode: 'tsfr',
      },
    })
    const dummyAccount = {
      account: {
        user: {
          email: '',
          expId1: '000b',
          expId2: '00000a',
        },
      },
    }
    let store
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const link = 'testMockLink'
    beforeEach(() => {
      store = mockStore(initialState)
    })
    it('posts a request to the exponena end point', async () => {
      const state = {
        ...initialState,
        ...dummyAccount,
        config: { locale: 'fr' },
      }
      const mockData = {
        body: {
          link,
        },
      }
      const store = mockStore(state)
      const postMock = () => {
        const p = Promise.resolve(mockData)
        p.type = 'exponeaResolvedPromise'
        return p
      }
      post.mockImplementationOnce(postMock)
      await store.dispatch(accountActions.getPreferenceLink())
      const actions = store.getActions()

      expect(actions.length).toBe(2)
      expect(actions[1]).toEqual({
        type: 'FETCH_EXPONENA_LINK',
        link: `${mockData.body.link}?lang=${state.config.locale}`,
      })
    })
    it('logs a client error to new relic if exponea api fails', async () => {
      const state = {
        ...initialState,
        ...dummyAccount,
        config: { locale: 'fr' },
      }
      store = mockStore(state)
      const mockData = {
        error: 'Unprocessable Entity',
        message: 'EXPONEA LINK NOT AVAILABLE',
        statusCode: 422,
      }
      const postMock = () => {
        const p = Promise.reject(mockData)
        p.type = 'exponeaRejectedPromise'
        return p
      }
      post.mockImplementationOnce(postMock)
      await store.dispatch(accountActions.getPreferenceLink())

      expect(clientLogger.nrBrowserLogError).toHaveBeenCalled()
    })
  })
})
