import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutMiniBag from './CheckoutMiniBag'
import { GTM_ACTION, GTM_CATEGORY } from '../../../analytics'

describe('<CheckoutMiniBag />', () => {
  const renderComponent = testComponentHelper(CheckoutMiniBag.WrappedComponent)
  const initialProps = {
    orderSummary: {},
    closeMiniBag: jest.fn(),
    showDiscounts: true,
    sendAnalyticsClickEvent: jest.fn(),
    totalShoppingBagItems: 1,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('should render the totalShoppingBagItems in the header', () => {
      const values = [0, 1, 6, 24]
      values.forEach((totalShoppingBagItems) => {
        const { wrapper } = renderComponent({
          ...initialProps,
          totalShoppingBagItems,
        })
        expect(wrapper.find('h5.CheckoutMiniBag-header').text()).toMatch(
          `(${totalShoppingBagItems})`
        )
      })
    })
  })

  describe('@methods', () => {
    describe('scrollMinibag(pos)', () => {
      it('should modify scrollTop property', () => {
        const { instance } = renderComponent(initialProps)
        instance.scrollableContent = {
          offsetHeight: 1200,
          scrollTop: 0,
        }

        instance.scrollMinibag(100)
        expect(instance.scrollableContent.scrollTop).toBe(-1100)
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => jest.resetAllMocks())

    describe('on Back To Checkout button click', () => {
      it('dispatches closeMiniBag action to hide the component', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        expect(instance.props.closeMiniBag).toHaveBeenCalledTimes(0)
        wrapper
          .find('.CheckoutMiniBag-backToCheckout')
          .props()
          .clickHandler()
        expect(instance.props.closeMiniBag).toHaveBeenCalledTimes(1)
      })
    })

    describe('on close button click', () => {
      it('should close the minibag', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
        wrapper.find('.CheckoutMiniBag-closeButton').simulate('click')
        expect(initialProps.closeMiniBag).toHaveBeenCalled()
      })

      it('should fire a GTM click event', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
        wrapper.find('.CheckoutMiniBag-closeButton').simulate('click')
        expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalled()
        expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.SHOPPING_BAG,
          action: GTM_ACTION.CLICKED,
          label: 'close-button',
        })
      })
    })
  })
})
