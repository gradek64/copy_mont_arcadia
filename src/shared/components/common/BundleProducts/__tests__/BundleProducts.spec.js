import testComponentHelper from 'test/unit/helpers/test-component'
import BundleProducts from '../BundleProducts'
import Carousel from '../../Carousel/Carousel'
import MiniProduct from '../../MiniProduct/MiniProduct'
import bundleMocksMultiple from '../../../../../../test/mocks/bundleMocksMultiple'
import BundlesMock from '../../../../../../test/mocks/bundleMocks'
import QubitReact from 'qubit-react/wrapper'

describe('<BundleProducts/>', () => {
  const props = {
    items: bundleMocksMultiple.bundleSlots,
  }

  const renderComponent = testComponentHelper(BundleProducts.WrappedComponent)

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
    it('should render empty when items is an empty array', () => {
      const { wrapper } = renderComponent({ ...props, items: [] })
      expect(wrapper.find(MiniProduct).length).toBe(0)
    })
    it('should show single items', () => {
      const { wrapper } = renderComponent({
        ...props,
        items: BundlesMock.bundleSlots,
      })
      expect(wrapper.find('.BundleProducts-item').length).toBe(3)
      expect(wrapper.find('.Carousel').length).toBe(0)
    })
    it('should show carousel items', () => {
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('.BundleProducts-item').length).toBe(3)
      expect(wrapper.find(Carousel).prop('assets').length).toBe(5)
    })
    it('should show a list of mini products', () => {
      const { wrapper } = renderComponent({
        ...props,
        items: BundlesMock.bundleSlots,
      })
      expect(wrapper.find(MiniProduct).length).toBe(3)
    })
    describe('@qubit', () => {
      const { wrapper } = renderComponent(props)
      const qubitWrapper = wrapper.find(QubitReact)
      it('should render a qubit react wrapper with correct id', () => {
        expect(qubitWrapper.props().id).toBe('qubit-pdp-BundleProducts')
      })
    })
  })
})
