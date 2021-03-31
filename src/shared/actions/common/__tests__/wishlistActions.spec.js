import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  addToWishlistSuccess,
  addToWishlistFailure,
  addToWishlist,
  storeProductId,
  deleteStoredProductId,
  addToWishlistAfterLogin,
  createWishlistSuccess,
  createWishlistFailure,
  createDefaultWishlist,
  getAllWishlistsSuccess,
  getAllWishlistsFailure,
  getAllWishlists,
  getWishlistSuccess,
  getPaginatedWishlistSuccess,
  getWishlistFailure,
  getWishlist,
  getPaginatedWishlist,
  getDefaultWishlist,
  removeProductFromWishlist,
  triggerWishlistLoginModal,
  clearWishlist,
  captureWishlistEvent,
  setMovingProductToWishlist,
  clearMovingProductToWishlist,
} from '../wishlistActions'
import { get, post, del } from '../../../lib/api-service'
import {
  getDefaultWishlistId,
  getWishlistedItem,
  getWishlistItemCount,
  isProductAddedToWishlist,
} from '../../../selectors/wishlistSelectors'
import { showModal, showInfoModal } from '../modalActions'
import { isMobile, getWindowWidth } from '../../../selectors/viewportSelectors'

// mocks
jest.mock('../../../selectors/wishlistSelectors')

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
  post: jest.fn(),
  del: jest.fn(),
}))

jest.mock('../modalActions', () => ({
  showModal: jest.fn().mockReturnValue({
    type: 'SHOW_MODAL_THUNK_MOCK',
  }),
  showInfoModal: jest.fn(),
}))

