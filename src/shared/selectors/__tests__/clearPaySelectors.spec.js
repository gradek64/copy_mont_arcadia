import {
  getAfterPayScriptUrl,
  isClearPayAvailable,
  isPaymentTypeClearPay,
} from '../clearPaySelectors'

describe('clearPaySelectors', () => {
  describe('getAfterPayScriptUrl', () => {
    it('should return the correct script url if it is WCS prod', () => {
      const state = {
        debug: {
          environment: 'prod',
        },
      }

      expect(getAfterPayScriptUrl(state)).toBe(
        'https://portal.clearpay.co.uk/afterpay.js'
      )
    })

    it('should return the correct script url if it is WCS dev', () => {
      const state = {
        debug: {
          environment: 'dev',
        },
      }

      expect(getAfterPayScriptUrl(state)).toBe(
        'https://portal.sandbox.clearpay.co.uk/afterpay.js'
      )
    })
  })

  describe('isPaymentTypeClearPay', () => {
    it('should return true if payment type is ClearPay', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'CLRPY',
            },
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'CLRPY',
                },
              },
            },
          },
        },
      }
      expect(isPaymentTypeClearPay(state)).toBe(true)
    })

    it('should return false if payment type is not ClearPay', () => {
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
      expect(isPaymentTypeClearPay(state)).toBe(false)
    })
  })
  describe('isClearPayAvailable', () => {
    describe('FF FEATURE_CLEAR_PAY is on', () => {
      const features = {
        status: {
          FEATURE_CLEAR_PAY: true,
        },
      }

      it('should return true if checkout.orderSummary.basket.isClearPayAvailable is true', () => {
        const isClearPayAvailableValue = true
        const state = {
          features,
          checkout: {
            orderSummary: {
              basket: {
                isClearPayAvailable: isClearPayAvailableValue,
              },
            },
          },
        }

        expect(isClearPayAvailable(state)).toBe(isClearPayAvailableValue)
      })

      it('should return false if checkout.orderSummary.basket.isClearPayAvailable is false', () => {
        const isClearPayAvailableValue = false
        const state = {
          features,
          checkout: {
            orderSummary: {
              basket: {
                isClearPayAvailable: isClearPayAvailableValue,
              },
            },
          },
        }

        expect(isClearPayAvailable(state)).toBe(isClearPayAvailableValue)
      })

      it('should return false if checkout.orderSummary.basket.isClearPayAvailable is undefined', () => {
        const state = {
          features,
          checkout: {
            orderSummary: {
              basket: {
                isClearPayAvailable: undefined,
              },
            },
          },
        }

        expect(isClearPayAvailable(state)).toBe(false)
      })
    })

    describe('FF FEATURE_CLEAR_PAY is off', () => {
      const features = {
        status: {
          FEATURE_CLEAR_PAY: false,
        },
      }

      it('should return false if checkout.orderSummary.basket.isClearPayAvailable is true', () => {
        const isClearPayAvailableValue = true
        const state = {
          features,
          checkout: {
            orderSummary: {
              basket: {
                isClearPayAvailable: isClearPayAvailableValue,
              },
            },
          },
        }

        expect(isClearPayAvailable(state)).toBe(false)
      })

      it('should return false if checkout.orderSummary.basket.isClearPayAvailable is false', () => {
        const isClearPayAvailableValue = false
        const state = {
          features,
          checkout: {
            orderSummary: {
              basket: {
                isClearPayAvailable: isClearPayAvailableValue,
              },
            },
          },
        }

        expect(isClearPayAvailable(state)).toBe(isClearPayAvailableValue)
      })

      it('should return false if checkout.orderSummary.basket.isClearPayAvailable is undefined', () => {
        const state = {
          features,
          checkout: {
            orderSummary: {
              basket: {
                isClearPayAvailable: undefined,
              },
            },
          },
        }

        expect(isClearPayAvailable(state)).toBe(false)
      })
    })
  })
})
