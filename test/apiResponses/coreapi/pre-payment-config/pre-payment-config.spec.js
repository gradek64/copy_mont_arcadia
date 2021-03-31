jest.unmock('superagent')
import superagent from 'superagent'
import url from 'url'

import eps from '../routes_tests'
import { headers } from '../utilis'
import { createAccount, logIn, logOut } from '../utilis/userAccount'
import {
  addItemToShoppingBag2,
  guestAddItemToShoppingBag,
} from '../utilis/shoppingBag'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'

const SECOND = 1000

const JWT_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+$/

async function logInAsReturningUser(products, paymentMethod) {
  const newAccount = await createAccount()
  const shoppingBag = await addItemToShoppingBag2(
    newAccount.jsessionid,
    products.productsSimpleId
  )
  await payOrder(newAccount.jsessionid, shoppingBag.orderId, paymentMethod)
  await logOut()
  await logIn({
    username: newAccount.accountProfile.email,
    password: 'monty1',
  })

  return {
    jsessionid: newAccount.jsessionid,
    orderId: shoppingBag.orderId,
  }
}

describe.skip('Pre-Payment Config', () => {
  describe('Generic user - an unknown user who has not previously hit any transitional endpoints', () => {
    it('fails as a generic user', async () => {
      try {
        await superagent.post(eps.orders.prePaymentConfig.path).set(headers)
      } catch (error) {
        expect(error.response.body.statusCode).toBe(403)
        expect(error.response.body).toHaveProperty('message')
      }
    })
  })

  describe('Guest user', () => {
    let products
    beforeAll(async () => {
      products = await getProducts()
    }, 60 * SECOND)

    it('has a null Bank Identification Number (BIN)', async () => {
      const guestAddToBagResult = await guestAddItemToShoppingBag(
        products.productsSimpleId
      )

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: guestAddToBagResult.jsessionid })

      expect(response.body).toHaveProperty('binNumber', null)
    })

    it('has a populated JSON Web Token for Device Data Collection', async () => {
      const guestAddToBagResult = await guestAddItemToShoppingBag(
        products.productsSimpleId
      )

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: guestAddToBagResult.jsessionid })

      expect(response.body).toHaveProperty('ddcJwt')
      expect(JWT_REGEX.test(response.body.ddcJwt)).toBe(true)
    })

    it('has a secure URL for Device Data Collection', async () => {
      const guestAddToBagResult = await guestAddItemToShoppingBag(
        products.productsSimpleId
      )
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: guestAddToBagResult.jsessionid })

      expect(response.body).toHaveProperty('ddcUrl')
      const ddcUrl = url.parse(response.body.ddcUrl)
      expect(ddcUrl.protocol).toEqual('https:')
    })

    it('echoes the supplied orderId in the response', async () => {
      const orderId = 'test-order-id'
      const guestAddToBagResult = await guestAddItemToShoppingBag(
        products.productsSimpleId
      )
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: guestAddToBagResult.jsessionid })
        .send({ orderId })

      expect(response.body).toHaveProperty('orderId')
      expect(response.body.orderId).toEqual(orderId)
    })

    it('has a null orderId in the response when omitted from the request', async () => {
      const guestAddToBagResult = await guestAddItemToShoppingBag(
        products.productsSimpleId
      )
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: guestAddToBagResult.jsessionid })

      expect(response.body).toHaveProperty('orderId')
      expect(response.body.orderId).toBeNull()
    })
  })

  describe('Newly registered user', () => {
    it('has a null Bank Identification Number (BIN)', async () => {
      const newAccount = await createAccount()
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: newAccount.jsessionid })

      expect(response.body).toHaveProperty('binNumber', null)
    })

    it('has a populated JSON Web Token for Device Data Collection', async () => {
      const newAccount = await createAccount()
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: newAccount.jsessionid })

      expect(response.body).toHaveProperty('ddcJwt')
      expect(JWT_REGEX.test(response.body.ddcJwt)).toBe(true)
    })

    it('has a secure URL for Device Data Collection', async () => {
      const newAccount = await createAccount()
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: newAccount.jsessionid })

      expect(response.body).toHaveProperty('ddcUrl')
      const ddcUrl = url.parse(response.body.ddcUrl)
      expect(ddcUrl.protocol).toEqual('https:')
    })

    it('echoes the supplied orderId in the response', async () => {
      const orderId = 'test-order-id'
      const newAccount = await createAccount()
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: newAccount.jsessionid })
        .send({ orderId })

      expect(response.body).toHaveProperty('orderId')
      expect(response.body.orderId).toEqual(orderId)
    })

    it('has a null orderId in the response when omitted from the request', async () => {
      const newAccount = await createAccount()
      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: newAccount.jsessionid })

      expect(response.body).toHaveProperty('orderId')
      expect(response.body.orderId).toBeNull()
    })
  })

  describe('Returning user', () => {
    let products
    beforeAll(async () => {
      products = await getProducts()
    }, 60 * SECOND)

    describe('supplies the leading six digits of the Bank Identification Number (BIN) supported card types', () => {
      it('for VISA', async () => {
        jest.setTimeout(60 * SECOND)

        const returningUser = await logInAsReturningUser(products, 'VISA')

        const response = await superagent
          .post(eps.orders.prePaymentConfig.path)
          .set(headers)
          .set({ Cookie: returningUser.jsessionid })

        expect(response.body).toHaveProperty('binNumber')
        expect(typeof response.body.binNumber).toBe('string')
        expect(/^\d{6}$/.test(response.body.binNumber)).toBe(true)
      })

      it('for Mastercard', async () => {
        jest.setTimeout(60 * SECOND)

        const returningUser = await logInAsReturningUser(products, 'MCARD')

        const response = await superagent
          .post(eps.orders.prePaymentConfig.path)
          .set(headers)
          .set({ Cookie: returningUser.jsessionid })

        expect(response.body).toHaveProperty('binNumber')
        expect(typeof response.body.binNumber).toBe('string')
        expect(/^\d{6}$/.test(response.body.binNumber)).toBe(true)
      })

      // TODO New Day Mastercard
    })

    it('has a null Bank Identification Number (BIN) for unsupported card types e.g. American Express', async () => {
      jest.setTimeout(60 * SECOND)

      const returningUser = await logInAsReturningUser(products, 'AMEX')

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: returningUser.jsessionid })

      expect(response.body).toHaveProperty('binNumber', null)
    })

    it('has a populated JSON Web Token for Device Data Collection', async () => {
      jest.setTimeout(60 * SECOND)

      const returningUser = await logInAsReturningUser(products, 'VISA')

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: returningUser.jsessionid })

      expect(response.body).toHaveProperty('ddcJwt')
      expect(JWT_REGEX.test(response.body.ddcJwt)).toBe(true)
    })

    it('has a secure URL for Device Data Collection', async () => {
      jest.setTimeout(60 * SECOND)

      const returningUser = await logInAsReturningUser(products, 'VISA')

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: returningUser.jsessionid })

      expect(response.body).toHaveProperty('ddcUrl')
      const ddcUrl = url.parse(response.body.ddcUrl)
      expect(ddcUrl.protocol).toEqual('https:')
    })

    it('echoes the supplied orderId in the response', async () => {
      jest.setTimeout(60 * SECOND)

      const returningUser = await logInAsReturningUser(products, 'VISA')

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: returningUser.jsessionid })
        .send({ orderId: `${returningUser.orderId}` })

      expect(response.body).toHaveProperty('orderId')
      expect(response.body.orderId).toEqual(`${returningUser.orderId}`)
    })

    it('has a null orderId in the response when omitted from the request', async () => {
      jest.setTimeout(60 * SECOND)

      const returningUser = await logInAsReturningUser(products, 'VISA')

      const response = await superagent
        .post(eps.orders.prePaymentConfig.path)
        .set(headers)
        .set({ Cookie: returningUser.jsessionid })

      expect(response.body).toHaveProperty('orderId')
      expect(response.body.orderId).toBeNull()
    })
  })
})
