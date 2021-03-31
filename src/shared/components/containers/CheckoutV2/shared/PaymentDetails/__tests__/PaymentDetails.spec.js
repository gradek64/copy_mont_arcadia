import toJson from 'enzyme-to-json'
import { propEq } from 'ramda'

import testComponentHelper from 'test/unit/helpers/test-component'

import PaymentDetails from '../PaymentDetails'

describe('<PaymentDetails/>', () => {
  const renderComponent = testComponentHelper(PaymentDetails)
  const saveSelectedPaymentMethodMock = jest.fn()
  const openPaymentMethodsStub = jest.fn()
  const requiredProps = {
    billingAddressForm: {},
    billingDetailsForm: {},
    combinedPaymentMethods: [],
    findAddressState: {},
    inDeliveryAndPayment: false,
    isMobileBreakpoint: false,
    showPaymentForm: false,
    storedPaymentDetails: {
      type: 'CARD',
    },
    paymentMethodsAreOpen: false,
    openPaymentMethods: openPaymentMethodsStub,
    selectedCombinedPaymentMethod: {},
    setFormField: () => {},
    setManualAddressMode: () => {},
    saveSelectedPaymentMethod: saveSelectedPaymentMethodMock,
    selectedPaymentMethod: 'CARD',
    shoppingBagTotalItems: 1,
  }

  const resetFormPartialStub = jest.fn()
  const setFormFieldStub = jest.fn()
  const getPaymentMethodsStub = jest.fn()
  const validateFormField = jest.fn()

  const combinedPaymentMethods = [
    { value: 'CARD', label: 'Debit and Credit Card', type: 'CARD' },
    { value: 'ACCNT', label: 'Account Card', type: 'OTHER_CARD' },
    { value: 'PYPAL', label: 'Paypal', type: 'OTHER' },
    { value: 'MPASS', label: 'Masterpass', type: 'OTHER' },
    { value: 'KLRNA', label: 'Try before you buy', type: 'OTHER' },
    { value: 'APPLE', label: 'ApplePay', type: 'OTHER' },
  ]

  const paymentDetails = {
    type: 'CARD',
    cardNumberStar: '************1111',
    expiryMonth: '08',
    expiryYear: new Date().getFullYear() + 5,
  }

  const baseProps = {
    combinedPaymentMethods,
    resetFormPartial: resetFormPartialStub,
    setFormField: setFormFieldStub,
    getPaymentMethods: getPaymentMethodsStub,
    validateFormField,
    validationSchema: { cardNumber: '', cvv: '' },
    selectedPaymentMethod: 'CARD',
  }

  afterEach(() => {
    resetFormPartialStub.mockReset()
    setFormFieldStub.mockReset()
    getPaymentMethodsStub.mockReset()
  })

  describe('@renders', () => {
    it('should render default state correctly', () => {
      const component = renderComponent({
        ...requiredProps,
        resetFormPartial: resetFormPartialStub,
        setFormField: setFormFieldStub,
        getPaymentMethods: getPaymentMethodsStub,
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render payment method options', () => {
      const component = renderComponent({
        ...requiredProps,
        ...baseProps,
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    describe('when there are current payment details and method', () => {
      const component = renderComponent({
        ...requiredProps,
        ...baseProps,
        ...baseProps,
        storedPaymentDetails: paymentDetails,
        storedCombinedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'CARD')
        ),
      })

      it('should render preview', () => {
        const preview = component.wrapper.find('PaymentMethodPreview')
        expect(component.getTreeFor(preview)).toMatchSnapshot()
      })

      it('should only show 4 digits in card number in preview Ending in', () => {
        expect(
          component.wrapper
            .find('.PaymentDetails-preview')
            .first()
            .text()
        ).toEqual('Ending in: 1111')
      })
    })

    it('should not render preview if there are storedPaymentDetails but the payment form has been modified withing the session', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        ...baseProps,
        ...baseProps,
        storedPaymentDetails: { type: '' },
        storedCombinedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'CARD')
        ),
        showPaymentForm: true,
      })

      expect(wrapper.find('PaymentMethodPreview').exists()).toBe(false)
    })

    it('should not render preview if country is not supported by Klarna', () => {
      const component = renderComponent({
        ...requiredProps,
        ...baseProps,
        ...baseProps,
        storedPaymentDetails: { type: 'KLRNA' },
        storedCombinedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'KLRNA')
        ),
        isCountrySupportedByKlarna: false,
        userAccountSelectedPaymentMethod: 'KLRNA',
      })
      expect(component.wrapper.find('PaymentMethodPreview').exists()).toBe(
        false
      )
    })

    it('should render ‘card’ payment preview, is current payment method is `CARD`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        ...baseProps,
        storedPaymentDetails: paymentDetails,
        storedCombinedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'CARD')
        ),
      })
      expect(
        toJson(wrapper.find('PaymentMethodPreview').children())
      ).toMatchSnapshot()
    })

    it('should render ‘card’ payment preview, is current payment method is `ACCNT`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        ...baseProps,
        storedPaymentDetails: paymentDetails,
        storedCombinedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'ACCNT')
        ),
      })
      expect(
        toJson(wrapper.find('PaymentMethodPreview').children())
      ).toMatchSnapshot()
    })

    it('should render ‘non-card’ payment preview, is current payment method is `PYPAL`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        ...baseProps,
        storedPaymentDetails: paymentDetails,
        storedCombinedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'PYPAL')
        ),
      })
      expect(
        toJson(wrapper.find('PaymentMethodPreview').children())
      ).toMatchSnapshot()
    })

    it('should render billing AddressPreview if on delivery payment page and state is default', () => {
      expect(
        renderComponent({
          ...requiredProps,
          ...baseProps,
          showPaymentForm: true,
          billingAddressForm: {
            fields: {
              country: {
                value: 'United Kingdom',
              },
              address1: {
                value: '123 Fake St',
              },
            },
          },
          billingDetailsForm: {
            fields: {},
          },
          findAddressState: {
            isManual: true,
            monikers: [],
          },
          inDeliveryAndPayment: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render billing address forms if on delivery payment page and showAddressPreview state is false', () => {
      const { wrapper, getTree } = renderComponent({
        ...requiredProps,
        ...baseProps,
        storedPaymentDetails: {
          type: '',
        },
        billingAddressForm: {
          fields: {
            country: {
              value: 'United Kingdom',
            },
            address1: {
              value: '123 Fake St',
            },
          },
        },
        billingDetailsForm: {
          fields: {},
        },
        findAddressState: {
          isManual: true,
          monikers: [],
        },
        inDeliveryAndPayment: true,
      })
      wrapper.setState({ showAddressPreview: false })
      expect(getTree()).toMatchSnapshot()
    })

    describe('ApplePay', () => {
      it('should render preview if device is supported by ApplePay', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          ...baseProps,
          ...baseProps,
          storedPaymentDetails: { type: 'APPLE' },
          storedCombinedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'APPLE')
          ),
          isApplePayAvailableWithActiveCard: true,
          userAccountSelectedPaymentMethod: 'APPLE',
        })

        const PaymentMethodPreview = wrapper.find('PaymentMethodPreview')

        expect(PaymentMethodPreview.exists()).toBe(true)
        expect(PaymentMethodPreview.prop('type')).toBe('OTHER')
        expect(PaymentMethodPreview.prop('value')).toBe('APPLE')
      })

      it('should not render preview if device is not supported by ApplePay', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          ...baseProps,
          ...baseProps,
          storedPaymentDetails: { type: 'APPLE' },
          storedCombinedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'APPLE')
          ),
          isApplePayAvailableWithActiveCard: false,
          userAccountSelectedPaymentMethod: 'APPLE',
        })
        expect(wrapper.find('PaymentMethodPreview').exists()).toBe(false)
      })
    })
  })

  describe('@lifeCycle', () => {
    beforeEach(() => {
      saveSelectedPaymentMethodMock.mockReset()
    })

    describe('componentDidMount', () => {
      it('should not save payment method if "selectedPaymentMethod" and "storedCombinedPaymentMethod" props are the same', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          selectedPaymentMethod: 'CARD',
          storedCombinedPaymentMethod: {
            value: 'CARD',
          },
        })
        instance.componentDidMount()
        expect(saveSelectedPaymentMethodMock).toHaveBeenCalledTimes(0)
      })

      it('should save payment method if "selectedPaymentMethod" and "storedCombinedPaymentMethod" props are not the same', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          selectedPaymentMethod: 'CARD',
          storedCombinedPaymentMethod: {
            value: 'KLRNA',
          },
        })
        instance.componentDidMount()
        expect(saveSelectedPaymentMethodMock).toHaveBeenCalledTimes(1)
      })

      it('should save payment method if "storedCombinedPaymentMethod" is undefined', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          selectedPaymentMethod: 'CARD',
          storedCombinedPaymentMethod: undefined,
        })
        instance.componentDidMount()
        expect(saveSelectedPaymentMethodMock).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('@methods', () => {
    beforeEach(() => jest.clearAllMocks())

    describe('loginNotice', () => {
      it('should return a text string with payment type specified', () => {
        const { instance } = renderComponent(requiredProps)
        const paymentType = 'Paypal'
        const expected = `You will be asked to log onto ${paymentType} to confirm your order`
        expect(instance.loginNotice(paymentType)).toEqual(expected)
      })
    })

    describe('handlePaymentMethodPreviewChange', () => {
      const setFormField = jest.fn()
      const { instance } = renderComponent({
        ...requiredProps,
        setFormField,
      })

      it('should update "showPaymentPreview" to false', () => {
        expect(instance.state.showPaymentPreview).toBeTruthy()
        instance.handlePaymentMethodPreviewChange()
        expect(instance.state.showPaymentPreview).toBeFalsy()
        expect(setFormField).toHaveBeenCalledTimes(1)
      })

      it('should call openPaymentMethods', () => {
        instance.handlePaymentMethodPreviewChange()
        expect(instance.props.openPaymentMethods).toBeCalled()
      })
    })

    describe('handleAddressPreviewChange', () => {
      const setManualAddressMode = jest.fn()
      const { instance } = renderComponent({
        ...requiredProps,
        setManualAddressMode,
      })

      it('should update "showAddressPreview" to false', () => {
        expect(instance.state.showAddressPreview).toBeTruthy()
        instance.handleAddressPreviewChange()
        expect(instance.state.showAddressPreview).toBeFalsy()
        expect(setManualAddressMode).toHaveBeenCalledTimes(1)
      })
    })

    describe('savePaymentMethod', () => {
      it('should save the payment method', () => {
        const { instance } = renderComponent(requiredProps)
        instance.savePaymentMethod('KLRNA')
        expect(saveSelectedPaymentMethodMock).toHaveBeenCalledTimes(1)
      })

      it('should not save the payment method', () => {
        const { instance } = renderComponent(requiredProps)
        instance.savePaymentMethod('CARD')
        expect(saveSelectedPaymentMethodMock).toHaveBeenCalledTimes(0)
      })
    })
  })
})
