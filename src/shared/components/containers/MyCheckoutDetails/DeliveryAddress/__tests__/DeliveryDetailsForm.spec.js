import testComponentHelper from 'test/unit/helpers/test-component'
import DeliveryDetailsForm from '../DeliveryDetailsForm'
import AddressFormDetailsContainer from '../../AddressFormDetailsContainer/AddressFormDetailsContainer'

describe('<DeliveryDetailsForm />', () => {
  const renderComponent = testComponentHelper(DeliveryDetailsForm)

  describe('@renders', () => {
    const renderedComponent = renderComponent()
    const { wrapper } = renderedComponent

    it('in default state', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })

    it('should set `detailsType` prop to `deliveryMCD` in the `DetailsForm` component', () => {
      expect(
        wrapper.find(AddressFormDetailsContainer).prop('addressType')
      ).toBe('deliveryMCD')
    })

    it('should set `label` prop to `Delivery Details` in the `DetailsForm` component', () => {
      expect(wrapper.find(AddressFormDetailsContainer).prop('label')).toBe(
        'Delivery Details'
      )
    })
  })
})
