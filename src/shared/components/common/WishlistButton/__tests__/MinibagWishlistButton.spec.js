import testComponentHelper from 'test/unit/helpers/test-component'

import MinibagWishlistButton from '../MinibagWishlistButton'
import WishlistButtonContainer from '../WishlistButtonContainer'
import QubitReact from 'qubit-react/wrapper'

describe('<MinibagWishlistButton />', () => {
  const productId = 12345
  const setMovingProductToWishlist = jest
    .fn()
    .mockReturnValue(Promise.resolve())
  const clearMovingProductToWishlist = jest
    .fn()
    .mockReturnValue(Promise.resolve())
  const defaultProps = {
    productId,
    setMovingProductToWishlist,
    clearMovingProductToWishlist,
    addToWishlist: jest.fn(),
    triggerWishlistLoginModal: jest.fn(),
    onClickWhenInWishlist: jest.fn(),
    movingProductToWishlist: false,
  }

  const renderComponent = testComponentHelper(
    MinibagWishlistButton.WrappedComponent
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('should display if authenticated and not already in wishlist', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        isAuthenticated: true,
        isAddedToWishlist: false,
      })
      expect(wrapper.find(WishlistButtonContainer)).toHaveLength(1)
    })
    it('should display nothing if authenticated and already in wishlist', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        isAuthenticated: true,
        isAddedToWishlist: true,
      })
      expect(wrapper.find(WishlistButtonContainer)).toHaveLength(0)
    })
  })

  describe('@events', () => {
    describe('onClickPreHook', () => {
      beforeEach(() => jest.clearAllMocks())

      it('should call `setMovingProductToWishlist` with the productId', async () => {
        const { instance } = renderComponent({
          ...defaultProps,
        })
        expect(setMovingProductToWishlist).toHaveBeenCalledTimes(0)
        await instance.onClickPreHook()
        expect(setMovingProductToWishlist).toHaveBeenCalledTimes(1)
        expect(setMovingProductToWishlist).toHaveBeenCalledWith(
          instance.props.productId
        )
      })
    })

    describe('afterAddToWishlist', () => {
      beforeEach(() => jest.clearAllMocks())

      it('should call `clearMovingProductToWishlist`', async () => {
        const { instance } = renderComponent({
          ...defaultProps,
        })
        expect(clearMovingProductToWishlist).toHaveBeenCalledTimes(0)
        await instance.afterAddToWishlist()
        expect(clearMovingProductToWishlist).toHaveBeenCalledTimes(1)
      })
      it('should call `afterAddToWishlist` then `clearMovingProductToWishlist`', async () => {
        const { instance } = renderComponent({
          ...defaultProps,
          afterAddToWishlist: jest.fn().mockReturnValue(Promise.resolve()),
        })
        expect(clearMovingProductToWishlist).toHaveBeenCalledTimes(0)
        expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(0)
        await instance.afterAddToWishlist()
        expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(1)
        expect(clearMovingProductToWishlist).toHaveBeenCalledTimes(1)
      })
      it('should call `clearMovingProductToWishlist` even if afterAddToWishlist fails', async () => {
        const { instance } = renderComponent({
          ...defaultProps,
          afterAddToWishlist: jest.fn().mockReturnValue(Promise.reject()),
        })
        expect(clearMovingProductToWishlist).toHaveBeenCalledTimes(0)
        expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(0)
        await instance.afterAddToWishlist()
        expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(1)
        expect(clearMovingProductToWishlist).toHaveBeenCalledTimes(1)
      })
      it('should render a qubit react wrapper with accurate id', () => {
        const { wrapper } = renderComponent(defaultProps)
        const qubitWrapper = wrapper.find(QubitReact)
        expect(qubitWrapper.props().id).toBe(
          'exp-349-wishlist-phrase-change-186709'
        )
        expect(qubitWrapper.props().renderAddToWishlistText).toBe(
          defaultProps.renderAddToWishlistText
        )
      })
    })
  })
})
