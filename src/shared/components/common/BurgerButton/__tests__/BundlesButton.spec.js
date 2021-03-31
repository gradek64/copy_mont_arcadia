import testComponentHelper from 'test/unit/helpers/test-component'
import BurgerButton from '../BurgerButton'

describe('<BurgerButton />', () => {
  const renderComponent = testComponentHelper(BurgerButton.WrappedComponent)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent({
        isFeatureBurgerMenuIconWithTextEnabled: false,
      })
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('when isFeatureBurgerIconWithMenuTextEnabled is set to true', () => {
    const { wrapper } = renderComponent({
      isFeatureBurgerMenuIconWithTextEnabled: true,
    })

    it('should have the class BurgerButton-hasMenuTextIcon on the button', () => {
      expect(
        wrapper.find('.BurgerButton').hasClass('BurgerButton-hasMenuTextIcon')
      ).toBe(true)
    })

    it('should not have any span elements within the button markup', () => {
      expect(wrapper.contains('BurgerButton-bar')).toBe(false)
    })
  })

  describe('when isFeatureBurgerIconWithMenuTextEnabled is set to false', () => {
    const { wrapper } = renderComponent({
      isFeatureBurgerMenuIconWithTextEnabled: false,
    })

    it('should not have the class BurgerButton-hasMenuTextIcon on the button', () => {
      expect(
        wrapper.find('.BurgerButton').hasClass('BurgerButton-hasMenuTextIcon')
      ).toBe(false)
    })

    it('should have span elements within the button markup', () => {
      expect(wrapper.find('.BurgerButton-bar').length).toBe(3)
    })
  })
})
