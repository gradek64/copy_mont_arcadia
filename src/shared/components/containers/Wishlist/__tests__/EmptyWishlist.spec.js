import { identity } from 'ramda'
import { browserHistory } from 'react-router'
import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import EmptyWishlist from '../EmptyWishlist'
import Button from '../../../common/Button/Button'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  },
}))

const props = {
  isUserAuthenticated: false,
  onSignInHandler: jest.fn(),
  visited: [],
}

describe(EmptyWishlist.name, () => {
  const context = {
    l: jest.fn(identity),
  }
  const renderComponent = testComponentHelper(EmptyWishlist, { props, context })

  describe('@render', () => {
    it('should render component when user is not authenticated', () => {
      const { getTree } = renderComponent({
        ...props,
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('should not render SIGN IN message when user is authenticated', () => {
      const { getTree } = renderComponent({
        ...props,
        isUserAuthenticated: true,
      })
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('onSignInHandler()', () => {
      it('should trigger function to open login modal when sign in button is clicked', () => {
        const { wrapper, instance } = renderComponent({
          ...props,
        })
        const EmptyWishlistSignInButton = wrapper.find(
          '.EmptyWishlist-signInButton'
        )
        expect(instance.props.onSignInHandler).not.toHaveBeenCalled()
        EmptyWishlistSignInButton.simulate('click')
        expect(instance.props.onSignInHandler).toHaveBeenCalledTimes(1)
      })
    })

    describe('when `Continue Shopping` button is clicked ', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      describe('when the `visited` array contains one or less values', () => {
        it('it should call `browserHistory.replace`', () => {
          const { wrapper } = renderComponent({
            ...props,
            visited: [],
          })
          const continueShoppingBtn = wrapper.find(Button).first()
          continueShoppingBtn.dive().simulate('click')
          expect(browserHistory.replace).toHaveBeenCalledWith('/')
        })
      })

      describe('when the `visited` array contains 2 or more values', () => {
        describe('when the previous route matches an excluded route', () => {
          it('it should call `browserHistory.replace`', () => {
            const { wrapper } = renderComponent({
              ...props,
              visited: ['path1', '/login', '/wishlist'],
            })
            const continueShoppingBtn = wrapper.find(Button).first()
            continueShoppingBtn.dive().simulate('click')
            expect(browserHistory.replace).toHaveBeenCalledWith('/')
          })

          describe('when the previous route does not match an excluded route', () => {
            it('it should call `browserHistory.goBack`', () => {
              const { wrapper } = renderComponent({
                ...props,
                visited: ['/path1', '/plp', '/wishlist'],
              })
              const continueShoppingBtn = wrapper.find(Button).first()
              continueShoppingBtn.dive().simulate('click')
              expect(browserHistory.goBack).toHaveBeenCalled()
            })
          })
        })
      })
    })
  })
})
