import url from 'url'
import { createAccountResponse } from '../../utilis/userAccount'
import { getProducts } from '../../utilis/selectProducts'
import { payOrder } from '../../utilis/payOrder'
import { addItemToShoppingBagResponse } from '../../utilis/shoppingBag'
import completedOrderSchema from './../order-complete.schema'
import { processClientCookies } from '../../utilis/cookies'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('3D Secure v1 for new users', () => {
  let orderCompleted

  beforeAll(async () => {
    let cookies
    const { mergeCookies } = processClientCookies()
    const products = await getProducts()
    const newAccountResponse = await createAccountResponse()
    cookies = mergeCookies(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      cookies,
      products.productsSimpleId
    )
    const shoppingBag = shoppingBagResponse.body
    // The name '3D. Authorised' must be used in conjunction with the card number
    // 4444333322221111 to trigger a 3D Secure flow in the payment sandbox.
    cookies = mergeCookies(shoppingBagResponse)
    orderCompleted = await payOrder(cookies, shoppingBag.orderId, 'VISA', {
      nameAndPhone: {
        firstName: '3D.',
        lastName: 'Authorised',
      },
    })
  }, 60000)

  // TODO: remove when redis is removed
  it(
    'should keep redis and client cookies in sync',
    async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    },
    30000
  )

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
