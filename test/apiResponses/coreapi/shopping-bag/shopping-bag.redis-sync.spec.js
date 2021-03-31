require('@babel/register')

import {
  addItemToShoppingBagResponse,
  fetchSizeQtyResponse,
  removeItemFromShoppingBagResponse,
  updateShoppingBagItemResponse,
  promotionCodeResponse,
  deletePromotionCodeResponse,
  transferShoppingBagResponse,
} from '../utilis/shoppingBag'
import { createAccountResponse } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'

import {
  getResponseAndSessionCookies,
  getJessionIdFromResponse,
} from '../utilis/redis'

describe('Keeping Redis in sync with the client', () => {
  let products
  let productSizeQtyResponse
  let productSizeQty
  let shoppingBagResponse
  let shoppingBag
  let jsessionid

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeEach(async () => {
    const newAccountResponse = await createAccountResponse()
    jsessionid = await getJessionIdFromResponse(newAccountResponse)
    await addItemToShoppingBagResponse(jsessionid, products.productsSimpleId)
    shoppingBagResponse = await addItemToShoppingBagResponse(
      jsessionid,
      products.productsWasPriceId
    )
    shoppingBag = shoppingBagResponse.body
    productSizeQtyResponse = await fetchSizeQtyResponse(
      jsessionid,
      products.productsSimpleId.catEntry
    )
    productSizeQty = productSizeQtyResponse.body
  }, 60000)

  describe('It should return the Shopping Bag Json Schema', () => {
    it(
      'should keep redis cookies in sync with the client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          shoppingBagResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Shopping Bag DELETE Product', () => {
    it(
      'should keep redis cookies in sync with the client',
      async () => {
        const removeItemResponse = await removeItemFromShoppingBagResponse(
          jsessionid,
          shoppingBag.orderId,
          shoppingBag.products[0].orderItemId
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          removeItemResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Shopping GET Fetch Size and Quantity Json Schema', () => {
    it('should keep redis cookies in sync with the client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        productSizeQtyResponse
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe('Shopping PUT Update Qty Product Json Schema', () => {
    it(
      'should keep redis cookies in sync with the client',
      async () => {
        const productUpdateResponse = await updateShoppingBagItemResponse(
          jsessionid,
          productSizeQty.items[0].catEntryId,
          productSizeQty.items[0].catEntryId,
          2
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          productUpdateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Shopping PUT Update Size Product Json Schema', () => {
    it(
      'should keep redis cookies in sync with the client',
      async () => {
        const productUpdateResponse = await updateShoppingBagItemResponse(
          jsessionid,
          productSizeQty.items[1].catEntryId,
          productSizeQty.items[0].catEntryId,
          1
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          productUpdateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Shopping Bag POST Add Promotion Code', () => {
    it(
      'should keep redis cookies in sync with the client',
      async () => {
        const addPromotionCodeResponse = await promotionCodeResponse(jsessionid)
        const { responseCookies, session } = await getResponseAndSessionCookies(
          addPromotionCodeResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Shopping Bag POST Delete Promotion Code', () => {
    it(
      'should keep redis cookies in sync with the client',
      async () => {
        await promotionCodeResponse(jsessionid)
        const deletedPromotionCodeResponse = await deletePromotionCodeResponse(
          jsessionid
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          deletedPromotionCodeResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('Shopping Bag Transfer POST Request', () => {
    it('should keep redis cookies in sync with the client', async () => {
      const newAccount = await createAccountResponse()
      const jsessionid = await getJessionIdFromResponse(newAccount)
      const transferBagResponse = await transferShoppingBagResponse(jsessionid)
      const { responseCookies, session } = await getResponseAndSessionCookies(
        transferBagResponse
      )
      expect(responseCookies).toMatchSession(session)
    })
  })
})
