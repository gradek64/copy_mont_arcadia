import testComponentHelper from 'test/unit/helpers/test-component'
import ProductViews from '../ProductViews'

const PRODUCT = 0
const OUTFIT = 1

describe('<ProductViews/>', () => {
  const renderComponent = testComponentHelper(ProductViews.WrappedComponent)

  const initialProps = {
    selectView: jest.fn(),
    toggleFeature: jest.fn(),
    responsiveProductViewEnabled: true,
  }

  beforeEach(() => initialProps.selectView.mockClear())

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('product selected', () => {
      expect(
        renderComponent({
          ...initialProps,
          productViewSelected: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('outfit selected', () => {
      expect(
        renderComponent({
          ...initialProps,
          productViewSelected: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with className', () => {
      const mockedClassname = 'mock'
      expect(
        renderComponent({
          ...initialProps,
          className: mockedClassname,
        }).wrapper.find(`.ProductViews.${mockedClassname}`).length
      ).toBe(1)
    })
  })

  describe('@events', () => {
    describe('click on Product', () => {
      it('calls selectView("Product")', () => {
        const { wrapper, instance } = renderComponent(initialProps)

        expect(instance.props.selectView).not.toBeCalled()
        wrapper
          .find('.ProductViews-button')
          .get(PRODUCT)
          .props.onClick()
        expect(instance.props.selectView).toHaveBeenCalledTimes(1)
        expect(instance.props.selectView).toHaveBeenCalledWith('Product')
      })
    })
    describe('click on Outfit', () => {
      it('calls selectView("Outfit")', () => {
        const { wrapper, instance } = renderComponent(initialProps)

        expect(instance.props.selectView).not.toBeCalled()
        wrapper
          .find('.ProductViews-button')
          .get(OUTFIT)
          .props.onClick()
        expect(instance.props.selectView).toHaveBeenCalledTimes(1)
        expect(instance.props.selectView).toHaveBeenCalledWith('Outfit')
      })
    })
  })
})
