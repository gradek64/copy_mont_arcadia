import jwt from 'jsonwebtoken'
import url from 'url'
import { createAccount } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'
import completedOrderSchema from './order-complete.schema'

describe('3D Secure v1 for new users', () => {
  let orderCompleted

  beforeAll(async () => {
    const products = await getProducts()
    const newAccount = await createAccount()
    const shoppingBag = await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )

    // The name '3D. Authorised' must be used in conjunction with the card number
    // 4444333322221111 to trigger a 3D Secure flow in the payment sandbox.
    orderCompleted = await payOrder(
      newAccount.jsessionid,
      shoppingBag.orderId,
      'VISA',
      {
        nameAndPhone: {
          firstName: '3D.',
          lastName: 'Authorised',
        },
      }
    )
  }, 60000)

  it('should have a status code of 200', () => {
    expect(orderCompleted.statusCode).toBe(200)
  })

  it('should receive 3D Secure details in a vbvForm', () => {
    const responseBodySchema = {
      title: 'vbvForm',
      type: 'object',
      required: completedOrderSchema.requiredPropertiesThreeDSecureV1,
      properties: completedOrderSchema.threeDSecureV1Schema,
    }
    expect(orderCompleted.body).toMatchSchema(responseBodySchema)
  })

  it('should have a correctly structured vbvForm', () => {
    const { vbvForm } = orderCompleted.body
    const vbvFormSchema = {
      title: 'vbvForm',
      type: 'object',
      required: completedOrderSchema.requiredPropertiesThreeDSecureV1VbvForm,
      properties: completedOrderSchema.threeDSecureV1VbvFormSchema,
    }
    expect(vbvForm).toMatchSchema(vbvFormSchema)
  })

  it('termUrl is formed correctly', () => {
    // 'termUrl' allows for plain http to run in development.
    const { termUrl } = orderCompleted.body.vbvForm
    const parsedTermUrl = url.parse(termUrl)
    expect(/^https?:/.test(parsedTermUrl.protocol)).toBe(true)
    expect(typeof parsedTermUrl.host).toBe('string')
    expect(parsedTermUrl.host.length > 0).toBe(true)
    expect(/\bpaymentMethod\b/.test(parsedTermUrl.query)).toBe(true)
  })

  it('originalTermUrl is formed correctly', () => {
    // 'originalTermUrl' refers to a WCS environment.
    const { originalTermUrl } = orderCompleted.body.vbvForm
    const parsedOriginalTermUrl = url.parse(originalTermUrl)
    expect(/^https:/.test(parsedOriginalTermUrl.protocol)).toBe(true)
    expect(
      /\.?arcadiagroup\.co\.uk$/.test(parsedOriginalTermUrl.hostname)
    ).toBe(true)
    expect(/\borderId\b/.test(parsedOriginalTermUrl.query)).toBe(true)
    expect(/\blangId\b/.test(parsedOriginalTermUrl.query)).toBe(true)
    expect(/\bstoreId\b/.test(parsedOriginalTermUrl.query)).toBe(true)
    expect(/\bcatalogId\b/.test(parsedOriginalTermUrl.query)).toBe(true)
  })

  it('action is formed correctly', () => {
    // 'action' refers to the payment gateway.
    const { action } = orderCompleted.body.vbvForm
    const parsedAction = url.parse(action)
    expect(/^https:/.test(parsedAction.protocol)).toBe(true)
    expect(/\.?worldpay\.com$/.test(parsedAction.hostname)).toBe(true)
    expect(typeof parsedAction.path).toBe('string')
    expect(parsedAction.path.length > 0).toBe(true)
  })
})

