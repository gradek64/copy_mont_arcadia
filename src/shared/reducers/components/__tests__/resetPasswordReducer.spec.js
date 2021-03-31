import testReducer from '../resetPasswordReducer'

describe('resetPasswordReducer', () => {
  describe('RESET_PASSWORD_FORM_LEAVE', () => {
    it('restores initial state', () => {
      expect(
        testReducer({ success: true }, { type: 'RESET_PASSWORD_FORM_LEAVE' })
      ).toEqual({
        success: false,
      })
    })
  })
  describe('LOGOUT', () => {
    it('restores initial state', () => {
      expect(testReducer({ success: true }, { type: 'LOGOUT' })).toEqual({
        success: false,
      })
    })
  })
  describe('RESET_PASSWORD_FORM_API_SUCCESS', () => {
    it('sets success to true and basket', () => {
      expect(
        testReducer(
          { success: false },
          {
            type: 'RESET_PASSWORD_FORM_API_SUCCESS',
            payload: { basketItemCount: 3 },
          }
        )
      ).toEqual({
        success: true,
        basketCount: 3,
      })
    })
  })
})
