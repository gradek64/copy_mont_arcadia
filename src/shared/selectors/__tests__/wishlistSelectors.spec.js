import {
  getDefaultWishlistId,
  getWishlistItemIds,
  getTotalWishlistItems,
  getWishlistItemDetails,
  getWishlistItemCount,
  isProductAddedToWishlist,
  getWishlistedItem,
  isWishlistSync,
  isMovingProductToWishlist,
  isMovingAnyProductToWishlist,
  isLoadingWishlistItemDetails,
  getWishlistPageNo,
} from '../wishlistSelectors'

describe('Wishlist Selectors', () => {
  describe('getDefaultWishlistId', () => {
    it('returns null if there is no default wishlist', () => {
      expect(getDefaultWishlistId(undefined)).toEqual(null)
      expect(getDefaultWishlistId({})).toEqual(null)
      expect(
        getDefaultWishlistId({
          wishlist: {},
        })
      ).toEqual(null)
    })
    it('returns default wishlist Id', () => {
      const state = {
        wishlist: {
          giftListId: 98765,
        },
      }
      expect(getDefaultWishlistId(state)).toBe(98765)
    })
  })

  describe('getWishlistItemIds', () => {
    it('returns null if wishlist items have not been populated', () => {
      expect(getWishlistItemIds(undefined)).toEqual(null)
      expect(getWishlistItemIds({})).toEqual(null)
      expect(
        getWishlistItemIds({
          wishlist: {},
        })
      ).toEqual(null)
    })

    it('returns wishlist items', () => {
      const state = {
        wishlist: {
          productList: [{}, {}],
        },
      }
      expect(getWishlistItemIds(state)).toEqual([{}, {}])
    })
  })

  describe('getTotalWishlistItems', () => {
    it('should return the `noOfItemsInList`', () => {
      const state = {
        wishlist: {
          noOfItemsInList: 10,
        },
      }
      expect(getTotalWishlistItems(state)).toBe(10)
    })

    it('should return 0 if `noOfItemsInList` is undefined', () => {
      const state = {
        wishlist: {},
      }
      expect(getTotalWishlistItems(state)).toBe(0)
    })
  })

  describe('getWishlistItemDetails', () => {
    it('returns null if wishlist itemDetails have not been populated', () => {
      expect(getWishlistItemDetails(undefined)).toEqual(null)
      expect(getWishlistItemDetails({})).toEqual(null)
      expect(
        getWishlistItemDetails({
          wishlist: {},
        })
      ).toEqual(null)
    })

    it('returns wishlist itemDetails', () => {
      const state = {
        wishlist: {
          itemDetails: [{}, {}],
        },
      }
      expect(getWishlistItemDetails(state)).toEqual([{}, {}])
    })
  })

  describe(getWishlistItemCount.name, () => {
    it('returns 0 if wishlist items have not been populated', () => {
      expect(getWishlistItemCount(undefined)).toEqual(0)
      expect(getWishlistItemCount({})).toEqual(0)
      expect(
        getWishlistItemCount({
          wishlist: {},
        })
      ).toEqual(0)
    })
    it('returns wishlist item count', () => {
      const state = {
        wishlist: {
          productList: [{}, {}],
        },
      }
      expect(getWishlistItemCount(state)).toBe(2)
    })
  })

  describe(isProductAddedToWishlist.name, () => {
    it('returns false if given product is not wishlisted', () => {
      expect(isProductAddedToWishlist(undefined, undefined)).toBe(false)
      expect(isProductAddedToWishlist({}, null)).toBe(false)
      expect(
        isProductAddedToWishlist(
          {
            wishlist: {
              productList: [{ productId: 1007 }],
            },
          },
          11111
        )
      ).toBe(false)
    })
    it('returns true when a given product is wishlisted', () => {
      expect(
        isProductAddedToWishlist(
          {
            wishlist: {
              productList: [{ productId: 1007 }, { productId: 1234 }],
            },
          },
          1234
        )
      ).toBe(true)
    })
  })

  describe(getWishlistedItem.name, () => {
    it('returns empty object if productId is not wishlisted', () => {
      expect(getWishlistedItem(undefined, undefined)).toEqual({})
      expect(getWishlistedItem({}, null)).toEqual({})
      expect(
        getWishlistedItem(
          {
            wishlist: {
              productList: [{ productId: 1007 }],
            },
          },
          11111
        )
      ).toEqual({})
    })
    it('returns item when a given product is wishlisted', () => {
      expect(
        getWishlistedItem(
          {
            wishlist: {
              productList: [{ productId: 1007 }, { productId: 1234 }],
            },
          },
          1234
        )
      ).toEqual({ productId: 1234 })
    })
  })

  describe(isWishlistSync.name, () => {
    it('should return false when wishlistItemIds or wishlistItemDetails are not initialised', () => {
      const state = {
        wishlist: {
          productList: null,
          itemDetails: null,
        },
      }
      expect(isWishlistSync(state)).toBeFalsy()
    })
    it('should return false if wishlisted items are not synced', () => {
      const state = {
        wishlist: {
          productList: [{ productId: 29078 }],
          itemDetails: [],
        },
      }
      expect(isWishlistSync(state)).toBeFalsy()
    })
    it('should return true if wishlisted items are synced', () => {
      const state = {
        wishlist: {
          productList: [{ productId: 29078 }],
          itemDetails: [{ parentProductId: 29078 }],
        },
      }
      expect(isWishlistSync(state)).toBeTruthy()
    })
  })

  describe(isMovingProductToWishlist.name, () => {
    const productId = 12345
    it('should return false when movingProductToWishlist is null', () => {
      const state = {
        wishlist: {},
      }
      expect(isMovingProductToWishlist(state, productId)).toBeFalsy()
    })
    it('should return false when movingProductToWIshlist is different to given id', () => {
      const state = {
        wishlist: {
          movingProductToWishlist: 1,
        },
      }
      expect(isMovingProductToWishlist(state, productId)).toBeFalsy()
    })
    it('should return true when movingProductToWishlist is same as given id', () => {
      const state = {
        wishlist: {
          movingProductToWishlist: productId,
        },
      }
      expect(isMovingProductToWishlist(state, productId)).toBeTruthy()
    })
  })
  describe(isMovingAnyProductToWishlist.name, () => {
    it('should return false when movingProductToWishlist is null', () => {
      const state = {
        wishlist: {},
      }
      expect(isMovingAnyProductToWishlist(state)).toBeFalsy()
    })
    it('should return true when movingProductToWIshlist is truthy', () => {
      const state = {
        wishlist: {
          movingProductToWishlist: 1,
        },
      }
      expect(isMovingAnyProductToWishlist(state)).toBeTruthy()
    })
  })
})

describe('isLoadingWishlistItemDetails', () => {
  it('should return the `isLoadingItemDetails` state', () => {
    const state = {
      wishlist: { isLoadingItemDetails: true },
    }
    expect(isLoadingWishlistItemDetails(state)).toBe(true)
  })

  it('should return false if `isLoadingItemDetails` is not defined', () => {
    const state = { wishlist: {} }
    expect(isLoadingWishlistItemDetails(state)).toBe(false)
  })
})

describe('getWishlistPageNo', () => {
  it('should return the `pageNo` state, which represents the no of paginated chunks of items that have been loaded', () => {
    const state = {
      wishlist: {
        pageNo: 4,
      },
    }
    expect(getWishlistPageNo(state)).toBe(4)
  })

  it('should return 0 if `pageNo` is undefined', () => {
    const state = { wishlist: {} }
    expect(getWishlistPageNo(state)).toBe(0)
  })
})