describe.skip('3D Secure v2 for new users', () => {
  let products
  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  const responseBody3DSecureV2Schema = {
    title: '3DS2 response',
    type: 'object',
    required: completedOrderSchema.requiredPropertiesThreeDSecureV2,
    properties: completedOrderSchema.threeDSecureV2Schema,
  }

  const responseBodyCompletedOrderSchema = {
    title: '3DS2 response',
    type: 'object',
    required: completedOrderSchema.requiredPropertiesHighLevel,
    properties: completedOrderSchema.completedOrderHighLevelSchema,
  }

  const responseBody3DSecureV2JwtSchema = {
    title: 'JWT',
    type: 'object',
    required: completedOrderSchema.requiredPropertiesThreeDSecureV2Jwt,
    properties: completedOrderSchema.threeDSecureV2JwtSchema,
  }

  const responseBody3DSecureV2JwtPayloadSchema = {
    title: 'JWT',
    type: 'object',
    required: completedOrderSchema.requiredPropertiesThreeDSecureV2JwtPayload,
    properties: completedOrderSchema.threeDSecureV2JwtPayloadSchema,
  }

  const billingNamesChallenge = [
    'CHALLENGE_UNKNOWN_IDENTITY',
    'CHALLENGE_IDENTIFIED',
    'CHALLENGE_VALID_ERROR',
    'BYPASSED_AFTER_CHALLENGE',
  ]
  const billingNamesBypassed = [
    'BYPASSED',
    'FRICTIONLESS_IDENTIFIED',
    'FRICTIONLESS_NOT_IDENTIFIED',
    'FRICTIONLESS_VALID_ERROR',
  ]

  billingNamesChallenge.forEach((name) => {
    describe(name, () => {
      let orderCompleted

      beforeAll(async () => {
        const newAccount = await createAccount()
        const shoppingBag = await addItemToShoppingBag2(
          newAccount.jsessionid,
          products.productsSimpleId
        )

        // The name '3DS_V2_ CHALLENGE_IDENTIFIED' must be used in conjunction with the card number
        // 4444333322221111 to trigger a 3D Secure flow in the payment sandbox.
        orderCompleted = await payOrder(
          newAccount.jsessionid,
          shoppingBag.orderId,
          'VISA',
          {
            nameAndPhone: {
              firstName: '3DS_V2_',
              lastName: name,
            },
            threeDSecure2: {
              dfReferenceId: 'a88e0eb2-6af8-4030-a3ef-584ad87cfefe',
              challengeWindowSize: '390x400',
            },
          }
        )
      }, 60000)

      it('should have a status code of 200', () => {
        expect(orderCompleted.statusCode).toBe(200)
      })

      it('should receive 3D Secure details in the response body', () => {
        expect(orderCompleted.body).toMatchSchema(responseBody3DSecureV2Schema)
      })

      it('challengeUrl is formed correctly', () => {
        // 'challengeUrl' refers to the payment gateway.
        const { challengeUrl } = orderCompleted.body
        const parsedChalllengUrl = url.parse(challengeUrl)
        expect(/^https:/.test(parsedChalllengUrl.protocol)).toBe(true)
        expect(/\.?worldpay\.com$/.test(parsedChalllengUrl.hostname)).toBe(true)
        expect(typeof parsedChalllengUrl.path).toBe('string')
        expect(parsedChalllengUrl.path.length > 0).toBe(true)
      })

      it('challengeJwt should be a decodable JSON Web Token', () => {
        const { challengeJwt } = orderCompleted.body
        const decodedJwt = jwt.decode(challengeJwt)
        expect(decodedJwt).not.toBeNull()
      })

      it('JSON Web Token must conform to the challenge schema', () => {
        const { challengeJwt } = orderCompleted.body
        const decodedJwt = jwt.decode(challengeJwt)
        expect(decodedJwt).toMatchSchema(responseBody3DSecureV2JwtSchema)
      })

      it('JSON Web Token Payload must conform to the payload schema', () => {
        const { challengeJwt } = orderCompleted.body
        const decodedJwt = jwt.decode(challengeJwt)
        expect(decodedJwt.Payload).toMatchSchema(
          responseBody3DSecureV2JwtPayloadSchema
        )
      })

      it('JSON Web Token should contain a well formed return URL', () => {
        const { challengeJwt } = orderCompleted.body
        const decodedJwt = jwt.decode(challengeJwt)

        // 'ReturnUrl' allows for plain http to run in development.
        const parsedReturnUrl = url.parse(decodedJwt.ReturnUrl)
        expect(/^https?:/.test(parsedReturnUrl.protocol)).toBe(true)
        expect(typeof parsedReturnUrl.host).toBe('string')
        expect(parsedReturnUrl.host.length > 0).toBe(true)
        expect(/\bpaymentMethod\b/.test(parsedReturnUrl.query)).toBe(true)
      })
    })
  })

  billingNamesBypassed.forEach((name) => {
    describe(name, () => {
      let orderCompleted
      beforeAll(async () => {
        const newAccount = await createAccount()
        const shoppingBag = await addItemToShoppingBag2(
          newAccount.jsessionid,
          products.productsSimpleId
        )

        orderCompleted = await payOrder(
          newAccount.jsessionid,
          shoppingBag.orderId,
          'VISA',
          {
            nameAndPhone: {
              firstName: '3DS_V2_',
              lastName: name,
            },
            threeDSecure2: {
              dfReferenceId: 'a88e0eb2-6af8-4030-a3ef-584ad87cfefe',
              challengeWindowSize: '390x400',
            },
          }
        )
      }, 60000)

      it('should have a status code of 200', () => {
        expect(orderCompleted.statusCode).toBe(200)
      })

      it('should receive order complete details in the response body', () => {
        expect(orderCompleted.body).toHaveProperty('completedOrder')
        expect(orderCompleted.body.completedOrder).toMatchSchema(
          responseBodyCompletedOrderSchema
        )
      })
    })
  })

  describe('FRICTIONLESS_REJECTED', () => {
    let orderCompleted
    it(
      'should have transaction error in the response body',
      async () => {
        const newAccount = await createAccount()
        const shoppingBag = await addItemToShoppingBag2(
          newAccount.jsessionid,
          products.productsSimpleId
        )

        try {
          orderCompleted = await payOrder(
            newAccount.jsessionid,
            shoppingBag.orderId,
            'VISA',
            {
              nameAndPhone: {
                firstName: '3DS_V2_',
                lastName: 'FRICTIONLESS_REJECTED',
              },
              threeDSecure2: {
                dfReferenceId: 'a88e0eb2-6af8-4030-a3ef-584ad87cfefe',
                challengeWindowSize: '390x400',
              },
            }
          )
        } catch (err) {
          orderCompleted = err.response
        }
        expect(orderCompleted.body).toMatchSchema(
          completedOrderSchema.threeDSecureV2AuthenticationRejectedSchema
        )
      },
      60000
    )
  })
})
