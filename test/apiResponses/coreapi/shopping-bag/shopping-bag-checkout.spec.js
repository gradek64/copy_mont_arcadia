require('@babel/register')

import {
  stringType,
  stringTypeEmpty,
  booleanType,
  objectType,
  arrayType,
} from '../utilis'
import {
  addItemToShoppingBag2,
  promotionCode,
  removeItemFromShoppingBag,
  deletePromotionCode,
  updateShoppingBagItem,
} from '../utilis/shoppingBag'
import { createAccount } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'

const orderSummarySchema = {
  title: 'New User Order Summary',
  type: 'object',
  required: [
    'basket',
    'deliveryLocations',
    'giftCards',
    'deliveryInstructions',
    'smsMobileNumber',
    'shippingCountry',
    'savedAddresses',
    'ageVerificationDeliveryConfirmationRequired',
    'estimatedDelivery',
    'billingDetails',
    'deliveryDetails',
  ],
  optional: ['checkoutDiscountIntroEspot', 'isGuestOrder'],
  properties: {
    isGuestOrder: booleanType(false),
    basket: objectType,
    deliveryLocations: arrayType(1),
    giftCards: arrayType(),
    deliveryInstructions: stringTypeEmpty,
    smsMobileNumber: stringTypeEmpty,
    shippingCountry: stringType,
    savedAddresses: arrayType(),
    ageVerificationDeliveryConfirmationRequired: booleanType(false),
    estimatedDelivery: arrayType(0, true, 'string'),
    checkoutDiscountIntroEspot: objectType,
    billingDetails: objectType,
    deliveryDetails: objectType,
  },
}

describe('It should return the Order Summary Json Schema when in checkout', () => {
  let products
  let newAccount
  let shoppingBag
  let orderSummaryResponse
  let addPromotionCode
  let removePromotionCode

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()
    orderSummaryResponse = await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId,
      true,
      'orderSummary'
    )
    shoppingBag = await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsWasPriceId
    )
    addPromotionCode = await promotionCode(
      newAccount.jsessionid,
      'orderSummary'
    )
  }, 60000)

  describe('Shopping Bag DELETE Product', () => {
    let shoppingBagRemoveItems
    beforeAll(async () => {
      shoppingBagRemoveItems = await removeItemFromShoppingBag(
        newAccount.jsessionid,
        shoppingBag.orderId,
        shoppingBag.products[0].orderItemId,
        shoppingBag.products[0].isDDPProduct,
        'orderSummary'
      )
    }, 60000)

    it('Shopping Bag DELETE Product Json Schema', () => {
      expect(shoppingBagRemoveItems.body).toMatchSchema(orderSummarySchema)
    })
  })

  describe('Shopping Bag ADD Product', () => {
    it('Shopping Bag ADD Product Json Schema', () => {
      const addToBagOrderSummarySchema = {
        title: 'New User Order Summary',
        type: 'object',
        required: [
          'basket',
          'deliveryLocations',
          'giftCards',
          'deliveryInstructions',
          'smsMobileNumber',
          'shippingCountry',
          'savedAddresses',
          'ageVerificationDeliveryConfirmationRequired',
        ],
        optional: ['checkoutDiscountIntroEspot', 'isGuestOrder'],
        properties: {
          isGuestOrder: booleanType(false),
          basket: objectType,
          deliveryLocations: arrayType(1),
          giftCards: arrayType(),
          deliveryInstructions: stringTypeEmpty,
          smsMobileNumber: stringTypeEmpty,
          shippingCountry: stringType,
          savedAddresses: arrayType(),
          ageVerificationDeliveryConfirmationRequired: booleanType(false),
          estimatedDelivery: arrayType(0, true, 'string'),
          checkoutDiscountIntroEspot: objectType,
          deliveryDetails: objectType,
        },
      }
      expect(orderSummaryResponse).toMatchSchema(addToBagOrderSummarySchema)
    })
  })

  describe('Shopping Bag DELETE Promotion Code', () => {
    beforeAll(async () => {
      removePromotionCode = await deletePromotionCode(
        newAccount.jsessionid,
        'orderSummary'
      )
    }, 60000)

    it('Shopping bag schema', () => {
      expect(removePromotionCode).toMatchSchema(orderSummarySchema)
    })
  })

  describe('Shopping Bag POST Add Promotion Code', () => {
    it('Shopping bag schema', () => {
      expect(addPromotionCode).toMatchSchema(orderSummarySchema)
    })
  })

  describe('Shopping Bag UPDATE Bag Item', () => {
    let productUpdate
    beforeAll(async () => {
      orderSummaryResponse = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsSimpleId,
        true,
        'orderSummary'
      )
      productUpdate = await updateShoppingBagItem(
        newAccount.jsessionid,
        products.productsSimpleId.catEntryId,
        products.productsSimpleId.catEntryId,
        2,
        'orderSummary'
      )
    }, 60000)

    it('Shopping Bag DELETE Product Json Schema', () => {
      expect(productUpdate).toMatchSchema(orderSummarySchema)
    })
  })
})
