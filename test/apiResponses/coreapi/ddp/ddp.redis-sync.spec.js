require('@babel/register')

import { getProducts } from '../utilis/selectProducts'
import { createAccountResponse } from '../utilis/userAccount'
import {
  addItemToShoppingBagResponse,
  removeItemFromShoppingBagResponse,
} from '../utilis/shoppingBag'
import {
  getJessionIdFromResponse,
  getResponseAndSessionCookies,
} from '../utilis/redis'

describe('DDP with home delivery', () => {
  let products
  let newAccount
  let jsessionid
  let shoppingBagResponse
  let shoppingBag

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccountResponse()
    jsessionid = await getJessionIdFromResponse(newAccount)
    await addItemToShoppingBagResponse(jsessionid, products.productsSimpleId)

    shoppingBagResponse = await addItemToShoppingBagResponse(jsessionid, {
      productId: '32075155',
      productSku: '100000012',
      partNumber: '100000012',
      productQuantity: 1,
    })
    shoppingBag = shoppingBagResponse.body
  }, 60000)

  describe('default to home express when DDP is added to shopping bag', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { session, responseCookies } = await getResponseAndSessionCookies(
          shoppingBagResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('should default to store standard when DDP is removed from shopping bag', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const remove = await removeItemFromShoppingBagResponse(
          jsessionid,
          shoppingBag.orderId,
          shoppingBag.products[1].orderItemId,
          shoppingBag.products[1].isDDPProduct
        )
        const { session, responseCookies } = await getResponseAndSessionCookies(
          remove
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
})
