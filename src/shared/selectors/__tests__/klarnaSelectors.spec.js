import {
  shouldInitialiseKlarnaSession,
  isPaymentTypeKlarna,
  isCountrySupportedByKlarna,
  shouldKlarnaBlockPaymentButton,
} from '../klarnaSelectors'

describe('Klarna Selectors', () => {
  describe('initialiseKlarnaSession', () => {
    const clientToken = 'cda1fae1-c104-70b0-a4de-b4c92dbfe680'
    const paymentMethodCategories = ['pay_later', 'pay_over_time']
    it('should initialise a klarna session if a sessionId does not exists', () => {
      const state = {
        klarna: { sessionId: '', paymentMethodCategories },
      }
      expect(shouldInitialiseKlarnaSession(state)).toBeTruthy()
    })

    it('should not initialise a klarna session if a client token does exists', () => {
      const state = {
        klarna: { clientToken, paymentMethodCategories },
      }
      expect(shouldInitialiseKlarnaSession(state)).toBeFalsy()
    })

    it('should initialise a klarna session on page refresh', () => {
      const state = {
        klarna: { klarnaSessionId: '', paymentMethodCategories: [] },
      }
      expect(shouldInitialiseKlarnaSession(state)).toBeTruthy()
    })
  })
  describe('isPaymentTypeKlarna', () => {
    it('should return true if payment type is Klarna', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'KLRNA',
            },
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'KLRNA',
                },
              },
            },
          },
        },
      }
      expect(isPaymentTypeKlarna(state)).toBeTruthy()
    })

    it('should return true if payment type Klarna and forms payment type value is an empty string', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'KLRNA',
            },
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: '',
                },
              },
            },
          },
        },
      }
      expect(isPaymentTypeKlarna(state)).toBeTruthy()
    })
    it('should return false if Klarna payment type is selected', () => {
      const state = {
        account: {
          user: {
            creditCard: {
              type: 'VISA',
            },
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: '',
                },
              },
            },
          },
        },
      }
      expect(isPaymentTypeKlarna(state)).toBeFalsy()
    })
  })
  describe('isCountrySupportedByKlarna', () => {
    const initState = {
      paymentMethods: [
        {
          value: 'KLRNA',
          deliveryCountry: ['United Kingdom'],
          billingCountry: ['United Kingdom'],
        },
      ],
    }

    it('should return true if country is supported', () => {
      const state = {
        ...initState,
        checkout: {
          orderSummary: {
            shippingCountry: 'United Kingdom',
          },
        },
      }
      expect(isCountrySupportedByKlarna(state)).toBeTruthy()
    })

    it('should return false if country is not supported', () => {
      const state = {
        ...initState,
        checkout: {
          orderSummary: {
            shippingCountry: 'Trinidad',
          },
        },
      }
      expect(isCountrySupportedByKlarna(state)).toBeFalsy()
    })

    it('should return false if Klarna is not listed in the paymentMethods array', () => {
      const state = {
        paymentMethods: [
          {
            value: 'VISA',
            type: 'CARD',
            label: 'Visa',
          },
          {
            value: 'MCARD',
            type: 'CARD',
            label: 'MasterCard',
          },
          {
            value: 'AMEX',
            type: 'CARD',
            label: 'American Express',
          },
          {
            value: 'SWTCH',
            type: 'CARD',
            label: 'Switch/Maestro',
          },
          {
            value: 'ACCNT',
            type: 'OTHER_CARD',
            label: 'Account Card',
          },
          {
            value: 'PYPAL',
            type: 'OTHER',
            label: 'PayPal',
          },
          {
            value: 'ALIPY',
            type: 'OTHER',
            label: 'AliPay',
          },
          {
            value: 'CUPAY',
            type: 'OTHER',
            label: 'China Union Pay',
          },
        ],
        checkout: {
          orderSummary: {
            shippingCountry: 'China',
          },
        },
      }
      expect(isCountrySupportedByKlarna(state)).toBeFalsy()
    })
  })

  describe('shouldKlarnaBlockPaymentButton', () => {
    describe('Payment type is Klarna and Klarna payment is blocked', () => {
      it('should return true', () => {
        const state = {
          account: {
            user: {
              creditCard: {
                type: 'KLRNA',
              },
            },
          },
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'KLRNA',
                  },
                },
              },
            },
          },
          klarna: {
            isKlarnaPaymentBlocked: true,
          },
        }

        expect(shouldKlarnaBlockPaymentButton(state)).toBeTruthy()
      })
    })

    describe('Klarna payment is blocked but payment type is VISA', () => {
      it('should return false', () => {
        const state = {
          account: {
            user: {
              creditCard: {
                type: 'VISA',
              },
            },
          },
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: '',
                  },
                },
              },
            },
          },
          klarna: {
            isKlarnaPaymentBlocked: true,
          },
        }

        expect(shouldKlarnaBlockPaymentButton(state)).toBeFalsy()
      })
    })
  })
})
