require('@babel/register')

import { getProducts } from '../utilis/selectProducts'
import { createAccountResponse } from '../utilis/userAccount'
import {
  addItemToShoppingBagResponse,
  updateShoppingBagDelivery,
  removeItemFromShoppingBagResponse,
  deliveryOptions,
} from '../utilis/shoppingBag'

import { getResponseAndSessionCookies } from '../utilis/redis'
import { processClientCookies } from '../utilis/cookies'

describe('DDP with home delivery', () => {
  let products
  let shoppingBagResponse
  let mergeCookies
  let shoppingBag
  let shoppingBagCookies

  beforeEach(async () => {
    ;({ mergeCookies } = processClientCookies())
    products = await getProducts()
    const newAccountResponse = await createAccountResponse()
    const newAccountCookies = mergeCookies(newAccountResponse)
    const addFirstItemResponse = await addItemToShoppingBagResponse(
      newAccountCookies,
      products.productsSimpleId
    )
    const firstItemCookies = mergeCookies(addFirstItemResponse)
    shoppingBagResponse = await addItemToShoppingBagResponse(firstItemCookies, {
      productId: '32075155',
      productSku: '100000012',
      partNumber: '100000012',
      productQuantity: 1,
    })
    shoppingBagCookies = mergeCookies(shoppingBagResponse)
    shoppingBag = shoppingBagResponse.body
  }, 60000)

  it('should default to home express when DDP is added to shopping bag', async () => {
    const selectedDeliveryMethods = shoppingBag.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('home_express')
  })

  // can be removed when redis is removed
  it('should keep response cookies an redis cookies in sync', async () => {
    const { responseCookies, session } = await getResponseAndSessionCookies(
      shoppingBagResponse
    )
    expect(responseCookies).toMatchSession(session)
  })

  describe('defaults to standard on removal of DDP', () => {
    let removeResponse

    beforeEach(async () => {
      removeResponse = await removeItemFromShoppingBagResponse(
        shoppingBagCookies,
        shoppingBag.orderId,
        shoppingBag.products[1].orderItemId,
        shoppingBag.products[1].isDDPProduct
      )
    })

    it('should default to store standard when DDP is removed from shopping bag', async () => {
      const selectedDeliveryMethods = removeResponse.body.deliveryOptions.filter(
        (deliveryMethods) => deliveryMethods.selected === true
      )
      expect(selectedDeliveryMethods[0].type).toEqual('home_standard')
    })

    // can be removed when redis is removed
    it('should keep response cookies an redis cookies in sync', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        removeResponse
      )
      expect(responseCookies).toMatchSession(session)
    })
  })
})

describe.skip('DDP with store collection', () => {
  let products
  let shoppingBagResponse
  let shoppingBag
  let shoppingBagCookies

  beforeAll(async () => {
    const { mergeCookies } = processClientCookies()
    products = await getProducts()
    const newAccountResponse = await createAccountResponse()
    const newAccountCookies = mergeCookies(newAccountResponse)
    const addFirstItemResponse = await addItemToShoppingBagResponse(
      newAccountCookies,
      products.productsSimpleId
    )
    const firstItemCookies = mergeCookies(addFirstItemResponse)

    const updatedDeliveryResponse = await updateShoppingBagDelivery(
      firstItemCookies,
      deliveryOptions.freeCollectFromStoreStandard
    )
    const updatedDeliveryCookies = mergeCookies(updatedDeliveryResponse)

    shoppingBagResponse = await addItemToShoppingBagResponse(
      updatedDeliveryCookies,
      {
        productId: '32075155',
        productSku: '100000012',
        partNumber: '100000012',
        productQuantity: 1,
      }
    )
    shoppingBagCookies = mergeCookies(shoppingBagResponse)
    shoppingBag = shoppingBagResponse.body
  }, 60000)

  it('should default to store express when DDP is added to shopping bag', async () => {
    const selectedDeliveryMethods = shoppingBag.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('store_express')
  })

  it('should default to store standard when DDP is removed from shopping bag', async () => {
    const remove = await removeItemFromShoppingBagResponse(
      shoppingBagCookies,
      shoppingBag.orderId,
      shoppingBag.products[1].orderItemId,
      shoppingBag.products[1].isDDPProduct
    )

    const selectedDeliveryMethods = remove.body.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('store_standard')
  })
})
