import * as utils from '../../../__test__/utils'
import AddToBasketV2 from '../AddToBasketV2'
import transform from '../../../transforms/basket'
import orderSummaryTransform from '../../../transforms/orderSummary'
import { basketCookies } from '../cookies'

jest.mock('../cookies')
jest.mock('../../../transforms/orderSummary')
jest.mock('../../../transforms/basket')

const payloadFromMontySingleAndFlexible = {
  partNumber: '602018001236275',
  productId: 32035428,
  quantity: 1,
  sku: '602018001236275',
}

const payloadFromMontyFixedBundle = {
  productId: 32052695,
  bundleItems: [
    { productId: 31882700, sku: '602018001231061' },
    { productId: 31880835, sku: '602018001230957' },
  ],
}

const payloadToWcsSingleAndFlexible = {
  Add2ShopCart: 'true',
  URL: 'Add2ShopCartResponseView',
  add2cartErrorViewName: 'Add2ShopCartResponseView',
  calculationUsageId: '-1',
  catalogId: '33057',
  errorViewName: 'Add2ShopCartResponseView',
  isBasketResponseReqd: true,
  isSingleItem: true,
  langId: '-1',
  lowStockThreshold: 1,
  orderId: '.',
  partNumber: '602018001236275',
  productId: 32035428,
  quantity: 1,
  result: 'ADDED_TO_BAG',
  shouldCachePage: 'false',
  storeId: 12556,
  updatePrices: '1',
  noRedirect: false,
}

const wcsBody = {
  Basket: {
    orderId: '12345',
    products: {
      Product: [{ quantity: 1 }, { quantity: 3 }],
    },
  },
}

const addToBagFailResponse = {
  success: false,
  message:
    'Please select a size and/or quantity you require before adding it to your bag.',
  items: 7,
  total: 83.0,
}

const payloadToWcsFixedBundle = {
  Add2ShopCart: 'true',
  URL: 'Add2ShopCartResponseView',
  add2cartErrorViewName: 'Add2ShopCartResponseView',
  calculationUsageId: '-1',
  catalogId: '33057',
  errorViewName: 'Add2ShopCartResponseView',
  isBasketResponseReqd: true,
  isSingleItem: false,
  langId: '-1',
  lowStockThreshold: 1,
  noOfSlots: 2,
  orderId: '.',
  partNumber_1: '602018001231061',
  partNumber_2: '602018001230957',
  productId: 32052695,
  productId_1: 31882700,
  productId_2: 31880835,
  quantity_1: 1,
  quantity_2: 1,
  result: 'ADDED_TO_BAG',
  shouldCachePage: 'false',
  slot_1: [1],
  slot_2: [2],
  storeId: 12556,
  updatePrices: '1',
  noRedirect: false,
}

const transformedBody = { body: 'I am a transformed basket body for Monty' }

const orderSummaryRequest = {
  catalogId: '33057',
  langId: '-1',
  orderId: '12345',
  storeId: 12556,
  page: '',
  URL:
    'OrderCalculate?updatePrices=1%26orderItemId*=%26quantity*=%26URL=BillingAddressView',
  returnPage: 'ShoppingBag',
  outOrderItemName: '',
  Proceed: '',
  CheckoutURL:
    'OrderCopy?URL=OrderPrepare%3fURL%3dOrderDisplay%26errorViewName=InvalidInputErrorView',
  PromoURL:
    'PromotionCodeManage?URL=OrderCalculate%3fURL%3dOrderPrepare%3fURL%3dOrderItemDisplay%26taskType=A%26errorViewName=OrderItemDisplayViewShiptoAssoc',
  shoppingBasketURL:
    'OrderCalculate?langId=-1%26storeId=12556%26catalogId=33057%26updatePrices=1%26calculationUsageId=-1%26URL=OrderItemDisplay',
  showCheckout: false,
}

const orderSummaryResponse = {
  jsessionid: 'session_id',
  body: {
    orderSummary: 'hello',
  },
}

const execute = utils.buildExecutor(AddToBasketV2)

describe('AddToBasketV2', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps a request to/from WCS', async () => {
    transform.mockReturnValue(transformedBody)
    const cookies = 'cookies'
    basketCookies.mockReturnValue(cookies)
    const jsessionid = 1
    utils.setWCSResponse({ body: wcsBody, jsessionid })

    const res = await execute({
      payload: payloadFromMontySingleAndFlexible,
      method: 'GET',
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/NewProductDetailsActionControl',
        payload: payloadToWcsSingleAndFlexible,
      })
    )
    expect(res.body).toEqual(transformedBody)
    expect(transform).toHaveBeenCalledWith(wcsBody.Basket, '£')
    expect(res.jsessionid).toBe(jsessionid)
    expect(res.setCookies).toBe(cookies)
  })

  it('maps a request to/from WCS for fixed bundle', async () => {
    await execute({
      payload: payloadFromMontyFixedBundle,
      method: 'GET',
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/NewProductDetailsActionControl',
        payload: payloadToWcsFixedBundle,
      })
    )
  })

  it('maps a request to/from WCS for order summary response', async () => {
    const cookies = 'cookies'
    basketCookies.mockReturnValue(cookies)
    orderSummaryTransform.mockReturnValue(transformedBody)
    const jsessionid = 1
    utils.setWCSResponse({ body: wcsBody, jsessionid })
    utils.setWCSResponse({ body: orderSummaryResponse, jsessionid }, { n: 1 })

    const res = await execute({
      payload: {
        ...payloadFromMontySingleAndFlexible,
        responseType: 'orderSummary',
      },
      method: 'GET',
    })

    expect(utils.getRequestArgs(1)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PreCheckout',
        query: orderSummaryRequest,
      })
    )
    expect(res.body).toEqual(transformedBody)
    expect(orderSummaryTransform).toHaveBeenCalledWith(
      orderSummaryResponse.orderSummary,
      false,
      '£'
    )
    expect(res.jsessionid).toBe(jsessionid)
    expect(res.setCookies).toBe(cookies)
  })

  it('returns 422 if add to basket failed', async () => {
    utils.setWCSResponse(Promise.reject({ body: addToBagFailResponse }))

    try {
      await execute({
        payload: payloadToWcsSingleAndFlexible,
        method: 'GET',
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.output.payload.statusCode).toBe(422)
    }
  })

  it('returns 422 if fetch order summary failed', async () => {
    utils.setWCSResponse({ body: wcsBody })
    utils.setWCSResponse(Promise.reject({ body: { success: false } }), { n: 1 })

    try {
      await execute({
        payload: {
          ...payloadFromMontySingleAndFlexible,
          responseType: 'orderSummary',
        },
        method: 'GET',
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.output.payload.statusCode).toBe(422)
    }
  })
})
