import testComponentHelper from 'test/unit/helpers/test-component'
import DeliveryAddressForm from '../DeliveryAddressForm'
import AddressForm from '../../../../common/AddressForm/AddressForm'

describe('<DeliveryAddressForm />', () => {
  const renderComponent = testComponentHelper(DeliveryAddressForm)

  describe('@renders', () => {
    const renderedComponent = renderComponent()
    const { wrapper } = renderedComponent

    it('in default state', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })

    it('should set `addressType` prop to `deliveryMCD` in the `AddressForm` component', () => {
      expect(wrapper.find(AddressForm).prop('addressType')).toBe('deliveryMCD')
    })
  })
})
