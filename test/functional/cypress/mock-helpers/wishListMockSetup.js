import routes from '../constants/routes'
import { authStateCookieUpdate, setUpMocksForRouteList } from '../lib/helpers'

export default class wishlistMocks {
  mocksForWishlist = (selectedEndpoints = {}) => {
    const {
      setAuthStateCookie,
      addWishlistItem,
      addWishlistItemToBag,
      removeWishlistItem,
      getWishlistItemIds,
      getWishlists,
      getWishlistById,
      byIdUrlFilter,
      quickViewProduct,
      productId,
    } = selectedEndpoints

    let filterFormatted
    if (byIdUrlFilter !== undefined) {
      filterFormatted = `**${byIdUrlFilter}**`
    } else {
      filterFormatted = '**'
    }

    authStateCookieUpdate(setAuthStateCookie)

    const wishlistRoutes = [
      quickViewProduct &&
        productId && {
          method: 'GET',
          url: routes.wishlistApi.quickViewProduct(productId),
          response: quickViewProduct,
          alias: 'get-qv-item',
        },
      addWishlistItem && {
        method: 'POST',
        url: routes.wishlistApi.addItem,
        response: addWishlistItem,
        alias: 'add-wl-item',
      },
      addWishlistItemToBag && {
        method: 'POST',
        url: routes.wishlistApi.addToBag,
        response: addWishlistItemToBag,
        alias: 'add-wl-item-to-bag',
      },
      removeWishlistItem && {
        method: 'DELETE',
        url: routes.wishlistApi.removeItem,
        response: removeWishlistItem,
        alias: 'remove-wl-item',
      },
      getWishlistItemIds && {
        method: 'GET',
        url: routes.wishlistApi.wishlist,
        response: getWishlistItemIds,
        alias: 'get-wl-item-id',
      },
      getWishlists && {
        method: 'GET',
        url: routes.wishlistApi.wishlists,
        response: getWishlists,
        alias: 'get-wishlists',
      },
      getWishlistById && {
        method: 'GET',
        url: `${routes.wishlistApi.wishlistId}${filterFormatted}`,
        response: getWishlistById,
        alias: 'get-wl-id',
      },
    ]
    setUpMocksForRouteList(wishlistRoutes)
  }
}
