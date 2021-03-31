import testComponentHelper from '../../../../../../../test/unit/helpers/test-component'
import GuestCheckoutButton from '../GuestCheckoutButton'

const initialProps = {
  clickGuestCheckout: jest.fn(),
}

describe('@GuestCheckoutButton', () => {
  const renderComponent = testComponentHelper(GuestCheckoutButton)

  describe('@renders', () => {
    const component = renderComponent(initialProps)
    const { getTree } = component

    it('in default state', () => {
      expect(getTree()).toMatchSnapshot()
    })
  })
})
