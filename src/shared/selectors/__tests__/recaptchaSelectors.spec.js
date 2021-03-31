import { isGuestRecaptchaEnabled } from '../recaptchaSelectors'

describe('Recaptcha Selectors', () => {
  describe('isGuestRecaptchaEnabled', () => {
    it('it should return true if isGuestOrder, FEATURE_GUEST_RECAPTCHA and recaptchaSiteKey are truthy', () => {
      const state = {
        config: { googleRecaptchaSiteKey: 'site key' },
        checkout: {
          orderSummary: {
            isGuestOrder: true,
          },
        },
        features: {
          status: {
            FEATURE_GUEST_RECAPTCHA: true,
          },
        },
      }
      expect(isGuestRecaptchaEnabled(state)).toBe(true)
    })

    it('it should return false if isGuestOrder, FEATURE_GUEST_RECAPTCHA and recaptchaSiteKey are falsy', () => {
      const state = {
        config: { googleRecaptchaSiteKey: 'site key' },
        checkout: {
          orderSummary: {
            isGuestOrder: false,
          },
        },
        features: {
          status: {
            FEATURE_GUEST_RECAPTCHA: true,
          },
        },
      }
      expect(isGuestRecaptchaEnabled(state)).toBe(false)
    })

    it('it should return false if isGuestOrder, FEATURE_GUEST_RECAPTCHA are truthy and recaptchaSiteKey is falsy', () => {
      const state = {
        config: { googleRecaptchaSiteKey: '' },
        checkout: {
          orderSummary: {
            isGuestOrder: true,
          },
        },
        features: {
          status: {
            FEATURE_GUEST_RECAPTCHA: true,
          },
        },
      }
      expect(isGuestRecaptchaEnabled(state)).toBe(false)
    })

    it('it should return false if isGuestOrder, googleRecaptchaSiteKey are truthy and FEATURE_GUEST_RECAPTCHA is falsy', () => {
      const state = {
        config: { googleRecaptchaSiteKey: 'site key' },
        checkout: {
          orderSummary: {
            isGuestOrder: true,
          },
        },
        features: {
          status: {
            FEATURE_GUEST_RECAPTCHA: false,
          },
        },
      }
      expect(isGuestRecaptchaEnabled(state)).toBe(false)
    })
  })
})
