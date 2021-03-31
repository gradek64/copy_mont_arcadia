/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')

import { createAccount } from '../../utilis/userAccount'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getProducts } from '../../utilis/selectProducts'
import { getResponseAndSessionCookies } from '../../utilis/redis'
import { getOrderSummary } from '../../utilis/orderSummary'

describe('Order Summary -> New User Scenarios', () => {
  let orderSummaryResp

  beforeAll(async () => {
    const products = await getProducts()
    const newAccount = await createAccount()
    const jsessionId = newAccount.jsessionid
    await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    orderSummaryResp = await getOrderSummary(jsessionId)
  }, 60000)

  describe('It should return a New User User Order Summary Json', () => {
    it(
      'Should keep redis and client cookies in sync',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          orderSummaryResp
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
})
