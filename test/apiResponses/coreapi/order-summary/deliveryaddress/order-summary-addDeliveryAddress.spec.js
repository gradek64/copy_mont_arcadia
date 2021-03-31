/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../../routes_tests'
import {
  headers,
  stringTypeEmpty,
  numberType,
  stringTypePattern,
  numberTypePattern,
  stringType,
  objectType,
} from '../../utilis'

import { INVALID_PHONE_NO, INVALID_STATE } from '../../message-data'
import { addNewDeliveryAddressDefault } from '../order-summary-data'
import { createAccount } from '../../utilis/userAccount'
import { payOrder } from '../../utilis/payOrder'
import { authenticateMySession } from '../../utilis/authenticate'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getProducts } from '../../utilis/selectProducts'

describe('Orders Summary - delivery dddress', () => {
  let jsessionId
  let originalDeliveryAddress
  let addNewDeliveryAddress
  let amendDeliveryAddress
  let deleteDeliveryAddress

  beforeAll(async () => {
    const products = await getProducts()
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
  }, 60000)

  describe('POST: - add new delivery address', () => {
    it('Should add new delivery address', async () => {
      try {
        addNewDeliveryAddress = await superagent
          .post(eps.checkout.addOrderSummaryDeliveryAddress.path)
          .set(headers)
          .set({ Cookie: authenticateMySession(jsessionId) })
          .send(addNewDeliveryAddressDefault)
      } catch (e) {
        addNewDeliveryAddress = e
      }
      originalDeliveryAddress = addNewDeliveryAddress.body.savedAddresses[1]
      const responseSavedAddress = addNewDeliveryAddress.body.savedAddresses[0]

      const {
        address: { address1, city, country, postcode },
        nameAndPhone: { telephone, title, firstName, lastName },
      } = addNewDeliveryAddressDefault

      const addDeliveryAddressSchema = {
        title: 'Add New Delivery Address Schema',
        type: 'object',
        required: [
          'id',
          'addressName',
          'selected',
          'address1',
          'address2',
          'city',
          'state',
          'country',
          'telephone',
          'title',
          'firstName',
          'lastName',
        ],
        properties: {
          id: numberType,
          addressName: stringTypePattern('DUNDEE, DD2 2DD, United Kingdom'),
          selected: true,
          address1: stringTypePattern(address1),
          address2: stringTypeEmpty,
          city: stringTypePattern(city),
          state: stringTypeEmpty,
          country: stringTypePattern(country),
          telephone: stringTypePattern(telephone),
          postcode: stringTypePattern(postcode),
          title: stringTypePattern(title),
          firstName: stringTypePattern(firstName),
          lastName: stringTypePattern(lastName),
        },
      }
      expect(responseSavedAddress).toMatchSchema(addDeliveryAddressSchema)
    })
  })

  describe('PUT: - update delivery address', () => {
    it('Should have selected the original delivery address', async () => {
      try {
        amendDeliveryAddress = await superagent
          .put(eps.checkout.amendOrderSummaryDeliveryAddress.path)
          .set(headers)
          .set({ Cookie: authenticateMySession(jsessionId) })
          .send({ addressId: originalDeliveryAddress.id })
      } catch (e) {
        amendDeliveryAddress = e
      }

      const {
        id,
        addressName,
        address1,
        address2,
        city,
        country,
        telephone,
        title,
        firstName,
        lastName,
        postcode,
      } = originalDeliveryAddress

      const amendDeliveryAddressSchema = {
        title: 'Add New Delivery Address Schema',
        type: 'object',
        required: [
          'id',
          'addressName',
          'selected',
          'address1',
          'address2',
          'city',
          'state',
          'country',
          'telephone',
          'title',
          'firstName',
          'lastName',
          'postcode',
        ],
        properties: {
          id: numberTypePattern(id),
          addressName: stringTypePattern(addressName),
          selected: true,
          address1: stringTypePattern(address1),
          address2: stringTypePattern(address2),
          city: stringTypePattern(city),
          state: stringTypeEmpty,
          country: stringTypePattern(country),
          telephone: stringTypePattern(telephone),
          postcode: stringTypePattern(postcode),
          title: stringTypePattern(title),
          firstName: stringTypePattern(firstName),
          lastName: stringTypePattern(lastName),
        },
      }
      expect(amendDeliveryAddress.body.savedAddresses[1]).toMatchSchema(
        amendDeliveryAddressSchema
      )
    })

    it('should have updated the basket with the original customer name', () => {
      const { telephone, title, firstName, lastName } = originalDeliveryAddress
      const nameAndPhoneSchema = {
        title:
          'My Account - User Full Profile Schema Billing Details NameAndPhone Schema',
        type: 'object',
        required: ['lastName', 'telephone', 'title', 'firstName'],
        properties: {
          lastName: stringTypePattern(lastName),
          telephone: stringTypePattern(telephone),
          title: stringTypePattern(title),
          firstName: stringTypePattern(firstName),
        },
      }
      expect(
        amendDeliveryAddress.body.deliveryDetails.nameAndPhone
      ).toMatchSchema(nameAndPhoneSchema)
    })

    it('should have updated the basket with the original customer address', () => {
      const {
        address1,
        address2,
        city,
        country,
        postcode,
      } = originalDeliveryAddress
      const addressDetailsSchema = {
        title:
          'My Account - User Full Profile Schema Billing Details Address Schema',
        type: 'object',
        required: [
          'address1',
          'address2',
          'city',
          'state',
          'country',
          'postcode',
        ],
        properties: {
          address1: stringTypePattern(address1),
          address2: stringTypePattern(address2),
          city: stringTypePattern(city),
          state: stringTypeEmpty,
          country: stringTypePattern(country),
          postcode: stringTypePattern(postcode),
        },
      }
      expect(amendDeliveryAddress.body.deliveryDetails.address).toMatchSchema(
        addressDetailsSchema
      )
    })
  })

  describe('DELETE: remove delivery address', () => {
    it('should delete the selected delivery address', async () => {
      try {
        deleteDeliveryAddress = await superagent
          .delete(eps.checkout.orderSummaryDeleteDeliveryAddress.path)
          .set(headers)
          .set({ Cookie: authenticateMySession(jsessionId) })
          .send({ addressId: addNewDeliveryAddress.body.savedAddresses[0].id })
      } catch (e) {
        deleteDeliveryAddress = e
      }

      const deleteDeliveryAddressSchema = {
        title: 'Delete Details Address Schema',
        type: 'object',
        required: ['DeliveryOptionsDetails', 'action', 'message', 'success'],
        properties: {
          DeliveryOptionsDetails: objectType,
          action: stringType,
          message: stringType,
          success: stringTypePattern('true'),
        },
      }
      expect(deleteDeliveryAddress.body).toMatchSchema(
        deleteDeliveryAddressSchema
      )
    })
  })

  describe('POST: - add new delivery address error responses', () => {
    it('Should return an error when invalid phone number is passed', async () => {
      const address = {
        ...addNewDeliveryAddressDefault,
        nameAndPhone: {
          ...addNewDeliveryAddressDefault.nameAndPhone,
          telephone: '123',
        },
      }
      const addNewDeliveryAddress = await superagent
        .post(eps.checkout.addOrderSummaryDeliveryAddress.path)
        .set(headers)
        .set({ Cookie: authenticateMySession(jsessionId) })
        .send(address)
        .then(() => {})
        .catch((error) => {
          return error
        })
      const responseInvalidPhone = addNewDeliveryAddress.response.body
      expect(responseInvalidPhone).toMatchSchema(INVALID_PHONE_NO)
    })

    it('Should return an error when invalid state is passed', async () => {
      const address = {
        ...addNewDeliveryAddressDefault,
        address: {
          ...addNewDeliveryAddressDefault.address,
          country: 'Canada',
          state: '',
        },
      }
      const addNewDeliveryAddress = await superagent
        .post(eps.checkout.addOrderSummaryDeliveryAddress.path)
        .set(headers)
        .set({ Cookie: authenticateMySession(jsessionId) })
        .send(address)
        .then(() => {})
        .catch((error) => {
          return error
        })
      const responseInvalidState = addNewDeliveryAddress.response.body
      expect(responseInvalidState).toMatchSchema(INVALID_STATE)
    })
  })
})
