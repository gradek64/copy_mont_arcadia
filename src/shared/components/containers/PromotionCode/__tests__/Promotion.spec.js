import testComponentHelper from 'test/unit/helpers/test-component'
import Promotion from '../Promotion'

describe('<Promotion />', () => {
  const initialProps = {
    promotion: {
      promotionCode: 'WELCOME15',
      label: 'Welcome treat! 15% off',
    },
    removePromotionCode: jest.fn(),
    showForm: jest.fn(),
  }
  const renderComponent = testComponentHelper(Promotion)
  beforeEach(() => jest.resetAllMocks())
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with add Button', () => {
      expect(
        renderComponent({
          ...initialProps,
          showAddButton: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })
  describe('@events', () => {
    describe('click remove promo', () => {
      it('it should call removePromotionCode() with props.promotion.promotionCode', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.removePromotionCode).not.toHaveBeenCalled()
        wrapper.find('.PromotionCode-removeText').simulate('click')
        expect(instance.props.removePromotionCode).toHaveBeenCalledTimes(1)
        expect(instance.props.removePromotionCode).toHaveBeenLastCalledWith(
          instance.props.promotion.promotionCode
        )
      })
    })
    describe('click add promocode', () => {
      it('it should call removePromotionCode() with props.promotion.promotionCode', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          showAddButton: true,
        })
        expect(instance.props.showForm).not.toHaveBeenCalled()
        wrapper.find('.PromotionCode-addText').simulate('click')
        expect(instance.props.showForm).toHaveBeenCalledTimes(1)
      })
    })
  })
})
