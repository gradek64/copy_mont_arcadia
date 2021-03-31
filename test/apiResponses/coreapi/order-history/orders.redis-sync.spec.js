/* eslint-disable func-names */
require('@babel/register')

jest.unmock('superagent')

import { getResponseAndSessionCookies } from '../utilis/redis'
import {
  loginAndGetOrderHistoryResponse,
  getOrderDetailsForAllOfOrderHistory,
} from '../utilis/orderDetails'

describe('Order History Tests', () => {
  const SECOND = 1000

  describe('Order History Schema', () => {
    it(
      'should keep redis in sync with client cookies',
      async () => {
        const response = await loginAndGetOrderHistoryResponse()
        const { session, responseCookies } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30 * SECOND
    )
  })

  describe('Order History Details Schema', () => {
    it(
      'should keep redis in sync with client cookies',
      async () => {
        const { response } = await getOrderDetailsForAllOfOrderHistory()
        const { session, responseCookies } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30 * SECOND
    )
  })
})
