import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutPrimaryTitle from '../CheckoutPrimaryTitle'

describe('<CheckoutPrimaryTitle />', () => {
  const renderComponent = testComponentHelper(CheckoutPrimaryTitle)
  const defaultProps = {
    title: 'Delivery Method',
  }
  const baseClasseName = '.CheckoutPrimaryTitle'
  const augmentedClassName =
    '.CheckoutPrimaryTitle.CheckoutPrimaryTitle-augmented'

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it(`should render a div with className equal to '${baseClasseName}' and the passed title prop`, () => {
      const { wrapper } = renderComponent(defaultProps)

      expect(wrapper.find(baseClasseName)).toHaveLength(1)
      expect(wrapper.find(baseClasseName).text()).toBe('Delivery Method')
      expect(wrapper.find(augmentedClassName)).toHaveLength(0)
    })

    describe('when `isAugmented` is equal to true', () => {
      it(`should render a div with className equal to '${augmentedClassName}' and the passed title prop`, () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          isAugmented: true,
        })
        expect(wrapper.find(augmentedClassName)).toHaveLength(1)
        expect(wrapper.find(augmentedClassName).text()).toBe('Delivery Method')
      })
    })
  })
})
