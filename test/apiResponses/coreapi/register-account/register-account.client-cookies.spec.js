require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import {
  booleanType,
  booleanTypeAny,
  headers,
  numberType,
  numberTypePattern,
  objectType,
  stringType,
  stringTypeEmpty,
  stringTypeNumber,
} from '../utilis'
import { createSpecificUser, registerErrorEmail } from './register-account-data'
import {
  EXISTING_EMAIL,
  EMPTY_EMAIL,
  EMPTY_PASSWORD,
  CONFIRM_PASSWORD,
  MISSMATCH_PASSWORD,
  SHORT_PASSWORD,
  SAME_CHARS_PASSWORD,
  ALL_NUMERIC_PASSWORD,
  ALL_CHARS_PASSWORD,
  CHARS_LIMIT_PASSWORD,
} from '../message-data'
import { createAccountResponse } from './../utilis/userAccount'
import {
  ddpPropertiesSchema,
  ddpRequiredProperties,
} from '../my-account/my-account-schemas'

const registerAccountSchema = {
  title: 'Logon User Partial Profile Schema',
  type: 'object',
  required: [
    'basketItemCount',
    'billingDetails',
    'creditCard',
    'deliveryDetails',
    'email',
    'exists',
    'firstName',
    'hasBillingDetails',
    'hasCardNumberHash',
    'hasDeliveryDetails',
    'hasPayPal',
    'lastName',
    'subscriptionId',
    'title',
    'userTrackingId',
    'version',
    'expId1',
    'expId2',
    'success',
    ...ddpRequiredProperties,
  ],
  optional: ['userId', 'userToken'],
  properties: {
    basketItemCount: numberTypePattern(0, 0),
    billingDetails: objectType,
    creditCard: objectType,
    deliveryDetails: objectType,
    email: stringType,
    exists: booleanType(true),
    firstName: stringTypeEmpty,
    hasBillingDetails: booleanType(false),
    hasCardNumberHash: booleanType(false),
    hasDeliveryDetails: booleanType(false),
    hasPayPal: booleanType(false),
    lastName: stringTypeEmpty,
    subscriptionId: numberType,
    title: stringTypeEmpty,
    userTrackingId: numberType,
    version: stringType,
    userId: stringTypeNumber,
    userToken: stringType,
    expId1: stringType,
    expId2: stringType,
    success: booleanTypeAny,
    ...ddpPropertiesSchema,
  },
}

