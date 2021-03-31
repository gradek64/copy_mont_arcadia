require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'

import {
  addToBagPayload,
  itemWishlist,
  wishlistName,
} from '../wishlist/wishlist-data'
import { authenticateMySession } from '../utilis/authenticate'

export const headers = {
  'Content-Type': 'application/json',
  'BRAND-CODE': 'tsuk',
}

export const createWishlist = async (jsessionid) => {
  const wishlistResponse = await superagent
    .post(eps.wishlist.createWishlist.path)
    .set(headers)
    .set({ Cookie: authenticateMySession(jsessionid) })
    .send(wishlistName)
  return wishlistResponse.body
}

export const addItemToWishlist = async (jsessionid) => {
  const addToItemWishlistResponse = await superagent
    .post(eps.wishlist.addItemWishlist.path)
    .set(headers)
    .set({ Cookie: authenticateMySession(jsessionid) })
    .send(itemWishlist)
  return addToItemWishlistResponse.body
}

export const retrieveWishlist = async (jsessionid, giftListId) => {
  const getWishlistResponse = await superagent
    .get(eps.wishlist.getWishlist.path(giftListId))
    .set(headers)
    .set({ Cookie: authenticateMySession(jsessionid) })
  return getWishlistResponse.body
}

export const getWishlists = async (jsessionid) => {
  const getWishlistsResponse = await superagent
    .get(eps.wishlist.getAllWishlists.path)
    .set(headers)
    .set({ Cookie: authenticateMySession(jsessionid) })
  return getWishlistsResponse.body
}

export const addItemToBagFromWishlist = async (jsessionid) => {
  const addItemToBagFromWishlistResponse = await superagent
    .post(eps.wishlist.addToBagWishlist.path)
    .set(headers)
    .set({ Cookie: authenticateMySession(jsessionid) })
    .send(addToBagPayload)
  return addItemToBagFromWishlistResponse.body
}

export const removeItemFromWishlist = async (
  jsessionid,
  wishlistId,
  wishlistItemId
) => {
  const removeItemFromWishlistResponse = await superagent
    .delete(eps.wishlist.deleteItemWishlist.path)
    .set(headers)
    .set({ Cookie: authenticateMySession(jsessionid) })
    .send({ wishlistId, wishlistItemId })
  return removeItemFromWishlistResponse.body
}
