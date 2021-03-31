import testComponentHelper from 'test/unit/helpers/test-component'
import ShippingDestinationFlag from '../../ShippingDestinationFlag/ShippingDestinationFlag'

describe('<ShippingDestinationFlag />', () => {
  const defaultProps = {
    shippingDestination: 'United Kingdom',
  }
  const renderComponent = testComponentHelper(ShippingDestinationFlag)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render a <span/> tag', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      expect(wrapper.find('span')).toHaveLength(1)
    })

    it('should render the correct class name', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        shippingDestination: 'United States',
      })
      expect(wrapper.find('.FlagIcons--unitedStates')).toHaveLength(1)
    })
  })
})
