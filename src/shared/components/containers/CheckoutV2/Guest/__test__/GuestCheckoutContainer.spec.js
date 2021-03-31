import deepFreeze from 'deep-freeze'
import testComponentHelper from 'test/unit/helpers/test-component'
import GuestCheckoutContainer from '../GuestCheckoutContainer'

describe('<GuestCheckoutContainer />', () => {
  beforeEach(() => jest.resetAllMocks())
  const renderComponent = testComponentHelper(
    GuestCheckoutContainer.WrappedComponent,
    { disableLifecycleMethods: false }
  )

  const initialProps = deepFreeze({
    location: {
      pathname: '/guest/checkout/delivery',
    },
    orderError: '',
    orderSummary: {},
    clearCheckoutForms: jest.fn(),
    clearOrderError: jest.fn(),
    getOrderSummary: jest.fn(),
    getAllPaymentMethods: jest.fn(),
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('should call getOrderSummary() and getAllPaymentMethods()', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(1)
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(1)
      })
    })

    describe('componentDidUpdate', () => {
      describe('after a guest user failed payment attempt', () => {
        it('should call getOrderSummary to reset persisted address and not update the checkout forms', () => {
          const { wrapper, instance } = renderComponent(initialProps)

          wrapper.setProps({
            orderError: 'An error has occurred.',
            orderSummary: {
              // ... other orderSummary properties
              email: 'guest@user.com',
            },
          })

          expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(2)
          expect(instance.props.getOrderSummary).toHaveBeenCalledWith({
            clearGuestDetails: true,
            shouldUpdateForms: false,
          })
        })
      })
    })

    describe('componentWillUnmount', () => {
      it('should clear checkout forms and order errors if any', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        expect(instance.props.clearCheckoutForms).toHaveBeenCalledTimes(0)
        expect(instance.props.clearOrderError).toHaveBeenCalledTimes(0)
        wrapper.unmount()
        expect(instance.props.clearCheckoutForms).toHaveBeenCalledTimes(1)
        expect(instance.props.clearOrderError).toHaveBeenCalledTimes(1)
      })
    })
  })
})
