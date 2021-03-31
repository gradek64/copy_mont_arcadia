/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')

import {
  homeExpressPayload,
  storeCFSNotSupportedPayload,
  storeStandardPayload,
  storeExpressPayload,
  parcelshopPayload,
  homeStandardPayload,
} from '../order-summary-data'
import { getProducts } from '../../utilis/selectProducts'
import { getOrderSummary, updateOrderSummary } from '../../utilis/orderSummary'
import { createAccountResponse } from '../../utilis/userAccount'
import { addItemToShoppingBagResponse } from '../../utilis/shoppingBag'
import {
  getJessionIdFromResponse,
  getResponseAndSessionCookies,
} from '../../utilis/redis'

describe('Modifying order delivery methods existing user', () => {
  let products
  let jsessionId
  let orderId
  let orderSummaryResp

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeEach(async () => {
    const newAccountResponse = await createAccountResponse()
    jsessionId = await getJessionIdFromResponse(newAccountResponse)
    await addItemToShoppingBagResponse(jsessionId, products.productsSimpleId)
    orderSummaryResp = await getOrderSummary(jsessionId)
    orderId = orderSummaryResp.body.basket.orderId
  }, 60000)

  describe('It should return an Existing User Order Summary Json Schema - Home Standard', () => {
    it('should keep redis and client coookies in sync', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderSummaryResp
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe.skip('Existing User Order Summary => Store selected does not support CFS', () => {
    it('should keep redis and client coookies in sync', async () => {
      const returnedResponse = await updateOrderSummary(
        storeCFSNotSupportedPayload(orderId),
        jsessionId
      )
      const { responseCookies, session } = await getResponseAndSessionCookies(
        returnedResponse
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Standard', () => {
    it(
      'should keep redis and client coookies in sync',
      async () => {
        const updateResponse = await updateOrderSummary(
          storeStandardPayload(orderId),
          jsessionId
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Existing user Order Summary => Modifying Delivery Option To Home Express', () => {
    it(
      'should keep redis and client coookies in sync',
      async () => {
        const updateResponse = await updateOrderSummary(
          homeExpressPayload(orderId),
          jsessionId
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Parcelshop', () => {
    it(
      'should keep redis and client coookies in sync',
      async () => {
        const updateResponse = await updateOrderSummary(
          parcelshopPayload(orderId),
          jsessionId
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Express', () => {
    it(
      'should keep redis and client coookies in sync',
      async () => {
        const updateResponse = await updateOrderSummary(
          storeExpressPayload(orderId),
          jsessionId
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Existing User Order Summary => Modifying Delivery Option To Home Standard', () => {
    it(
      'should keep redis and client coookies in sync',
      async () => {
        const updateResponse = await updateOrderSummary(
          homeStandardPayload(orderId),
          jsessionId
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          updateResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
})
