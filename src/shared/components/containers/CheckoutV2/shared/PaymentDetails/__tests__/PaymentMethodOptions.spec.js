import { propEq } from 'ramda'
import PaymentMethodOptions from '../PaymentMethodOptions'
import testComponentHelper from '../../../../../../../../test/unit/helpers/test-component'

const combinedPaymentMethods = [
  {
    value: 'CARD',
    label: 'Debit and Credit Card',
    description: 'Enter card details',
    type: 'CARD',
  },
  {
    value: 'ACCNT',
    label: 'Account Card',
    description: 'Use your account card',
    type: 'OTHER_CARD',
  },
  { value: 'PYPAL', label: 'Paypal', description: 'Use paypal', type: 'OTHER' },
  {
    value: 'MPASS',
    label: 'Masterpass',
    description: 'Masterpass accepted',
    type: 'OTHER',
  },
  {
    value: 'KLRNA',
    label: 'Pay in 30 days or 3 monthly instalments, interest free',
    description: 'Pay in 30 days or 3 monthly instalments, interest free',
    type: 'OTHER',
  },
  {
    value: 'CLRPY',
    label: 'Pay in 4 fortnightly instalments, interest free',
    description: 'Pay in 4 fortnightly instalments, interest free',
    type: 'OTHER',
  },
  {
    value: 'APPLE',
    type: 'OTHER',
    label: 'Apple Pay',
    description: 'Use apple pay from your device',
  },
]

const baseProps = {
  combinedPaymentMethods,
  isMobile: false,
  savePaymentMethod: jest.fn(),
  loginNotice: () =>
    'You will be asked to log onto Paypal to confirm your order',
}

