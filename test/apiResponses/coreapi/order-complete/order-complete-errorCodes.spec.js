import chai from 'chai'

chai.use(require('chai-json-schema'))

import { createAccount } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { cardDataPayload } from '../utilis/creditCard'
import { payOrderError, paymentMethodPayload } from '../utilis/payOrder'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'
import {
  INVALID_CARD_NUMBER,
  INVALID_DATA_TYPE,
  INVALID_POSTCODE,
  INVALID_ADDRESS_FIRST_LINE,
  INVALID_PHONE_NUMBER,
  INVALID_BLANK_CITY,
  INVALID_ADDRESS_CHARACTERS,
  INVALID_EXPIRY_DATE,
  INVALID_LAST_NAME,
} from '../message-data'

const TIMEOUT = 60 * 1000

describe('It should return an error response for POST /order failures', () => {
  let products
  let newAccount
  let shoppingBag
  let errResponse
  let body

  beforeAll(async () => {
    products = await getProducts()
  }, TIMEOUT)

  beforeEach(async () => {
    newAccount = await createAccount()
    shoppingBag = await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )
    body = paymentMethodPayload(shoppingBag.orderId, 'VISA')
  }, TIMEOUT)

  describe('Invalid payment payload', () => {
    // We will skip this for now as account card payments have been turned off for some customers
    it.skip(
      'Should reject invalid card number',
      async () => {
        const newBody = {
          ...body,
          creditCard: {
            ...cardDataPayload,
            cardNumber: '0',
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_CARD_NUMBER)
      },
      TIMEOUT
    )

    it(
      'Should reject invalid card data (cvv)',
      async () => {
        const newBody = {
          ...body,
          cardCvv: 'AAA',
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_DATA_TYPE)
      },
      TIMEOUT
    )

    it(
      'Should reject invalid expiry date ',
      async () => {
        const newBody = {
          ...body,
          creditCard: {
            ...cardDataPayload,
            expiryYear: '1970',
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }
        expect(errResponse).toMatchSchema(INVALID_EXPIRY_DATE)
      },
      TIMEOUT
    )
  })

  describe('Invalid order details payload', () => {
    it(
      'Should reject invalid postcode in billing address',
      async () => {
        const newBody = {
          ...body,
          billingDetails: {
            ...body.billingDetails,
            address: {
              ...body.billingDetails.address,
              postcode: 'ACB',
            },
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_POSTCODE)
      },
      TIMEOUT
    )

    it(
      'Should reject invalid postcode in delivery address',
      async () => {
        const newBody = {
          ...body,
          deliveryAddress: {
            ...body.deliveryAddress,
            postcode: 'ACB',
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_POSTCODE)
      },
      TIMEOUT
    )

    it(
      'Should reject blank city in billing address',
      async () => {
        const newBody = {
          ...body,
          billingDetails: {
            ...body.billingDetails,
            address: {
              ...body.billingDetails.address,
              city: '',
            },
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_BLANK_CITY)
      },
      TIMEOUT
    )

    it(
      'Should reject blank city in delivery address',
      async () => {
        const newBody = {
          ...body,
          deliveryAddress: {
            ...body.deliveryAddress,
            city: '',
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_BLANK_CITY)
      },
      TIMEOUT
    )

    it(
      'Should reject invalid telephone number in billing address',
      async () => {
        const newBody = {
          ...body,
          billingDetails: {
            ...body.billingDetails,
            nameAndPhone: {
              ...body.billingDetails.nameAndPhone,
              telephone: '415',
            },
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_PHONE_NUMBER)
      },
      TIMEOUT
    )

    it(
      'Should reject invalid telephone number in delivery address',
      async () => {
        const newBody = {
          ...body,
          deliveryNameAndPhone: {
            ...body.deliveryNameAndPhone,
            telephone: '415',
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_PHONE_NUMBER)
      },
      TIMEOUT
    )

    it(
      'Should reject special characters in billing address',
      async () => {
        const newBody = {
          ...body,
          billingDetails: {
            ...body.billingDetails,
            address: {
              ...body.billingDetails.address,
              address1: '广东省佛山市禅城区新明',
            },
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_ADDRESS_CHARACTERS)
      },
      TIMEOUT
    )

    it(
      'Should reject special characters in delivery address',
      async () => {
        const newBody = {
          ...body,
          deliveryAddress: {
            ...body.deliveryAddress,
            address1: '广东省佛山市禅城区新明',
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_ADDRESS_CHARACTERS)
      },
      TIMEOUT
    )
  })

  describe('Blank address1 details payload', () => {
    it(
      'Should reject blank billing address1',
      async () => {
        const newBody = {
          ...body,
          billingDetails: {
            ...body.billingDetails,
            address: {
              ...body.billingDetails.address,
              address1: '',
            },
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_ADDRESS_FIRST_LINE)
      },
      TIMEOUT
    )

    it(
      'Should reject blank delivery address1',
      async () => {
        const newBody = {
          ...body,
          deliveryAddress: {
            ...body.deliveryAddress,
            address1: '',
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_ADDRESS_FIRST_LINE)
      },
      TIMEOUT
    )

    it(
      'Should reject blank billing last name',
      async () => {
        const newBody = {
          ...body,
          billingDetails: {
            ...body.billingDetails,
            nameAndPhone: {
              ...body.billingDetails.nameAndPhone,
              lastName: '',
            },
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_LAST_NAME)
      },
      TIMEOUT
    )

    it(
      'Should reject blank delivery last name',
      async () => {
        const newBody = {
          ...body,
          deliveryNameAndPhone: {
            ...body.deliveryNameAndPhone,
            lastName: '',
          },
          creditCard: {
            ...cardDataPayload,
          },
        }

        try {
          errResponse = await payOrderError(
            newAccount.jsessionid,
            shoppingBag.orderId,
            newBody
          )
        } catch (e) {
          errResponse = e.response.body
        }

        expect(errResponse).toMatchSchema(INVALID_LAST_NAME)
      },
      TIMEOUT
    )
  })
})
