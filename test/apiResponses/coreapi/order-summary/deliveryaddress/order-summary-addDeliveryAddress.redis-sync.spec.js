/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../../routes_tests'
import { headers } from '../../utilis'

import { addNewDeliveryAddressDefault } from '../order-summary-data'
import { createAccount } from '../../utilis/userAccount'
import { payOrder } from '../../utilis/payOrder'
import { authenticateMySession } from '../../utilis/authenticate'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getProducts } from '../../utilis/selectProducts'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('Orders Summary - delivery dddress', () => {
  let products
  let jsessionId
  let originalDeliveryAddress
  let addNewDeliveryAddress
  let amendDeliveryAddress
  let deleteDeliveryAddress

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeAll(async () => {
    const newAccount = await createAccount()
    jsessionId = newAccount.jsessionid

    await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    const orderSummaryResp = await superagent
      .get(eps.checkout.orderSummary.path)
      .set(headers)
      .set({ Cookie: jsessionId })
    const orderId = orderSummaryResp.body.basket.orderId
    await payOrder(newAccount.jsessionid, orderId, 'VISA')

    await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )
    addNewDeliveryAddress = await superagent
      .post(eps.checkout.addOrderSummaryDeliveryAddress.path)
      .set(headers)
      .set({ Cookie: authenticateMySession(jsessionId) })
      .send(addNewDeliveryAddressDefault)
  }, 60000)

  describe('POST: - add new delivery address', () => {
    it('should keep redis in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        addNewDeliveryAddress
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe('PUT: - update delivery address', () => {
    it('should keep redis in sync with client', async () => {
      try {
        amendDeliveryAddress = await superagent
          .put(eps.checkout.amendOrderSummaryDeliveryAddress.path)
          .set(headers)
          .set({ Cookie: authenticateMySession(jsessionId) })
          .send({ addressId: originalDeliveryAddress.id })
      } catch (e) {
        amendDeliveryAddress = e
      }
      const { responseCookies, session } = await getResponseAndSessionCookies(
        amendDeliveryAddress
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe('DELETE: remove delivery address', () => {
    it('should keep redis in sync with client', async () => {
      try {
        deleteDeliveryAddress = await superagent
          .delete(eps.checkout.orderSummaryDeleteDeliveryAddress.path)
          .set(headers)
          .set({ Cookie: authenticateMySession(jsessionId) })
          .send({ addressId: addNewDeliveryAddress.body.savedAddresses[0].id })
      } catch (e) {
        deleteDeliveryAddress = e
      }
      const { responseCookies, session } = await getResponseAndSessionCookies(
        deleteDeliveryAddress
      )
      expect(responseCookies).toMatchSession(session)
    })
  })
})
