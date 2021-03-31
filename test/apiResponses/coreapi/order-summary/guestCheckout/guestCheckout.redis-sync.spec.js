/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../../routes_tests'
import { headers } from '../../utilis'
import { homeStandardPayload } from '../order-summary-data'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getProducts } from '../../utilis/selectProducts'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('Order Summary -> Guest Checkout Scenarios', () => {
  let products
  let jsessionId
  let orderSummaryResp

  beforeAll(async () => {
    products = await getProducts()
    try {
      const generateJsessionId = await superagent
        .get(eps.siteOptions.path)
        .set(headers)
      jsessionId = generateJsessionId.headers['set-cookie']
        .toString()
        .split(';')[0]
      await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    } catch (e) {
      throw e
    }

    try {
      orderSummaryResp = await superagent
        .get(eps.checkout.orderSummary.path)
        .set(headers)
        .set({ Cookie: jsessionId })
        .send(homeStandardPayload())
    } catch (e) {
      throw e
    }
  }, 60000)

  describe('It should return the order summary with isGuestOrder set to true', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          orderSummaryResp
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })
})
