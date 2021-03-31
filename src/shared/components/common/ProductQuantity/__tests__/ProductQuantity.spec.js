import testComponentHelper from 'test/unit/helpers/test-component'
import ProductQuantity from '../ProductQuantity'
import Select from '../../../common/FormComponents/Select/Select'

describe('<ProductQuantity/>', () => {
  const renderComponent = testComponentHelper(ProductQuantity)
  const initialProps = {
    activeItem: { quantity: 7 },
    onSelectQuantity: jest.fn(),
  }

  describe('@renders', () => {
    describe('in default state', () => {
      const { wrapper } = renderComponent(initialProps)
      it('should be wrapped with FeatureCheck component', () => {
        expect(
          wrapper
            .find('.ProductQuantity')
            .parent()
            .is('Connect(FeatureCheck)')
        ).toBe(true)
        expect(
          wrapper
            .find('.ProductQuantity')
            .parent()
            .getElement().props.flag
        ).toBe('FEATURE_PDP_QUANTITY')
      })
      it('should have Select component with prop options as Array of length initialProps.activeItem.quantity ', () => {
        expect(wrapper.find(Select).length).toBe(1)
        expect(wrapper.find(Select).getElement().props.options.length).toBe(
          initialProps.activeItem.quantity
        )
        expect(wrapper.find(Select).getElement().props.isDisabled).toBe(false)
        expect(wrapper.find(Select).getElement().props.value).toBe('1')
      })
    })

    describe('in product size not selected ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        activeItem: {},
      })
      it('should be wrapped with FeatureCheck component', () => {
        expect(
          wrapper
            .find('.ProductQuantity')
            .parent()
            .is('Connect(FeatureCheck)')
        ).toBe(true)
        expect(
          wrapper
            .find('.ProductQuantity')
            .parent()
            .getElement().props.flag
        ).toBe('FEATURE_PDP_QUANTITY')
      })
      it('should have Select component with prop options as Array of length initialProps.activeItem.quantity ', () => {
        expect(wrapper.find(Select).length).toBe(1)
        expect(wrapper.find(Select).getElement().props.options.length).toBe(10)
        expect(wrapper.find(Select).getElement().props.isDisabled).toBe(true)
      })
    })
    it('with classNameu', () => {
      const fakeClass = 'fake-class'
      const { wrapper } = renderComponent({
        ...initialProps,
        className: fakeClass,
      })
      expect(wrapper.find('.ProductQuantity').hasClass(fakeClass)).toBe(true)
    })
  })

  describe('@events', () => {
    it('select change', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      expect(instance.props.onSelectQuantity).not.toHaveBeenCalled()
      wrapper.find(Select).simulate('change', { target: { value: 4 } })
      expect(instance.props.onSelectQuantity).toHaveBeenCalledWith(4)
      expect(instance.props.onSelectQuantity).toHaveBeenCalledTimes(1)
    })
  })
})
