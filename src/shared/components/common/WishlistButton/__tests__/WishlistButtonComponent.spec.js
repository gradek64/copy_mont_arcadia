import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'

import WishlistButtonComponent from '../WishlistButtonComponent'
import WishListIcon from '../../WishList/WishListIcon'

describe('<WishlistButtonComponent />', () => {
  const productId = 123456
  const defaultProps = {
    productId,
    isSelected: false,
    onClick: jest.fn(),
  }

  const renderComponent = testComponentHelper(WishlistButtonComponent)

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

    it('should render with plp modifier', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        modifier: 'plp',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render with pdp modifier', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        modifier: 'pdp',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render with quickview modifier', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        modifier: 'quickview',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render with minibag modifier', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        modifier: 'minibag',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render with isSelected=true', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        isSelected: true,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render with isAdding=true', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        isAdding: true,
      })
      expect(wrapper.find(WishListIcon).prop('isAdding')).toBe(true)
    })

    it('should render renderAddToWishlistText', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        isSelected: false,
        renderRemoveFromWishlistText: () => <span>Remove from wishlist</span>,
        renderAddToWishlistText: () => <span>Move to wishlist</span>,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render renderRemoveFromWishlistText', () => {
      const { getTree } = renderComponent({
        ...defaultProps,
        isSelected: true,
        renderRemoveFromWishlistText: () => <span>Remove from wishlist</span>,
        renderAddToWishlistText: () => <span>Move to wishlist</span>,
      })
      expect(getTree()).toMatchSnapshot()
    })

    describe('when `isSelected` is equal to false ', () => {
      describe('when renderAddToWishlistText is not undefined', () => {
        it('should display `Move to wishlist`', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            renderAddToWishlistText: () => <span>Move to wishlist</span>,
          })
          const textWrapper = wrapper.find('span').last()
          expect(textWrapper.text()).toEqual('Move to wishlist')
        })
      })

      describe('when renderAddToWishlistText is undefined', () => {
        it('should not display `Move to wishlist`', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })

          const span = wrapper.find('span')
          expect(span.text).not.toEqual('Move to wishlist')
          expect(span.length).toBe(1)
        })
      })
    })

    describe('when `isSelected` is equal to true ', () => {
      describe('when renderRemoveFromWishlistText is not undefined', () => {
        it('should display `Remove from wishlist`', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            isSelected: true,
            renderRemoveFromWishlistText: () => (
              <span>Remove from wishlist</span>
            ),
          })
          const textWrapper = wrapper.find('span').last()
          expect(textWrapper.text()).toEqual('Remove from wishlist')
        })
      })

      describe('when renderRemoveFromWishlistText is undefined', () => {
        it('should not display `Remove from wishlist`', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            isSelected: true,
          })

          const span = wrapper.find('span')
          expect(span.text).not.toEqual('Remove from wishlist')
          expect(span.length).toBe(1)
        })
      })
    })
  })

  describe('@events', () => {
    describe('on clicking the wishlist button', () => {
      it('should call the onClick callback', async () => {
        const { instance, wrapper } = renderComponent({
          ...defaultProps,
        })

        expect(instance.props.onClick).toHaveBeenCalledTimes(0)
        await wrapper.find('.WishlistButton').simulate('click')
        expect(instance.props.onClick).toHaveBeenCalledTimes(1)
      })
    })
  })
})
