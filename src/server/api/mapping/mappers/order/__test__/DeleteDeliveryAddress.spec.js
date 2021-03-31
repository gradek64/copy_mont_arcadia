import * as utils from '../../../__test__/utils'
import DeleteDeliveryAddress from '../DeleteDeliveryAddress'

import wcs from 'test/apiResponses/orders/deleteDeliveryAddress/wcs.json'

describe('DeleteDeliveryAddress Mapper', () => {
  const addressId = '555555'
  const orderId = '12345678'

  beforeEach(() => {
    jest.clearAllMocks()
    utils.setUserSession({
      cookies: [utils.createCookies()(utils.createCartIdCookie(orderId))],
    })
    utils.setWCSResponse({ body: wcs })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const payloadFromMonty = {
    addressId,
    orderId,
  }

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    orderId,
    addressId,
  }

  const defaults = {
    method: 'delete',
    payload: payloadFromMonty,
    query: {},
    endpoint: '',
    params: {},
    headers: {
      cookie: utils.createJSessionIdCookie(12345),
    },
    getOrderId: () => Promise.resolve(orderId),
  }

  const execute = utils.buildExecutor(DeleteDeliveryAddress, defaults)

  describe('Requests', () => {
    it('should set the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/AddressBookDelete'
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

    describe('Responses', () => {
      it('should be mapped correctly', async () => {
        await expect(execute()).resolves.toEqual({ body: wcs })
      })
    })
  })
})
