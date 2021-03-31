require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'

import { getProducts } from '../utilis/selectProducts'
import { createAccount } from '../utilis/userAccount'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'
import { getResponseAndSessionCookies } from '../utilis/redis'

const headers = {
  'Content-Type': 'application/json',
  'brand-code': 'tsuk',
}

const CreateKlarnaSession = (orderId, jsessionId) =>
  superagent
    .post(eps.payments.klarna.create.path)
    .set(headers)
    .set({ Cookie: jsessionId })
    .send({ orderId })

const UpdateKlarnaSession = (orderId, jsessionId, klarnaCookies) =>
  superagent
    .put(eps.payments.klarna.update.path)
    .set(headers)
    .set({ Cookie: `${jsessionId}; ${klarnaCookies}` })
    .send({ orderId })

describe('Klarna', () => {
  let orderId
  let jsessionId

  beforeAll(async () => {
    const products = await getProducts()
    const newAccount = await createAccount()
    jsessionId = newAccount.jsessionid
    await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    const orderSummaryResp = await superagent
      .get(eps.checkout.orderSummary.path)
      .set(headers)
      .set({ Cookie: jsessionId })

    orderId = orderSummaryResp.body.basket.orderId
  }, 60000)

  describe('create klarna session', () => {
    it(
      'should keep client cookies in sync with redis',
      async () => {
        const createSession = await CreateKlarnaSession(orderId, jsessionId)
        const { responseCookies, session } = await getResponseAndSessionCookies(
          createSession,
          jsessionId
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('update klarna session', () => {
    it(
      'should keep client cookies in sync with redis',
      async () => {
        const {
          body: { sessionId, clientToken },
        } = await CreateKlarnaSession(orderId, jsessionId)
        const klarnaCookies = `klarnaSessionId=${sessionId}; klarnaClientToken=${clientToken}`
        const updateSession = await UpdateKlarnaSession(
          orderId,
          jsessionId,
          klarnaCookies
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateSession,
          jsessionId
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })
})
