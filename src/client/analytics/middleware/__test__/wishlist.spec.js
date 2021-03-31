import dataLayer from '../../../../shared/analytics/dataLayer'
import { addPostDispatchListeners } from '../analytics-middleware'
import wishlistConfig, {
  wishlistModalPageView,
  wishlistCloseAuthenticationModal,
  wishlistSuccessfulSignIn,
  wishlistUnsuccessfulSignIn,
  wishlistSuccessfulRegister,
  wishlistUnsuccessfulRegister,
  addToWishlist,
  removeFromWishlist,
  addToBagFromWishlist,
} from '../wishlist'

const mockState = {
  account: {
    user: {
      userTrackingId: 1234,
    },
  },
  config: {
    brandCode: 'ts',
  },
  forms: {
    login: {
      message: {
        message: 'some error',
      },
    },
    register: {
      message: {
        message: 'some error',
      },
    },
  },
  routing: {
    location: {
      pathname: '/some-path',
    },
  },
  viewport: {
    media: 'mobile',
  },
  products: {
    products: [
      {
        productId: '12345',
        lineNumber: 'TX456723U2',
        unitPrice: 20.0,
      },
    ],
  },
}
const mockStore = {
  getState: () => mockState,
}

dataLayer.push = jest.fn()
jest.mock('../analytics-middleware', () => ({
  addPostDispatchListeners: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('wishlist analytics', () => {
  describe('wishlist login modal and authentication', () => {
    it('captures wishlist login modal page view event', () => {
      const options = { modifier: 'plp' }
      const expectedEvent = {
        wishlist: {
          pageType: 'TS:Wish List Authentication',
          pageCategory: 'TS:Wish List',
          viewport: 'mobile',
          openedFrom: 'plp',
        },
      }
      wishlistModalPageView({ ...options }, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'wishlistModalPageView'
      )
    })

    it('captures wishlist login modal close click event', () => {
      const options = { modifier: 'plp' }
      const expectedEvent = {
        wishlist: {
          eventCategory: 'wish list',
          eventAction: 'click-close-modal',
          eventLabel: 'plp',
        },
      }
      wishlistCloseAuthenticationModal({ ...options }, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'wishlistCloseAuthenticationModal'
      )
    })

    it('captures wishlist login event success with user id', () => {
      const expectedEvent = {
        wishlist: {
          eventCategory: 'wish list',
          eventAction: 'successful-sign-in',
          eventLabel: '1234',
        },
      }
      wishlistSuccessfulSignIn({}, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'wishlistSuccessfulSignIn'
      )
    })

    it('captures wishlist login event failure with error', () => {
      const expectedEvent = {
        wishlist: {
          eventCategory: 'wish list',
          eventAction: 'unsuccessful-sign-in',
          eventLabel: 'some error',
        },
      }
      wishlistUnsuccessfulSignIn({}, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'wishlistUnsuccessfulSignIn'
      )
    })

    it('captures wishlist register event success with user id', () => {
      const expectedEvent = {
        wishlist: {
          eventCategory: 'wish list',
          eventAction: 'successful-register',
          eventLabel: '1234',
        },
      }
      wishlistSuccessfulRegister({}, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'wishlistSuccessfulRegister'
      )
    })

    it('captures wishlist register event failure with error', () => {
      const expectedEvent = {
        wishlist: {
          eventCategory: 'wish list',
          eventAction: 'unsuccessful-register',
          eventLabel: 'some error',
        },
      }
      wishlistUnsuccessfulRegister({}, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'wishlistUnsuccessfulRegister'
      )
    })
  })

  describe('wishlist page and actions', () => {
    it('captures `add to wishlist` event', () => {
      const options = {
        productId: '12345',
        modifier: 'plp',
        productDetails: {
          lineNumber: 'TX456723U2',
          price: 20.0,
        },
      }
      const expectedEvent = {
        wishlist: {
          addedFrom: 'plp',
          wlUrl: '/some-path',
          productId: '12345',
          lineNumber: 'TX456723U2',
          price: 20.0,
        },
      }
      addToWishlist({ ...options }, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'addToWishlist'
      )
    })

    it('captures `remove from wishlist` event', () => {
      const options = {
        productId: '12345',
        modifier: 'plp',
        productDetails: {
          lineNumber: 'TX456723U2',
          price: 20.0,
        },
      }
      const expectedEvent = {
        wishlist: {
          removedFrom: 'plp',
          wlUrl: '/some-path',
          productId: '12345',
          lineNumber: 'TX456723U2',
          price: 20.0,
        },
      }
      removeFromWishlist({ ...options }, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'removeFromWishlist'
      )
    })

    it('captures `add to bag from wishlist` event', () => {
      const options = {
        productId: 5389572,
        lineNumber: 'TX456723U2',
        price: 20.0,
      }
      const expectedEvent = {
        wishlist: {
          pageType: 'wishlist',
          wlUrl: '/some-path',
          ...options,
        },
      }
      addToBagFromWishlist({ ...options }, mockStore)
      expect(dataLayer.push).toHaveBeenCalledWith(
        expectedEvent,
        null,
        'addToBagFromWishlist'
      )
    })
  })

  describe('wishlist listener configuration', () => {
    it('should configure the listeners correctly', () => {
      wishlistConfig()
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_WISHLIST_MODAL_PAGE_VIEW',
        wishlistModalPageView
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_WISHLIST_MODAL_CLOSE',
        wishlistCloseAuthenticationModal
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_WISHLIST_LOGIN_SUCCESS',
        wishlistSuccessfulSignIn
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_WISHLIST_LOGIN_ERROR',
        wishlistUnsuccessfulSignIn
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_WISHLIST_REGISTER_SUCCESS',
        wishlistSuccessfulRegister
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_WISHLIST_REGISTER_ERROR',
        wishlistUnsuccessfulRegister
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_ADD_TO_WISHLIST',
        addToWishlist
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_REMOVE_FROM_WISHLIST',
        removeFromWishlist
      )
      expect(addPostDispatchListeners).toHaveBeenCalledWith(
        'GA_ADD_TO_BAG_FROM_WISHLIST',
        addToBagFromWishlist
      )
    })
  })
})
