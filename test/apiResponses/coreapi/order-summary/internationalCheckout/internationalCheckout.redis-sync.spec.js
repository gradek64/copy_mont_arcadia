require('@babel/register')

jest.unmock('superagent')

import {
  getResponseAndSessionCookies,
  getJessionIdFromResponse,
} from '../../utilis/redis'
import { sriLankaOrderSummaryUser } from '../order-summary-data'
import { getOrderSummary } from '../../utilis/orderSummary'
import { logInResponse } from '../../utilis/userAccount'

describe('International order summary Schema', () => {
  let orderSummaryResp

  beforeAll(async () => {
    const response = await logInResponse({
      payload: sriLankaOrderSummaryUser,
    })
    const jsessionId = await getJessionIdFromResponse(response)
    orderSummaryResp = await getOrderSummary(jsessionId)
  }, 60000)

  describe('It should return an Order Summary Json Schema', () => {
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
