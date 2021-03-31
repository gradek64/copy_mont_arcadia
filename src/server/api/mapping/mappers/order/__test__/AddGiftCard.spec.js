import * as utils from '../../../__test__/utils'
import AddGiftCard from '../AddGiftCard'
import { giftCardConstants } from '../../../constants/giftCard'

import WCSGuest from '../../../../../../../test/apiResponses/orders/addGiftCard/wcs-guest.json'
import MontyGuest from '../../../../../../../test/apiResponses/orders/addGiftCard/hapiMonty-guest.json'
import WCSRegistered from '../../../../../../../test/apiResponses/orders/addGiftCard/wcs-registered.json'
import MontyRegistered from '../../../../../../../test/apiResponses/orders/addGiftCard/hapiMonty-registered.json'
import wcsResponseRegisteredCfsfree from 'test/apiResponses/orders/addGiftCard/wcs-cfsfree.json'
import hapiResponseRegisteredCfsfree from 'test/apiResponses/orders/addGiftCard/hapi-cfsfree.json'
import WCSRegisteredGiftCardCoveringTotal from '../../../../../../../test/apiResponses/orders/addGiftCard/wcs-registered-giftcard-covering-total.json'
import MontyRegisteredGiftCardCoveringTotal from '../../../../../../../test/apiResponses/orders/addGiftCard/hapiMonty-registered-giftcard-covering-total.json'

const payloadFromMonty = { giftCardNumber: '1234123412341234', pin: '1234' }

const sharedPayloadToWCS = {
  ...giftCardConstants,
  catalogId: '33057',
  langId: '-1',
  storeId: 12556,
  giftCardNo: '1234123412341234',
  giftCardPinNo: '1234',
  orderId: '56789',
  action: 'add',
}

describe('AddGiftCard Mapper', () => {
  const orderId = '56789'
  const mockAPI = () => utils.setWCSResponse({ body: WCSGuest })

  beforeEach(() => {
    jest.clearAllMocks()

    utils.setUserSession({
      cookies: [`cartId=${orderId};`],
    })
    mockAPI()
  })

  const defaults = {
    endpoint: 'giftcard',
    query: {},
    payload: sharedPayloadToWCS,
    method: 'post',
    headers: {
      cookie: 'jsessionid=12345',
    },
    params: {},
    getOrderId: () => Promise.resolve(orderId),
  }

  const execute = utils.buildExecutor(AddGiftCard, defaults)

  it('should map the correct endpoint', async () => {
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/PPTGiftCardsManager'
    )
  })

  it('should use the correct method', async () => {
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should send the correct payload for a guest user', async () => {
    await execute({
      payload: payloadFromMonty,
    })
    expect(utils.getRequestArgs(0).payload).toEqual({
      ...sharedPayloadToWCS,
      sourcePage: 'PaymentDetails',
    })
  })

  it('should send the correct payload for a registered user', async () => {
    await execute({
      payload: payloadFromMonty,
      headers: { cookie: 'jsessionid=12345; authenticated=yes;' },
    })
    expect(utils.getRequestArgs(0).payload).toEqual({
      ...sharedPayloadToWCS,
      sourcePage: 'OrderSubmitForm',
    })
  })

  it('should correctly map the response for a guest user', async () => {
    utils.setWCSResponse({
      body: WCSGuest,
      jsessionid: '12345',
    })

    await expect(
      execute({
        payload: payloadFromMonty,
      })
    ).resolves.toEqual({ body: MontyGuest, jsessionid: '12345' })
  })

  it('should correctly map the response for a registered user', async () => {
    utils.setWCSResponse({
      body: WCSRegistered,
      jsessionid: '12345',
    })

    await expect(
      execute({
        payload: payloadFromMonty,
        headers: {
          cookie: 'authenticated=yes; jsessionid=12345;',
        },
      })
    ).resolves.toEqual({
      body: MontyRegistered,
      jsessionid: '12345',
    })
  })

  it('should correctly map the response for a user using a giftCard that covers the basket total', async () => {
    utils.setWCSResponse({
      body: WCSRegisteredGiftCardCoveringTotal,
      jsessionid: '12345',
    })

    await expect(
      execute({
        payload: payloadFromMonty,
        headers: {
          cookie: 'authenticated=yes; jsessionid=12345;',
        },
      })
    ).resolves.toEqual({
      body: MontyRegisteredGiftCardCoveringTotal,
      jsessionid: '12345',
    })
  })

  it('should correctly map the response for a registered user which selected free collect from store', async () => {
    utils.setWCSResponse({
      body: wcsResponseRegisteredCfsfree,
      jsessionid: '12345',
    })

    await expect(
      execute({
        payload: payloadFromMonty,
        headers: {
          cookie: 'authenticated=yes; jsessionid=12345;',
        },
      })
    ).resolves.toEqual({
      body: hapiResponseRegisteredCfsfree,
      jsessionid: '12345',
    })
  })

  describe('errorCodes', () => {
    const addGifCardMapper = new AddGiftCard()
    const execute = utils.buildExecutor(AddGiftCard, {
      endpoint: 'originEndpoint',
      query: 'query',
      payload: 'payload',
      method: 'METHOD',
      headers: {
        'brand-code': 'tsuk',
        cookie: 'authenticated=yes; jsessionid=12345;',
      },
    })

    Object.entries(addGifCardMapper.mapWCSErrorCodes).forEach(
      ([errorCode, statusCode]) => {
        it(`should throw a ${statusCode} if wcs returns an errorCode of ${errorCode}`, async () => {
          utils.setWCSResponse({
            errorCode,
            message: 'emergency!',
          })
          return utils.expectFailedWith(execute(), {
            message: 'emergency!',
            statusCode,
            wcsErrorCode: errorCode,
          })
        })
      }
    )
  })

  it('should reject with 422 error and a message from WCS if the WCS response success value is false', async () => {
    utils.setWCSResponse({
      body: {
        success: false,
        message: 'There is no money on your gift card',
      },
    })

    await expect(execute()).rejects.toHaveProperty('output.payload', {
      error: 'Unprocessable Entity',
      message: 'There is no money on your gift card',
      statusCode: 422,
    })
  })

  it('should reject if the request from WCS fails', async () => {
    utils.setWCSResponse(Promise.reject('WCS crashed'))
    await expect(execute()).rejects.toBe('WCS crashed')
  })
})
