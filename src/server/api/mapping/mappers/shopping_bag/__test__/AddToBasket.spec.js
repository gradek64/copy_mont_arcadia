import * as utils from '../../../__test__/utils'
import AddToBasket from '../AddToBasket'
import wcsPdpResponse from '../../../../../../../test/apiResponses/pdp/wcs.json'
import wcsPdpResponseFixedBundle from '../../../../../../../test/apiResponses/pdp/bundles/fixed/wcs_fixed_bundle.json'
import { omit } from 'ramda'

jest.mock('../../../transforms/basket')
import transform from '../../../transforms/basket'

jest.mock('../../../transforms/orderSummary')
import orderSummaryTransform from '../../../transforms/orderSummary'

const payloadFromMonty = {
  productId: 29099635,
  sku: '602016000997332',
  quantity: 1,
}

const payloadFromMontyInCheckout = {
  productId: 29099635,
  sku: '602016000997332',
  quantity: 1,
  responseType: 'orderSummary',
}

const payloadFromMontyBundle = {
  productId: 28402147,
  bundleItems: [
    { productId: 28361263, sku: '602017001099935' },
    { productId: 28359754, sku: '602017001099797' },
  ],
}

const payloadToWcs = {
  add2cartErrorViewName: 'Add2ShopCartResponseView',
  Add2ShopCart: 'true',
  quantity: 1,
  updatePrices: '1',
  calculationUsageId: '-1',
  catEntryId: 29099635,
  errorViewName: 'Add2ShopCartResponseView',
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  result: 'ADDED_TO_BAG',
  orderId: '.',
  attrName: ['134315349', '134315353'],
  attrValue: ['KHAKI', '8'],
  shouldCachePage: 'false',
  URL: 'Add2ShopCartResponseView',
  lowStockThreshold: 1,
}

const payloadToWcsBundle = {
  add2cartErrorViewName: 'Add2ShopCartResponseView',
  Add2ShopCart: 'true',
  quantity: 1,
  updatePrices: '1',
  calculationUsageId: '-1',
  errorViewName: 'Add2ShopCartResponseView',
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  result: 'ADDED_TO_BAG',
  orderId: '.',
  isBundle: 'true',
  productId: 28402147,
  slot_1: '1',
  catEntryId_1: 28361263,
  attrName_1: ['156889348', '156889350'],
  attrValue_1: ['PEACH', '10'],
  quantity_1: 1,
  slot_2: '2',
  catEntryId_2: 28359754,
  attrName_2: ['156872440', '156872441'],
  attrValue_2: ['PEACH', '4'],
  quantity_2: 1,
  shouldCachePage: 'false',
  URL: 'Add2ShopCartResponseView',
  lowStockThreshold: 1,
}

const basketParameters = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  updatePrices: 1,
  calculationUsageId: [-1, -2, -7],
  calculateOrder: 1,
  orderId: '.',
  URL: 'OrderItemDisplay',
}

const orderSummaryParameters = {
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

const productParameters = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  productId: 29099635,
}

const addToBagResponse = {
  success: true,
  message: 'Item(s) successfully added to your shopping bag.',
  items: 7,
  total: 83.0,
}

const addToBagFailResponse = {
  success: false,
  message:
    'Please select a size and/or quantity you require before adding it to your bag.',
  items: 7,
  total: 83.0,
}

const wcsBasket = {
  Basket: {
    products: {
      Product: [{ quantity: 1 }, { quantity: 3 }],
    },
  },
}

const transformedBody = { body: 'I am a transformed basket body for Monty' }

const execute = utils.buildExecutor(AddToBasket, {
  getOrderId: () => Promise.resolve('12345'),
})

