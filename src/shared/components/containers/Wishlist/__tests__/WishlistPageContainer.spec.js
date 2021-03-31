import { identity, compose, range } from 'ramda'
import { CSSTransition } from 'react-transition-group'

import testComponentHelper, {
  analyticsDecoratorHelper,
  buildComponentRender,
  mountRender,
} from '../../../../../../test/unit/helpers/test-component'

import { MAX_WISHLIST_ITEMS } from '../../../../constants/wishlistConstants'

import DecoratedWishlistPageContainer, {
  WishlistPageContainer,
} from '../WishlistPageContainer'
import WishlistLoginModal from '../../../containers/Wishlist/WishlistLoginModal'
import WishlistLimitInfo from '../WishlistLimitInfo'
import EmptyWishlist from '../EmptyWishlist'
import Loader from '../../../common/Loader/Loader'
import WishlistItemContainer from '../WishlistItemContainer'

const createFakeItem = (i) => ({
  catEntryId: `316218${i}`,
})
const createFakeItems = (quantity) =>
  range(1, quantity + 1).map((i) => createFakeItem(i))
const itemsMock = [createFakeItem('90'), createFakeItem('47')]

const checkTransitionWrapperState = (wrapper, element, isShown) => {
  const transitionWrapper = wrapper.find(element).parent()
  expect(transitionWrapper.is(CSSTransition)).toBe(true)
  expect(transitionWrapper.prop('in')).toBe(isShown)
}

const props = {
  totalItems: 0,
  items: null,
  isLoadingItems: false,
  loadedPages: 1,
  isUserAuthenticated: false,
  location: { action: 'PUSH' },
  hasReachedPageBottom: false,
  isWishlistSync: false,
  getPaginatedWishlist: jest.fn(),
  triggerWishlistLoginModal: jest.fn(),
  preservedScroll: 3,
  visited: [],
}

