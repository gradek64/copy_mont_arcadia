import {
  getCardIcons,
  getCombinedPaymentMethodByPaymentMethodValue,
  getEnabledDecoratedCombinedPaymentMethods,
  getPaymentMethodByOptionType,
  getPaymentMethodByValue,
  getPaymentMethodTypeByValue,
  getPaymentOptionByType,
  getApplePayCardPaymentMethods,
  getSelectedPaymentOptionType,
  isPaymentMethodsLoaded,
  selectCombinedPaymentMethods,
  selectDecoratedCombinedPaymentMethods,
  selectPaymentMethodForStoredPaymentDetails,
  selectPaymentMethodsValidForDeliveryAndBillingCountry,
  selectPaymentMethodsValidForFooter,
  filterAvailablePaymentMethodsForMCD,
  getMCDAvailablePaymentMethodTypes,
  getPaymentOptionKlarna,
  isCard,
  isCardOrAccountCard,
  getSelectedPaymentTypeFromForms,
  getSelectedPaymentTypeFromFormsWithoutDefaultResult,
  getSavedPaymentTypeFromAccount,
  getPaymentMethods,
  getCurrentPaymentConfig,
  getPaymentConfig,
} from '../paymentMethodSelectors'

import { isClearPayAvailable } from '../clearPaySelectors'

jest.mock('../clearPaySelectors')
// mocks
import { paymentMethodsList } from '../../../../test/mocks/paymentMethodsMocks'

const combinedPaymentTypes = [
  {
    description: 'Visa, MasterCard, American Express, Switch/Maestro',
    label: 'Credit/Debit Card',
    paymentTypes: [paymentMethodsList[0], paymentMethodsList[2]],
    type: 'CARD',
    value: 'CARD',
    icons: ['icon_visa.gif', 'icon_amex.gif'],
  },
  {
    description: 'Check out with your PayPal account',
    label: 'Paypal',
    paymentTypes: [],
    type: 'OTHER',
    value: 'PYPAL',
    icons: ['icon_paypal.gif'],
  },
]

