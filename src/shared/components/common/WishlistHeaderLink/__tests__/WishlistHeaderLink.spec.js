import testComponentHelper from 'test/unit/helpers/test-component'
import WishlistHeaderLink from '../WishlistHeaderLink'
import { isFF, isIE11 } from '../../../../lib/browser'

jest.mock('../../../../lib/browser')

describe('<WishlistHeaderLink />', () => {
  const renderComponent = testComponentHelper(
    WishlistHeaderLink.WrappedComponent
  )

  const getDefaultWishlistMock = jest.fn()
  const wishlistProps = {
    isWishlistEnabled: true,
    getDefaultWishlist: getDefaultWishlistMock,
  }
  const initialProps = {
    ...wishlistProps,
    isAuthenticated: false,
    itemsCount: 0,
    preserveScroll: jest.fn(),
  }

  describe('@renders', () => {
    it('displays in default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('does not display when wishlist feature flag is disabled', () => {
      const { wrapper } = renderComponent({ isWishlistEnabled: false })
      expect(wrapper.find('.WishlistHeaderLink').length).toBe(0)
    })

    it('should display `label` if prop supplied', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        label: 'Label',
      })
      expect(wrapper.find('.WishlistHeaderLink-label')).toHaveLength(1)
      expect(wrapper.find('.WishlistHeaderLink-label').text()).toBe('Label')
    })

    it('renders class name when supplied className prop', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        className: 'test-class',
      })
      expect(wrapper.find('.test-class').length).toBe(1)
    })

    describe('user is not authenticated', () => {
      const { wrapper } = renderComponent(initialProps)
      it('should display icon in `not added to wishlist` state', () => {
        expect(
          wrapper.find('.WishlistHeaderLink-icon').hasClass('is-selected')
        ).toBe(false)
      })
    })
    describe('user is authenticated', () => {
      describe('0 items in wishlist', () => {
        it('should display icon in `not added to wishlist` state', () => {
          const { wrapper } = renderComponent({
            ...wishlistProps,
            isAuthenticated: true,
            itemsCount: 0,
          })
          expect(
            wrapper.find('.WishlistHeaderLink-icon').hasClass('is-selected')
          ).toBe(false)
        })
      })
      describe('1 or more items in wishlist', () => {
        it('should display icon in `added to wishlist` state', () => {
          const { wrapper } = renderComponent({
            ...wishlistProps,
            isAuthenticated: true,
            itemsCount: 5,
          })
          expect(
            wrapper.find('.WishlistHeaderLink-icon').hasClass('is-selected')
          ).toBe(true)
        })
      })
    })
  })

  describe('@events', () => {
    afterEach(() => jest.clearAllMocks())
    const oldWindowNavigatorAgent = window.navigator.userAgent
    afterAll(() => {
      Object.defineProperty(global.navigator, 'userAgent', {
        get: () => oldWindowNavigatorAgent,
        configurable: true,
      })
    })
    describe('when clicking on the wishlist icon', () => {
      it('it should call the `preserveScroll` with the right arg if IE11', () => {
        isIE11.mockImplementationOnce(() => true)
        const { wrapper } = renderComponent(initialProps)
        wrapper.prop('onClick')()
        expect(initialProps.preserveScroll).toHaveBeenCalledWith(0)
      })

      it('it should call the `preserveScroll` with the right arg if Firefox', () => {
        isFF.mockImplementationOnce(() => true)
        const { wrapper } = renderComponent(initialProps)
        wrapper.prop('onClick')()
        expect(initialProps.preserveScroll).toHaveBeenCalledWith(0)
      })
    })
  })
})