jest.mock('../../../selectors/viewportSelectors', () => ({
  isMobile: jest.fn(),
  getWindowWidth: jest.fn(),
}))

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Wishlist Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getDefaultWishlistId.mockReturnValue(12503)
    getWishlistedItem.mockReturnValue({})
    getWishlistItemCount.mockReturnValue(10)
  })

  const productId = 29000912

  const mockDefaultWishlist = {
    name: 'default',
    giftListId: 12503,
    type: 'public',
    default: 'Yes',
  }

  const mockWishlist = {
    ...mockDefaultWishlist,
    productList: [
      { productId: 31308633, giftListItemId: 39303433 },
      { productId: 31308769, giftListItemId: 39303490 },
    ],
  }

  const mockPaginatedWishlist = {
    ...mockDefaultWishlist,
    itemDetails: [{ parentProductId: productId.toString() }],
  }

  describe(addToWishlistSuccess.name, () => {
    it('returns ADD_TO_WISHLIST_SUCCESS action creator', () => {
      expect(addToWishlistSuccess({})).toEqual({
        type: 'ADD_TO_WISHLIST_SUCCESS',
        wishlist: {},
      })
    })
  })

  describe(addToWishlistFailure.name, () => {
    it('returns ADD_TO_WISHLIST_FAILURE action creator', () => {
      expect(addToWishlistFailure()).toEqual({
        type: 'ADD_TO_WISHLIST_FAILURE',
      })
    })
  })

  describe(storeProductId.name, () => {
    it('should trigger an action to store the productId', () => {
      expect(storeProductId(productId)).toEqual({
        type: 'WISHLIST_STORE_PRODUCT_ID',
        productId,
      })
    })
  })

  describe(deleteStoredProductId.name, () => {
    it('should trigger the action that deletes the stored productId', () => {
      expect(deleteStoredProductId()).toEqual({
        type: 'WISHLIST_DELETE_STORED_PRODUCT_ID',
      })
    })
  })

  describe(setMovingProductToWishlist.name, () => {
    it('should trigger the action that stores productId being moved to wishlist', () => {
      expect(setMovingProductToWishlist(12345)).toEqual({
        type: 'SET_MOVING_PRODUCT_TO_WISHLIST',
        productId: 12345,
      })
    })
  })

  describe(clearMovingProductToWishlist.name, () => {
    it('should trigger the action that clears productId being moved to wishlist', () => {
      expect(clearMovingProductToWishlist()).toEqual({
        type: 'CLEAR_MOVING_PRODUCT_TO_WISHLIST',
      })
    })
  })

  describe(addToWishlist.name, () => {
    it('triggers addToWishlistSuccess action on success', (done) => {
      post.mockImplementationOnce(() => {
        const p = new Promise((resolve) =>
          resolve({
            body: mockWishlist,
          })
        )
        p.type = 'ADD_TO_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [
        { type: 'ADD_TO_WISHLIST_SUCCESS', wishlist: mockWishlist },
      ]

      const store = mockStore()
      store.dispatch(addToWishlist(productId)).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
        done()
      })
    })
    it('dispatches addToWishlist analytics action on success', (done) => {
      const modifier = 'pdp'
      post.mockImplementationOnce(() => {
        const p = new Promise((resolve) =>
          resolve({
            body: mockWishlist,
          })
        )
        p.type = 'ADD_TO_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [
        { type: 'GA_ADD_TO_WISHLIST', productId, modifier },
      ]

      const store = mockStore()
      store.dispatch(addToWishlist(productId, modifier)).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
        done()
      })
    })
    it('does not dispatch addToWishlist analytics action on failure', (done) => {
      const modifier = 'pdp'
      post.mockImplementationOnce(() => {
        const p = new Promise((resolve, reject) => reject())
        p.type = 'ADD_TO_WISHLIST_THUNK_MOCK'
        return p
      })

      const store = mockStore()
      store
        .dispatch(addToWishlist(productId, modifier))
        .then(() => done('expected promise to reject'))
        .catch(() => {
          const analyticsAction = store
            .getActions()
            .find((a) => a.type === 'GA_ADD_TO_WISHLIST')
          expect(analyticsAction).not.toBeDefined()
          done()
        })
    })

    it('triggers addToWishlistFailure action on failure', (done) => {
      post.mockImplementationOnce(() => {
        const p = new Promise((resolve, reject) =>
          reject({
            body: {
              message: 'Error message',
            },
          })
        )
        p.type = 'ADD_TO_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [{ type: 'ADD_TO_WISHLIST_FAILURE' }]

      const store = mockStore()
      store
        .dispatch(addToWishlist(productId))
        .then(() => done('expected promise to reject'))
        .catch(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          done()
        })
    })

    it('dispatches the `showInfoModal` action when the wishlist is full', (done) => {
      getWishlistItemCount.mockReturnValueOnce(250)
      const showInfoModalMock = () => {
        const p = new Promise((resolve) =>
          resolve({
            body: mockWishlist,
          })
        )
        p.type = 'SHOW_INFO_MODAL'
        return p
      }
      showInfoModal.mockImplementationOnce(showInfoModalMock)
      const expectedActions = [
        { type: 'ADD_TO_WISHLIST_FAILURE' },
        showInfoModalMock(),
      ]

      const store = mockStore()
      store
        .dispatch(addToWishlist(productId))
        .then(() => done('expected promise to reject'))
        .catch(() => {
          expect(showInfoModal).toHaveBeenCalled()
          expect(store.getActions()).toEqual(expectedActions)
          done()
        })
        .catch(() => done())
    })
  })

  describe(triggerWishlistLoginModal.name, () => {
    const MockModal = () => <div>Test modal</div>
    beforeEach(() => jest.clearAllMocks())
    it('should trigger saving the productId and showing the login modal', () => {
      isMobile.mockReturnValueOnce(true)
      getWindowWidth.mockReturnValueOnce(100)

      const expectedActions = [
        {
          type: 'WISHLIST_STORE_PRODUCT_ID',
          productId,
        },
        {
          type: 'SHOW_MODAL_THUNK_MOCK',
        },
      ]
      const store = mockStore({})
      store.dispatch(triggerWishlistLoginModal(productId, MockModal))
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('should not trigger saving the productId and showing the login modal', () => {
      isMobile.mockReturnValueOnce(true)
      getWindowWidth.mockReturnValueOnce(100)
      showModal.mockReturnValue({
        type: 'SHOW_MODAL_THUNK_MOCK',
      })

      const expectedActions = [
        {
          type: 'SHOW_MODAL_THUNK_MOCK',
        },
      ]
      const store = mockStore({})
      store.dispatch(triggerWishlistLoginModal(null, MockModal))
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('should dispatch the modal action with rollFull when viewport is mobile', () => {
      isMobile.mockReturnValueOnce(true)
      getWindowWidth.mockReturnValueOnce(100)
      const store = mockStore({})
      store.dispatch(triggerWishlistLoginModal(productId, MockModal))
      expect(showModal).toHaveBeenCalledWith(<MockModal />, {
        mode: 'rollFull',
      })
    })

    it('should dispatch the modal action with wishlistLogin when viewport is desktop', () => {
      isMobile.mockReturnValueOnce(false)
      getWindowWidth.mockReturnValueOnce(100)
      const store = mockStore({})
      store.dispatch(triggerWishlistLoginModal(productId, MockModal))
      expect(showModal).toHaveBeenCalledWith(<MockModal />, {
        mode: 'wishlistLogin',
      })
    })
    it('should dispatch the modal action with the provided modifier and callback', () => {
      isMobile.mockReturnValueOnce(false)
      getWindowWidth.mockReturnValueOnce(100)
      const store = mockStore({})
      const modifier = 'plp'
      const afterAddToWishlist = jest.fn()
      store.dispatch(
        triggerWishlistLoginModal(
          productId,
          MockModal,
          modifier,
          afterAddToWishlist
        )
      )
      expect(showModal).toHaveBeenCalledWith(
        <MockModal
          modifier={modifier}
          afterAddToWishlist={afterAddToWishlist}
        />,
        {
          mode: 'wishlistLogin',
        }
      )
    })
  })

  describe(addToWishlistAfterLogin.name, () => {
    describe('item is not in the wishlist', () => {
      it('should add product to wishlist and then delete pendingProductId', async () => {
        const modifier = 'pdp'
        const pendingProductId = 123456
        const productDetails = {
          lineNumber: 'TX345OP',
          price: 20.0,
        }
        const store = mockStore({
          wishlist: {
            pendingProductId,
          },
        })

        const postMock = Promise.resolve({ body: mockWishlist })
        postMock.type = 'WISHLIST_MOCK'
        post.mockReturnValueOnce(postMock)

        isProductAddedToWishlist.mockReturnValueOnce(false)

        const expectedActions = [
          {
            type: 'WISHLIST_DELETE_STORED_PRODUCT_ID',
          },
          {
            type: 'ADD_TO_WISHLIST_SUCCESS',
            wishlist: mockWishlist,
          },
          {
            type: 'GA_ADD_TO_WISHLIST',
            productId: pendingProductId,
            modifier,
            productDetails,
          },
        ]

        await store.dispatch(
          addToWishlistAfterLogin(pendingProductId, modifier, productDetails)
        )
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('item is in the wishlist', () => {
      it('should only trigger deleting the saved productId', async () => {
        const modifier = 'minibag'
        const pendingProductId = 123456
        const store = mockStore({
          wishlist: {
            pendingProductId,
            productList: [{ productId: '123456' }],
          },
        })

        isProductAddedToWishlist.mockReturnValueOnce(true)

        const expectedActions = [
          {
            type: 'WISHLIST_DELETE_STORED_PRODUCT_ID',
          },
          {
            type: 'GA_ADD_TO_WISHLIST',
            productId: pendingProductId,
            modifier,
          },
        ]

        await store.dispatch(
          addToWishlistAfterLogin(pendingProductId, modifier)
        )
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })
  })

  describe(createWishlistSuccess.name, () => {
    it('returns CREATE_WISHLIST_SUCCESS action creator', () => {
      expect(createWishlistSuccess({})).toEqual({
        type: 'CREATE_WISHLIST_SUCCESS',
        wishlist: {},
      })
    })
  })

  describe(createWishlistFailure.name, () => {
    it('returns CREATE_WISHLIST_FAILURE action creator', () => {
      expect(createWishlistFailure()).toEqual({
        type: 'CREATE_WISHLIST_FAILURE',
      })
    })
  })

  describe(createDefaultWishlist.name, () => {
    beforeEach(() => jest.clearAllMocks())
    it('triggers createWishlistSuccess action on success', (done) => {
      const mockWishlist = {
        giftListName: 'default',
        giftListId: 12503,
      }

      post.mockImplementationOnce(() => {
        const p = new Promise((resolve) =>
          resolve({
            body: mockWishlist,
          })
        )
        p.type = 'CREATE_DEFAULT_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [
        { type: 'CREATE_WISHLIST_SUCCESS', wishlist: mockWishlist },
      ]

      const store = mockStore({})
      store.dispatch(createDefaultWishlist()).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
        done()
      })
    })
    it('triggers createWishlistFailure action on failure', (done) => {
      post.mockImplementationOnce(() => {
        const p = new Promise((resolve, reject) =>
          reject({
            body: {
              message: 'Error message',
            },
          })
        )
        p.type = 'CREATE_DEFAULT_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [{ type: 'CREATE_WISHLIST_FAILURE' }]

      const store = mockStore({})
      store.dispatch(createDefaultWishlist()).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
        done()
      })
    })
  })

  describe(getAllWishlistsSuccess.name, () => {
    it('returns GET_ALL_WISHLISTS_SUCCESS action creator', () => {
      expect(getAllWishlistsSuccess({})).toEqual({
        type: 'GET_ALL_WISHLISTS_SUCCESS',
        payload: {},
      })
    })
  })

  describe(getAllWishlistsFailure.name, () => {
    it('returns GET_ALL_WISHLISTS_FAILURE action creator', () => {
      expect(getAllWishlistsFailure()).toEqual({
        type: 'GET_ALL_WISHLISTS_FAILURE',
      })
    })
  })

  describe(getAllWishlists.name, () => {
    beforeEach(() => jest.clearAllMocks())
    it('triggers getAllWishlistsSuccess action on success', (done) => {
      const wishlists = [
        { name: 'default', giftListId: 12345 },
        { name: 'summer', giftListId: 67891 },
      ]

      get.mockImplementationOnce(() => {
        const p = new Promise((resolve) =>
          resolve({
            body: wishlists,
          })
        )
        p.type = 'GET_ALL_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [
        { type: 'GET_ALL_WISHLISTS_SUCCESS', payload: wishlists },
      ]

      const store = mockStore({})
      expect.assertions(1)
      store.dispatch(getAllWishlists()).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
        done()
      })
    })

    it('triggers getAllWishlistsFailure action on failure', (done) => {
      get.mockImplementationOnce(() => {
        const p = new Promise((resolve, reject) =>
          reject({
            body: {
              message: 'Error message',
            },
          })
        )
        p.type = 'GET_ALL_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [{ type: 'GET_ALL_WISHLISTS_FAILURE' }]

      const store = mockStore({})
      store
        .dispatch(getAllWishlists())
        .then(() => done('expected promise to reject'))
        .catch(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          done()
        })
    })
  })

  describe(getWishlistSuccess.name, () => {
    it('returns GET_WISHLIST_SUCCESS action creator', () => {
      expect(getWishlistSuccess({})).toEqual({
        type: 'GET_WISHLIST_SUCCESS',
        wishlist: {},
      })
    })
  })

  describe(getPaginatedWishlistSuccess.name, () => {
    it('returns GET_PAGINATED_WISHLIST_SUCCESS action creator', () => {
      const wishlist = { stuffIWant: ["big 'ol hat"] }
      expect(getPaginatedWishlistSuccess(wishlist)).toEqual({
        type: 'GET_PAGINATED_WISHLIST_SUCCESS',
        wishlist,
      })
    })
  })

  describe(getWishlistFailure.name, () => {
    it('returns GET_WISHLIST_FAILURE action creator', () => {
      expect(getWishlistFailure()).toEqual({
        type: 'GET_WISHLIST_FAILURE',
      })
    })
  })

  describe(getWishlist.name, () => {
    beforeEach(() => jest.clearAllMocks())
    it('triggers getWishlistSuccess action on success', (done) => {
      const getWishlistMock = () => {
        const p = new Promise((resolve) =>
          resolve({
            body: mockWishlist,
          })
        )
        p.type = 'GET_WISHLIST_THUNK_MOCK'
        return p
      }
      get.mockImplementationOnce(getWishlistMock)

      const expectedActions = [
        getWishlistMock(),
        { type: 'GET_WISHLIST_SUCCESS', wishlist: mockWishlist },
      ]

      const store = mockStore({})
      store.dispatch(getWishlist(12345)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
        done()
      })
    })

    it('triggers getWishlistFailure action on failure', (done) => {
      get.mockImplementationOnce(() => {
        const p = new Promise((resolve, reject) =>
          reject({
            body: {
              message: 'Error message',
            },
          })
        )
        p.type = 'GET_WISHLIST_THUNK_MOCK'
        return p
      })

      const expectedAction = [{ type: 'GET_WISHLIST_FAILURE' }]

      const store = mockStore({})
      store.dispatch(getWishlist()).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
        done()
      })
    })
  })

  describe(getPaginatedWishlist.name, () => {
    describe('when there is no default wishlist in the store', () => {
      it('should dispatch getWishlistFailure', () => {
        getDefaultWishlistId.mockReturnValueOnce(undefined)

        const expectedActions = [{ type: 'GET_WISHLIST_FAILURE' }]

        const store = mockStore({})
        store.dispatch(getPaginatedWishlist())
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    describe('when there a populated default wishlist in the store', () => {
      beforeEach(() => jest.clearAllMocks())

      it('should trigger getPaginatedWishlistSuccess action on success', async () => {
        const getPaginatedWishlistMock = () => {
          const p = Promise.resolve({
            body: mockPaginatedWishlist,
          })
          p.type = 'GET_WISHLIST_THUNK_MOCK'
          return p
        }
        get.mockImplementationOnce(getPaginatedWishlistMock)

        const expectedActions = [
          { type: 'START_WISHLIST_LOADING_DETAILS' },
          expect.objectContaining({ type: 'GET_WISHLIST_THUNK_MOCK' }),
          { type: 'END_WISHLIST_LOADING_DETAILS' },
          {
            type: 'GET_PAGINATED_WISHLIST_SUCCESS',
            wishlist: mockPaginatedWishlist,
          },
        ]

        const store = mockStore({})
        await store.dispatch(getPaginatedWishlist())
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('triggers getWishlistFailure action on failure', async () => {
        const getPaginatedWishlistMock = () => {
          const p = Promise.reject({
            body: {
              message: 'Error message',
            },
          })
          p.type = 'GET_WISHLIST_THUNK_MOCK'
          return p
        }

        get.mockImplementationOnce(getPaginatedWishlistMock)

        const expectedActions = [
          { type: 'START_WISHLIST_LOADING_DETAILS' },
          expect.objectContaining({ type: 'GET_WISHLIST_THUNK_MOCK' }),
          { type: 'END_WISHLIST_LOADING_DETAILS' },
          { type: 'GET_WISHLIST_FAILURE' },
        ]

        const store = mockStore({})
        await store.dispatch(getPaginatedWishlist())
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe(getDefaultWishlist.name, () => {
    describe('when wishlist feature flag is disabled', () => {
      it('does nothing', () => {
        const store = mockStore({})
        expect(store.dispatch(getDefaultWishlist())).toBeNull()
      })
    })
    describe('when wishlist feature flag is enabled but user is not authenticated', () => {
      it('does nothing', () => {
        const store = mockStore({
          auth: {
            authentication: false,
          },
          features: {
            status: {
              FEATURE_WISHLIST: true,
            },
          },
        })
        expect(store.dispatch(getDefaultWishlist())).toBeNull()
      })
    })
    describe('when user is authenticated and wishlist feature is enabled', () => {
      beforeEach(() => jest.clearAllMocks())
      const userAuthStore = {
        auth: {
          authentication: 'full',
        },
        features: {
          status: {
            FEATURE_WISHLIST: true,
          },
        },
      }
      it('fetches default wishlist', (done) => {
        // 1st get mock - getAllWishlists
        const getAllWishlistsMock = () => {
          const p = new Promise((resolve) =>
            resolve({
              body: [
                {
                  name: 'default',
                  giftListId: 12503,
                  default: 'Yes',
                },
              ],
            })
          )
          p.type = 'GET_ALL_WISHLISTS_THUNK_MOCK'
          return p
        }
        get.mockImplementationOnce(getAllWishlistsMock)

        // 2nd get mock - getWishlist
        const getWishlistMock = () => {
          const p = new Promise((resolve) =>
            resolve({
              body: mockWishlist,
            })
          )
          p.type = 'GET_WISHLIST_THUNK_MOCK'
          return p
        }
        get.mockImplementationOnce(getWishlistMock)

        const expectedActions = [
          getAllWishlistsMock(),
          {
            type: 'GET_ALL_WISHLISTS_SUCCESS',
            payload: [{ giftListId: 12503, name: 'default', default: 'Yes' }],
          },
          getWishlistMock(),
          { type: 'GET_WISHLIST_SUCCESS', wishlist: mockWishlist },
        ]

        const store = mockStore(userAuthStore)
        store.dispatch(getDefaultWishlist()).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
          done()
        })
      })

      it('creates default wishlist if user does not have one previously', (done) => {
        // get request mock - getAllWishlists
        get.mockImplementationOnce(() => {
          const p = new Promise((resolve) =>
            resolve({
              body: [],
            })
          )
          p.type = 'GET_ALL_WISHLISTS_THUNK_MOCK'
          return p
        })

        // post mock - createDefaultWishlist
        post.mockImplementationOnce(() => {
          const p = new Promise((resolve) =>
            resolve({
              body: mockWishlist,
            })
          )
          p.type = 'CREATE_DEFAULT_WISHLIST_THUNK_MOCK'
          return p
        })

        const expectedActions = [
          { type: 'GET_ALL_WISHLISTS_SUCCESS', payload: [] },
          { type: 'CREATE_WISHLIST_SUCCESS', wishlist: mockWishlist },
        ]

        const store = mockStore(userAuthStore)
        store.dispatch(getDefaultWishlist()).then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
          done()
        })
      })

      it('triggers getWishlistFailure action on failure', (done) => {
        get.mockImplementationOnce(() => {
          const p = new Promise((resolve, reject) =>
            reject({
              body: {
                message: 'Error message',
              },
            })
          )
          p.type = 'GET_ALL_WISHLISTS_THUNK_MOCK'
          return p
        })

        const expectedActions = [
          { type: 'GET_ALL_WISHLISTS_FAILURE' },
          { type: 'GET_WISHLIST_FAILURE' },
        ]

        const store = mockStore(userAuthStore)
        store.dispatch(getDefaultWishlist()).then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
          done()
        })
      })
    })
  })

  describe(removeProductFromWishlist.name, () => {
    const wishlist = {
      giftListId: 12345,
      productList: [
        {
          productId: 5001,
          giftListItemId: 12345,
        },
      ],
    }
    it('successfully remove an item from the wishlist', async () => {
      del.mockImplementation(() => {
        const p = new Promise((resolve) =>
          resolve({
            statusCode: 200,
          })
        )
        p.type = 'removeWishlist_THUNK_MOCK'
        return p
      })
      getWishlistedItem.mockReturnValueOnce({
        productId: 5001,
        giftListItemId: 12345,
      })

      const expectedActions = [
        { type: 'REMOVE_ITEM_FROM_WISHLIST', productId: 5001 },
      ]

      const store = mockStore()
      await store.dispatch(
        removeProductFromWishlist({
          productId: 5001,
        })
      )
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('handles failure when wishlistItemId is not found in the wishlist', () => {
      const expectedAction = [{ type: 'REMOVE_WISHLIST_FAILURE' }]

      const store = mockStore({
        wishlist: {
          productList: [],
        },
      })
      store.dispatch(
        removeProductFromWishlist({
          productId: 5001,
        })
      )
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
      expect(del).not.toHaveBeenCalled()
    })

    it('handles failure to remove an item from the wishlist with a successful resolution of the http request', async () => {
      del.mockImplementation(() => {
        const p = new Promise((resolve) =>
          resolve({
            statusCode: 500,
          })
        )
        p.type = 'removeWishlist_THUNK_MOCK'
        return p
      })
      getWishlistedItem.mockReturnValueOnce({
        productId: 5001,
        giftListItemId: 12345,
      })

      const expectedAction = [{ type: 'REMOVE_WISHLIST_FAILURE' }]

      const store = mockStore({ wishlist })
      await store.dispatch(
        removeProductFromWishlist({
          productId: 5001,
        })
      )
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('handles a rejection of the http request to remove an item from the wishlist', (done) => {
      del.mockImplementation(() => {
        const p = new Promise((resolve, reject) => reject())
        p.type = 'removeWishlist_THUNK_MOCK'
        return p
      })
      getWishlistedItem.mockReturnValueOnce({
        productId: 5001,
        giftListItemId: 12345,
      })

      const expectedAction = [{ type: 'REMOVE_WISHLIST_FAILURE' }]

      const store = mockStore({ wishlist })
      store
        .dispatch(
          removeProductFromWishlist({
            productId: 5001,
          })
        )
        .then(() => done('expected promise to reject'))
        .catch(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          done()
        })
    })
    it('dispatches removeFromWishlist analytics action on success', async () => {
      const modifier = 'pdp'
      const productId = 5001
      del.mockImplementationOnce(() => {
        const p = new Promise((resolve) =>
          resolve({
            statusCode: 200,
          })
        )
        p.type = 'removeWishlist_THUNK_MOCK'
        return p
      })
      getWishlistedItem.mockReturnValueOnce({
        productId,
        giftListItemId: 12345,
      })

      const expectedAction = [
        { type: 'GA_REMOVE_FROM_WISHLIST', productId, modifier },
      ]

      const store = mockStore()
      await store.dispatch(
        removeProductFromWishlist({ productId, modifier, reportToGA: true })
      )
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })
    it('does not dispatch removeFromWishlist analytics action when reportToGa is falsy', async () => {
      const modifier = 'pdp'
      const productId = 5001
      del.mockImplementationOnce(() => {
        const p = new Promise((resolve) =>
          resolve({
            statusCode: 200,
          })
        )
        p.type = 'removeWishlist_THUNK_MOCK'
        return p
      })
      getWishlistedItem.mockReturnValueOnce({
        productId,
        giftListItemId: 12345,
      })

      const store = mockStore()
      await store.dispatch(removeProductFromWishlist({ productId, modifier }))
      const analyticsAction = store
        .getActions()
        .find((a) => a.type === 'GA_REMOVE_FROM_WISHLIST')
      expect(analyticsAction).not.toBeDefined()
    })
    it('does not dispatch removeFromWishlist analytics action on failure', (done) => {
      const modifier = 'pdp'
      const productId = 5001
      del.mockImplementationOnce(() => {
        const p = new Promise((resolve, reject) => reject())
        p.type = 'removeWishlist_THUNK_MOCK'
        return p
      })
      getWishlistedItem.mockReturnValueOnce({
        productId,
        giftListItemId: 12345,
      })

      const store = mockStore()
      store
        .dispatch(removeProductFromWishlist(productId, modifier))
        .then(() => done('should have failed'))
        .catch(() => {
          const analyticsAction = store
            .getActions()
            .find((a) => a.type === 'GA_REMOVE_FROM_WISHLIST')
          expect(analyticsAction).not.toBeDefined()
          done()
        })
    })
  })

  describe(clearWishlist.name, () => {
    it('should return the CLEAR_WISHLIST action creator', () => {
      expect(clearWishlist()).toEqual({
        type: 'CLEAR_WISHLIST',
      })
    })
  })

  describe(captureWishlistEvent.name, () => {
    it('should dispatch the provided action with payload to capture wishlist event analytics', () => {
      const type = 'GA_ADD_TO_WISHLIST'
      const modifier = 'plp'
      const productId = 1234
      const store = mockStore()
      store.dispatch(captureWishlistEvent(type, { productId, modifier }))

      expect(store.getActions()).toEqual([
        {
          type: 'GA_ADD_TO_WISHLIST',
          modifier: 'plp',
          productId: 1234,
        },
      ])
    })
  })
})