describe('payment method selectors', () => {
  describe('getPaymentMethods', () => {
    it('returns all payments available', () => {
      const state = {
        paymentMethods: [
          { type: 'CARD', value: 'VISA' },
          { type: 'CARD', value: 'AMEX' },
        ],
      }

      const paymentMethods = getPaymentMethods(state)

      expect(paymentMethods).toEqual([
        { type: 'CARD', value: 'VISA' },
        { type: 'CARD', value: 'AMEX' },
      ])
    })

    describe('ClearPay', () => {
      describe('isClearPayAvailable is false', () => {
        it('does not return ClearPay if it is present', () => {
          isClearPayAvailable.mockReturnValue(false)
          const state = {
            paymentMethods: [{ type: 'OTHER', value: 'CLRPY' }],
          }
          expect(getPaymentMethods(state)).toEqual([])
        })
      })

      describe('isClearPayAvailable is true', () => {
        it('returns ClearPay if it is present', () => {
          isClearPayAvailable.mockReturnValue(true)

          const state = {
            features: {
              status: {
                FEATURE_CLEAR_PAY: true,
              },
            },
            paymentMethods: [{ type: 'OTHER', value: 'CLRPY' }],
          }
          expect(getPaymentMethods(state)).toEqual([
            { type: 'OTHER', value: 'CLRPY' },
          ])
        })
      })
    })

    describe('ApplePay', () => {
      describe('FEATURE_APPLE_PAY is on', () => {
        it('returns ApplePay if it is present', () => {
          const state = {
            features: {
              status: {
                FEATURE_APPLE_PAY: true,
              },
            },
            paymentMethods: [
              { type: 'CARD', value: 'VISA' },
              { type: 'CARD', value: 'AMEX' },
              { type: 'OTHER', value: 'APPLE' },
            ],
          }

          const paymentMethods = getPaymentMethods(state)

          expect(paymentMethods).toEqual([
            { type: 'CARD', value: 'VISA' },
            { type: 'CARD', value: 'AMEX' },
            { type: 'OTHER', value: 'APPLE' },
          ])
        })
      })

      describe('FEATURE_APPLE_PAY is off', () => {
        it('does not return ApplePay if it is present', () => {
          const state = {
            features: {
              status: {
                FEATURE_APPLE_PAY: false,
              },
            },
            paymentMethods: [
              { type: 'CARD', value: 'VISA' },
              { type: 'CARD', value: 'AMEX' },
              { type: 'OTHER', value: 'APPLE' },
            ],
          }

          const paymentMethods = getPaymentMethods(state)

          expect(paymentMethods).toEqual([
            { type: 'CARD', value: 'VISA' },
            { type: 'CARD', value: 'AMEX' },
          ])
        })
      })
    })
  })

  describe('getMCDAvailablePaymentMethodTypes', () => {
    it('returns an empty array when there are no payment methods', () => {
      const state = { paymentMethods: [] }
      const types = getMCDAvailablePaymentMethodTypes(state)
      expect(types).toEqual([])
    })

    describe('when the payment method type is card', () => {
      it('returns one `CARD` entry to represent all the card types', () => {
        const state = {
          paymentMethods: [
            { type: 'CARD', value: 'VISA' },
            { type: 'CARD', value: 'AMEX' },
          ],
        }
        const types = getMCDAvailablePaymentMethodTypes(state)
        expect(types).toEqual(['CARD'])
      })
    })

    describe('when the payment method type is not CARD', () => {
      it('plucks the payment method `value` prop instead of the `type` prop and returns it as part of the result', () => {
        const state = {
          paymentMethods: [
            { type: 'OTHER', value: 'ACCNT' },
            { type: 'OTHER', value: 'PYPAL' },
          ],
        }
        const types = getMCDAvailablePaymentMethodTypes(state)
        expect(types).toEqual(['ACCNT', 'PYPAL'])
      })

      it('should not have CLRPY in return result', () => {
        const state = {
          paymentMethods: [
            { type: 'OTHER', value: 'ACCNT' },
            { type: 'OTHER', value: 'PYPAL' },
            { type: 'OTHER', value: 'CLRPY' },
          ],
        }
        const types = getMCDAvailablePaymentMethodTypes(state)
        expect(types).toEqual(['ACCNT', 'PYPAL'])
      })
    })
  })

  describe('getPaymentMethodByOptionType', () => {
    describe('when the type is `CARD`', () => {
      it('returns a standard card entry that contains all the payment methods', () => {
        const type = 'CARD'
        const state = {
          paymentMethods: [
            { type: 'CARD', label: 'Visa' },
            { type: 'CARD', label: 'MasterCard' },
          ],
        }
        const result = getPaymentMethodByOptionType(state, type)
        const expectedResult = {
          value: 'CARD',
          type: 'CARD',
          label: 'Credit/Debit Card',
          description: 'Visa, MasterCard',
          paymentTypes: [
            { type: 'CARD', label: 'Visa' },
            { type: 'CARD', label: 'MasterCard' },
          ],
        }
        expect(result).toEqual(expectedResult)
      })
    })

    describe('when the type is not `CARD`', () => {
      it('returns the payment method whose `value` prop is the same as the `type` argument', () => {
        const type = 'ACCNT'
        const state = {
          paymentMethods: [{ value: 'ACCNT' }, { type: 'CARD' }],
        }
        const result = getPaymentMethodByOptionType(state, type)
        expect(result).toEqual(state.paymentMethods[0])
      })
    })
  })

  describe('getCardIcons', () => {
    it('returns each card payment method icon', () => {
      const state = {
        paymentMethods: [
          { type: 'CARD', icon: 'icon1' },
          { type: 'CARD', icon: 'icon2' },
        ],
      }
      const result = getCardIcons(state)
      expect(result).toEqual(['icon1', 'icon2'])
    })
  })

  describe('getPaymentMethodByValue', () => {
    it('returns the payment method whose value is the same as the value supplied', () => {
      const value = 'PYPAL'
      const state = {
        paymentMethods: [{ value: 'ACCNT' }, { value: 'PYPAL' }],
      }
      const result = getPaymentMethodByValue(state, value)
      expect(result).toEqual(state.paymentMethods[1])
    })
  })

  describe('isPaymentMethodsLoaded', () => {
    it('returns true when there are payment methods', () => {
      const state = { paymentMethods: [1] }
      const result = isPaymentMethodsLoaded(state)
      expect(result).toBe(true)
    })

    it('returns false when there are no payment methods', () => {
      const state = { paymentMethods: [] }
      const result = isPaymentMethodsLoaded(state)
      expect(result).toBe(false)
    })
  })

  describe('getSelectedPaymentOptionType', () => {
    describe('when the selected payment option is of a card type', () => {
      it('it returns `CARD`', () => {
        const state = {
          paymentMethods: [
            { value: 'VISA', type: 'CARD' },
            { value: 'PYPAL', type: 'OTHER' },
          ],
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'VISA',
                  },
                },
              },
            },
          },
        }
        const result = getSelectedPaymentOptionType(state)
        expect(result).toBe('CARD')
      })
    })

    describe('when the selected payment option is not a card type', () => {
      it('returns the value of the selected payment option', () => {
        const state = {
          paymentMethods: [
            { value: 'VISA', type: 'CARD' },
            { value: 'PYPAL', type: 'OTHER' },
          ],
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'PYPAL',
                  },
                },
              },
            },
          },
        }
        const result = getSelectedPaymentOptionType(state)
        expect(result).toBe('PYPAL')
      })
    })
  })

  describe('getPaymentOptionByType', () => {
    describe('when the type is `CARD`', () => {
      it('returns a standard card entry', () => {
        const type = 'CARD'
        const state = {
          paymentMethods: [
            { type: 'CARD', label: 'Visa', icon: 'visa-icon' },
            { type: 'CARD', label: 'MasterCard', icon: 'mc-icon' },
            { type: 'OTHER' },
          ],
        }
        const result = getPaymentOptionByType(state, type)
        const expectedResult = {
          value: 'CARD',
          type: 'CARD',
          icons: ['visa-icon', 'mc-icon'],
          label: 'Credit/Debit Card',
          description: 'Visa, MasterCard',
          paymentTypes: [
            { type: 'CARD', label: 'Visa', icon: 'visa-icon' },
            { type: 'CARD', label: 'MasterCard', icon: 'mc-icon' },
          ],
        }
        expect(result).toEqual(expectedResult)
      })
    })

    describe('when the type is not `CARD`', () => {
      it('returns a standard non card entry', () => {
        const type = 'PYPAL'
        const state = {
          paymentMethods: [{ value: 'PYPAL', icon: 'paypal-icon' }],
        }
        const result = getPaymentOptionByType(state, type)
        const expectedResult = {
          value: 'PYPAL',
          icons: ['paypal-icon'],
        }
        expect(result).toEqual(expectedResult)
      })
    })
  })

  describe('getPaymentMethodTypeByValue', () => {
    describe('if value exists in paymentMethods', () => {
      it('return type CARD if value is VISA', () => {
        const value = 'VISA'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('CARD')
      })
      it('return type CARD if value is MCARD', () => {
        const value = 'MCARD'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('CARD')
      })
      it('return type CARD if value is AMEX', () => {
        const value = 'AMEX'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('CARD')
      })
      it('return type CARD if value is SWTCH', () => {
        const value = 'SWTCH'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('CARD')
      })
      it('return type CARD if value is SWTCH', () => {
        const value = 'SWTCH'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('CARD')
      })
      it('return type OTHER_CARD if value is ACCNT', () => {
        const value = 'ACCNT'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('OTHER_CARD')
      })
      it('return type OTHER if value is PYPAL', () => {
        const value = 'PYPAL'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('OTHER')
      })
      it('return type OTHER if value is MPASS', () => {
        const value = 'MPASS'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('OTHER')
      })
      it('return type OTHER if value is KLRNA', () => {
        const value = 'KLRNA'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('OTHER')
      })
    })

    describe('returns by default', () => {
      it('should return CARD if state is {}', () => {
        const result = getPaymentMethodTypeByValue({}, null)
        expect(result).toEqual('CARD')
      })
      it('should return CARD if state is type is null', () => {
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, null)
        expect(result).toEqual('CARD')
      })
      it('should return CARD if value does not exists in paymentMethods', () => {
        const value = 'NOVALUE'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value)
        expect(result).toEqual('CARD')
      })
      it('should return OTHER as default if specified', () => {
        const value = 'NOVALUE'
        const state = {
          paymentMethods: paymentMethodsList,
        }
        const result = getPaymentMethodTypeByValue(state, value, 'OTHER')
        expect(result).toEqual('OTHER')
      })
    })
  })

  describe('isCard', () => {
    const state = {
      paymentMethods: paymentMethodsList,
    }
    it('should detect regular banking cards', () => {
      expect(isCard(state, 'VISA')).toBe(true)
      expect(isCard(state, 'MCARD')).toBe(true)
      expect(isCard(state, 'AMEX')).toBe(true)
      expect(isCard(state, 'SWTCH')).toBe(true)
    })
    it('should reject account Card', () => {
      expect(isCard(state, 'ACCNT')).toBe(false)
    })
    it('should reject other payment types', () => {
      expect(isCard(state, 'PYPAL')).toBe(false)
      expect(isCard(state, 'KLRNA')).toBe(false)
    })
    it('should reject an unknown payment type', () => {
      expect(isCard(state, 'SHOW_ME_THE_MONEY')).toBe(false)
    })
  })
  describe('isCardOrAccountCard', () => {
    const state = {
      paymentMethods: paymentMethodsList,
    }
    it('should detect regular banking cards', () => {
      expect(isCardOrAccountCard(state, 'VISA')).toBe(true)
      expect(isCardOrAccountCard(state, 'MCARD')).toBe(true)
      expect(isCardOrAccountCard(state, 'AMEX')).toBe(true)
      expect(isCardOrAccountCard(state, 'SWTCH')).toBe(true)
    })
    it('should accept account Card', () => {
      expect(isCardOrAccountCard(state, 'ACCNT')).toBe(true)
    })
    it('should reject other payment types', () => {
      expect(isCardOrAccountCard(state, 'PYPAL')).toBe(false)
      expect(isCardOrAccountCard(state, 'KLRNA')).toBe(false)
    })
    it('should reject an unknown payment type', () => {
      expect(isCardOrAccountCard(state, 'SHOW_ME_THE_MONEY')).toBe(false)
    })
  })

  describe('isCard', () => {
    it('should detect regular banking cards', () => {
      const state = {
        paymentMethods: paymentMethodsList,
      }
      expect(isCard(state, 'VISA')).toBe(true)
      expect(isCard(state, 'MCARD')).toBe(true)
      expect(isCard(state, 'AMEX')).toBe(true)
      expect(isCard(state, 'SWTCH')).toBe(true)
    })

    it('should reject other payment types', () => {
      const state = {
        paymentMethods: paymentMethodsList,
      }
      expect(isCard(state, 'ACCNT')).toBe(false)
      expect(isCard(state, 'PYPAL')).toBe(false)
      expect(isCard(state, 'KLRNA')).toBe(false)
    })

    it('should reject an unknown payment type', () => {
      const state = {
        paymentMethods: paymentMethodsList,
      }
      expect(isCard(state, 'SHOW_ME_THE_MONEY')).toBe(false)
    })
  })

  describe('selectPaymentMethodForStoredPaymentDetails', () => {
    const state = {
      account: {
        user: {
          creditCard: {
            type: 'VISA',
          },
        },
      },
      paymentMethods: [
        {
          label: 'Visa',
          value: 'VISA',
          icon: 'visa.svg',
        },
      ],
    }

    it('should extract creditCard from user', () => {
      expect(
        selectPaymentMethodForStoredPaymentDetails(state)
      ).toMatchSnapshot()
    })

    it('should return credit/debit visa card when not payment methods list', () => {
      expect(
        selectPaymentMethodForStoredPaymentDetails({
          ...state,
          paymentMethods: [],
        })
      ).toEqual({})
    })

    it('should return empty when account/user/creditcard state is empty', () => {
      expect(
        selectPaymentMethodForStoredPaymentDetails({
          account: { user: { creditcard: {} } },
        })
      ).toEqual({})
    })
  })

  describe('selectCombinedPaymentMethods', () => {
    it('should return the combined payment methods (cards combined as one payment method)', () => {
      const mockState = {
        paymentMethods: [
          paymentMethodsList[0],
          paymentMethodsList[2],
          paymentMethodsList[5],
        ],
      }

      expect(selectCombinedPaymentMethods(mockState)).toEqual([
        {
          description: 'Visa, American Express',
          label: 'Credit/Debit Card',
          paymentTypes: [paymentMethodsList[0], paymentMethodsList[2]],
          type: 'CARD',
          value: 'CARD',
        },
        {
          description: 'Check out with your PayPal account',
          label: 'Paypal',
          type: 'OTHER',
          value: 'PYPAL',
          icon: 'icon_paypal.gif',
        },
      ])
    })
  })

  describe('selectDecoratedCombinedPaymentMethods', () => {
    let mockState

    beforeEach(() => {
      mockState = {
        paymentMethods: [
          paymentMethodsList[0],
          paymentMethodsList[2],
          paymentMethodsList[5],
        ],
      }
    })

    it('should return combinedPaymentMethods with the icons mapped to an array for each payment type', () => {
      expect(selectDecoratedCombinedPaymentMethods(mockState)).toEqual([
        {
          description: 'Visa, American Express',
          label: 'Credit/Debit Card',
          paymentTypes: [paymentMethodsList[0], paymentMethodsList[2]],
          type: 'CARD',
          value: 'CARD',
          icons: ['icon_visa.gif', 'icon_amex.gif'],
        },
        {
          description: 'Check out with your PayPal account',
          label: 'Paypal',
          paymentTypes: [],
          type: 'OTHER',
          value: 'PYPAL',
          icons: ['icon_paypal.gif'],
        },
      ])
    })
  })

  describe('getCombinedPaymentMethodByPaymentMethodValue', () => {
    let combinedPaymentMethods
    beforeEach(() => {
      combinedPaymentMethods = [
        {
          description: 'Visa, American Express',
          label: 'Credit/Debit Card',
          paymentTypes: [paymentMethodsList[0], paymentMethodsList[2]],
          type: 'CARD',
          value: 'CARD',
        },
        {
          description: 'Check out with your PayPal account',
          label: 'Paypal',
          type: 'OTHER',
          value: 'PYPAL',
          icon: 'icon_paypal.gif',
        },
      ]
    })
    it('should return a combined payment method if a non card payment method value property is provided', () => {
      expect(
        getCombinedPaymentMethodByPaymentMethodValue(
          combinedPaymentMethods,
          'VISA',
          undefined
        )
      ).toBe(combinedPaymentMethods[0])
    })
    it('should return the card combined payment method if a card payment method value property is provided', () => {
      expect(
        getCombinedPaymentMethodByPaymentMethodValue(
          combinedPaymentMethods,
          'PYPAL',
          undefined
        )
      ).toBe(combinedPaymentMethods[1])
    })
    it('should default to the supplied default value if no combined payment method can be found', () => {
      expect(
        getCombinedPaymentMethodByPaymentMethodValue(
          combinedPaymentMethods,
          'NON_EXISTENT',
          []
        )
      ).toEqual([])
    })
  })

  describe('selectPaymentMethodsValidForDeliveryAndBillingCountry', () => {
    it('should not filter out payment methods that do not define a billing country or delivery country', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[0]],
      }

      expect(
        selectPaymentMethodsValidForDeliveryAndBillingCountry(state)
      ).toEqual([paymentMethodsList[0]])
    })

    it('should not filter out payment methods that match both billing country and delivery country', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[7]],
      }

      expect(
        selectPaymentMethodsValidForDeliveryAndBillingCountry(state)
      ).toEqual([paymentMethodsList[7]])
    })

    it('should not filter out payment methods that match one or more billing countries', () => {
      const state = {
        config: {
          country: 'Germany',
        },
        paymentMethods: [paymentMethodsList[10]],
      }

      expect(
        selectPaymentMethodsValidForDeliveryAndBillingCountry(state)
      ).toEqual([paymentMethodsList[10]])
    })

    it('should filter out payment methods that are for the incorrect billing country', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[0], paymentMethodsList[8]],
      }
      expect(
        selectPaymentMethodsValidForDeliveryAndBillingCountry(state)
      ).toEqual([paymentMethodsList[0]])
    })

    it('should filter out payment methods that are for the incorrect delivery country', () => {
      const hypotheticalPaymentMethod = {
        ...paymentMethodsList[1],
        deliveryCountry: ['Egypt'],
      }
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[0], hypotheticalPaymentMethod],
      }
      expect(
        selectPaymentMethodsValidForDeliveryAndBillingCountry(state)
      ).toEqual([paymentMethodsList[0]])
    })
  })

  describe('getPaymentConfig', () => {
    it('Should return clearPay payment config with alwaysShowIconInFooter as true', () => {
      const expectedResult = getPaymentConfig('CLRPY')
      expect(expectedResult).toEqual(
        {
          alwaysShowIconInFooter: true,
          canSavePaymentAsDefault: false,
          saveDetails: false,
        }
      )
    })

    it('Should return applePay payment config with alwaysShowIconInFooter as false', () => {
      const expectedResult = getPaymentConfig('APPLE')
      expect(expectedResult).toEqual(
        {
          alwaysShowIconInFooter: false,
          canSavePaymentAsDefault: true,
          saveDetails: true,
        }
      )
    })
  })

  describe('getEnabledDecoratedCombinedPaymentMethods', () => {
    const defaultState = {
      config: {
        country: 'United Kingdom',
      },
      paymentMethods: [
        paymentMethodsList[0],
        paymentMethodsList[11],
        paymentMethodsList[8],
        paymentMethodsList[12],
      ],
      features: {
        status: {
          FEATURE_CLEAR_PAY: true,
          FEATURE_APPLE_PAY: true,
        },
      },
    }

    it('should return all available payment methods', () => {
      isClearPayAvailable.mockReturnValue(true)
      const state = {
        ...defaultState,
        applePay: {
          canMakePayments: true,  //  Needed for isAppleAvailable selector
        },
      }

      const paymentMethods = getEnabledDecoratedCombinedPaymentMethods(state)
      expect(paymentMethods).toEqual([
        {
          description: 'Visa',
          label: 'Credit/Debit Card',
          paymentTypes: [paymentMethodsList[0]],
          type: 'CARD',
          value: 'CARD',
          icons: ['icon_visa.gif'],
        },
        {
          description: 'Check out with your ClearPay account',
          label: 'ClearPay',
          paymentTypes: [],
          type: 'OTHER',
          value: 'CLRPY',
          icons: ['icon_clearpay.svg'],
        },
        {
          description: 'Check out with your Apple Pay account',
          label: 'Apple',
          paymentTypes: [],
          type: 'OTHER',
          value: 'APPLE',
          icons: ['icon_applepay.svg'],
        },
      ])
    })

    it('should not return apple pay if isApplePayAvailable is false', () => {
      isClearPayAvailable.mockReturnValue(true)
      const paymentMethods = getEnabledDecoratedCombinedPaymentMethods(defaultState)
      expect(paymentMethods).toEqual([
        {
          description: 'Visa',
          label: 'Credit/Debit Card',
          paymentTypes: [paymentMethodsList[0]],
          type: 'CARD',
          value: 'CARD',
          icons: ['icon_visa.gif'],
        },
        {
          description: 'Check out with your ClearPay account',
          label: 'ClearPay',
          paymentTypes: [],
          type: 'OTHER',
          value: 'CLRPY',
          icons: ['icon_clearpay.svg'],
        },
      ])
    })

    it('should not return clear pay if isClearPayAvailable is false', () => {
      isClearPayAvailable.mockReturnValue(false)
      const state = {
        ...defaultState,
        applePay: {
          canMakePayments: true,  //  Needed for isAppleAvailable selector
        },
      }
      const paymentMethods = getEnabledDecoratedCombinedPaymentMethods(state)
      expect(paymentMethods).toEqual([
        {
          description: 'Visa',
          label: 'Credit/Debit Card',
          paymentTypes: [paymentMethodsList[0]],
          type: 'CARD',
          value: 'CARD',
          icons: ['icon_visa.gif'],
        },
        {
          description: 'Check out with your Apple Pay account',
          label: 'Apple',
          paymentTypes: [],
          type: 'OTHER',
          value: 'APPLE',
          icons: ['icon_applepay.svg'],
        },
      ])
    })
  })

  describe('selectPaymentMethodsValidForFooter', () => {
    describe('When Clear pay feature flag is on', () => {
      it('should return clear pay payment type for footer', () => {
        const state = {
          config: {
            country: 'United Kingdom',
          },
          features: {
            status: {
              FEATURE_CLEAR_PAY: true,
            },
          },
          paymentMethods: [
            paymentMethodsList[0],
            paymentMethodsList[11],
            paymentMethodsList[8],
          ],
        }
        const expectedResult = selectPaymentMethodsValidForFooter(state)
        expect(expectedResult).toEqual([
          paymentMethodsList[0],
          paymentMethodsList[11],
        ])
      })
    })

    describe('When Clear pay feature flag is off', () => {
      it('should not return clear pay payment type for footer', () => {
        const state = {
          config: {
            country: 'United Kingdom',
          },
          features: {
            status: {
              FEATURE_CLEAR_PAY: false,
            },
          },
          paymentMethods: [
            paymentMethodsList[0],
            paymentMethodsList[11],
            paymentMethodsList[8],
          ],
        }
        const expectedResult = selectPaymentMethodsValidForFooter(state)

        expect(expectedResult).toEqual([paymentMethodsList[0]])
      })
    })

    it('should not filter out payment methods that do not define a billing country or delivery country', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[0]],
      }

      expect(selectPaymentMethodsValidForFooter(state)).toEqual([
        paymentMethodsList[0],
      ])
    })

    it('should not filter out payment methods that match both billing country and delivery country', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[7]],
      }

      expect(selectPaymentMethodsValidForFooter(state)).toEqual([
        paymentMethodsList[7],
      ])
    })

    it('should not filter out payment methods that match one or more billing countries', () => {
      const state = {
        config: {
          country: 'Germany',
        },
        paymentMethods: [paymentMethodsList[10]],
      }

      expect(selectPaymentMethodsValidForFooter(state)).toEqual([
        paymentMethodsList[10],
      ])
    })

    it('should filter out payment methods that are for the incorrect billing country', () => {
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[0], paymentMethodsList[8]],
      }
      expect(selectPaymentMethodsValidForFooter(state)).toEqual([
        paymentMethodsList[0],
      ])
    })

    it('should filter out payment methods that are for the incorrect delivery country', () => {
      const hypotheticalPaymentMethod = {
        ...paymentMethodsList[1],
        deliveryCountry: ['Egypt'],
      }
      const state = {
        config: {
          country: 'United Kingdom',
        },
        paymentMethods: [paymentMethodsList[0], hypotheticalPaymentMethod],
      }
      expect(selectPaymentMethodsValidForFooter(state)).toEqual([
        paymentMethodsList[0],
      ])
    })
  })

  describe('filterAvailablePaymentMethodsForMCD', () => {
    const generateMCDFormsState = (deliveryCountry, billingCountry) => ({
      forms: {
        account: {
          myCheckoutDetails: {
            deliveryAddressMCD: {
              fields: {
                country: {
                  value: deliveryCountry,
                },
              },
            },
            billingAddressMCD: {
              fields: {
                country: {
                  value: billingCountry,
                },
              },
            },
          },
        },
      },
    })

    it('should return all available payment methods available in the UK', () => {
      const state = {
        ...generateMCDFormsState('United Kingdom', 'United Kingdom'),
        paymentMethods: paymentMethodsList,
      }

      expect(filterAvailablePaymentMethodsForMCD(state).length).toBe(8)
    })
    it('includes AliPay when BillingCountry is set to China', () => {
      const state = {
        ...generateMCDFormsState('United Kingdom', 'China'),
        paymentMethods: paymentMethodsList,
      }
      const expectedResult = filterAvailablePaymentMethodsForMCD(state).find(
        (el) => el.value === 'ALIPY'
      )
      expect(expectedResult).toEqual(paymentMethodsList[8])
    })
  })

  describe('getPaymentOptionKlarna', () => {
    it('should return a klarna payment option', () => {
      const state = {
        paymentMethods: [
          {
            value: 'KLRNA',
          },
        ],
      }
      expect(getPaymentOptionKlarna(state)).toEqual(state.paymentMethods[0])
    })

    it('should return an empty object', () => {
      const state = {
        paymentMethods: [
          {
            value: 'CARD',
          },
        ],
      }
      expect(getPaymentOptionKlarna(state)).toEqual({})
    })
  })

  describe('getSelectedPaymentTypeFromForms', () => {
    it('should return a selected payment method', () => {
      const expected = combinedPaymentTypes[1]
      expect(
        getSelectedPaymentTypeFromForms.resultFunc(
          combinedPaymentTypes,
          'PYPAL'
        )
      ).toEqual(expected)
    })

    it('should return a default payment method if a payment type is not defined', () => {
      const expected = combinedPaymentTypes[0]
      expect(
        getSelectedPaymentTypeFromForms.resultFunc(combinedPaymentTypes, '')
      ).toEqual(expected)
    })
  })

  describe('getSelectedPaymentTypeFromFormsWithoutDefaultResult', () => {
    it('should return a selected payment method', () => {
      const expected = combinedPaymentTypes[1]
      expect(
        getSelectedPaymentTypeFromFormsWithoutDefaultResult.resultFunc(
          combinedPaymentTypes,
          'PYPAL'
        )
      ).toEqual(expected)
    })

    it('should return undefined if a payment type is not defined', () => {
      const expected = undefined
      expect(
        getSelectedPaymentTypeFromFormsWithoutDefaultResult.resultFunc(
          combinedPaymentTypes,
          ''
        )
      ).toEqual(expected)
    })
  })

  describe('getSavedPaymentTypeFromAccount', () => {
    it('should return a selected payment method', () => {
      const expected = combinedPaymentTypes[1]
      expect(
        getSavedPaymentTypeFromAccount.resultFunc(combinedPaymentTypes, 'PYPAL')
      ).toEqual(expected)
    })

    it('should return undefined if a payment type is not defined', () => {
      const expected = undefined
      expect(
        getSavedPaymentTypeFromAccount.resultFunc(combinedPaymentTypes, '')
      ).toEqual(expected)
    })
  })

  describe('getApplePayCardPaymentMethods', () => {
    it('returns the Apple Payments cards accepted', () => {
      const state = {
        paymentMethods: [
          { type: 'CARD', value: 'VISA' },
          { type: 'CARD', value: 'MCARD' },
          { type: 'CARD', value: 'AMEX' },
          { type: 'CARD', value: 'ANOTHER_CARD' },
          { type: 'CARD', value: 'SWTCH' },
          { type: 'OTHER', value: 'PAYPAL' },
        ],
      }
      const types = getApplePayCardPaymentMethods(state)

      expect(types).toEqual(['visa', 'masterCard', 'amex', 'maestro'])
    })
  })

  describe('getCurrentPaymentConfig', () => {
    it('saveDetails and canSavePaymentAsDefault should be true', () => {
      const state = {
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'APPLEPAY',
                },
              },
            },
          },
        },
      }

      const types = getCurrentPaymentConfig(state)

      expect(types).toEqual({
        alwaysShowIconInFooter: false,
        canSavePaymentAsDefault: true,
        saveDetails: true,
      })
    })

    describe('Clearpay', () => {
      it('saveDetails and canSavePaymentAsDefault should be false', () => {
        const state = {
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

        const types = getCurrentPaymentConfig(state)

        expect(types).toEqual({
          alwaysShowIconInFooter: true,
          canSavePaymentAsDefault: false,
          saveDetails: false,
        })
      })
    })
  })
})
