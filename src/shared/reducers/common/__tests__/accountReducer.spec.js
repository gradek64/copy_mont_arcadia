import testReducer from '../accountReducer'
import { getMockStoreWithInitialReduxState } from '../../../../../test/unit/helpers/get-redux-mock-store'
import { UPDATE_LOCATION } from 'react-router-redux'

describe('accountReducer', () => {
  const initialState = {
    user: {},
    forgetPwd: false,
    myCheckoutDetails: {
      editingEnabled: false,
      initialFocus: undefined,
    },
    exponeaLink: '',
    resetPasswordLinkIsValid: null,
  }

  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    expect(state.account.user).toEqual({})
    expect(state.account.forgetPwd).toBe(false)
    expect(state.account.myCheckoutDetails.editingEnabled).toBe(false)
    expect(state.account.myCheckoutDetails.initialFocus).toBe(undefined)
  })

  it('should handle PRE_CACHE_RESET', () => {
    expect(
      testReducer(undefined, {
        type: 'PRE_CACHE_RESET',
      })
    ).toEqual(initialState)
  })

  describe('USER_ACCOUNT', () => {
    it('should set user key with payload', () => {
      const user = 'test'
      expect(
        testReducer(initialState, {
          type: 'USER_ACCOUNT',
          user,
        })
      ).toEqual({
        ...initialState,
        user,
      })
    })
  })

  describe('FETCH_EXPONENA_LINK', () => {
    it('should set exponeaLink key with payload', () => {
      const link = 'www.mockLink.com'
      expect(
        testReducer(initialState, {
          type: 'FETCH_EXPONENA_LINK',
          link,
        })
      ).toEqual({
        ...initialState,
        exponeaLink: link,
      })
    })
  })

  describe('TOGGLE_FORGET_PASSWORD', () => {
    it('should set forgetPwd to true from false', () => {
      expect(
        testReducer(initialState, {
          type: 'TOGGLE_FORGET_PASSWORD',
          account: undefined,
        })
      ).toEqual({
        ...initialState,
        forgetPwd: true,
      })
    })
    it('should set forgetPwd to false from true', () => {
      expect(
        testReducer(
          {
            ...initialState,
            forgetPwd: true,
          },
          {
            type: 'TOGGLE_FORGET_PASSWORD',
            account: undefined,
          }
        )
      ).toEqual(initialState)
    })
  })

  describe('RESET_PASSWORD_LINK_VALID', () => {
    it('should set resetPasswordLinkIsValid to true', () => {
      expect(
        testReducer(initialState, {
          type: 'RESET_PASSWORD_LINK_VALID',
        })
      ).toEqual({
        ...initialState,
        resetPasswordLinkIsValid: true,
      })
    })
  })

  describe('RESET_PASSWORD_LINK_INVALID', () => {
    it('should set resetPasswordLinkIsValid to false', () => {
      expect(
        testReducer(initialState, {
          type: 'RESET_PASSWORD_LINK_INVALID',
        })
      ).toEqual({
        ...initialState,
        resetPasswordLinkIsValid: false,
      })
    })
  })

  describe('`SET_MCD_INITIAL_FOCUS`', () => {
    it('set MyCheckoutDetails editing enabled to true in state with initialFocus correctly set', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_MCD_INITIAL_FOCUS',
            initialFocus: '#initial-focus-test-selector',
          }
        )
      ).toEqual({
        myCheckoutDetails: {
          initialFocus: '#initial-focus-test-selector',
        },
      })
    })
    it('set MyCheckoutDetails editing enabled to true in state with initialFocus correctly unset', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_MCD_INITIAL_FOCUS',
          }
        )
      ).toEqual({
        myCheckoutDetails: {
          initialFocus: undefined,
        },
      })
    })
  })

  describe('`UPDATE_LOCATION`', () => {
    it('should NOT update editingEnabled when no pathname', () => {
      expect(
        testReducer(
          {
            myCheckoutDetails: {
              editingEnabled: false,
              initialFocus: undefined,
            },
          },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: '',
            },
          }
        )
      ).toEqual({
        myCheckoutDetails: {
          editingEnabled: false,
          initialFocus: undefined,
        },
      })
    })
    it('should update editingEnabled to false when view mode', () => {
      expect(
        testReducer(
          {
            myCheckoutDetails: {
              editingEnabled: true,
              initialFocus: undefined,
            },
          },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: '/my-account/details',
            },
          }
        )
      ).toEqual({
        myCheckoutDetails: {
          editingEnabled: false,
          initialFocus: undefined,
        },
      })
    })
    it('should update editingEnabled to true when edit mode', () => {
      expect(
        testReducer(
          {
            myCheckoutDetails: {
              editingEnabled: false,
              initialFocus: undefined,
            },
          },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: '/my-account/details/edit',
            },
          }
        )
      ).toEqual({
        myCheckoutDetails: {
          editingEnabled: true,
          initialFocus: undefined,
        },
      })
    })
  })
})
