import * as utils from '../../../__test__/utils'
import RemoveFromBasket from '../RemoveFromBasket'

jest.mock('boom', () => ({
  badData: jest.fn(),
}))
import Boom from 'boom'

jest.mock('../../../transforms/basket')
import transform from '../../../transforms/basket'

jest.mock('../../../transforms/orderSummary')
import orderSummaryTransform from '../../../transforms/orderSummary'

import { cookieOptionsBag } from '../../../../../lib/auth'

const orderId = 1822719
const orderItemId = 8235446
const deleteItemResponseWcs = {
  products: {
    Product: [{ quantity: 1 }, { quantity: 3 }],
  },
}

const orderSummary = {
  MiniBagForm: {
    Basket: deleteItemResponseWcs,
  },
}

const orderSummaryResponse = {
  orderSummary,
}

const basketResponseMonty = { basketMonty: {} }
const jsessionid = '12345'
const cookiesToSet = [
  {
    name: 'bagCount',
    value: '4',
    options: cookieOptionsBag,
  },
]

const montyRequest = {
  originEndpoint: '/api/shopping_bag/delete_item',
  query: {
    orderId,
    orderItemId,
  },
  payload: {},
  method: 'delete',
  headers: {},
  params: {},
}

const wcsPayload = {
  orderItemId,
  orderId,
  updatePrices: '1',
  calculationUsageId: ['-1', '-2', '-7'],
  isDDPItem: false,
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  errorViewName: 'ShoppingBagRemoveItemAjaxView',
  URL: 'OrderCalculate?URL=ShoppingBagRemoveItemAjaxView',
}

const ddpOrderId = 10009339
const ddpOrderItemId = 11661002

const ddpWcsPayload = {
  orderItemId: ddpOrderItemId,
  orderId: ddpOrderId,
  updatePrices: '1',
  calculationUsageId: ['-1', '-2', '-7'],
  isDDPItem: true,
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  errorViewName: 'ShoppingBagRemoveItemAjaxView',
  URL: 'OrderCalculate?URL=DeliveryPageUpdateAjaxView',
}

const ddpResponseWcs = {
  orderSummary: {
    deliveryoptionsform: {
      deliveryMethods: [{ selected: true }],
      expressDelivery: { selected: false },
    },
  },
}

const execute = utils.buildExecutor(RemoveFromBasket, montyRequest)

const happyApi = () => {
  utils.setWCSResponse({ body: deleteItemResponseWcs, jsessionid })
}

const happyApiOrderSummary = () => {
  utils.setWCSResponse({ body: orderSummaryResponse, jsessionid })
}

const happyApiDDP = () => {
  utils.setWCSResponse({ body: ddpResponseWcs, jsessionid })
}

describe('RemoveFromBasket', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('calling the wcs endpoint for deleting an item from the basket', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/OrderItemDelete', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/OrderItemDelete'
      )
    })
    it('should call with the post method', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })
    it('should call with the correct payload', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).payload).toEqual(wcsPayload)
    })
    it('should call with the correct payload if the deleted item is DDP item', async () => {
      happyApi()
      await execute({
        query: {
          orderItemId: ddpOrderItemId,
          orderId: ddpOrderId,
          isDDPItem: true,
          responseType: 'orderSummary',
        },
      })
      expect(utils.getRequestArgs(0).payload).toEqual(ddpWcsPayload)
    })
    describe('if the response is not expected', () => {
      it('should throw an error if the product property is not present', async () => {
        utils.setWCSResponse({ body: {} })
        Boom.badData.mockReturnValue('BAM!')
        await expect(execute()).rejects.toBe('BAM!')
      })
    })
    it('should call appropriate URL if in checkout', async () => {
      happyApi()
      await execute({
        query: {
          responseType: 'orderSummary',
        },
      })
      expect(utils.getRequestArgs(0).payload.URL).toBe(
        'OrderCalculate?URL=DeliveryPageUpdateAjaxView'
      )
    })

    it('should call appropriate URL if not checkout', async () => {
      happyApi()
      await execute({
        query: {
          inCheckout: 'false',
        },
      })
      expect(utils.getRequestArgs(0).payload.URL).toBe(
        'OrderCalculate?URL=ShoppingBagRemoveItemAjaxView'
      )
    })
  })
  describe('response', () => {
    it('should contain the basket response in the body', async () => {
      happyApi()
      transform.mockReturnValue(basketResponseMonty)
      const result = await execute()
      expect(transform).toHaveBeenCalledTimes(1)
      expect(orderSummaryTransform).toHaveBeenCalledTimes(0)
      expect(result.body).toEqual(basketResponseMonty)
    })
    it('should contain the basket count cookie to set', async () => {
      happyApi()
      transform.mockReturnValue(basketResponseMonty)
      const result = await execute()
      expect(transform).toHaveBeenCalledTimes(1)
      expect(orderSummaryTransform).toHaveBeenCalledTimes(0)
      expect(result.setCookies).toEqual(cookiesToSet)
    })
    it('should contain the jsessionid', async () => {
      happyApi()
      transform.mockReturnValue(basketResponseMonty)
      const result = await execute()
      expect(transform).toHaveBeenCalledTimes(1)
      expect(orderSummaryTransform).toHaveBeenCalledTimes(0)
      expect(result.jsessionid).toBe(jsessionid)
    })
    it('should call orderSummary Transform when in checkout', async () => {
      happyApiOrderSummary()
      const result = await execute({
        query: {
          responseType: 'orderSummary',
        },
      })
      expect(transform).toHaveBeenCalledTimes(0)
      expect(orderSummaryTransform).toHaveBeenCalledTimes(1)
      expect(orderSummaryTransform).toHaveBeenCalledWith(
        orderSummaryResponse.orderSummary,
        false,
        '£'
      )
      expect(result.setCookies).toEqual(cookiesToSet)
    })
    it('should contain deliveryMethods selected to be true and expressDelivery selected to be false when deleted item is DDP item', async () => {
      happyApiDDP()
      orderSummaryTransform.mockReturnValue(ddpResponseWcs)
      const result = await execute({
        query: {
          orderItemId: ddpOrderItemId,
          orderId: ddpOrderId,
          isDDPItem: true,
          responseType: 'orderSummary',
        },
      })
      expect(transform).toHaveBeenCalledTimes(0)
      expect(orderSummaryTransform).toHaveBeenCalledTimes(1)
      expect(
        result.body.orderSummary.deliveryoptionsform.deliveryMethods[0].selected
      ).toBe(true)
      expect(
        result.body.orderSummary.deliveryoptionsform.expressDelivery.selected
      ).toBe(false)
    })
  })

  describe('Remember me timeout', () => {
    it('should return 401 and include remember me data', async () => {
      utils.setWCSResponse(
        Promise.reject({
          data: {
            headers: {
              'set-cookie': 'authenticated=partial;ttl=864000000;',
            },
            success: false,
            isLoggedIn: true,
            account: {},
            basket: {},
          },
          isBoom: true,
          output: {
            statusCode: 401,
            payload: {
              statusCode: 401,
              error: 'Unauthorized',
              message: 'Restricted action',
            },
            headers: {
              'set-cookie': 'authenticated=partial;ttl=864000000;',
            },
          },
        })
      )

      try {
        await execute()

        global.fail('Expected to throw')
      } catch (error) {
        expect(error.isBoom).toBe(true)
        expect(error.output.statusCode).toBe(401)
        expect(error.output.headers['set-cookie']).toContain(
          'authenticated=partial'
        )
      }
    })
  })
})
