import { stringType } from '../utilis'

require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'

import { getProducts } from '../utilis/selectProducts'
import { createAccountResponse } from '../utilis/userAccount'
import { addItemToShoppingBagResponse } from '../utilis/shoppingBag'
import { processClientCookies } from '../utilis/cookies'
import { getResponseAndSessionCookies } from '../utilis/redis'

const headers = {
  'Content-Type': 'application/json',
  'brand-code': 'tsuk',
}

const CreateKlarnaSession = (orderId, cookies) =>
  superagent
    .post(eps.payments.klarna.create.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send({ orderId })

const UpdateKlarnaSession = (orderId, cookies) =>
  superagent
    .put(eps.payments.klarna.update.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send({ orderId })

describe('Klarna', () => {
  let products
  let orderId
  let mergeCookies
  let cookies

  const schema = {
    properties: {
      sessionId: stringType,
      clientToken: stringType,
      paymentMethodCategories: stringType,
    },
    required: ['sessionId', 'clientToken', 'paymentMethodCategories'],
  }

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeEach(async () => {
    ;({ mergeCookies } = processClientCookies())
    const newAccountResponse = await createAccountResponse()
    cookies = mergeCookies(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      cookies,
      products.productsSimpleId
    )
    cookies = mergeCookies(shoppingBagResponse)
    const orderSummaryResp = await superagent
      .get(eps.checkout.orderSummary.path)
      .set(headers)
      .set({ Cookie: cookies })
    cookies = mergeCookies(orderSummaryResp)
    orderId = orderSummaryResp.body.basket.orderId
  }, 60000)

  describe('Create Klarna session', () => {
    it(
      'should create a session with klarna returning a sessionId, clientToken and paymentMethodCategories',
      async () => {
        const createSession = await CreateKlarnaSession(orderId, cookies)
        expect(createSession.body).toMatchSchema(schema)
      },
      30000
    )

    // remove when redis is removed
    it(
      'should keep client and redis cookies in sync',
      async () => {
        const createSession = await CreateKlarnaSession(orderId, cookies)
        const { responseCookies, session } = await getResponseAndSessionCookies(
          createSession
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('Update Klarna Session', () => {
    it(
      'should update a session with klarna returning an existing sessionId, clientToken and paymentMethodCategories',
      async () => {
        const response = await CreateKlarnaSession(orderId, cookies)
        const {
          body: { sessionId, clientToken, paymentMethodCategories },
        } = response
        const klarnaCookies = [
          `klarnaSessionId=${sessionId}`,
          `klarnaClientToken=${clientToken}`,
        ]
        cookies = mergeCookies(response)
        const expected = { sessionId, clientToken, paymentMethodCategories }
        const updateSession = await UpdateKlarnaSession(orderId, [
          ...cookies,
          ...klarnaCookies,
        ])
        expect(updateSession.body).toMatchSchema(schema)
        expect(updateSession.body).toEqual(expected)
      },
      30000
    )

    // remove when redis is removed
    it(
      'should keep client and redis cookies in sync',
      async () => {
        const createSession = await CreateKlarnaSession(orderId, cookies)
        const {
          body: { sessionId, clientToken },
        } = createSession
        const klarnaCookies = [
          `klarnaSessionId=${sessionId}`,
          `klarnaClientToken=${clientToken}`,
        ]
        cookies = mergeCookies(createSession)
        const updateSession = await UpdateKlarnaSession(orderId, [
          ...cookies,
          ...klarnaCookies,
        ])
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateSession
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })
})