describe('It should return the Account Registration Json Schema', () => {
  describe('Register account with subscription', () => {
    let response
    beforeAll(async () => {
      response = await createAccountResponse({
        subscribe: true,
      })
      response = response.body
    })
    it('Register Account', () => {
      expect(response).toMatchSchema(registerAccountSchema)
    })

    it('Register Account Credit Card Schema', () => {
      const body = response.creditCard
      const creditCardSchema = {
        title: 'Register Account Schema Credit Card Object Schema',
        type: 'object',
        required: [
          'cardNumberHash',
          'cardNumberStar',
          'expiryMonth',
          'expiryYear',
          'type',
        ],
        properties: {
          cardNumberHash: stringTypeEmpty,
          cardNumberStar: stringTypeEmpty,
          expiryMonth: stringTypeEmpty,
          expiryYear: stringTypeEmpty,
          type: stringTypeEmpty,
        },
      }
      expect(body).toMatchSchema(creditCardSchema)
    })

    it('Register Account Billing Details Schema', () => {
      const body = response.billingDetails
      const billingDetailsSchema = {
        title: 'Register Account Schema Billing Details Object Schema',
        type: 'object',
        required: ['addressDetailsId', 'nameAndPhone', 'address'],
        properties: {
          address: objectType,
          addressDetailsId: numberTypePattern(-1, -1),
          nameAndPhone: objectType,
        },
      }
      expect(body).toMatchSchema(billingDetailsSchema)
    })

    it('Register Account Billing Details nameAndPhone Schema', () => {
      const body = response.billingDetails.nameAndPhone
      const billingDetailsSchema = {
        title: 'Register Account Schema Billing Details NameAndPhone Schema',
        type: 'object',
        required: ['lastName', 'telephone', 'title', 'firstName'],
        properties: {
          firstName: stringTypeEmpty,
          lastName: stringTypeEmpty,
          telephone: stringTypeEmpty,
          title: stringTypeEmpty,
        },
      }
      expect(body).toMatchSchema(billingDetailsSchema)
    })

    it('Register Account Billing Details address Schema', () => {
      const body = response.billingDetails.address
      const billingDetailsSchema = {
        title: 'Register Account Schema Billing Details Address Schema',
        type: 'object',
        required: [
          'address1',
          'address2',
          'city',
          'country',
          'postcode',
          'state',
        ],
        properties: {
          address1: stringTypeEmpty,
          address2: stringTypeEmpty,
          city: stringTypeEmpty,
          country: stringTypeEmpty,
          postcode: stringTypeEmpty,
          state: stringTypeEmpty,
        },
      }
      expect(body).toMatchSchema(billingDetailsSchema)
    })

    it('Register Account Delivery Details Schema', () => {
      const body = response.deliveryDetails
      const deliveryDetailsSchema = {
        title: 'Register Account Schema Delivery Details Object Schema',
        type: 'object',
        required: ['addressDetailsId', 'nameAndPhone', 'address'],
        properties: {
          address: objectType,
          addressDetailsId: numberTypePattern(-1, -1),
          nameAndPhone: objectType,
        },
      }
      expect(body).toMatchSchema(deliveryDetailsSchema)
    })

    it('Register Account Delivery Details nameAndPhone Schema', () => {
      const body = response.deliveryDetails.nameAndPhone
      const deliveryDetailsSchema = {
        title: 'Register Account Schema Delivery Details NameAndPhone Schema',
        type: 'object',
        required: ['lastName', 'telephone', 'title', 'firstName'],
        properties: {
          firstName: stringTypeEmpty,
          lastName: stringTypeEmpty,
          telephone: stringTypeEmpty,
          title: stringTypeEmpty,
        },
      }
      expect(body).toMatchSchema(deliveryDetailsSchema)
    })

    it('Register Account Delivery Details address Schema', () => {
      const body = response.deliveryDetails.address
      const deliveryDetailsSchema = {
        title: 'Register Account Schema Delivery Details Address Schema',
        type: 'object',
        required: [
          'address1',
          'address2',
          'city',
          'country',
          'postcode',
          'state',
        ],
        properties: {
          address1: stringTypeEmpty,
          address2: stringTypeEmpty,
          city: stringTypeEmpty,
          country: stringTypeEmpty,
          postcode: stringTypeEmpty,
          state: stringTypeEmpty,
        },
      }
      expect(body).toMatchSchema(deliveryDetailsSchema)
    })
  })
  describe('Register Account with no Subscription', () => {
    let response
    beforeAll(async () => {
      response = await createAccountResponse({ subscribe: false })
      response = response.body
    })

    it('Register Account Schema No Subscription', () => {
      const regWithoutSubscriptionSchema = {
        ...registerAccountSchema,
        properties: {
          ...registerAccountSchema.properties,
          subscriptionId: { type: 'string', pattern: '^$' },
        },
      }
      expect(response).toMatchSchema(regWithoutSubscriptionSchema)
    })
  })

  describe('Register Account with errors', () => {
    let response
    it('It should return an error response with existing email', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(
          createSpecificUser('automation1@a.com', 'test12', 'test12', false)
        )
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(EXISTING_EMAIL)
    })
    it('It should return an error response with no data sent', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(EMPTY_EMAIL)
    })

    it('It should return an error response with no email sent', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(EMPTY_EMAIL)
    })

    it('It should return an error response with no password sent', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(registerErrorEmail, '', '', false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(EMPTY_PASSWORD)
    })

    it('It should return an error response with no confirm password sent', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(registerErrorEmail, 'test12', '', false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(CONFIRM_PASSWORD)
    })

    it('It should return an error response with different password and confirm password', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(
          createSpecificUser(registerErrorEmail, 'test12', 'test123', false)
        )
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(MISSMATCH_PASSWORD)
    })

    it('It should return an error response with password too short sent', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(registerErrorEmail, 'test1', 'test1', false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(SHORT_PASSWORD)
    })

    it('It should return an error response with password with consecutive character use exceeds limit', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(
          createSpecificUser(
            registerErrorEmail,
            'aaaaaaaa12',
            'aaaaaaaa12',
            false
          )
        )
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(SAME_CHARS_PASSWORD)
    })

    it('It should return an error response with password with repeating character exceeds limit', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(
          createSpecificUser(
            registerErrorEmail,
            'asawaearad12',
            'asawaearad12',
            false
          )
        )
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(CHARS_LIMIT_PASSWORD)
    })

    it('It should return an error response with all numeric password forbidden', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(registerErrorEmail, '123456', '123456', false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(ALL_NUMERIC_PASSWORD)
    })

    it('It should return an error response with all letter password forbidden', async () => {
      response = await superagent
        .post(eps.myAccount.register.path)
        .set(headers)
        .send(createSpecificUser(registerErrorEmail, 'qwerty', 'qwerty', false))
        .then(() => {})
        .catch((error) => {
          return error
        })
      const body = response.response.body
      expect(body).toMatchSchema(ALL_CHARS_PASSWORD)
    })
  })

  describe('Register acount for native Apps', () => {
    describe('When I register an account by additonally providing the appId', () => {
      let response
      beforeAll(async () => {
        response = await createAccountResponse({
          subscribe: true,
          appId: '1234-1234-1234-1234',
          deviceType: 'apps',
        })
        response = response.body
      })
      it('Then I receive back the userId', () => {
        // WCS is now sending us back userId.
        // So removed '.not' statement
        expect(response.userId).toBeDefined()
        expect(typeof response.userId).toBe('string')
      })
      it('Then I receive back the userToken', () => {
        // WCS is now sending us back userToken.
        // So removed '.not' statement
        expect(typeof response.userToken).toBe('string')
      })
      it('Then the rest of the response matches the regular registering schema', () => {
        expect(response).toMatchSchema(registerAccountSchema)
      })
    })
  })
})
