import toJson from 'enzyme-to-json'

import testComponentHelper from 'test/unit/helpers/test-component'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'

import MiniBagConfirm, { WrappedMiniBagConfirm } from '../MiniBagConfirm'

const noop = () => {}

describe('<MiniBagConfirm />', () => {
  const requiredProps = {
    showMiniBagConfirm: noop,
    openMiniBag: noop,
  }
  const products = [
    {
      name: 'TALL Black Leigh Jeans',
      unitPrice: '38.00',
      size: '14',
      inStock: true,
      lowStock: false,
      assets: [],
      productId: 29750936,
    },
    {
      name: 'Chain Belted Jacket',
      unitPrice: '65.00',
      size: '10',
      inStock: true,
      lowStock: false,
      assets: [],
      productId: 29752415,
    },
  ]
  const renderComponent = testComponentHelper(WrappedMiniBagConfirm)

  describe('@decorators', () => {
    describe('connect', () => {
      it('should order products based on the current product‘s `bundleProducts` order', () => {
        const store = mockStoreCreator({
          currentProduct: {
            bundleProducts: [
              {
                productId: 29752415,
              },
              {
                productId: 29750936,
              },
            ],
          },
          shoppingBag: {
            recentlyAdded: {
              products,
            },
          },
        })
        const renderComponent = testComponentHelper(MiniBagConfirm)
        const { wrapper } = renderComponent({ store })
        expect(wrapper.prop('products')).toEqual([
          {
            name: 'Chain Belted Jacket',
            unitPrice: '65.00',
            size: '10',
            inStock: true,
            lowStock: false,
            assets: [],
            productId: 29752415,
          },
          {
            name: 'TALL Black Leigh Jeans',
            unitPrice: '38.00',
            size: '14',
            inStock: true,
            lowStock: false,
            assets: [],
            productId: 29750936,
          },
        ])
      })

      it('should not order the products if there is no current product', () => {
        const store = mockStoreCreator({
          shoppingBag: {
            recentlyAdded: {
              products,
            },
          },
        })
        const renderComponent = testComponentHelper(MiniBagConfirm)
        const { wrapper } = renderComponent({ store })
        expect(wrapper.prop('products')).toEqual(products)
      })
    })
  })

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should add `is-visible` class if `isShown` prop is `true` and there are `products`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        isShown: true,
        products,
      })
      expect(wrapper.find('.MiniBagConfirm').hasClass('is-visible')).toBe(true)
    })

    it('should render `products` correctly', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        products,
        quantity: 2,
      })
      expect(toJson(wrapper.find('.MiniBagConfirm-products'))).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('on componentDidUpdate', () => {
      it('should call `showMiniBagConfirm` after 6 seconds if `isShown` property changes from `false` to `true`', () => {
        const setTimeoutMock = jest.fn(() => 12345)
        const showMiniBagConfirmMock = jest.fn()
        const { instance } = renderComponent({
          ...requiredProps,
          isShown: true,
          setTimeout: setTimeoutMock,
          showMiniBagConfirm: showMiniBagConfirmMock,
        })
        instance.componentDidUpdate({ isShown: false })
        expect(instance.timeoutID).toBe(12345)
        expect(setTimeoutMock.mock.calls[0][1]).toBe(6000)
        // called the supplied timeout callback
        setTimeoutMock.mock.calls[0][0]()
        expect(showMiniBagConfirmMock).toHaveBeenCalledWith(false)
        expect(instance.timeoutID).toBeUndefined()
      })
    })

    describe('on componentWillUnmount', () => {
      it('should clear timeout', () => {
        const clearTimeoutMock = jest.fn()
        const { instance } = renderComponent({
          ...requiredProps,
          clearTimeout: clearTimeoutMock,
        })
        instance.timeoutID = 12345
        instance.componentWillUnmount()
        expect(clearTimeoutMock).toHaveBeenCalledWith(12345)
      })
    })
  })

  describe('@events', () => {
    describe('on ‘Checkout Now’ button  click', () => {
      it('should stop event prapogation', () => {
        const redirectToMock = jest.fn()
        const stopPropagationMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
        })
        wrapper.find('.MiniBagConfirm-goToCheckout').prop('clickHandler')({
          stopPropagation: stopPropagationMock,
        })
        expect(stopPropagationMock).toHaveBeenCalled()
      })

      it('should call `showMiniBagConfirm` after `200` milliseconds (and store the timeout ID)', () => {
        const redirectToMock = jest.fn()
        const setTimeoutMock = jest.fn(() => 12345)
        const showMiniBagConfirmMock = jest.fn()
        const { wrapper, instance } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
          setTimeout: setTimeoutMock,
          showMiniBagConfirm: showMiniBagConfirmMock,
        })
        wrapper.find('.MiniBagConfirm-goToCheckout').prop('clickHandler')()
        expect(instance.timeoutID).toBe(12345)
        expect(setTimeoutMock.mock.calls[0][1]).toBe(200)
        // called the supplied timeout callback
        setTimeoutMock.mock.calls[0][0]()
        expect(showMiniBagConfirmMock).toHaveBeenCalledWith(false)
        expect(instance.timeoutID).toBeUndefined()
      })

      it('should redirect to `/checkout`', () => {
        const redirectToMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
        })
        wrapper.find('.MiniBagConfirm-goToCheckout').prop('clickHandler')()
        expect(redirectToMock).toHaveBeenCalledWith('/checkout')
      })
    })

    describe('on ‘View Bag’ button click', () => {
      it('should stop event propagation', () => {
        const redirectToMock = jest.fn()
        const stopPropagationMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
        })
        wrapper.find('.MiniBagConfirm-viewBag').prop('clickHandler')({
          stopPropagation: stopPropagationMock,
        })
        expect(stopPropagationMock).toHaveBeenCalled()
      })

      it('should call `showMiniBagConfirm` after `200` milliseconds (and store the timeout ID)', () => {
        const redirectToMock = jest.fn()
        const setTimeoutMock = jest.fn(() => 12345)
        const showMiniBagConfirmMock = jest.fn()
        const { wrapper, instance } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
          setTimeout: setTimeoutMock,
          showMiniBagConfirm: showMiniBagConfirmMock,
        })
        wrapper.find('.MiniBagConfirm-viewBag').prop('clickHandler')()
        expect(instance.timeoutID).toBe(12345)
        expect(setTimeoutMock.mock.calls[0][1]).toBe(200)
        // called the supplied timeout callback
        setTimeoutMock.mock.calls[0][0]()
        expect(showMiniBagConfirmMock).toHaveBeenCalledWith(false)
        expect(instance.timeoutID).toBeUndefined()
      })

      it('should call `openMiniBag`', () => {
        const redirectToMock = jest.fn()
        const openMiniBagMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
          openMiniBag: openMiniBagMock,
        })
        wrapper.find('.MiniBagConfirm-viewBag').prop('clickHandler')()
        expect(openMiniBagMock).toHaveBeenCalled()
      })
    })

    describe('on ‘Close’ button click', () => {
      it('should call `showMiniBagConfirm` after `200` milliseconds (and store the timeout ID)', () => {
        const redirectToMock = jest.fn()
        const setTimeoutMock = jest.fn(() => 12345)
        const showMiniBagConfirmMock = jest.fn()
        const { wrapper, instance } = renderComponent({
          ...requiredProps,
          redirectTo: redirectToMock,
          setTimeout: setTimeoutMock,
          showMiniBagConfirm: showMiniBagConfirmMock,
        })
        wrapper.find('.Modal-closeIcon').prop('onClick')()
        expect(instance.timeoutID).toBe(12345)
        expect(setTimeoutMock.mock.calls[0][1]).toBe(200)
        // called the supplied timeout callback
        setTimeoutMock.mock.calls[0][0]()
        expect(showMiniBagConfirmMock).toHaveBeenCalledWith(false)
        expect(instance.timeoutID).toBeUndefined()
      })
    })
  })
})
