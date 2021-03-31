import testComponentHelper, {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'

import PaymentMethodOption from '../PaymentMethodOption'
import { CLEARPAY } from '../../../../../../constants/paymentTypes'

describe('<PaymentMethodOption/>', () => {
  const renderComponent = testComponentHelper(
    PaymentMethodOption.WrappedComponent
  )

  const mountAndRenderComponent = buildComponentRender(
    mountRender,
    PaymentMethodOption.WrappedComponent
  )

  const baseProps = {
    label: 'Debit and Credit Card',
    value: 'CARD',
    isMobile: false,
    billingCardFieldsToValidate: {
      cardNumber: '',
      cvv: '',
    },
    validationSchema: {
      cardNumber: [],
      cvv: [],
      expiryMonth: jest.fn(),
    },
    paymentType: '',
  }

  describe('@renders', () => {
    it('should render default state correctly', () => {
      const component = renderComponent(baseProps)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render a description if data is available and payment type Klarna', () => {
      const component = renderComponent({
        ...baseProps,
        description: 'klarna description',
        value: 'KLRNA',
      })
      expect(
        component.wrapper.find('.PaymentMethodOption-description').text()
      ).toEqual('klarna description')
    })

    it('should render a description if data is available and payment type Clearpay', () => {
      const component = renderComponent({
        ...baseProps,
        description: 'Clearpay description',
        value: 'CLRPY',
      })
      expect(
        component.wrapper.find('.PaymentMethodOption-description').text()
      ).toEqual('Clearpay description')
    })

    it('should not render element if description is not available', () => {
      const component = renderComponent({
        ...baseProps,
        description: '',
      })
      expect(
        component.wrapper.find('.PaymentMethodOption-description')
      ).toHaveLength(0)
    })

    it('should render card icons for desktop view', () => {
      const icons = ['icon-one.svg', 'icon-two.svg']
      const component = mountAndRenderComponent({
        ...baseProps,
        icons,
      })
      const iconWrappers = component.wrapper.find('.PaymentMethodOption-icon')
      expect(iconWrappers).toHaveLength(2)

      icons.forEach((icon, index) => {
        const iconWrapper = iconWrappers.at(index)
        expect(iconWrapper.props().src).toEqual(`/assets/common/images/${icon}`)
        expect(iconWrapper.key()).toEqual(icon)
      })
    })

    it('should be able to set `checked`', () => {
      const component = renderComponent({
        ...baseProps,
        isChecked: true,
      })
      expect(component.wrapper.find('button').prop('checked')).toBe(true)
    })
  })

  describe('@method', () => {
    describe('handlePaymentMethodChange', () => {
      it('should update form fields if checked', () => {
        const resetFormPartial = jest.fn()
        const setFormField = jest.fn()
        const validateFormField = jest.fn()
        const sendAnalyticsPaymentMethodSelectionEvent = jest.fn()
        const savePaymentMethod = jest.fn()

        const component = renderComponent({
          ...baseProps,
          resetFormPartial,
          setFormField,
          validateFormField,
          sendAnalyticsPaymentMethodSelectionEvent,
          savePaymentMethod,
        })

        component.instance.handlePaymentMethodChange({
          currentTarget: { checked: true, value: 'CARD' },
        })
        expect(resetFormPartial).toHaveBeenCalledTimes(1)
        expect(setFormField).toHaveBeenCalledTimes(1)
        expect(savePaymentMethod).toHaveBeenCalledTimes(1)
        expect(validateFormField).toHaveBeenCalledTimes(2)
        expect(sendAnalyticsPaymentMethodSelectionEvent).toHaveBeenCalledTimes(
          1
        )
      })

      it('should reset the form partially if target passes value', () => {
        const resetFormPartial = jest.fn()
        const setFormField = jest.fn()
        const validateFormField = jest.fn()
        const sendAnalyticsPaymentMethodSelectionEvent = jest.fn()
        const savePaymentMethod = jest.fn()

        const component = renderComponent({
          ...baseProps,
          resetFormPartial,
          setFormField,
          validateFormField,
          sendAnalyticsPaymentMethodSelectionEvent,
          savePaymentMethod,
        })

        component.instance.handlePaymentMethodChange({
          currentTarget: { checked: false, value: 'VISA' },
        })
        expect(resetFormPartial).toHaveBeenCalledTimes(1)
        expect(setFormField).toHaveBeenCalledTimes(1)
        expect(savePaymentMethod).toHaveBeenCalledTimes(1)
        expect(validateFormField).toHaveBeenCalledTimes(2)
        expect(sendAnalyticsPaymentMethodSelectionEvent).toHaveBeenCalledTimes(
          1
        )
      })

      it('should not load afterPay script when Payment Method is not change to clearpay', () => {
        const resetFormPartial = jest.fn()
        const setFormField = jest.fn()
        const validateFormField = jest.fn()
        const sendAnalyticsPaymentMethodSelectionEvent = jest.fn()
        const savePaymentMethod = jest.fn()
        const afterPayScriptUrl = 'https://portal.clearpay.co.uk/afterpay.js'
        window.loadScript = jest.fn()

        const component = renderComponent({
          ...baseProps,
          resetFormPartial,
          setFormField,
          validateFormField,
          sendAnalyticsPaymentMethodSelectionEvent,
          savePaymentMethod,
          afterPayScriptUrl,
        })

        component.instance.handlePaymentMethodChange({
          currentTarget: { checked: false, value: 'VISA' },
        })

        expect(window.loadScript).toHaveBeenCalledTimes(0)
      })

      it('should load afterPay script when Payment Method change to clearpay the first time', () => {
        const resetFormPartial = jest.fn()
        const setFormField = jest.fn()
        const validateFormField = jest.fn()
        const sendAnalyticsPaymentMethodSelectionEvent = jest.fn()
        const savePaymentMethod = jest.fn()
        const afterPayScriptUrl = 'https://portal.clearpay.co.uk/afterpay.js'
        window.loadScript = jest.fn()

        const component = renderComponent({
          ...baseProps,
          resetFormPartial,
          setFormField,
          validateFormField,
          sendAnalyticsPaymentMethodSelectionEvent,
          savePaymentMethod,
          afterPayScriptUrl,
        })

        component.instance.handlePaymentMethodChange({
          currentTarget: { checked: false, value: CLEARPAY },
        })

        expect(window.loadScript).toHaveBeenCalledTimes(1)
        expect(window.loadScript).toBeCalledWith(
          expect.objectContaining({
            src: afterPayScriptUrl,
            isAsync: false,
          })
        )
      })

      it('should not load afterPay script if it is already loaded', () => {
        const resetFormPartial = jest.fn()
        const setFormField = jest.fn()
        const validateFormField = jest.fn()
        const sendAnalyticsPaymentMethodSelectionEvent = jest.fn()
        const savePaymentMethod = jest.fn()
        const afterPayScriptUrl = 'https://portal.clearpay.co.uk/afterpay.js'
        window.loadScript = jest.fn()

        const mockAfterPayLib = () => {
          window.AfterPay = {
            initialize: jest.fn(),
            open: jest.fn(),
            transfer: jest.fn(),
          }
        }

        const component = renderComponent({
          ...baseProps,
          resetFormPartial,
          setFormField,
          validateFormField,
          sendAnalyticsPaymentMethodSelectionEvent,
          savePaymentMethod,
          afterPayScriptUrl,
        })

        component.instance.handlePaymentMethodChange({
          currentTarget: { checked: false, value: CLEARPAY },
        })

        expect(window.loadScript).toHaveBeenCalledTimes(1)

        window.loadScript.mockReset()

        mockAfterPayLib()

        component.instance.handlePaymentMethodChange({
          currentTarget: { checked: false, value: CLEARPAY },
        })

        expect(window.loadScript).toHaveBeenCalledTimes(0)
      })
    })
  })
})
