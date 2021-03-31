import testComponentHelper from 'test/unit/helpers/test-component'

import WishlistLoginModal from '../WishlistLoginModal'
import Login from '../../Login/Login'
import Register from '../../Register/Register'

describe('<WishlistLoginModal/>', () => {
  const renderComponent = testComponentHelper(
    WishlistLoginModal.WrappedComponent
  )
  const initialProps = {
    brandName: 'topshop',
    relativePath: '/search/?q=red',
    addToWishlistAfterLogin: jest.fn(() => Promise.resolve()),
    closeModal: jest.fn(() => Promise.resolve()),
    clearModalChildren: jest.fn(() => Promise.resolve()),
    getPaginatedWishlist: jest.fn(() => Promise.resolve()),
    wishlistPageCloseModal: jest.fn(() => Promise.resolve()),
    showModal: jest.fn(() => Promise.resolve()),
    afterAddToWishlist: jest.fn(),
    isModalCancelled: true,
    captureWishlistEvent: jest.fn(),
  }

  describe('@Renders', () => {
    it('in its default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render <Login/> and <Register/> components', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Login).length).toBe(1)
      expect(wrapper.find(Register).length).toBe(1)
    })
  })
  describe('@lifecycle', () => {
    beforeEach(() => jest.clearAllMocks())

    describe('onComponentDidMount', () => {
      it('should capture modal page view', () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'plp',
        })
        instance.componentDidMount()
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
          'GA_WISHLIST_MODAL_PAGE_VIEW',
          { modifier: 'plp' }
        )
      })
    })
    describe('componentWillUnmount', () => {
      beforeEach(() => jest.clearAllMocks())

      it('should not capture event if wishlist not cancelled by user', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isModalCancelled: false,
        })
        instance.componentWillUnmount()
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledTimes(0)
      })

      it('should capture modal close by user', () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'plp',
        })
        instance.componentWillUnmount()
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
          'GA_WISHLIST_MODAL_CLOSE',
          { modifier: 'plp' }
        )
      })

      it('should invoke onCancelLogin callback', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onCancelLogin: jest.fn(),
        })
        expect(instance.props.onCancelLogin).toHaveBeenCalledTimes(0)
        instance.componentWillUnmount()
        expect(instance.props.onCancelLogin).toHaveBeenCalledTimes(1)
      })

      it('should not invoke onCancelLogin callback if modal not cancelled by user', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isModalCancelled: false,
          onCancelLogin: jest.fn(),
        })
        expect(instance.props.onCancelLogin).toHaveBeenCalledTimes(0)
        instance.componentWillUnmount()
        expect(instance.props.onCancelLogin).toHaveBeenCalledTimes(0)
      })
    })
  })
  describe('@Events', () => {
    describe('On success callback', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })
      it('should capture wishlist modal login success', () => {
        const { instance } = renderComponent(initialProps)
        instance.handleSuccess('login')
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
          'GA_WISHLIST_LOGIN_SUCCESS'
        )
      })
      it('should capture wishlist modal register success', () => {
        const { instance } = renderComponent(initialProps)
        instance.handleSuccess('register')
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
          'GA_WISHLIST_REGISTER_SUCCESS'
        )
      })
      it('clear and close modal if no modifier passed', async () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on plp', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'plp',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.addToWishlistAfterLogin).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on pdp', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'pdp',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.addToWishlistAfterLogin).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on quickview', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'quickview',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on plp', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'plp',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.addToWishlistAfterLogin).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on pdp', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'pdp',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.addToWishlistAfterLogin).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on minibag', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'minibag',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.addToWishlistAfterLogin).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, add to wishlist if on quickview', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'quickview',
        })
        expect(instance.props.addToWishlistAfterLogin).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.addToWishlistAfterLogin).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
      it('clear and close modal, fetch wishlist items if on wishlist page', async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'wishlist',
        })
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        expect(instance.props.getPaginatedWishlist).not.toHaveBeenCalled()
        await instance.handleSuccess('login')
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
        expect(instance.props.getPaginatedWishlist).toHaveBeenCalledTimes(1)
      })
      it("should call wishlist page close modal if logged in from the wishlist page'", async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'wishlist',
        })
        instance.wishlistPageHandler = jest.fn(() => Promise.resolve())
        expect(instance.wishlistPageHandler).not.toHaveBeenCalled()
        await instance.handleSuccess()
        expect(instance.wishlistPageHandler).toHaveBeenCalledTimes(1)
      })
      it("should call 'afterAddToWishlist' if provided", async () => {
        const { instance } = renderComponent({
          ...initialProps,
          modifier: 'minibag',
        })

        expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(0)
        await instance.handleSuccess()
        expect(instance.props.afterAddToWishlist).toHaveBeenCalledTimes(1)
      })
    })
    describe('On error callback', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })
      it('should capture wishlist modal login error', () => {
        const { instance } = renderComponent(initialProps)
        instance.handleError('login')
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
          'GA_WISHLIST_LOGIN_ERROR'
        )
      })
      it('should capture wishlist modal register error', () => {
        const { instance } = renderComponent(initialProps)
        instance.handleError('register')
        expect(instance.props.captureWishlistEvent).toHaveBeenCalledWith(
          'GA_WISHLIST_REGISTER_ERROR'
        )
      })
    })
  })
})
