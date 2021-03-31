import testComponentHelper from 'test/unit/helpers/test-component'
import PaymentBtnWithTC from '../PaymentBtnWithTC'
import RecaptchaTermsAndConditions from '../RecaptchaTermsAndConditions'
import SimpleTotals from '../../../../common/SimpleTotals/SimpleTotals'
import PayPalSmartButtons from '../../PayPal/PayPalSmartButtons'
import PaymentButtonContainer from '../../shared/PaymentButtonContainer'

describe('<PaymentBtnWithTC />', () => {
  const initialProps = {
    isDDPStandaloneOrder: false,
    isOutOfStock: false,
    shippingInfo: {
      cost: 0,
      deliveryMethod: 'HOME',
      deliveryType: 'HOME',
      estimatedDelivery: ['No later than Friday 22 July 2016'],
      label: '',
      shipModeId: 0,
    },
    priceInfo: {
      subTotal: '918.00',
    },
    discounts: [],
    formNames: ['address', 'details', 'findAddress'],
    formErrors: {},
    paymentType: 'VISA',
    brandName: 'topshop',
    paypalSmartButtons: false,
  }

  const renderComponent = testComponentHelper(PaymentBtnWithTC)

  describe('@render', () => {
    it('should render with the initial props', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('should render the SimpleTotals', () => {
      const { wrapper } = renderComponent(initialProps)
      const simpleTotal = wrapper.find(SimpleTotals)

      expect(simpleTotal.exists()).toBe(true)
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    describe('<RecaptchaTermsAndConditions />', () => {
      describe('when `isGuestRecaptchaEnabled` is equal to false', () => {
        it('should not render the `RecaptchaTermsAndConditions` component', () => {
          const { wrapper } = renderComponent(initialProps)
          expect(wrapper.find(RecaptchaTermsAndConditions)).toHaveLength(0)
        })
      })

      describe('when `isGuestRecaptchaEnabled` is equal to true', () => {
        it('should render the `RecaptchaTermsAndConditions` component', () => {
          const props = { ...initialProps, isGuestRecaptchaEnabled: true }
          const { wrapper } = renderComponent(props)
          expect(wrapper.find(RecaptchaTermsAndConditions)).toHaveLength(1)
        })
      })

      describe('when `paypalSmartButtons` is equal to true', () => {
        it('should render the `PayPalSmartButtons` component', () => {
          const props = { ...initialProps, paypalSmartButtons: true }
          const { wrapper } = renderComponent(props)
          expect(wrapper.find(PayPalSmartButtons)).toHaveLength(1)
          expect(wrapper.find(PaymentButtonContainer)).toHaveLength(0)
        })
      })

      describe('when `paypalSmartButtons` is equal to false', () => {
        it('should render the `PaymentButtonContainer` component', () => {
          const props = { ...initialProps, paypalSmartButtons: false }
          const { wrapper } = renderComponent(props)
          expect(wrapper.find(PayPalSmartButtons)).toHaveLength(0)
          expect(wrapper.find(PaymentButtonContainer)).toHaveLength(1)
        })
      })
    })
  })
})
