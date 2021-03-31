require('@babel/register')

import { createAccountResponse } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { addItemToShoppingBagResponse } from '../utilis/shoppingBag'
import address from '../utilis/address'
import { stringType, stringOrNull, addPropsToSchema } from '../utilis'
import { INVALID_DELIVERY_ADDRESS_POSTCODE_AND_COUNTRY } from '../message-data'
import { addressDetailsSchema } from '../my-account/my-account-schemas'
import { getResponseAndSessionCookies } from '../utilis/redis'
import { processClientCookies } from '../utilis/cookies'

describe('find address in checkout', () => {
  describe('find address United Kingdom', () => {
    let products
    let findAddress
    let mergeCookies

    beforeAll(async () => {
      ;({ mergeCookies } = processClientCookies())
      products = await getProducts()
      const newAccountResponse = await createAccountResponse()
      const newAccountCookies = mergeCookies(newAccountResponse)
      await addItemToShoppingBagResponse(
        newAccountCookies,
        products.productsSimpleId
      )
      findAddress = await address.findAddress()
    }, 60000)

    it(
      'should contain an array',
      async () => {
        expect(Array.isArray(findAddress.body)).toBe(true)
        expect(findAddress.body.length).toBe(1)
      },
      30000
    )

    it(
      'should return the expected properties',
      async () => {
        findAddress.body.forEach((address) => {
          const findAddressSchema = {
            title: 'Find Address Properties',
            type: 'object',
            required: ['address', 'moniker'],
            properties: {
              address: stringType,
              moniker: stringType,
            },
          }
          expect(address).toMatchSchema(findAddressSchema)
        })
      },
      30000
    )

    it(
      'should return a list of addresses',
      async () => {
        const listOfAddresses = await address.findAddress(undefined, 'HA47HH')
        expect(Array.isArray(listOfAddresses.body)).toBe(true)
        expect(listOfAddresses.body.length).toBeGreaterThan(0)
      },
      30000
    )

    it(
      'should return an empty array if address is not found',
      async () => {
        const emptyArray = await address.findAddress(undefined, 'ZA15ZZ')
        expect(Array.isArray(emptyArray.body)).toBe(true)
        expect(emptyArray.body.length).toBe(0)
      },
      30000
    )

    it(
      'should return a 422 error code if an invalid address is provided',
      async () => {
        try {
          await address.findAddress('IND', 'NW15QD')
        } catch (e) {
          expect(e.response.body).toMatchSchema(
            INVALID_DELIVERY_ADDRESS_POSTCODE_AND_COUNTRY
          )
          expect(e.response.body.statusCode).toEqual(422)
        }
      },
      60000
    )

    // can be removed when redis is removed
    it('should keep response cookies an redis cookies in sync', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        findAddress
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe('GET: address by moniker', () => {
    let addressMoniker
    let products
    let mergeCookies

    beforeAll(async () => {
      ;({ mergeCookies } = processClientCookies())
      products = await getProducts()
      const newAccountResponse = await createAccountResponse()
      const newAccountCookies = mergeCookies(newAccountResponse)
      await addItemToShoppingBagResponse(
        newAccountCookies,
        products.productsSimpleId
      )
      const findAddress = await address.findAddress()

      addressMoniker = await address.findAddressMoniker(
        findAddress.body[0].moniker
      )
    }, 60000)

    it('should match the address schema', () => {
      expect(addressMoniker.body).toMatchSchema(
        addPropsToSchema(addressDetailsSchema, {
          address2: stringOrNull,
          state: stringOrNull,
        })
      )
    })

    // can be removed when redis is removed
    it('should keep response cookies an redis cookies in sync', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        addressMoniker
      )
      expect(responseCookies).toMatchSession(session)
    })
  })
})
