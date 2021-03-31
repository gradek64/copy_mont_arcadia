import { getSuccess, getBasketCount } from '../resetPasswordSelectors'

describe('form selectors', () => {
  const populatedState = {
    resetPassword: {
      success: true,
      basketCount: 1,
    },
  }

  describe(getSuccess.name, () => {
    it('returns the state', () => {
      expect(getSuccess(populatedState)).toBe(true)
    })
  })

  describe(getBasketCount.name, () => {
    it('returns the state', () => {
      expect(getBasketCount(populatedState)).toBe(1)
    })
  })
})
