import {
  isPaymentTypeApplePay,
  getMerchantIdentifier,
  isApplePayAvailable,
} from '../applePaySelectors'

describe('applePaySelectors', () => {
  describe('isPaymentTypeApplePay', () => {
    it('should return true if payment type is Apple', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'APPLE',
            },
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'APPLE',
                },
              },
            },
          },
        },
      }
      expect(isPaymentTypeApplePay(state)).toBe(true)
    })

    it('should return false if payment type is not Apple', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'AMEX',
            },
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'AMEX',
                },
              },
            },
          },
        },
      }
      expect(isPaymentTypeApplePay(state)).toBe(false)
    })
  })

  describe('isApplePayAvailable', () => {
    it('should return true if apple pay is available', () => {
      const state = {
        applePay: {
          canMakePayments: true,
        },
      }
      expect(isApplePayAvailable(state)).toBe(true)
    })

    it('should return false if apple pay is unavailable', () => {
      const state = {
        applePay: {
          canMakePayments: false,
        },
      }
      expect(isApplePayAvailable(state)).toBe(false)
    })
  })

  describe('getMerchantIdentifier', () => {
    describe('WCS prod', () => {
      it('returns the correct merchant identifier', () => {
        const state = {
          config: {
            brandName: 'topman',
          },
          debug: {
            environment: 'prod',
          },
        }
        expect(getMerchantIdentifier(state)).toBe(
          'merchant.com.topman.applepay'
        )
      })
    })

    describe('WCS dev', () => {
      it('returns the correct merchant identifier', () => {
        const state = {
          config: {
            brandName: 'topshop',
          },
          debug: {
            environment: 'dev2',
          },
        }
        expect(getMerchantIdentifier(state)).toBe('merchant.com.topshop.test')
      })
    })
  })
})
