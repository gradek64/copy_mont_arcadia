import testComponentHelper from 'test/unit/helpers/test-component'
import BillingAddressForm from '../BillingAddressForm'
import AddressForm from '../../../../common/AddressForm/AddressForm'

describe('<BillingAddressForm />', () => {
  const renderComponent = testComponentHelper(BillingAddressForm)

  describe('@renders', () => {
    const renderedComponent = renderComponent()
    const { wrapper } = renderedComponent

    it('in default state', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })

    it('should set `addressType` prop to `billingMCD` in the `AddressForm` component', () => {
      expect(wrapper.find(AddressForm).prop('addressType')).toBe('billingMCD')
    })
  })
})
