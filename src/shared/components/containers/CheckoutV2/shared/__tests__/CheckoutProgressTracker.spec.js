import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutProgressTracker from '../CheckoutProgressTracker'
import trackerSteps from '../../../../../../../test/mocks/progressTrackerMocks'

describe('<CheckoutProgressTracker />', () => {
  const renderComponent = testComponentHelper(
    CheckoutProgressTracker.WrappedComponent
  )

  describe('@renders', () => {
    it('should render the correct steps for a new user', () => {
      const props = {
        steps: trackerSteps.NEW_CUSTOMER_STEPS,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('should render the correct steps for a returning user', () => {
      const props = {
        steps: trackerSteps.RETURNING_CUSTOMER_STEPS,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('should render the correct steps for a guest checkout user', () => {
      const props = {
        steps: trackerSteps.GUEST_CUSTOMER_STEPS,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })
})
