import testComponentHelper from 'test/unit/helpers/test-component'
import { GTM_TRIGGER, GTM_EVENT } from '../../../../analytics'

import { WrappedShoppingCart } from '../ShoppingCart'

describe('<ShoppingCart />', () => {
  const requiredProps = {
    onClick: () => {},
  }
  const renderComponent = testComponentHelper(WrappedShoppingCart)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should display `label` if prop supplied', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        label: 'Label',
      })
      expect(wrapper.find('.ShoppingCart-label')).toHaveLength(1)
      expect(wrapper.find('.ShoppingCart-label').text()).toBe('Label')
    })

    it('should display `itemsCount` if prop supplied', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        itemsCount: 5,
      })
      expect(wrapper.find('.ShoppingCart-itemsCount').text()).toBe('5')
    })

    it('should add `is-empty` class name if itemsCount prop is `0`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        itemsCount: 0,
      })
      expect(wrapper.find('.ShoppingCart').hasClass('is-empty')).toBe(true)
    })

    it('should add `modifier` to class name if prop supplied', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        modifier: 'modified',
      })
      expect(
        wrapper.find('.ShoppingCart').hasClass('ShoppingCart--modified')
      ).toBe(true)
    })
  })

  describe('@events', () => {
    it('should call `onClick` prop on click', () => {
      const props = {
        onClick: jest.fn(),
        sendAnalyticsDisplayEvent: jest.fn(),
        pageType: 'plp',
      }
      const { wrapper } = renderComponent(props)
      wrapper.prop('onClick')()
      expect(props.onClick).toHaveBeenCalled()

      expect(props.sendAnalyticsDisplayEvent).toHaveBeenCalledWith(
        {
          bagDrawerTrigger: GTM_TRIGGER.BAG_ICON_CLICKED,
          openFrom: 'plp',
        },
        GTM_EVENT.BAG_DRAWER_DISPLAYED
      )
    })
  })
})
