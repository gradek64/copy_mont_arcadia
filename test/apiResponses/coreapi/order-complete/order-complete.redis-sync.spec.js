import { createAccountResponse } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'
import {
  addItemToShoppingBagResponse,
  promotionCode,
} from '../utilis/shoppingBag'
import {
  getResponseAndSessionCookies,
  getJessionIdFromResponse,
} from '../utilis/redis'

const TIMEOUT = 60 * 10000

describe('It should return the Order Complete Json schema for a New User', () => {
  let products

  beforeAll(async () => {
    products = await getProducts()
  }, TIMEOUT)

  const payOrderWith = async (cardType, withPromo) => {
    const newAccountResponse = await createAccountResponse()
    const jsessionid = await getJessionIdFromResponse(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      jsessionid,
      products.productsSimpleId
    )
    const shoppingBag = shoppingBagResponse.body
    if (withPromo) await promotionCode(jsessionid)
    const orderCompleted = await payOrder(
      jsessionid,
      shoppingBag.orderId,
      cardType
    )
    return orderCompleted
  }

  describe('can pay with VISA card', () => {
    it(
      'keeps redis cookies in sync with client',
      async () => {
        const paidOrder = await payOrderWith('VISA')
        const { responseCookies, session } = await getResponseAndSessionCookies(
          paidOrder
        )
        expect(responseCookies).toMatchSession(session)
      },
      TIMEOUT
    )
  })

  describe('can pay with AMERICA EXPRESS card', () => {
    it(
      'keeps redis cookies in sync with client',
      async () => {
        const paidOrder = await payOrderWith('AMEX')
        const { responseCookies, session } = await getResponseAndSessionCookies(
          paidOrder
        )
        expect(responseCookies).toMatchSession(session)
      },
      TIMEOUT
    )
  })

  describe('can pay with ACCOUNT CARD', () => {
    it(
      'keeps redis cookies in sync with client',
      async () => {
        const paidOrder = await payOrderWith('ACCNT')
        const { responseCookies, session } = await getResponseAndSessionCookies(
          paidOrder
        )
        expect(responseCookies).toMatchSession(session)
      },
      TIMEOUT
    )
  })

  describe('can pay with PAYPAL', () => {
    it(
      'keeps redis cookies in sync with client',
      async () => {
        const paidOrder = await payOrderWith('PYPAL')
        const { responseCookies, session } = await getResponseAndSessionCookies(
          paidOrder
        )
        expect(responseCookies).toMatchSession(session)
      },
      TIMEOUT
    )
  })

  describe('when orders contain promotions', () => {
    it(
      'keeps redis cookies in sync with client',
      async () => {
        const paidOrder = await payOrderWith('VISA', true)
        const { responseCookies, session } = await getResponseAndSessionCookies(
          paidOrder
        )
        expect(responseCookies).toMatchSession(session)
      },
      TIMEOUT
    )
  })
})
