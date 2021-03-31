import testComponentHelper from 'test/unit/helpers/test-component'
import OrderCompleteSummary from '../OrderCompleteSummary'
import PaymentSummary from '../../../../common/PaymentSummary/PaymentSummary'
import SandBox from '../../../SandBox/SandBox'
import espotsMobile from '../../../../../constants/espotsMobile'

const initialProps = {
  buttonClickHandler: jest.fn(),
  isDiscoverMoreEnabled: true,
  orderCompleted: {
    deliveryCost: '4.00',
    deliveryPrice: '4.01',
    orderId: 3464614,
    subTotal: '33.00',
    paymentDetails: [
      {
        paymentMethod: 'Visa',
        cardNumberStar: '************1111',
        totalCost: '£30.00',
        totalCostAfterDiscount: '£10.00',
        selectedPaymentMethod: 'VISA',
      },
    ],
  },
  orderError: false,
  brandName: 'topshop',
  deliveryDate: 'Wednesday 10 June 2020',
  ddpDefaultName: 'Topshop Premier',
  isDDPStandaloneOrderCompleted: false,
  isMobile: false,
  logoVersion: '19102018',
  minLaptop: true,
  orderSubtotal: '33.00',
  paymentMethods: [],
}

const mappedPayments = [
  {
    cardNumber: '************1111',
    isCardType: true,
    method: 'Visa',
    price: '30.00',
    priceAfterDiscount: '10.00',
    type: 'VISA',
  },
]

describe('<OrderCompleteSummary />', () => {
  const renderComponent = testComponentHelper(
    OrderCompleteSummary.WrappedComponent
  )

  describe('@render', () => {
    describe('Order is complete with no errors', () => {
      const component = renderComponent(initialProps)
      const { wrapper } = renderComponent(initialProps)

      it('default', () => {
        expect(component.getTree()).toMatchSnapshot()
      })

      it('should pass down the correct `payments` prop', () => {
        expect(wrapper.find(PaymentSummary).props().payments).toEqual(
          mappedPayments
        )
      })

      it('should not show mobile espot', () => {
        expect(wrapper.find(SandBox).exists()).toBeFalsy()
      })

      describe('is mobile', () => {
        const component = renderComponent({
          ...initialProps,
          isMobile: true,
        })
        const { wrapper } = component
        it('should show the mobile espot', () => {
          expect(component.getTree()).toMatchSnapshot()
          expect(wrapper.find(SandBox).props().cmsPageName).toEqual(
            espotsMobile.orderConfirmation[0]
          )
        })
      })
    })
    describe('Order has error', () => {
      it('should render title only', () => {
        const component = renderComponent({
          ...initialProps,
          orderError: true,
        })
        expect(component.getTree()).toMatchSnapshot()
      })
    })
    describe('Order is not complete', () => {
      it('should render nothing', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          orderCompleted: {},
        })
        expect(wrapper.html()).toBeNull()
      })
    })
    describe('Guest Checkout', () => {
      it('should render the registration form if it is a guest order with a non-registered email', () => {
        const component = renderComponent({
          ...initialProps,
          orderCompleted: {
            ...initialProps.orderCompleted,
            isGuestOrder: true,
            isRegisteredEmail: false,
          },
        })
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should not render the registration form if it is a guest order with a registered email', () => {
        const component = renderComponent({
          ...initialProps,
          orderCompleted: {
            ...initialProps.orderCompleted,
            isGuestOrder: true,
            isRegisteredEmail: true,
          },
        })
        expect(component.getTree()).toMatchSnapshot()
      })
    })
  })
})
