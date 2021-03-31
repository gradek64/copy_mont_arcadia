import { stringType } from '../utilis'

require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'

import { getProducts } from '../utilis/selectProducts'
import { createAccount } from '../utilis/userAccount'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'

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
  const schema = {
    properties: {
      sessionId: stringType,
      clientToken: stringType,
      paymentMethodCategories: stringType,
    },
    required: ['sessionId', 'clientToken', 'paymentMethodCategories'],
  }

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

  it(
    'should create a session with klarna returning a sessionId, clientToken and paymentMethodCategories',
    async () => {
      const createSession = await CreateKlarnaSession(orderId, jsessionId)
      expect(createSession.body).toMatchSchema(schema)
    },
    30000
  )

  it(
    'should update a session with klarna returning an existing sessionId, clientToken and paymentMethodCategories',
    async () => {
      const {
        body: { sessionId, clientToken, paymentMethodCategories },
      } = await CreateKlarnaSession(orderId, jsessionId)
      const klarnaCookies = `klarnaSessionId=${sessionId}; klarnaClientToken=${clientToken}`
      const expected = { sessionId, clientToken, paymentMethodCategories }

      const updateSession = await UpdateKlarnaSession(
        orderId,
        jsessionId,
        klarnaCookies
      )
      expect(updateSession.body).toMatchSchema(schema)
      expect(updateSession.body).toEqual(expected)
    },
    30000
  )
})
