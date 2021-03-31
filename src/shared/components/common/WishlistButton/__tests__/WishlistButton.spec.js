import React from 'react'
import { mount } from 'enzyme'
import testComponentHelper from 'test/unit/helpers/test-component'
import configureMockStore from 'test/unit/lib/configure-mock-store'

jest.mock('../../../../actions/common/wishlistActions', () => ({
  addToWishlist: jest.fn(() => () => Promise.resolve()),
  triggerWishlistLoginModal: jest.fn(() => () => {}),
}))
import {
  addToWishlist,
  triggerWishlistLoginModal,
} from '../../../../actions/common/wishlistActions'

import WishlistButton from '../WishlistButton'

describe('<WishlistButton />', () => {
  const modifier = 'pdp'
  const productId = 12345
  const isFromQuickView = false
  const defaultProps = {
    modifier,
    productId,
    addToWishlist: jest.fn(),
    triggerWishlistLoginModal: jest.fn(),
    removeProductFromWishlist: jest.fn(),
    isFromQuickView,
  }

  const renderComponent = testComponentHelper(WishlistButton.WrappedComponent)

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
  })

  describe('when the user is partially authenticated', () => {
    it('should allow adding to wishlist', () => {
      const store = configureMockStore({
        auth: {
          authentication: 'partial',
        },
      })

      const wrapper = mount(<WishlistButton />, {
        context: {
          store,
        },
      })

      wrapper
        .find('button.WishlistButton')
        .first()
        .simulate('click')

      expect(triggerWishlistLoginModal).not.toHaveBeenCalled()
      expect(addToWishlist).toHaveBeenCalled()
    })
  })
})