describe('AddToBasket', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps a request to/from WCS', async () => {
    transform.mockReturnValueOnce(transformedBody)
    utils.setWCSResponse({ body: wcsPdpResponse })
    utils.setWCSResponse({ body: addToBagResponse }, { n: 1 })
    utils.setWCSResponse({ body: wcsBasket }, { n: 2 })

    const res = await execute({
      payload: payloadFromMonty,
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/ProductDisplay',
        query: productParameters,
      })
    )
    expect(utils.getRequestArgs(1)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/NewProductDetailsActionControl',
        payload: payloadToWcs,
      })
    )
    expect(utils.getRequestArgs(2)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/OrderCalculate',
        query: basketParameters,
      })
    )
    expect(res.body).toEqual(transformedBody)
    expect(res.setCookies).toEqual([
      {
        name: 'bagCount',
        value: '4',
        options: {
          path: '/',
          encoding: 'none',
          isSecure: false,
          isHttpOnly: false,
          clearInvalid: false,
          strictHeader: false,
        },
      },
    ])
  })

  it('maps a request for an order summary response', async () => {
    orderSummaryTransform.mockReturnValue(transformedBody)
    utils.setWCSResponse({ body: wcsPdpResponse })
    utils.setWCSResponse({ body: addToBagResponse }, { n: 1 })
    utils.setWCSResponse({ body: { success: true } }, { n: 2 })

    const res = await execute({
      payload: payloadFromMontyInCheckout,
      headers: {
        cookie: 'jsessionid=1; ',
      },
    })

    expect(utils.getRequestArgs(2)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PreCheckout',
        query: orderSummaryParameters,
      })
    )
    expect(res.body).toEqual(transformedBody)
  })

  it('maps request for bundle', async () => {
    utils.setWCSResponse({ body: wcsPdpResponseFixedBundle })
    utils.setWCSResponse({ body: addToBagResponse }, { n: 1 })
    utils.setWCSResponse({ body: { success: true } }, { n: 2 })

    await execute({
      payload: payloadFromMontyBundle,
    })

    expect(utils.getRequestArgs(1)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/NewProductDetailsActionControl',
        payload: payloadToWcsBundle,
      })
    )
  })

  it('maps request for DDP', async () => {
    utils.setWCSResponse({
      body: {
        ...wcsPdpResponse,
        isDDPProduct: true,
      },
    })
    utils.setWCSResponse({ body: addToBagResponse }, { n: 1 })
    utils.setWCSResponse({ body: { success: true } }, { n: 2 })

    await execute({
      payload: payloadFromMonty,
    })

    expect(utils.getRequestArgs(1)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/NewProductDetailsActionControl',
        payload: omit(['attrName', 'attrValue'], payloadToWcs),
      })
    )
  })

  it('should return 422 if fetched product returned success = false', async () => {
    utils.setWCSResponse(Promise.resolve({ body: { success: false } }))

    try {
      await execute({
        payload: payloadFromMonty,
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.output.payload.statusCode).toBe(422)
    }
  })

  it('should return 422 if add to basket returned success false', async () => {
    utils.setWCSResponse({ body: wcsPdpResponse })
    utils.setWCSResponse(Promise.resolve({ body: addToBagFailResponse }), {
      n: 1,
    })

    try {
      await execute({
        payload: payloadFromMonty,
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.output.payload.statusCode).toBe(422)
    }
  })

  it('should return 422 if failed to fetch order summary', async () => {
    utils.setWCSResponse({ body: wcsPdpResponse })
    utils.setWCSResponse({ body: addToBagResponse }, { n: 1 })
    utils.setWCSResponse(Promise.reject({ body: { success: false } }), { n: 2 })

    try {
      await execute({
        payload: {
          ...payloadFromMonty,
          responseType: 'orderSummary',
        },
        headers: {
          cookie: 'jsessionid=1; ',
        },
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.output.payload.statusCode).toBe(422)
    }
  })

  it('should return 422 if failed to fetch basket', async () => {
    utils.setWCSResponse({ body: wcsPdpResponse })
    utils.setWCSResponse({ body: addToBagResponse }, { n: 1 })
    utils.setWCSResponse(Promise.reject({ body: { success: false } }), { n: 2 })

    try {
      await execute({
        payload: payloadFromMonty,
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.output.payload.statusCode).toBe(422)
    }
  })
})
