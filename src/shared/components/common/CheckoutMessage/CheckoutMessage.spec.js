import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutMessage from './CheckoutMessage'
import Message from '../../common/FormComponents/Message/Message'
import OrderProducts from '../../common/OrderProducts/OrderProducts'

describe('<CheckoutMessage />', () => {
  const initialProps = {
    bagProducts: [{ sku: '00000001' }],
    orderSummaryError: {},
  }
  const renderComponent = testComponentHelper(CheckoutMessage.WrappedComponent)

  describe('@renders', () => {
    it('nothing if there is no error', () => {
      const { getTree } = renderComponent({
        ...initialProps,
        getBag: jest.fn(),
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('renders standard error message', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        orderSummaryError: {
          message: 'an error has occurred',
          isOutOfStock: false,
        },
      })
      expect(
        wrapper
          .find('.CheckoutMessage-message')
          .first()
          .text()
      ).toBe('an error has occurred')
      expect(wrapper.find('.CheckoutMessage-message')).toHaveLength(1)
    })
    it('renders Out of Stock message', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        orderSummaryError: {
          message: 'out of stock message',
          isOutOfStock: true,
        },
      })
      expect(wrapper.find(Message)).toHaveLength(1)
      expect(wrapper.find(OrderProducts)).toHaveLength(1)
    })
  })

  describe('@lifecycle', () => {
    it('getBag is called with `false` on mount if products are not present', () => {
      const { instance } = renderComponent({
        ...initialProps,
        orderSummaryError: {
          message: 'out of stock message',
          isOutOfStock: true,
        },
        getBag: jest.fn(),
      })
      instance.componentDidMount()
      expect(instance.props.getBag).toBeCalledWith()
    })
    it('getBag is NOT called on mount if products are present', () => {
      const { instance } = renderComponent({
        ...initialProps,
        orderSummaryError: {
          message: 'out of stock message',
          isOutOfStock: false,
        },
        getBag: jest.fn(),
      })
      instance.componentDidMount()
      expect(instance.props.getBag).not.toHaveBeenCalled()
    })
  })
})
