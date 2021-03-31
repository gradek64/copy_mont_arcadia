import testComponentHelper from 'test/unit/helpers/test-component'

import WishlistButtonContainer from '../WishlistButtonContainer'
import WishlistLoginModal from '../../../containers/Wishlist/WishlistLoginModal'
import WishlistButtonComponent from '../WishlistButtonComponent'

describe('<WishlistButtonContainer />', () => {
  const productId = 123456
  const onClickPreHook = jest.fn()
  const modifier = 'pdp'
  const isFromQuickView = false
  const productDetails = {
    lineNumber: 'TX2345OL',
    price: '20.00',
  }
  const defaultProps = {
    isAddedToWishlist: false,
    isAuthenticated: false,
    productId,
    modifier,
    addToWishlist: jest.fn(() => Promise.resolve()),
    removeProductFromWishlist: jest.fn(() => Promise.resolve()),
    triggerWishlistLoginModal: jest.fn().mockReturnValue(Promise.resolve()),
    productDetails: {
      lineNumber: 'TX2345OL',
      price: '20.00',
    },
  }

  const event = { preventDefault: jest.fn() }

  const renderComponent = testComponentHelper(
    WishlistButtonContainer.WrappedComponent
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@constructor', () => {
    it('sets initial state', () => {
      const { wrapper } = renderComponent(defaultProps)
      expect(wrapper.state('isInWishlist')).toBe(false)
    })
  })

  describe('@renders', () => {
    beforeEach(() => jest.clearAllMocks())

    it('should render default state', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render with plp modifier', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        modifier: 'plp',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should pass down `isAdding` as false by default', () => {
      const { wrapper } = renderComponent(defaultProps)
      expect(wrapper.find(WishlistButtonComponent).prop('isAdding')).toBe(false)
    })
  })

  describe('@lifecycle', () => {
    describe('when item has been successfully added to wishlist', () => {
      beforeEach(() => jest.clearAllMocks())
      it('updates UI if does not reflect the value of `isAddedToWishlist` yet', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          isAddedToWishlist: false,
          isAuthenticated: true,
        })
        expect(wrapper.state('isInWishlist')).toBe(false)
        wrapper.setProps({
          isAddedToWishlist: true,
        })
        expect(wrapper.state('isInWishlist')).toBe(true)
      })
    })
  })

  describe('@events', () => {
    describe('on clicking the wishlist button', () => {
      describe('button event', () => {
        it('should prevent default', async () => {
          const { instance } = renderComponent({
            ...defaultProps,
          })

          await instance.handleWishlistClick(event)
          expect(event.preventDefault).toHaveBeenCalledTimes(1)
        })
      })

      describe('when request is pending', () => {
        beforeEach(() => jest.clearAllMocks())

        it('should not trigger any action', async () => {
          const { instance } = renderComponent({
            ...defaultProps,
            isAddedToWishlist: false,
            isAuthenticated: true,
          })
          instance.setState({ isAdding: true })

          await instance.handleWishlistClick(event)
          expect(instance.props.addToWishlist).toHaveBeenCalledTimes(0)
          expect(
            instance.props.removeProductFromWishlist
          ).toHaveBeenCalledTimes(0)
          expect(
            instance.props.triggerWishlistLoginModal
          ).toHaveBeenCalledTimes(0)
        })

        it('should not call onClickPreHook', async () => {
          const { instance } = renderComponent({
            ...defaultProps,
            onClickPreHook,
            isAddedToWishlist: false,
            isAuthenticated: true,
          })
          instance.setState({ isAdding: true })

          await instance.handleWishlistClick(event)
          expect(instance.props.addToWishlist).toHaveBeenCalledTimes(0)
          expect(onClickPreHook).toHaveBeenCalledTimes(0)
          expect(
            instance.props.removeProductFromWishlist
          ).toHaveBeenCalledTimes(0)
          expect(
            instance.props.triggerWishlistLoginModal
          ).toHaveBeenCalledTimes(0)
        })
      })

      describe('when user is authenticated', () => {
        describe('and item is not in wishlist yet', () => {
          beforeEach(() => jest.clearAllMocks())

          it('should update the `isAdding` prop', () => {
            const { wrapper } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: false,
              isAuthenticated: true,
            })

            expect(wrapper.find(WishlistButtonComponent).prop('isAdding')).toBe(
              false
            )

            wrapper.find(WishlistButtonComponent).simulate('click', event)

            expect(wrapper.find(WishlistButtonComponent).prop('isAdding')).toBe(
              true
            )
          })

          it('should dispatch addToWishlist', async () => {
            const { instance, wrapper } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: false,
              isAuthenticated: true,
              modifier: 'plp',
            })

            expect(wrapper.state('isInWishlist')).toBe(false)
            await instance.handleWishlistClick(event)
            expect(wrapper.state('isInWishlist')).toBe(true)
            expect(instance.props.addToWishlist).toHaveBeenCalledTimes(1)
            expect(instance.props.addToWishlist).toHaveBeenCalledWith(
              productId,
              'plp',
              productDetails
            )
          })

          it('should call afterAddToWishlist', async () => {
            const { instance } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: false,
              isAuthenticated: true,
              modifier: 'plp',
              afterAddToWishlist: jest.fn().mockReturnValue(Promise.resolve()),
            })

            expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(0)
            await instance.handleWishlistClick(event)
            expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(1)
          })

          it('should revert local state if addToWishlist fails', async () => {
            const { instance, wrapper } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: false,
              isAuthenticated: true,
              addToWishlist: jest.fn(() => Promise.reject()),
            })

            expect(wrapper.state('isInWishlist')).toBe(false)
            await instance.handleWishlistClick(event)
            expect(wrapper.state('isInWishlist')).toBe(false)
          })
        })

        describe('and item has already been added to wishlist', () => {
          beforeEach(() => jest.clearAllMocks())

          it('should update the `isAdding` prop', () => {
            const { wrapper } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: true,
              isAuthenticated: true,
            })

            expect(wrapper.find(WishlistButtonComponent).prop('isAdding')).toBe(
              false
            )

            wrapper.find(WishlistButtonComponent).simulate('click', event)

            expect(wrapper.find(WishlistButtonComponent).prop('isAdding')).toBe(
              false
            )
          })

          it('should dispatch removeProductFromWishlist action', async () => {
            const { instance, wrapper } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: true,
              isAuthenticated: true,
              modifier: 'plp',
            })
            expect(wrapper.state('isInWishlist')).toBe(true)
            await instance.handleWishlistClick(event)
            expect(wrapper.state('isInWishlist')).toBe(false)
            expect(
              instance.props.removeProductFromWishlist
            ).toHaveBeenCalledTimes(1)
            expect(
              instance.props.removeProductFromWishlist
            ).toHaveBeenCalledWith({
              productId,
              modifier: 'plp',
              productDetails,
              reportToGA: true,
            })
          })

          it('should not call afterAddToWishlist', async () => {
            const { instance } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: true,
              isAuthenticated: true,
              modifier: 'plp',
              afterAddToWishlist: jest.fn().mockReturnValue(Promise.resolve()),
            })
            await instance.handleWishlistClick(event)
            expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(0)
          })

          it('should revert local state if removeProductFromWishlist fails', async () => {
            const { instance, wrapper } = renderComponent({
              ...defaultProps,
              isAddedToWishlist: true,
              isAuthenticated: true,
              removeProductFromWishlist: jest.fn(() => Promise.reject()),
            })
            expect(wrapper.state('isInWishlist')).toBe(true)
            await instance.handleWishlistClick(event)
            expect(wrapper.state('isInWishlist')).toBe(true)
          })
        })
      })

      describe('when user is not authenticated', () => {
        beforeEach(() => jest.clearAllMocks())

        it('should dispatch triggerWishlistLoginModal action', async () => {
          const modifier = 'plp'
          const { productDetails } = defaultProps
          const { instance } = renderComponent({
            ...defaultProps,
            isAddedToWishlist: false,
            isAuthenticated: false,
            modifier,
          })
          await instance.handleWishlistClick(event)
          expect(
            instance.props.triggerWishlistLoginModal
          ).toHaveBeenCalledTimes(1)
          expect(instance.props.triggerWishlistLoginModal).toHaveBeenCalledWith(
            productId,
            WishlistLoginModal,
            modifier,
            null,
            null,
            isFromQuickView,
            productDetails
          )
        })

        it('should call onAuthenticationPreHook', async () => {
          const modifier = 'plp'
          const onAuthenticationPreHook = jest.fn()
          const { instance } = renderComponent({
            ...defaultProps,
            isAddedToWishlist: false,
            isAuthenticated: false,
            modifier,
            onAuthenticationPreHook,
          })
          expect(instance.props.onAuthenticationPreHook).toHaveBeenCalledTimes(
            0
          )
          await instance.handleWishlistClick(event)
          expect(instance.props.onAuthenticationPreHook).toHaveBeenCalledTimes(
            1
          )
        })

        it('passes afterAddToWishlist to modal', async () => {
          const modifier = 'plp'
          const { productDetails } = defaultProps
          const { instance } = renderComponent({
            ...defaultProps,
            isAddedToWishlist: false,
            isAuthenticated: false,
            modifier,
            afterAddToWishlist: jest.fn(),
          })
          await instance.handleWishlistClick(event)
          expect(
            instance.props.triggerWishlistLoginModal
          ).toHaveBeenCalledTimes(1)
          expect(instance.props.triggerWishlistLoginModal).toHaveBeenCalledWith(
            productId,
            WishlistLoginModal,
            modifier,
            instance.props.afterAddToWishlist,
            null,
            isFromQuickView,
            productDetails
          )
        })

        it('passes onCancelLogin to modal', async () => {
          const modifier = 'plp'
          const { productDetails } = defaultProps
          const { instance } = renderComponent({
            ...defaultProps,
            isAddedToWishlist: false,
            isAuthenticated: false,
            modifier,
            onCancelLogin: jest.fn(),
          })

          await instance.handleWishlistClick(event)
          expect(
            instance.props.triggerWishlistLoginModal
          ).toHaveBeenCalledTimes(1)
          expect(instance.props.triggerWishlistLoginModal).toHaveBeenCalledWith(
            productId,
            WishlistLoginModal,
            modifier,
            null,
            instance.props.onCancelLogin,
            isFromQuickView,
            productDetails
          )
        })
      })
    })
  })
})
