import * as utils from '../../../__test__/utils'
import ChooseSavedAddress from '../ChooseSavedAddress'

import wcs from 'test/apiResponses/orders/wcs-chooseSavedAddress.json'
import monty from 'test/apiResponses/orders/hapiMonty-chooseSavedAddress.json'

describe('ChooseSavedAddress mapper', () => {
  const orderId = '12345678'
  const jsessionid = 2222222
  beforeEach(() => {
    jest.clearAllMocks()

    utils.setUserSession({
      cookies: [
        utils.createCookies()(
          utils.createCartIdCookie(orderId),
          utils.createJSessionIdCookie(jsessionid)
        ),
      ],
    })

    utils.setWCSResponse({ body: wcs })
  })

  const config = utils.getConfigByStoreCode('tsuk')
  const payloadFromMonty = {
    addressId: 678678,
  }

  const payloadToWCS = {
    storeId: config.siteId,
    catalogId: config.catalogId,
    langId: config.langId,
    orderId,
    sourcePage: 'OrderSubmitForm',
    status: 'P',
    errorViewName: 'UserRegistrationForm',
    actionType: 'updateOrderItemsOnly',
    deliveryOptionType: 'H',
    savedAddress: payloadFromMonty.addressId,
  }

  const defaults = {
    method: 'put',
    headers: {
      cookie: utils.createJSessionIdCookie(jsessionid),
    },
    query: {},
    payload: payloadFromMonty,
    params: {},
    getOrderId: () => orderId,
  }

  const execute = utils.buildExecutor(ChooseSavedAddress, defaults)

  describe('Requests', () => {
    it('should use the proper endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ProcessDeliveryDetails'
      )
    })

    it('should use the correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })

    it('should send the correct payload', async () => {
      await execute()
      expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
    })
  })

  describe('Successful requests', () => {
    it('should be mapped correctly', async () => {
      await expect(execute()).resolves.toEqual({ body: monty })
    })
  })

  describe('Responses with a missing parameter', () => {
    it('should throw an error', async () => {
      await utils.expectFailedWith(
        execute({
          payload: {},
        }),
        {
          statusCode: 422,
          message: 'Missing addressId',
        }
      )
    })
  })

  describe('Unsuccessful responses', () => {
    it('should throw an error', async () => {
      utils.setWCSResponse(Promise.reject('Error'))
      await expect(execute()).rejects.toBe('Error')
    })
  })
})
