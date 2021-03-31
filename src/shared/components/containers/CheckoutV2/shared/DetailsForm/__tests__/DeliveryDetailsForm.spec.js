import testComponentHelper from 'test/unit/helpers/test-component'
import DeliveryDetailsForm from '../DeliveryDetailsForm'
import CheckoutPrimaryTitle from '../../CheckoutPrimaryTitle'

describe('<DeliveryDetailsForm />', () => {
  const renderComponent = testComponentHelper(DeliveryDetailsForm)

  const showDDPAddressModal = jest.fn()
  const props = {
    bagContainsOnlyDDPProduct: true,
    showDDPAddressModal,
    isCollection: false,
  }

  describe('@renders', () => {
    it('should render default state', () => {
      expect(
        renderComponent({ showDDPAddressModal }).getTree()
      ).toMatchSnapshot()
    })
    it('renders why we need this link if bagContainsOnlyDDPProduct', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('should render CheckoutPrimaryTitle with the correct texts if isCollection set to false', () => {
      const { wrapper } = renderComponent({
        ...props,
      })

      expect(wrapper.find(CheckoutPrimaryTitle).exists()).toBe(true)
      expect(wrapper.find(CheckoutPrimaryTitle).prop('title')).toBe(
        'Delivery Address'
      )
    })
    it('should render CheckoutPrimaryTitle with the correct texts if isCollection set to true', () => {
      const { wrapper } = renderComponent({
        ...props,
        isCollection: true,
      })

      expect(wrapper.find(CheckoutPrimaryTitle).exists()).toBe(true)
      expect(wrapper.find(CheckoutPrimaryTitle).prop('title')).toBe(
        'Collection Details'
      )
    })
  })

  describe('events', () => {
    const { wrapper } = renderComponent(props)
    it('calls showDDPAddressModal when DeliveryDetailsForm-link is clicked', () => {
      expect(props.showDDPAddressModal).not.toHaveBeenCalled()
      wrapper.find('.DeliveryDetailsForm-link').simulate('click')
      expect(props.showDDPAddressModal).toHaveBeenCalledTimes(1)
    })
  })
})
