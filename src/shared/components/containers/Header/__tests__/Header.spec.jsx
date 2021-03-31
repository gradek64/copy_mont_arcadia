import testComponentHelper from 'test/unit/helpers/test-component'
import { HeaderComp } from '../Header'
import SearchBar from '../../SearchBar/SearchBar'
import QuickLinks from '../../../common/QuickLinks/QuickLinks'
import BrandLogo from '../../../common/BrandLogo/BrandLogo'
import Image from '../../../common/Image/Image'
import BurgerButton from '../../../common/BurgerButton/BurgerButton'
import WishlistHeaderLink from '../../../common/WishlistHeaderLink/WishlistHeaderLink'
import {
  GTM_EVENT,
  GTM_TRIGGER,
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../../../analytics'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: [],
}))

describe('<Header/>', () => {
  const initialProps = {
    topNavMenuOpen: false,
    toggleTopNavMenu: jest.fn(),
    toggleProductsSearchBar: jest.fn(),
    getCart: jest.fn(),
    sendAnalyticsDisplayEvent: jest.fn(),
    productsSearchOpen: false,
    shoppingBagTotalItems: 34,
    toggleMiniBag: jest.fn(),
    modalOpen: false,
    hasCartIcon: false,
    hasPaymentIcon: false,
    hasSearchBar: false,
    hasMenuButton: false,
    brandName: 'TS',
    isCheckoutBig: false,
    sendAnalyticsClickEvent: jest.fn(),
    clearOutOfStockError: jest.fn(),
    openMiniBag: jest.fn(),
    isRestrictedPath: false,
    isMobile: false,
    isStickyMobileEnabled: false,
    submitSearch: jest.fn(),
    refinementsOpen: false,
  }

  const renderComponent = testComponentHelper(HeaderComp.WrappedComponent)

  describe('@renders', () => {
    it('should render correct default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('does not contains "Header" section with is-forceDisplay by default', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('.Header.is-forceDisplay')).toHaveLength(0)
    })
    it('contains "Header" section with is-forceDisplay class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        forceDisplay: true,
      })
      expect(wrapper.find('.Header.is-forceDisplay')).toHaveLength(1)
    })
    it('does not contains "continueShopping" button by default', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('.Header-continueShopping').exists()).toEqual(false)
    })
    it('should render the One Page Checkout Header', () => {
      const { getTree } = renderComponent({
        ...initialProps,
        isInCheckout: true,
        isMobile: true,
        routePath: '/checkout/delivery',
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('does not contain "Header-container" section with .is-sticky class by default', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('.Header-container').hasClass('is-sticky')).toBe(
        false
      )
    })
    it('contains "Header-container" section with .is-sticky class if sticky=true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sticky: true,
      })
      expect(wrapper.find('.Header-container').hasClass('is-sticky')).toBe(true)
    })
    it('contains "Header-container" section with .is-refinements-open class if refinementsOpen=true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        refinementsOpen: true,
      })
      expect(
        wrapper.find('.Header-container').hasClass('is-refinements-open')
      ).toBe(true)
    })
    it('"Header-container" section DONT have is-stickyMobile class as default', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(
        wrapper.find('.Header-container').hasClass('is-stickyMobile')
      ).toBe(false)
    })
    it('"Header-container" section DONT have is-refinements-open class as default', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(
        wrapper.find('.Header-container').hasClass('is-refinements-open')
      ).toBe(false)
    })
    it('contains "Header-container" section with is-stickyMobile class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isStickyMobile: true,
      })
      expect(
        wrapper.find('.Header-container').hasClass('is-stickyMobile')
      ).toBe(true)
    })
    it('contains "Header" section', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.Header')).toHaveLength(1)
    })
    it('Header section is not sticky by default', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.Header').hasClass('is-sticky')).toBe(false)
    })
    it('Header section is sticky if sticky=true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sticky: true,
      })
      expect(wrapper.find('.Header').hasClass('is-sticky')).toBe(true)
    })
    it('contains "Header-center" section"', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.Header-center')).toHaveLength(1)
    })
    it('contains "BurgerButton"', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasMenuButton: true,
      })
      expect(wrapper.find(BurgerButton)).toHaveLength(1)
    })
    it('contains "Header-searchIcon"', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasSearchBar: true,
        productsSearchOpen: true,
      })
      expect(wrapper.find(Image)).toHaveLength(1)
    })
    it('Image contains the correct `alt` when `productsSearchOpen` is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasSearchBar: true,
        productsSearchOpen: true,
      })
      expect(
        wrapper
          .find(Image)
          .first()
          .props().alt
      ).toBe('Close')
    })
    it('Image contains the correct `alt` when `productsSearchOpen` is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasSearchBar: true,
        productsSearchOpen: false,
      })
      expect(
        wrapper
          .find(Image)
          .first()
          .props().alt
      ).toBe('Search')
    })
    it('contains BrandLogo component', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(BrandLogo)).toHaveLength(1)
    })
    it('contains QuickLinks component', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(QuickLinks)).toHaveLength(1)
    })
    it('contains Wishlist header link', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasCartIcon: true,
      })
      expect(wrapper.find(WishlistHeaderLink)).toHaveLength(1)
    })
    it('contains "Header-shoppingCartIcon', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasCartIcon: true,
      })
      expect(wrapper.find('.Header-shoppingCartIcon')).toHaveLength(1)
    })
    it('contains SearchBar component', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasSearchBar: true,
      })
      expect(wrapper.find(SearchBar)).toHaveLength(1)
    })
    it('contains the search icon search-icon.svg', () => {
      const props = {
        ...initialProps,
        hasSearchBar: true,
        productsSearchOpen: true,
        logoVersion: 'logo-version',
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper
          .find(Image)
          .first()
          .props().src
      ).toBe(
        `/assets/{brandName}/images/close-icon.svg?version=${props.logoVersion}`
      )
    })
  })

  describe('@events', () => {
    beforeEach(jest.resetAllMocks)
    it('when the .Header-searchButton is clicked then toggleProductsSearchBar() action is called', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasSearchBar: true,
      })
      wrapper
        .find('.Header-searchButton')
        .first()
        .props()
        .onClick({ preventDefault: () => {} })
      expect(initialProps.toggleProductsSearchBar).toHaveBeenCalledTimes(1)
    })
    it('when .Header-shoppingCartIconbutton is clicked then toggleMiniBag() action is called', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasCartIcon: true,
        pageType: 'plp',
      })
      wrapper
        .find('.Header-shoppingCartIconbutton')
        .first()
        .props()
        .onClick({ stopPropagation: () => {} })
      expect(initialProps.toggleMiniBag).toHaveBeenCalledTimes(1)
      expect(initialProps.sendAnalyticsDisplayEvent).toHaveBeenCalledWith(
        {
          bagDrawerTrigger: GTM_TRIGGER.BAG_ICON_CLICKED,
          openFrom: 'plp',
        },
        GTM_EVENT.BAG_DRAWER_DISPLAYED
      )
    })
    it('when ".Header-center button" is clicked then toggleMiniBag() action is called', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasCartIcon: true,
      })
      expect(browserHistory).toHaveLength(0)
      wrapper
        .find('.Header-center button')
        .first()
        .props()
        .onClick()
      expect(browserHistory).toHaveLength(1)
      expect(browserHistory[0]).toBe('/')
    })
    it('when .Header-burgerButtonContainer is clicked then toggleTopNavMenu() action is called', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        hasMenuButton: true,
      })
      wrapper
        .find('.Header-burgerButtonContainer')
        .first()
        .props()
        .onClick({ stopPropagation: () => {} })
      expect(initialProps.toggleTopNavMenu).toHaveBeenCalledTimes(1)
    })

    it('GTM analytics event called with sanitised route path when goToHomePage is invoked', () => {
      const { instance } = renderComponent({
        ...initialProps,
        hasContinueShoppingButton: true,
        routePath: '/checkout/delivery',
      })
      expect(initialProps.sendAnalyticsClickEvent).not.toHaveBeenCalled()
      instance.goToHomePage()
      expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalledWith({
        category: GTM_CATEGORY.CHECKOUT,
        action: GTM_ACTION.CONTINUE_SHOPPING,
        label: 'delivery',
        value: '',
      })
    })
  })

  describe('@lifecyle methods', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    describe('componentDidUpdate', () => {
      it('instance.searchInput.focus() is called when `hasSearchBar: true`, `productsSearchOpen: true` and `productsSearchOpen: false`', () => {
        const { instance } = renderComponent({
          ...initialProps,
          hasSearchBar: true,
          productsSearchOpen: true,
        })
        instance.searchInput = {
          focus: jest.fn(),
          blur: jest.fn(),
        }
        const previousProps = {
          productsSearchOpen: false,
        }
        instance.componentDidUpdate(previousProps)
        expect(instance.searchInput.focus).toHaveBeenCalledTimes(1)
        expect(instance.searchInput.blur).not.toHaveBeenCalled()
      })
      it('instance.searchInput.blur() is called when `hasSearchBar: true`, `productsSearchOpen: false` and `productsSearchOpen: true`', () => {
        const { instance } = renderComponent({
          ...initialProps,
          hasSearchBar: true,
          productsSearchOpen: false,
        })
        instance.searchInput = {
          focus: jest.fn(),
          blur: jest.fn(),
        }
        const previousProps = {
          productsSearchOpen: true,
        }
        instance.componentDidUpdate(previousProps)
        expect(instance.searchInput.blur).toHaveBeenCalledTimes(1)
        expect(instance.searchInput.focus).not.toHaveBeenCalled()
      })
      it('opens minibag if there is an error and clears out error when client side', () => {
        const beforeBrowser = process.browser
        process.browser = true
        const { instance } = renderComponent({
          ...initialProps,
          isOutOfStockInCheckout: true,
        })
        const previousProps = {
          isOutOfStockInCheckout: undefined,
        }
        expect(initialProps.openMiniBag).toHaveBeenCalledTimes(0)
        expect(initialProps.clearOutOfStockError).toHaveBeenCalledTimes(0)
        instance.componentDidUpdate(previousProps)
        expect(initialProps.openMiniBag).toHaveBeenCalledTimes(1)
        expect(initialProps.clearOutOfStockError).toHaveBeenCalledTimes(1)
        process.browser = beforeBrowser
      })
      it('does not opens minibag if there is an error and clears out error if SSR', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isOutOfStockInCheckout: true,
        })
        const previousProps = {
          isOutOfStockInCheckout: undefined,
        }
        expect(initialProps.openMiniBag).toHaveBeenCalledTimes(0)
        expect(initialProps.clearOutOfStockError).toHaveBeenCalledTimes(0)
        instance.componentDidUpdate(previousProps)
        expect(initialProps.openMiniBag).toHaveBeenCalledTimes(1)
        expect(initialProps.clearOutOfStockError).toHaveBeenCalledTimes(0)
      })
    })
  })
})