describe('<PaymentMethodsOptions/>', () => {
  const renderComponent = testComponentHelper(
    PaymentMethodOptions.WrappedComponent
  )

  describe('@render', () => {
    it('should render payment method options with CARD option selected', () => {
      const component = renderComponent({
        ...baseProps,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'CARD')
        ),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render payment method options with ACCOUNT CARD option selected', () => {
      const component = renderComponent({
        ...baseProps,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'ACCNT')
        ),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render payment method options with KLARNA option selected', () => {
      const component = renderComponent({
        ...baseProps,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'KLRNA')
        ),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render payment method options with PAYPAL option selected', () => {
      const component = renderComponent({
        ...baseProps,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'PYPAL')
        ),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should not render payment method options with APPLEPAY option selected if isApplePayAvailable is false', () => {
      const component = renderComponent({
        ...baseProps,
        isApplePayAvailable: false,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'APPLE')
        ),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render payment method options with APPLEPAY option selected if isApplePayAvailable is true', () => {
      const component = renderComponent({
        ...baseProps,
        isApplePayAvailable: true,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'APPLE')
        ),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render all of the descriptions for desktop', () => {
      const { wrapper } = renderComponent({
        ...baseProps,
        isMobile: false,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'ACCNT')
        ),
      })

      combinedPaymentMethods.forEach((item) => {
        expect(
          wrapper.find(`[value='${item.value}']`).prop('description')
        ).toBe(item.description)
      })
    })

    it('should render the correct descriptions for mobile', () => {
      const { wrapper } = renderComponent({
        ...baseProps,
        isMobile: true,
        selectedPaymentMethod: combinedPaymentMethods.find(
          propEq('value', 'ACCNT')
        ),
      })
      expect(wrapper.find('[value="CARD"]').prop('description')).toBe('')
      expect(wrapper.find('[value="ACCNT"]').prop('description')).toBe('')
      expect(wrapper.find('[value="KLRNA"]').prop('description')).toBe(
        'Pay in 30 days or 3 monthly instalments, interest free'
      )
      expect(wrapper.find('[value="CLRPY"]').prop('description')).toBe(
        'Pay in 4 fortnightly instalments, interest free'
      )
    })
  })

  describe('should render Qubit React Components with expected props', () => {
    describe('#qubit-allow-payment-method-selection', () => {
      const selectedIndex = 1
      const defaultIndex = 0
      const props = {
        ...baseProps,
        selectedPaymentTypeWithoutDefault: combinedPaymentMethods[defaultIndex],
        selectedPaymentMethod: combinedPaymentMethods[selectedIndex],
      }
      let qubitWrappers

      beforeEach(() => {
        const { wrapper } = renderComponent(props)
        qubitWrappers = wrapper.find('#qubit-allow-payment-method-selection')
      })

      it('should render a wrapper for each combined payment method', () => {
        expect(qubitWrappers.length).toBe(7)
      })

      it('should pass each wrapper expected selectedPaymentMethod prop', () => {
        qubitWrappers.forEach((node) => {
          const nodeProps = node.props()
          expect(nodeProps.selectedPaymentMethod).toEqual(
            props.selectedPaymentTypeWithoutDefault
          )
        })
      })
      it('should pass each wrapper expected paymentMethod prop', () => {
        qubitWrappers.forEach((node, i) => {
          const nodeProps = node.props()
          const expectedPaymentMethod = combinedPaymentMethods[i]
          expect(nodeProps.paymentMethod).toEqual(expectedPaymentMethod)
          if (i === defaultIndex) {
            expect(nodeProps.paymentMethod).toEqual(
              nodeProps.selectedPaymentMethod
            )
          }
        })
      })
      it("has Payment method option as it's child", () => {
        qubitWrappers.forEach((node) => {
          const paymentMethodOption = node.children()
          expect(paymentMethodOption.length).toBe(1)
          expect(paymentMethodOption.name()).toEqual(
            'Connect(PaymentMethodOption)'
          )
        })
      })
    })

    describe('#qubit-card-payment-method', () => {
      it('should render when payment type is CARD', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          selectedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'CARD')
          ),
        })
        const qubitCardPaymentMethod = wrapper
          .find('Connect(PaymentMethodOption)')
          .at(0)
          .prop('renderPaymentMethod')
        expect(qubitCardPaymentMethod).not.toBeNull()
        expect(qubitCardPaymentMethod.props).not.toBeNull()
      })

      it('should render when payment type is ACCNT', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          selectedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'ACCNT')
          ),
        })
        const qubitCardPaymentMethod = wrapper
          .find('Connect(PaymentMethodOption)')
          .at(1)
          .prop('renderPaymentMethod')
        expect(qubitCardPaymentMethod).not.toBeNull()
        expect(qubitCardPaymentMethod.props).not.toBeNull()
      })

      it('should not render when selected payment type is Klarna', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          selectedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'KLRNA')
          ),
        })
        const qubitCardPaymentMethod = wrapper
          .find('Connect(PaymentMethodOption)')
          .at(3)
          .find('#qubit-card-payment-method')
        expect(qubitCardPaymentMethod).not.toBeNull()
        expect(qubitCardPaymentMethod.length).toBe(0)
      })

      it('should render with showChild prop set to true when payment type has no default', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          selectedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'CARD')
          ),
        })
        const qubitCardPaymentMethod = wrapper
          .find('Connect(PaymentMethodOption)')
          .at(0)
          .prop('renderPaymentMethod')
        expect(qubitCardPaymentMethod.props.showChild).toBe(false)
      })

      it('should render with showChild prop set to false when payment type has a default', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          selectedPaymentMethod: combinedPaymentMethods.find(
            propEq('value', 'CARD')
          ),
          selectedPaymentTypeWithoutDefault: combinedPaymentMethods.find(
            propEq('value', 'ACCNT')
          ),
        })
        const qubitCardPaymentMethod = wrapper
          .find('Connect(PaymentMethodOption)')
          .at(0)
          .prop('renderPaymentMethod')
        expect(qubitCardPaymentMethod.props.showChild).toBe(true)
      })
    })
  })
})
