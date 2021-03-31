import testReducer from '../wishlistReducer'

describe('Wishlist Reducer', () => {
  const initialState = {
    itemDetails: null,
  }

  describe('ADD_TO_WISHLIST_SUCCESS', () => {
    it('should set wishlist', () => {
      const mockWishlist = {
        name: 'default',
        giftListId: 12503,
        type: 'public',
        default: 'Yes',
        itemDetails: null,
      }

      expect(
        testReducer(initialState, {
          type: 'ADD_TO_WISHLIST_SUCCESS',
          wishlist: mockWishlist,
        })
      ).toEqual(mockWishlist)
    })
  })

  describe('GET_WISHLIST_SUCCESS', () => {
    it('should set wishlist', () => {
      const mockWishlist = {
        name: 'default',
        giftListId: 12503,
        type: 'public',
        default: 'Yes',
        itemDetails: [],
      }

      expect(
        testReducer(initialState, {
          type: 'GET_WISHLIST_SUCCESS',
          wishlist: mockWishlist,
        })
      ).toEqual(mockWishlist)
    })
  })

  describe('GET_PAGINATED_WISHLIST_SUCCESS', () => {
    it('should merge the initial itemDetails with the new ones', () => {
      const initialState = {
        giftListId: 54007,
        itemDetails: [
          { parentProductId: 1 },
          { parentProductId: 2 },
          { parentProductId: 3 },
        ],
        productList: [
          { productId: 1 },
          { productId: 6 },
          { productId: 2 },
          { productId: 4 },
          { productId: 3 },
          { productId: 5 },
        ],
        name: 'default',
        noOfItemsInList: 100,
        pageNo: 1,
        pageSize: 20,
        type: 'public',
      }
      const nextPageData = {
        giftListId: 54007,
        itemDetails: [
          { parentProductId: 4 },
          { parentProductId: 5 },
          { parentProductId: 6 },
        ],
        name: 'default',
        noOfItemsInList: 100,
        pageNo: 2,
        pageSize: 20,
        type: 'public',
      }
      expect(
        testReducer(initialState, {
          type: 'GET_PAGINATED_WISHLIST_SUCCESS',
          wishlist: nextPageData,
        })
      ).toEqual({
        giftListId: 54007,
        itemDetails: [
          { parentProductId: 1 },
          { parentProductId: 6 },
          { parentProductId: 2 },
          { parentProductId: 4 },
          { parentProductId: 3 },
          { parentProductId: 5 },
        ],
        productList: [
          { productId: 1 },
          { productId: 6 },
          { productId: 2 },
          { productId: 4 },
          { productId: 3 },
          { productId: 5 },
        ],
        name: 'default',
        noOfItemsInList: 100,
        pageNo: 2,
        pageSize: 20,
        type: 'public',
      })
    })
  })

  describe('WISHLIST_STORE_PRODUCT_ID', () => {
    it('should save a productId to the store', () => {
      const productId = 123456
      const action = {
        type: 'WISHLIST_STORE_PRODUCT_ID',
        productId,
      }
      const state = {
        itemDetails: [],
        pendingProductId: '',
      }

      expect(testReducer(state, action)).toEqual({
        itemDetails: [],
        pendingProductId: productId,
      })
    })
  })

  describe('WISHLIST_DELETE_STORED_PRODUCT_ID', () => {
    it('should delete a saved productId in the store', () => {
      const action = { type: 'WISHLIST_DELETE_STORED_PRODUCT_ID' }
      const state = { itemDetails: [], pendingProductId: 1234567 }

      expect(testReducer(state, action)).toEqual({
        itemDetails: [],
        pendingProductId: null,
      })
    })
  })

  describe('REMOVE_ITEM_FROM_WISHLIST', () => {
    it('should not remove an item if not wishlisted', () => {
      const action = { type: 'REMOVE_ITEM_FROM_WISHLIST', productId: 123456 }
      const state = {
        productList: null,
        itemDetails: null,
      }

      expect(testReducer(state, action)).toEqual({
        productList: null,
        itemDetails: null,
      })
    })

    it('should delete an item from the wishlist by productId', () => {
      const action = { type: 'REMOVE_ITEM_FROM_WISHLIST', productId: 123456 }
      const state = {
        productList: [{ productId: 123456 }, { productId: 78901 }],
        itemDetails: [{ parentProductId: 123456 }, { parentProductId: 78901 }],
      }

      expect(testReducer(state, action)).toEqual({
        productList: [{ productId: 78901 }],
        itemDetails: [{ parentProductId: 78901 }],
      })
    })
  })

  describe('CLEAR_WISHLIST', () => {
    it('should remove all items from the wishlist', () => {
      const state = {
        productList: [{ giftListId: 123456 }, { giftListId: 78901 }],
        itemDetails: [{ listItemId: '123456' }, { listItemId: '78901' }],
      }

      const action = {
        type: 'CLEAR_WISHLIST',
      }

      expect(testReducer(state, action)).toEqual({
        productList: null,
        itemDetails: null,
      })
    })
  })

  describe('SET_MOVING_PRODUCT_TO_WISHLIST', () => {
    it('should set the productId being moved to wishlist', () => {
      const productId = 12345
      const state = {}

      const action = {
        type: 'SET_MOVING_PRODUCT_TO_WISHLIST',
        productId,
      }

      expect(testReducer(state, action)).toEqual({
        movingProductToWishlist: productId,
      })
    })
  })

  describe('CLEAR_MOVING_PRODUCT_TO_WISHLIST', () => {
    it('should clear the productId being moved to wishlist', () => {
      const productId = 12345
      const state = {
        movingProductToWishlist: productId,
      }

      const action = {
        type: 'CLEAR_MOVING_PRODUCT_TO_WISHLIST',
      }

      expect(testReducer(state, action)).toEqual({
        movingProductToWishlist: null,
      })
    })
  })

  describe('START_WISHLIST_LOADING_DETAILS', () => {
    it('should set the `isLoadingItemDetails` state to true', () => {
      expect(
        testReducer(
          {
            itemDetails: null,
          },
          { type: 'START_WISHLIST_LOADING_DETAILS' }
        )
      ).toEqual({
        itemDetails: null,
        isLoadingItemDetails: true,
      })
    })
  })

  describe('END_WISHLIST_LOADING_DETAILS', () => {
    it('should set the `isLoadingItemDetails` state to false', () => {
      expect(
        testReducer(
          {
            itemDetails: null,
            isLoadingItemDetails: true,
          },
          { type: 'END_WISHLIST_LOADING_DETAILS' }
        )
      ).toEqual({
        itemDetails: null,
        isLoadingItemDetails: false,
      })
    })
  })
})
