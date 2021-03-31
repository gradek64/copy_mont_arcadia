import testComponentHelper from 'test/unit/helpers/test-component'
import PaymentDetailsContainer, {
  mapStateToProps,
  mapDispatchToProps,
} from '../PaymentDetailsContainer'
import { setFormField } from '../../../../../actions/common/formActions'
import {
  saveSelectedPaymentMethod,
  setManualAddressMode,
  openPaymentMethods,
  closePaymentMethods,
} from '../../../../../actions/common/checkoutActions'
import {
  setApplePayAvailability,
  setApplePayAsDefaultPayment,
} from '../../../../../actions/common/applePayActions'

const renderComponent = testComponentHelper(
  PaymentDetailsContainer.WrappedComponent
)

describe('<PaymentDetailsContainer />', () => {
  describe('@mapStateToProps', () => {
    const storedCreditCard = {
      type: 'VISA',
      cardNumberHash: 'tjOBl4zzS+ueTZQWartO5l968iOmCOix',
      cardNumberStar: '************1111',
      expiryMonth: '08',
      expiryYear: '2018',
    }

    const requiredState = {
      viewport: { width: 320 },
      shoppingBag: {
        totalItems: 0,
      },
      checkout: {
        selectedPaymentMethod: 'CARD',
      },
      applePay: {
        canMakePayments: false,
      },
    }

    const accountCreditCard = {
      account: {
        user: {
          creditCard: storedCreditCard,
        },
      },
    }

    const paymentMethodsState = {
      paymentMethods: [
        {
          value: 'VISA',
          type: 'CARD',
          label: 'Visa',
          description: 'Pay with VISA',
          icon: 'icon_visa.svg',
        },
        {
          value: 'AMEX',
          type: 'CARD',
          label: 'American Express',
          description: 'Pay with American Express',
          icon: 'icon_amex.svg',
        },
        {
          value: 'ACCNT',
          type: 'OTHER_CARD',
          label: 'Account Card',
          description: 'Pay with Account Card',
          icon: 'icon_account-card.svg',
        },
        {
          value: 'PYPAL',
          type: 'OTHER',
          label: 'Paypal',
          description: 'Check out with your PayPal account',
          icon: 'icon_paypal.svg',
        },
      ],
      checkout: {
        orderSummary: {
          shippingCountry: 'United Kingdom',
        },
      },
    }

    const createFormsState = (paymentType) => ({
      forms: {
        checkout: {
          billingCardDetails: {
            fields: {
              paymentType: {
                value: paymentType,
              },
            },
          },
        },
      },
    })

    it('should create default props', () => {
      expect(mapStateToProps({ ...requiredState })).toEqual({
        combinedPaymentMethods: [],
        selectedCombinedPaymentMethod: undefined,
        storedPaymentDetails: {},
        storedPaymentMethod: {},
        storedCombinedPaymentMethod: undefined,
        orderDetails: undefined,
        billingAddressForm: undefined,
        billingDetailsForm: undefined,
        config: undefined,
        findAddressState: undefined,
        inDeliveryAndPayment: false,
        orderSummary: undefined,
        siteOptions: undefined,
        isMobileBreakpoint: true,
        userAccountSelectedPaymentMethod: 'CARD',
        shoppingBagTotalItems: 0,
        selectedPaymentMethod: 'CARD',
        storedCardHasExpired: false,
        isCountrySupportedByKlarna: false,
        isApplePayAvailable: false,
      })

      expect(mapDispatchToProps).toEqual({
        setFormField,
        setManualAddressMode,
        saveSelectedPaymentMethod,
        openPaymentMethods,
        closePaymentMethods,
        setApplePayAvailability,
        setApplePayAsDefaultPayment,
      })
    })

    it('should return the payment methods, with the cards combined', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          ...paymentMethodsState,
        }).combinedPaymentMethods
      ).toEqual([
        {
          value: 'CARD',
          label: 'Credit/Debit Card',
          description: 'Visa, American Express',
          type: 'CARD',
          paymentTypes: [
            paymentMethodsState.paymentMethods[0],
            paymentMethodsState.paymentMethods[1],
          ],
          icons: ['icon_visa.svg', 'icon_amex.svg'],
        },
        {
          value: 'ACCNT',
          label: 'Account Card',
          description: 'Pay with Account Card',
          type: 'OTHER_CARD',
          paymentTypes: [],
          icons: ['icon_account-card.svg'],
        },
        {
          value: 'PYPAL',
          label: 'Paypal',
          description: 'Check out with your PayPal account',
          type: 'OTHER',
          paymentTypes: [],
          icons: ['icon_paypal.svg'],
        },
      ])
    })

    it('should return the selected payment method', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          ...createFormsState('ACCNT'),
          ...paymentMethodsState,
          viewport: { width: 320 },
          shoppingBag: {
            totalItems: 0,
          },
        }).selectedCombinedPaymentMethod
      ).toEqual({
        description: 'Pay with Account Card',
        icons: ['icon_account-card.svg'],
        label: 'Account Card',
        paymentTypes: [],
        type: 'OTHER_CARD',
        value: 'ACCNT',
      })
    })

    it('should return a selected payment method of `CARD` if `paymentType` is a card', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          ...createFormsState('CARD'),
          ...paymentMethodsState,
          viewport: { width: 320 },
          shoppingBag: {
            totalItems: 0,
          },
        }).selectedCombinedPaymentMethod
      ).toEqual({
        description: 'Visa, American Express',
        icons: ['icon_visa.svg', 'icon_amex.svg'],
        label: 'Credit/Debit Card',
        paymentTypes: [
          paymentMethodsState.paymentMethods[0],
          paymentMethodsState.paymentMethods[1],
        ],
        type: 'CARD',
        value: 'CARD',
      })
    })

    it('should return first combinedPaymentMethod if no payment method selected in the form', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          ...paymentMethodsState,
          viewport: { width: 320 },
          shoppingBag: {
            totalItems: 0,
          },
        }).selectedCombinedPaymentMethod
      ).toEqual({
        description: 'Visa, American Express',
        icons: ['icon_visa.svg', 'icon_amex.svg'],
        label: 'Credit/Debit Card',
        paymentTypes: [
          paymentMethodsState.paymentMethods[0],
          paymentMethodsState.paymentMethods[1],
        ],
        type: 'CARD',
        value: 'CARD',
      })
    })

    it('should get the current payment details from the account', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          ...accountCreditCard,
        }).storedPaymentDetails
      ).toEqual(storedCreditCard)
    })

    it('should get the current payment method based on the account’s payment details', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          ...accountCreditCard,
          ...paymentMethodsState,
        }).storedCombinedPaymentMethod
      ).toEqual({
        description: 'Visa, American Express',
        icons: ['icon_visa.svg', 'icon_amex.svg'],
        label: 'Credit/Debit Card',
        paymentTypes: [
          paymentMethodsState.paymentMethods[0],
          paymentMethodsState.paymentMethods[1],
        ],
        type: 'CARD',
        value: 'CARD',
      })
    })

    it('should return inDeliveryAndPayment true if on delivery-payment page', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          routing: {
            location: {
              pathname: 'checkout/delivery-payment',
            },
          },
        }).inDeliveryAndPayment
      ).toBe(true)
    })

    it('should return inDeliveryAndPayment false if not on delivery-payment page', () => {
      expect(
        mapStateToProps({
          ...requiredState,
          routing: {
            location: {
              pathname: 'checkout/delivery',
            },
          },
        }).inDeliveryAndPayment
      ).toBe(false)
    })
  })

  describe('componentDidMount', () => {
    describe('Apple is the default payment', () => {
      it('calls setApplePayAsDefaultPayment and setApplePayAvailability', () => {
        const setApplePayAvailability = jest.fn(() => {})
        const setApplePayAsDefaultPayment = jest.fn(() => {})
        const { instance } = renderComponent({
          setFormField: () => {},
          setApplePayAvailability,
          setApplePayAsDefaultPayment,
          userAccountSelectedPaymentMethod: 'APPLE',
          storedPaymentDetails: {
            type: 'APPLE',
          },
        })

        instance.componentDidMount()

        expect(setApplePayAvailability).toHaveBeenCalledTimes(1)
        expect(setApplePayAsDefaultPayment).toHaveBeenCalledTimes(1)
      })
    })

    describe('Apple is not the default payment', () => {
      it('calls setApplePayAvailability', () => {
        const setApplePayAvailability = jest.fn(() => {})
        const setApplePayAsDefaultPayment = jest.fn(() => {})
        const { instance } = renderComponent({
          setFormField: () => {},
          setApplePayAvailability,
          setApplePayAsDefaultPayment,
          userAccountSelectedPaymentMethod: 'ANOTHER',
          storedPaymentDetails: {
            type: 'ANOTHER',
          },
        })

        instance.componentDidMount()

        expect(setApplePayAvailability).toHaveBeenCalledTimes(1)
        expect(setApplePayAsDefaultPayment).toHaveBeenCalledTimes(0)
      })
    })
  })
})
