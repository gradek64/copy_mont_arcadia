require('@babel/register')

import {
  booleanType,
  numberType,
  stringTypePattern,
  arrayType,
  stringType,
  objectType,
  numberTypePattern,
  booleanTypeAny,
} from '../utilis'
import { wishlistName } from './wishlist-data'
import { createAccount } from '../utilis/userAccount'
import { removeItemFromShoppingBag } from '../utilis/shoppingBag'
import {
  retrieveWishlist,
  createWishlist,
  addItemToWishlist,
  addItemToBagFromWishlist,
  removeItemFromWishlist,
  getWishlists,
} from '../utilis/wishlist'

let newUserAccount
let createWlResponse
let wishlists

describe('It should return the wishlist Json Schema', () => {
  beforeAll(async () => {
    newUserAccount = await createAccount()
    createWlResponse = await createWishlist(newUserAccount.jsessionid)
  }, 30000)

  describe('Wishlist Creation Schema', () => {
    it(
      'Wishlist creation Schema',
      () => {
        const wishlistCreationSchema = {
          title: 'Wishlist creation Schema',
          type: 'object',
          required: [
            'success',
            'externalId',
            'giftListName',
            'giftListId',
            'storeId',
          ],
          properties: {
            success: booleanType(true),
            externalId: numberType,
            giftListName: stringTypePattern(wishlistName),
            giftListId: numberType,
            storeId: numberType,
          },
        }
        expect(createWlResponse).toMatchSchema(wishlistCreationSchema)
      },
      30000
    )
  })

  describe('Add Item to Wishlist Schema', () => {
    let AddToWlResponse
    beforeAll(async () => {
      AddToWlResponse = await addItemToWishlist(newUserAccount.jsessionid)
    }, 30000)

    it(
      'Add item to wishlist Schema',
      () => {
        const addItemToWishlistSchema = {
          title: 'Wishlist add item Schema',
          type: 'object',
          required: [
            'productList',
            'pageNo',
            'name',
            'noOfItemsInList',
            'type',
            'pageSize',
            'giftListId',
            'success',
            'message',
          ],
          optional: ['isDDPOrder'],
          properties: {
            productList: arrayType(1),
            pageNo: numberType,
            name: stringType,
            noOfItemsInList: numberType,
            type: stringType,
            pageSize: numberType,
            giftListId: numberType,
            success: booleanType(true),
            message: stringType,
            isDDPOrder: booleanTypeAny,
          },
        }
        expect(AddToWlResponse).toMatchSchema(addItemToWishlistSchema)
      },
      30000
    )

    it(
      'Add Item => Product List schema',
      () => {
        AddToWlResponse.productList.forEach((productList) => {
          const productListSchema = {
            title: 'Product List Schema',
            type: 'object',
            required: ['productId', 'giftListItemId'],
            properties: {
              productId: numberType,
              giftListItemId: numberType,
            },
          }
          expect(productList).toMatchSchema(productListSchema)
        })
      },
      30000
    )
  })

  describe('Get all wishlists', () => {
    beforeAll(async () => {
      wishlists = await getWishlists(newUserAccount.jsessionid)
    }, 30000)
    it('get', () => {
      wishlists.forEach((obj) => {
        const wishlistsSchema = {
          title: 'Get Wishlists Schema',
          type: 'object',
          required: ['default', 'giftListId', 'giftListname', 'type'],
          properties: {
            default: stringType,
            giftListId: stringType,
            giftListname: stringType,
            type: stringType,
          },
        }
        expect(obj).toMatchSchema(wishlistsSchema)
      })
    })
  })

  describe('Get Wishlist Schema', () => {
    let response
    beforeAll(async () => {
      response = await retrieveWishlist(
        newUserAccount.jsessionid,
        wishlists[0].giftListId
      )
    }, 30000)

    it(
      'Get Wishlist Schema',
      () => {
        const wishlistCreationSchema = {
          title: 'Get wishlist Schema',
          type: 'object',
          required: [
            'pageSize',
            'pageNo',
            'name',
            'giftListId',
            'type',
            'noOfItemsInList',
            'productList',
          ],
          properties: {
            pageSize: numberType,
            pageNo: numberType,
            name: stringType,
            giftListId: numberType,
            type: stringType,
            noOfItemsInList: numberType,
            productList: arrayType(1),
          },
        }
        expect(response).toMatchSchema(wishlistCreationSchema)
      },
      30000
    )

    it(
      'Get wishlist => Item Details schema',
      () => {
        response.productList.forEach((productList) => {
          const productListSchema = {
            title: 'Item Details Schema',
            type: 'object',
            required: ['productId', 'giftListItemId'],
            properties: {
              productId: numberType,
              giftListItemId: numberType,
            },
          }
          expect(productList).toMatchSchema(productListSchema)
        })
      },
      30000
    )
  })

  describe('Add Item to Bag Schema', () => {
    let response
    beforeAll(async () => {
      response = await addItemToBagFromWishlist(newUserAccount.jsessionid)
    }, 30000)

    // Removing the item from the shopping bag to avoid making it full for the given size.
    afterEach(async () => {
      await removeItemFromShoppingBag(
        newUserAccount.jsessionid,
        response.orderId,
        response.products[0].orderItemId
      )
    }, 30000)

    it(
      'Add item to Bag Schema',
      () => {
        const addItemToWishlistSchema = {
          title: 'Wishlist add item to shopping bag Schema',
          type: 'object',
          required: [
            'orderId',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'deliveryOptions',
            'promotions',
            'discounts',
            'products',
            'savedProducts',
            'ageVerificationRequired',
            'restrictedDeliveryItem',
            'inventoryPositions',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'shoppingBagTotalEspot',
            'espots',
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            orderId: numberType,
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            deliveryOptions: arrayType(1),
            promotions: arrayType(0),
            discounts: arrayType(0),
            products: arrayType(1),
            savedProducts: arrayType(0),
            ageVerificationRequired: booleanType(false),
            restrictedDeliveryItem: booleanType(false),
            inventoryPositions: objectType,
            shoppingBagTotalEspot: objectType,
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanTypeAny,
            isOrderCoveredByGiftCards: booleanType(false),
            espots: objectType,
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(response).toMatchSchema(addItemToWishlistSchema)
      },
      30000
    )
    // The schema for inner properties of the Shopping Bag has been already tested in shopping-bag section.
  })

  describe('Remove Item from Wishlist Schema', () => {
    let response
    let wlResponse
    beforeAll(async () => {
      wlResponse = await retrieveWishlist(
        newUserAccount.jsessionid,
        wishlists[0].giftListId
      )
      response = await removeItemFromWishlist(
        newUserAccount.jsessionid,
        wlResponse.giftListId,
        wlResponse.productList[0].giftListItemId
      )
    }, 30000)

    it(
      'Remove item from wishlist Schema',
      () => {
        const addItemToWishlistSchema = {
          title: 'Wishlist remove item Schema',
          type: 'object',
          required: [
            'success',
            'externalId',
            'giftListId',
            'giftListItemId',
            'storeId',
          ],
          properties: {
            success: booleanType(true),
            externalId: arrayType(1, true, 'string'),
            giftListId: arrayType(1, true, 'string'),
            giftListItemId: arrayType(1, true, 'string'),
            storeId: arrayType(1, true, 'string'),
          },
        }
        expect(response).toMatchSchema(addItemToWishlistSchema)
      },
      30000
    )
  })

  describe('Get Empty Wishlist Schema', () => {
    let response
    beforeAll(async () => {
      newUserAccount = await createAccount()
      createWlResponse = await createWishlist(newUserAccount.jsessionid)
      response = await retrieveWishlist(
        newUserAccount.jsessionid,
        createWlResponse.giftListId
      )
    }, 30000)

    it(
      'Get Empty Wishlist Schema',
      () => {
        const emptyWishlistSchema = {
          title: 'Get wishlist Schema',
          type: 'object',
          required: [
            'pageSize',
            'pageNo',
            'name',
            'giftListId',
            'type',
            'noOfItemsInList',
            'productList',
          ],
          properties: {
            pageSize: numberType,
            pageNo: numberType,
            name: stringType,
            giftListId: numberType,
            type: stringType,
            noOfItemsInList: numberTypePattern(0, 0),
            productList: arrayType(0),
          },
        }
        expect(response).toMatchSchema(emptyWishlistSchema)
      },
      30000
    )
  })
})
