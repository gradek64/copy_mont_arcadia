import testComponentHelper from 'test/unit/helpers/test-component'
import TopSection from '../TopSection'
import StoreFinder from '../StoreFinder'
import ShippingDestinationMobile from '../../../common/ShippingDestination/ShippingDestinationMobile'

describe('<TopSection />', () => {
  const defaultProps = {}
  const renderComponent = testComponentHelper(TopSection)

  describe('@renders', () => {
    it('should render the <TopSection /> component', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render the <StoreFinder /> component', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      const storeFinder = wrapper.find(StoreFinder)
      expect(storeFinder).toHaveLength(1)
      expect(storeFinder.prop('locator')).toBe('TopNavMenu')
    })
    it('should render the <ShippingDestinationMobile /> component', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      expect(wrapper.find(ShippingDestinationMobile)).toHaveLength(1)
    })
  })
})
