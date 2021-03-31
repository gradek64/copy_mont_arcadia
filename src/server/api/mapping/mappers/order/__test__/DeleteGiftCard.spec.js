import * as utils from '../../../__test__/utils'
import DeleteGiftCard from '../DeleteGiftCard'
import { giftCardConstants } from '../../../constants/giftCard'

import wcsGuest from '../../../../../../../test/apiResponses/orders/deleteGiftCard/wcs-guest.json'
import montyGuest from '../../../../../../../test/apiResponses/orders/deleteGiftCard/hapiMonty-guest.json'
import wcsRegistered from '../../../../../../../test/apiResponses/orders/deleteGiftCard/wcs-registered.json'
import montyRegistered from '../../../../../../../test/apiResponses/orders/deleteGiftCard/hapiMonty-registered.json'

describe('DeleteGiftCard mapper', () => {
  const orderId = '7890'
  const jsessionid = 'jsessionid'
  const giftCardId = '123456'

  const sharedPayload = {
    ...giftCardConstants,
    catalogId: '33057',
    langId: '-1',
    storeId: 12556,
    action: 'remove',
    identifier: giftCardId,
    orderId: '7890',
  }

  const mockAPI = () => utils.setWCSResponse({ body: wcsGuest })

  beforeEach(() => {
    jest.clearAllMocks()
    utils.setUserSession({ cookies: [`cartId=${orderId};`] })
    mockAPI()
  })

  const defaults = {
    endpoint: '/giftcard',
    query: '',
    payload: sharedPayload,
    method: 'post',
    headers: {
      cookie: `jsessionid=${jsessionid};`,
    },
    params: {},
    getOrderId: () => Promise.resolve(orderId),
  }

  const execute = utils.buildExecutor(DeleteGiftCard, defaults)

  it('should set the correct endpoint', async () => {
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/PPTGiftCardsManager'
    )
  })

  it('should use the correct method', async () => {
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should set a correct payload for a guest user', async () => {
    await execute({ query: { giftCardId } })
    expect(utils.getRequestArgs(0).payload).toEqual({
      ...sharedPayload,
      sourcePage: 'PaymentDetails',
    })
  })

  it('should set a correct payload for a registered user', async () => {
    await execute({
      headers: {
        cookie: 'jsessionid=12345; authenticated=yes;',
      },
      query: { giftCardId },
    })
    expect(utils.getRequestArgs(0).payload).toEqual({
      ...sharedPayload,
      sourcePage: 'OrderSubmitForm',
    })
  })

  it('should correctly map the response for a guest user', async () => {
    utils.setWCSResponse({ body: wcsGuest, jsessionid })
    await expect(
      execute({
        headers: {
          cookie: `jsessionid=${jsessionid};`,
        },
      })
    ).resolves.toEqual({ body: montyGuest, jsessionid })
  })

  it('should correctly map the response for a registered user', async () => {
    utils.setWCSResponse({ body: wcsRegistered, jsessionid })

    await expect(
      execute({
        headers: {
          cookie: `jsessionid=${jsessionid}; authenticated=yes;`,
        },
      })
    ).resolves.toEqual({
      body: montyRegistered,
      jsessionid,
    })
  })

  it('should throw a Boom error if the response from WCS contains a false success value', async () => {
    utils.setWCSResponse({
      body: { success: false, message: 'Generic gift card error 1' },
    })

    await expect(execute()).rejects.toHaveProperty('output.payload', {
      error: 'Unprocessable Entity',
      message: 'Generic gift card error 1',
      statusCode: 422,
    })
  })

  it('should return a rejected promise if the WCS response is invalid or fails', async () => {
    utils.setWCSResponse(Promise.reject('server error'))
    await expect(
      execute({
        headers: {
          cookie: `jsessionid=${jsessionid};`,
        },
      })
    ).rejects.toBe('server error')
  })
})
