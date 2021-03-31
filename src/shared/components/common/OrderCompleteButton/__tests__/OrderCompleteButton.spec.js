import testComponentHelper from 'test/unit/helpers/test-component'
import OrderCompleteButton from '../OrderCompleteButton'

const initialProps = {
  buttonClickHandler: jest.fn(),
  isDiscoverMoreEnabled: false,
  orderError: false,
  orderCompleted: {
    isGuestOrder: false,
    isRegisteredEmail: false,
  },
}

describe('<OrderCompleteButton />', () => {
  const renderComponent = testComponentHelper(OrderCompleteButton)

  describe('@render', () => {
    describe('There are no errors', () => {
      const component = renderComponent(initialProps)
      const { wrapper } = component

      it('should display `Continue Shopping` wording', () => {
        expect(component.getTree()).toMatchSnapshot()
        expect(
          wrapper
            .find('.OrderCompleteButton-button')
            .childAt(0)
            .text()
        ).toBe('Continue Shopping')
      })
    })
    describe('There are errors', () => {
      const component = renderComponent({
        ...initialProps,
        orderError: true,
      })
      const { wrapper } = component

      it('should display `Go to Checkout` wording', () => {
        expect(component.getTree()).toMatchSnapshot()
        expect(
          wrapper
            .find('.OrderCompleteButton-button')
            .childAt(0)
            .text()
        ).toBe('Go to Checkout')
      })
    })
    describe('isDiscoverMoreEnabled is enabled', () => {
      const component = renderComponent({
        ...initialProps,
        isDiscoverMoreEnabled: true,
      })
      const { wrapper } = component

      it('should display the espot', () => {
        expect(component.getTree()).toMatchSnapshot()
        expect(
          wrapper.find('.OrderCompleteButton-discoverMore').exists()
        ).toBeTruthy()
      })
    })
  })
})
