import testComponentHelper from 'test/unit/helpers/test-component'
import BillingDetailsForm from '../BillingDetailsForm'

describe('<BillingDetailsForm />', () => {
  const renderComponent = testComponentHelper(BillingDetailsForm)

  describe('@renders', () => {
    const renderedComponent = renderComponent()

    it('in default state', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })
  })
})
