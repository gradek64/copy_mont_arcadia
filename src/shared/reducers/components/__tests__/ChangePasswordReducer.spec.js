import testReducer from '../ChangePasswordReducer'
import { getMockStoreWithInitialReduxState } from 'test/unit/helpers/get-redux-mock-store'

describe('Change Password Reducer', () => {
  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    expect(state.changePassword.success).toBe(false)
  })
  describe('CHANGE_PASSWORD_SUCCESS', () => {
    it('should set `hasSucceeded`', () => {
      expect(
        testReducer(
          { success: false },
          {
            type: 'CHANGE_PASSWORD_SUCCESS',
            hasSucceeded: true,
          }
        )
      ).toEqual({
        success: true,
      })
    })
  })
  describe('SET_POST_RESET_URL', () => {
    it('should set `postResetURL`', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_POST_RESET_URL',
            postResetURL: 'some/url',
          }
        )
      ).toEqual({
        postResetURL: 'some/url',
      })
    })
  })
  describe('LOGOUT', () => {
    it('should set initialState', () => {
      expect(
        testReducer(
          { success: false, postResetURL: 'some/url' },
          {
            type: 'LOGOUT',
          }
        )
      ).toEqual({
        success: false,
      })
    })
  })
})