describe(WishlistPageContainer.name, () => {
  const context = {
    l: jest.fn(identity),
  }

  const renderComponent = testComponentHelper(WishlistPageContainer, {
    context,
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(DecoratedWishlistPageContainer, 'wishlist', {
      componentName: 'WishlistPageContainer',
      isAsync: false,
    })
  })

  describe('@renders', () => {
    describe('on SSR', () => {
      let oldProcessBrowser
      beforeAll(() => {
        oldProcessBrowser = process.browser
        process.browser = false
      })
      afterAll(() => {
        process.browser = oldProcessBrowser
      })

      it('should render the header', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find('h1').text()).toBe('My Wishlist')
      })

      describe('if the user is logged in and has WL items', () => {
        it('should render the totalItems and a loading spinner', () => {
          const { wrapper } = renderComponent({
            ...props,
            isUserAuthenticated: true,
            totalItems: 14,
          })
          expect(wrapper.find('.WishlistPageContainer-itemCount').text()).toBe(
            '14 items'
          )
          expect(wrapper.find(Loader)).toHaveLength(1)
          checkTransitionWrapperState(wrapper, EmptyWishlist, false)
        })
      })

      describe('if the user is logged in but does not have WL items', () => {
        it('should render the empty WL component', () => {
          const { wrapper } = renderComponent({
            ...props,
            isUserAuthenticated: true,
            totalItems: 0,
          })
          checkTransitionWrapperState(wrapper, EmptyWishlist, true)
          const emptyWL = wrapper.find(EmptyWishlist)
          expect(emptyWL.prop('isUserAuthenticated')).toBe(true)

          expect(wrapper.find(Loader)).toHaveLength(0)
          expect(wrapper.find('WishlistPageContainer-itemCount')).toHaveLength(
            0
          )
        })
      })

      describe('if user is not logged in', () => {
        it('should render the empty WL component', () => {
          const { wrapper } = renderComponent({
            ...props,
            isUserAuthenticated: false,
          })
          checkTransitionWrapperState(wrapper, EmptyWishlist, true)
          const emptyWL = wrapper.find(EmptyWishlist)
          expect(emptyWL.prop('isUserAuthenticated')).toBe(false)

          expect(wrapper.find(Loader)).toHaveLength(0)
          expect(wrapper.find('WishlistPageContainer-itemCount')).toHaveLength(
            0
          )
        })
      })
    })

    describe('on client', () => {
      let oldProcessBrowser
      beforeAll(() => {
        oldProcessBrowser = process.browser
        process.browser = true
      })
      afterAll(() => {
        process.browser = oldProcessBrowser
      })

      describe('when user is not authenticated', () => {
        it('renders <EmptyWishlist /> CSSTransition', () => {
          const { wrapper, getTree } = renderComponent({
            ...props,
            isUserAuthenticated: false,
          })

          checkTransitionWrapperState(wrapper, EmptyWishlist, true)
          checkTransitionWrapperState(wrapper, WishlistItemContainer, false)
          expect(wrapper.find('WishlistPageContainer-itemCount')).toHaveLength(
            0
          )

          expect(getTree()).toMatchSnapshot()
        })
      })

      describe('when user is authenticated but has no wishlisted items', () => {
        it('renders <EmptyWishlist /> CSSTransition', () => {
          const { wrapper, getTree } = renderComponent({
            ...props,
            isUserAuthenticated: true,
            items: [],
            totalItems: 0,
          })

          checkTransitionWrapperState(wrapper, EmptyWishlist, true)
          checkTransitionWrapperState(wrapper, WishlistItemContainer, false)
          expect(wrapper.find('WishlistPageContainer-itemCount')).toHaveLength(
            0
          )

          expect(getTree()).toMatchSnapshot()
        })
      })

      describe('when user has items in the wishlist', () => {
        it('should render the item count', () => {
          const { wrapper } = renderComponent({
            ...props,
            isUserAuthenticated: true,
            items: itemsMock,
            totalItems: 88,
          })
          expect(wrapper.find('.WishlistPageContainer-itemCount').text()).toBe(
            '88 items'
          )
        })

        it('renders <WishlistItemContainer /> CSSTransition', () => {
          const { wrapper, getTree } = renderComponent({
            ...props,
            isUserAuthenticated: true,
            items: itemsMock,
            totalItems: 100,
          })

          checkTransitionWrapperState(wrapper, EmptyWishlist, false)
          checkTransitionWrapperState(wrapper, WishlistItemContainer, true)

          expect(getTree()).toMatchSnapshot()
        })

        it('should render a loader when `isLoadingItems` true', () => {
          const { wrapper } = renderComponent({
            ...props,
            isUserAuthenticated: true,
            items: itemsMock,
            totalItems: 20,
            isLoadingItems: true,
          })

          expect(wrapper.find(Loader)).toHaveLength(1)
        })

        describe('and user has not yet reached item limit', () => {
          it('should render two info boxes', () => {
            const items = createFakeItems(MAX_WISHLIST_ITEMS - 1)
            const { wrapper } = renderComponent({
              ...props,
              isUserAuthenticated: true,
              items,
              totalItems: items.length,
            })
            const infoBoxes = wrapper.find(WishlistLimitInfo)
            expect(infoBoxes.length).toBe(0)
          })
        })

        describe('and user has reached item limit', () => {
          it('should render an info box at the top and bottom if all items are loaded', () => {
            const items = createFakeItems(MAX_WISHLIST_ITEMS)
            const { wrapper } = renderComponent({
              ...props,
              isUserAuthenticated: true,
              items,
              totalItems: MAX_WISHLIST_ITEMS,
            })
            const infoBoxes = wrapper.find(WishlistLimitInfo)
            expect(infoBoxes.length).toBe(2)
            expect(infoBoxes.first().prop('withMarginTop')).toBe(true)
            expect(infoBoxes.last().prop('withMarginTop')).toBe(false)
          })

          it('should only render an info box at the top if not all items are loaded', () => {
            const items = createFakeItems(MAX_WISHLIST_ITEMS - 20)
            const { wrapper } = renderComponent({
              ...props,
              isUserAuthenticated: true,
              items,
              totalItems: MAX_WISHLIST_ITEMS,
            })
            const infoBox = wrapper.find(WishlistLimitInfo)
            expect(infoBox.length).toBe(1)
            expect(infoBox.prop('withMarginTop')).toBe(true)
          })
        })
      })
    })
  })

  describe('@lifecycle', () => {
    beforeEach(jest.clearAllMocks)

    describe('on componentDidMount', () => {
      const oldWindowNavigatorAgent = window.navigator.userAgent
      beforeAll(() => {
        window.scrollTo = jest.fn()
      })

      afterAll(() => {
        Object.defineProperty(global.navigator, 'userAgent', {
          get: () => oldWindowNavigatorAgent,
          configurable: true,
        })
        window.scrollTo.mockResore()
      })

      describe('fetch WL functionality', () => {
        it('should fetch items if `isWishlistSync` is false', () => {
          const { instance } = renderComponent({
            ...props,
            isWishlistSync: false,
          })
          expect(props.getPaginatedWishlist).not.toHaveBeenCalled()
          instance.componentDidMount()
          expect(props.getPaginatedWishlist).toHaveBeenCalled()
        })

        it('should not fetch items if `isWishlistSync` is true', () => {
          const { instance } = renderComponent({
            ...props,
            isWishlistSync: true,
          })
          instance.componentDidMount()
          expect(props.getPaginatedWishlist).not.toHaveBeenCalled()
        })
      })

      describe('preserve scroll functionality', () => {
        it('should dispatch getPaginatedWishlist when wishlist is not synced', () => {
          const { instance } = renderComponent(props)

          instance.componentDidMount()
          expect(instance.props.getPaginatedWishlist).toHaveBeenCalledTimes(1)
        })
        it('should not dispatch getPaginatedWishlist when wishlist is synced', () => {
          const { instance } = renderComponent({
            ...props,
            isWishlistSync: true,
          })

          instance.componentDidMount()
          expect(instance.props.getPaginatedWishlist).not.toHaveBeenCalled()
        })

        it('should call scrollTo and pass `0,0` as arguments if no IE11', () => {
          Object.defineProperty(global.navigator, 'userAgent', {
            get: () => 'Chrome',
            configurable: true,
          })

          const newProps = { ...props, location: { action: 'SOMETHING' } }
          global.process.browser = true

          const mountComponent = buildComponentRender(
            compose(mountRender),
            WishlistPageContainer
          )
          mountComponent(newProps)
          expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
        })

        it('should call scrollTo and pass `0,preservedScroll` as arguments if IE11', () => {
          Object.defineProperty(global.navigator, 'userAgent', {
            get: () => 'Trident',
            configurable: true,
          })
          const newProps = { ...props, location: { action: 'SOMETHING' } }
          global.process.browser = true

          const mountComponent = buildComponentRender(
            compose(mountRender),
            WishlistPageContainer
          )
          mountComponent(newProps)

          expect(window.scrollTo).toHaveBeenCalledWith(0, 3)
        })
      })
      // @TODO write tests to cover window.toScroll logic
    })

    describe('on UNSAFE_componentWillReceiveProps', () => {
      it('should fetch more items when at the bottom of the current page if not all items loaded', () => {
        const { wrapper } = renderComponent({
          ...props,
          isLoadingItems: false,
          hasReachedPageBottom: false,
          loadedPages: 1,
          totalItems: 100,
          items: createFakeItems(20),
        })

        expect(props.getPaginatedWishlist).not.toHaveBeenCalled()

        wrapper.setProps({ hasReachedPageBottom: true })

        expect(props.getPaginatedWishlist).toHaveBeenCalledWith(2)
      })

      it('should not more items if all items have been loaded', () => {
        const { wrapper } = renderComponent({
          ...props,
          isLoadingItems: false,
          hasReachedPageBottom: false,
          loadedPages: 5,
          totalItems: 100,
          items: createFakeItems(100),
        })

        wrapper.setProps({ hasReachedPageBottom: true })

        expect(props.getPaginatedWishlist).not.toHaveBeenCalled()
      })

      it('should not more items if a request for more items is already in flight', () => {
        const { wrapper } = renderComponent({
          ...props,
          isLoadingItems: true,
          hasReachedPageBottom: false,
          loadedPages: 1,
          totalItems: 100,
          items: createFakeItems(20),
        })

        wrapper.setProps({ hasReachedPageBottom: true })

        expect(props.getPaginatedWishlist).not.toHaveBeenCalled()
      })

      it('should try refetch the first page, if number of wl items changes', () => {
        const { wrapper } = renderComponent(props)

        wrapper.setProps({ totalItems: 52 })

        expect(props.getPaginatedWishlist).toHaveBeenCalledTimes(1)
        expect(props.getPaginatedWishlist).not.toHaveBeenCalledWith(2)
      })
    })
  })

  describe('@events', () => {
    let oldProcessBrowser
    beforeAll(() => {
      oldProcessBrowser = process.browser
      process.browser = true
    })
    afterAll(() => {
      process.browser = oldProcessBrowser
    })

    describe('when the user is not authenticated and the user clicks on the prompt to sign in', () => {
      it('should dispatch triggerWishlistLoginModal', () => {
        const { wrapper } = renderComponent({
          ...props,
          isUserAuthenticated: false,
        })
        expect(props.triggerWishlistLoginModal).not.toHaveBeenCalled()
        wrapper.find(EmptyWishlist).prop('onSignInHandler')()
        expect(props.triggerWishlistLoginModal).toHaveBeenCalledTimes(1)
        expect(props.triggerWishlistLoginModal).toHaveBeenCalledWith(
          null,
          WishlistLoginModal,
          'wishlist'
        )
      })
    })
  })
})
