/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../../routes_tests'
import {
  arrayType,
  booleanType,
  headers,
  objectType,
  stringType,
  stringTypeEmpty,
} from '../../utilis'
import { homeStandardPayload } from '../order-summary-data'
import { addItemToShoppingBagResponse } from '../../utilis/shoppingBag'
import { getProducts } from '../../utilis/selectProducts'

import { getResponseAndSessionCookies } from '../../utilis/redis'
import { processClientCookies } from '../../utilis/cookies'

describe('Order Summary -> Guest Checkout Scenarios', () => {
  let products
  let orderSummaryResp
  let cookies

  beforeAll(async () => {
    const { mergeCookies } = processClientCookies()
    products = await getProducts()
    try {
      const generateJsessionId = await superagent
        .get(eps.siteOptions.path)
        .set(headers)
      cookies = mergeCookies(generateJsessionId)
      const shoppingBagResponse = await addItemToShoppingBagResponse(
        cookies,
        products.productsSimpleId
      )
      cookies = mergeCookies(shoppingBagResponse)
    } catch (e) {
      throw e
    }

    try {
      orderSummaryResp = await superagent
        .get(eps.checkout.orderSummary.path)
        .set(headers)
        .set({ Cookie: cookies })
        .send(homeStandardPayload())
      cookies = mergeCookies(orderSummaryResp)
    } catch (e) {
      throw e
    }
  }, 60000)

  describe('It should return the order summary with isGuestOrder set to true', () => {
    it(
      'Order Summary Guest User',
      () => {
        const body = orderSummaryResp.body
        const orderSummaryGuestOrderSchema = {
          title: 'Order Summary Guest User',
          type: 'object',
          required: [
            'basket',
            'deliveryLocations',
            'giftCards',
            'deliveryInstructions',
            'smsMobileNumber',
            'shippingCountry',
            'savedAddresses',
            'ageVerificationDeliveryConfirmationRequired',
            'estimatedDelivery',
            'checkoutDiscountIntroEspot',
            'deliveryDetails',
          ],
          optional: ['checkoutDiscountIntroEspot', 'isGuestOrder'],
          properties: {
            isGuestOrder: booleanType(true),
            basket: objectType,
            deliveryLocations: arrayType(1),
            giftCards: arrayType(),
            deliveryInstructions: stringTypeEmpty,
            smsMobileNumber: stringTypeEmpty,
            shippingCountry: stringType,
            savedAddresses: arrayType(),
            ageVerificationDeliveryConfirmationRequired: booleanType(false),
            estimatedDelivery: arrayType(1, true, 'string'),
            checkoutDiscountIntroEspot: objectType,
            deliveryDetails: objectType,
          },
        }
        expect(body).toMatchSchema(orderSummaryGuestOrderSchema)
      },
      30000
    )

    // TODO: remove when redis is removed
    it('should keep client cookies and redis in sync', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderSummaryResp
      )
      expect(responseCookies).toMatchSession(session)
    })
  })
})
