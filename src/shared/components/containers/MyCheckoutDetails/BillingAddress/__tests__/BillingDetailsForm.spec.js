import testComponentHelper from 'test/unit/helpers/test-component'
import BillingDetailsForm from '../BillingDetailsForm'
import AddressFormDetailsContainer from '../../AddressFormDetailsContainer/AddressFormDetailsContainer'

describe('<BillingDetailsForm />', () => {
  const renderComponent = testComponentHelper(BillingDetailsForm)

  describe('@renders', () => {
    const renderedComponent = renderComponent()
    const { wrapper } = renderedComponent

    it('in default state', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })

    it('should set `addressType` prop to `billingMCD` in the `DetailsForm` component', () => {
      expect(
        wrapper.find(AddressFormDetailsContainer).prop('addressType')
      ).toBe('billingMCD')
    })

    it('should set `label` prop to `Billing Details` in the `DetailsForm` component', () => {
      expect(wrapper.find(AddressFormDetailsContainer).prop('label')).toBe(
        'Billing Details'
      )
    })
  })
})
