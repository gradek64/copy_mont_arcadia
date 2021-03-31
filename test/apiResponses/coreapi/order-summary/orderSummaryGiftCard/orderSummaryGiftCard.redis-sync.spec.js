/* eslint-disable no-restricted-syntax,no-prototype-builtins */

require('@babel/register')

import chai from 'chai'

chai.use(require('chai-json-schema'))

import { createAccount } from '../../utilis/userAccount'
import {
  addGiftCardResponse,
  removeGiftCardResponse,
} from '../../utilis/giftCard'
import { getProducts } from '../../utilis/selectProducts'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getResponseAndSessionCookies } from '../../utilis/redis'

import {
  validGiftCard,
  giftCardToCoverBasketTotal,
} from '../order-summary-data'
import { getOrderSummary } from '../../utilis/orderSummary'

describe('POST: - Add Giftcard', () => {
  let products
  let newAccount
  let jsessionId
  let validGiftCardResponse

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()
    jsessionId = newAccount.jsessionid
    await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    await getOrderSummary(jsessionId)
  }, 60000)

  describe('Add a valid giftcard', () => {
    it(
      'should keep redis and client cookies in sync',
      async () => {
        try {
          validGiftCardResponse = await addGiftCardResponse(
            jsessionId,
            validGiftCard
          )
        } catch (e) {
          validGiftCardResponse = e.response.body
        }
        const { responseCookies, session } = await getResponseAndSessionCookies(
          validGiftCardResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('DELETE: - Remove Giftcard', () => {
    //  Please note if this test is failing is because the balance of the card is zero or the card is expired or not active
    it(
      'should keep redis and client cookies in sync',
      async () => {
        const addValidGiftCard = await addGiftCardResponse(
          jsessionId,
          giftCardToCoverBasketTotal
        )
        const removeCardResponse = await removeGiftCardResponse(
          jsessionId,
          addValidGiftCard.body.giftCards[1].giftCardId
        )

        const { responseCookies, session } = await getResponseAndSessionCookies(
          removeCardResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
})
