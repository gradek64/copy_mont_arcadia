require('@babel/register')

import { getProducts } from '../utilis/selectProducts'
import { createAccountResponse } from '../utilis/userAccount'
import { addItemToShoppingBagResponse } from '../utilis/shoppingBag'
import {
  getResponseAndSessionCookies,
  getJessionIdFromResponse,
} from '../utilis/redis'
import address from '../utilis/address'

describe('find address in checkout', () => {
  describe('find address United Kingdom', () => {
    it(
      'should keep client cookies in sync with redis',
      async () => {
        const products = await getProducts()
        const newAccountResponse = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccountResponse)
        await addItemToShoppingBagResponse(
          jsessionid,
          products.productsSimpleId
        )
        const findAddressResponse = await address.findAddress()
        const { responseCookies, session } = await getResponseAndSessionCookies(
          findAddressResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('GET: address by moniker', () => {
    it(
      'should keep client cookies in sync with redis',
      async () => {
        const products = await getProducts()
        const newAccountResponse = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccountResponse)
        await addItemToShoppingBagResponse(
          jsessionid,
          products.productsSimpleId
        )
        const findAddressResponse = await address.findAddress()
        const { responseCookies, session } = await getResponseAndSessionCookies(
          findAddressResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
})
