import * as utils from '../../../__test__/utils'
import UpdateBasketItem from '../UpdateBasketItem'
import wcsResp from '../../../../../../../test/apiResponses/shopping-bag/update-basket-item/wcs.json'
import hapiMontyResp from '../../../../../../../test/apiResponses/shopping-bag/update-basket-item/hapiMonty.json'
import hapiMontyOutOfStock from '../../../../../../../test/apiResponses/shopping-bag/update-basket-item/hapiMontyOutOfStock.json'
import hapiMontyPartiallyOutOfStock from '../../../../../../../test/apiResponses/shopping-bag/update-basket-item/hapiMontyPartiallyOutOfStock.json'

import orderSummaryTransform from '../../../transforms/orderSummary'
import Boom from 'boom'

jest.mock('../../../transforms/orderSummary')

describe('UpdateBasketItem', () => {
  const orderId = '__orderId__'
  const catEntryId = '123'
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const updateInputDefaults = {
    endpoint: '/foo',
    query: '',
    payload: {
      quantity: '2',
      catEntryIdToDelete: 21189329,
      catEntryIdToAdd: 21189364,
    },
    method: 'put',
    headers: {
      cookie: 'jsessionid=1; ',
    },
    params: {},
    getOrderId: () => Promise.resolve(orderId),
  }

  const execute = utils.buildExecutor(UpdateBasketItem, updateInputDefaults)

  it('should map an update quantity request correctly', async () => {
    const quantity = 2

    utils.setWCSResponse({ body: wcsResp })

    await execute({
      payload: {
        catEntryIdToAdd: catEntryId,
        catEntryIdToDelete: catEntryId,
        quantity,
      },
    })

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/OrderItemUpdateAjax',
      query: {
        orderId,
        updatePrices: 1,
        calculationUsageId: [-1, -2, -7],
        langId: '-1',
        storeId: 12556,
        catalogId: '33057',
        catEntryId,
        calculateOrder: 1,
        quantity,
        sourcePage: 'PaymentDetails',
        URL: 'OrderCalculate?URL=ShoppingBagUpdateItemAjaxView',
        getOrderItemFromCookie: true,
        isSizeUpdate: true,
        errorViewName: 'ShoppingBagUpdateItemAjaxView',
      },
      payload: {},
      method: 'post',
      headers: updateInputDefaults.headers,
      jsessionid: null,
      hostname: false,
    })
  })

  it('should map an update size and quantity request correctly for order summary', async () => {
    const quantity = 2

    utils.setWCSResponse({ body: wcsResp })

    await execute({
      payload: {
        catEntryIdToAdd: catEntryId,
        catEntryIdToDelete: catEntryId,
        quantity,
        responseType: 'orderSummary',
      },
    })

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/OrderItemUpdateAjax',
      query: {
        orderId,
        updatePrices: 1,
        calculationUsageId: [-1, -2, -7],
        langId: '-1',
        storeId: 12556,
        catalogId: '33057',
        catEntryId,
        calculateOrder: 1,
        quantity,
        sourcePage: 'PaymentDetails',
        URL: 'OrderCalculate?URL=DeliveryPageUpdateAjaxView',
        getOrderItemFromCookie: true,
        isSizeUpdate: true,
        errorViewName: 'ShoppingBagUpdateItemAjaxView',
      },
      payload: {},
      method: 'post',
      headers: updateInputDefaults.headers,
      jsessionid: null,
      hostname: false,
    })
  })

  it('should map an update size and quantity request correctly', async () => {
    const oldCatEntryId = catEntryId
    const newCatEntryId = 21189330
    const quantity = 2

    utils.setWCSResponse({ body: wcsResp })

    await execute({
      payload: {
        catEntryIdToAdd: newCatEntryId,
        catEntryIdToDelete: catEntryId,
        quantity,
      },
    })

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/OrderItemDelete',
      query: {
        orderId,
        updatePrices: 1,
        calculationUsageId: [-1, -2, -7],
        langId: '-1',
        storeId: 12556,
        catalogId: '33057',
        catEntryId: oldCatEntryId,
        calculateOrder: 1,
        quantity,
        sourcePage: 'PaymentDetails',
        pageName: 'shoppingBag',
        URL: `OrderItemAddAjax?catEntryId=${newCatEntryId}&URL=OrderCalculate?URL=ShoppingBagUpdateItemAjaxView`,
        isSizeUpdate: true,
        errorViewName: 'ShoppingBagUpdateItemAjaxView',
      },
      payload: {},
      method: 'post',
      headers: updateInputDefaults.headers,
      jsessionid: null,
      hostname: false,
    })
  })

  it('should map an update size and quantity request correctly on order Summary', async () => {
    const oldCatEntryId = catEntryId
    const newCatEntryId = 21189330
    const quantity = 2

    utils.setWCSResponse({ body: wcsResp })

    await execute({
      payload: {
        catEntryIdToAdd: newCatEntryId,
        catEntryIdToDelete: catEntryId,
        quantity,
        responseType: 'orderSummary',
      },
    })

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/OrderItemDelete',
      query: {
        orderId,
        updatePrices: 1,
        calculationUsageId: [-1, -2, -7],
        langId: '-1',
        storeId: 12556,
        catalogId: '33057',
        catEntryId: oldCatEntryId,
        calculateOrder: 1,
        quantity,
        sourcePage: 'PaymentDetails',
        pageName: 'shoppingBag',
        URL: `OrderItemAddAjax?catEntryId=${newCatEntryId}&URL=OrderCalculate?URL=DeliveryPageUpdateAjaxView`,
        isSizeUpdate: true,
        errorViewName: 'ShoppingBagUpdateItemAjaxView',
      },
      payload: {},
      method: 'post',
      headers: updateInputDefaults.headers,
      jsessionid: null,
      hostname: false,
    })
  })

  it('should map correctly if product is out of stock during update', async () => {
    const wcsResponseOutOfStock = {
      ...wcsResp,
      productDataQuantity: {
        ...wcsResp.productDataQuantity,
        item_1: {
          ...wcsResp.productDataQuantity.item_1,
          inventorys: null,
          invavls: null,
        },
      },
    }

    utils.setWCSResponse({ body: wcsResponseOutOfStock })

    const resp = await execute({
      payload: {
        catEntryIdToAdd: catEntryId,
        catEntryIdToDelete: catEntryId,
        quantity: '1',
      },
    })

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/OrderItemUpdateAjax',
      query: {
        orderId,
        updatePrices: 1,
        calculationUsageId: [-1, -2, -7],
        langId: '-1',
        storeId: 12556,
        catalogId: '33057',
        catEntryId,
        calculateOrder: 1,
        quantity: '1',
        sourcePage: 'PaymentDetails',
        URL: 'OrderCalculate?URL=ShoppingBagUpdateItemAjaxView',
        getOrderItemFromCookie: true,
        isSizeUpdate: true,
        errorViewName: 'ShoppingBagUpdateItemAjaxView',
      },
      payload: {},
      method: 'post',
      headers: updateInputDefaults.headers,
      jsessionid: null,
      hostname: false,
    })

    expect(resp.body).toEqual(hapiMontyOutOfStock)
  })

  it('should map correctly if product is out of stock during update 2', async () => {
    const ProductCollection = [
      {
        ageVerificationRequired: false,
        assets: [],
        attributes: {},
        baseImageUrl: undefined,
        bundleProducts: [],
        bundleSlots: [],
        catEntryId: false,
        colourSwatches: [],
        discountText: '',
        exceedsAllowedQty: undefined,
        freeItem: false,
        inStock: true,
        isBundleOrOutfit: false,
        isDDPProduct: undefined,
        iscmCategory: undefined,
        items: [],
        lineNumber: '',
        lowStock: false,
        name: '',
        orderItemId: false,
        productId: false,
        quantity: 2,
        restrictedCountry: undefined,
        restrictedDeliveryItem: undefined,
        shipModeId: false,
        size: '',
        sourceUrl: undefined,
        totalPrice: '',
        tpmLinks: [],
        unitPrice: '0.00',
      },
    ]
    const initialResponse = {
      products: {
        Product: ProductCollection,
      },
      ageVerificationRequired: false,
      deliveryOptions: [],
      discounts: [],
      inventoryPositions: {},
      isBasketResponse: undefined,
      isDDPOrder: undefined,
      orderId: 0,
      promotions: [],
      restrictedDeliveryItem: false,
      savedProducts: [],
      subTotal: '0.00',
      total: '0.00',
      totalBeforeDiscount: '0.00',
    }
    const basketExpected = {
      products: ProductCollection,
      ageVerificationRequired: false,
      deliveryOptions: [],
      discounts: [],
      inventoryPositions: {},
      isBasketResponse: undefined,
      isDDPOrder: undefined,
      orderId: 0,
      promotions: [],
      restrictedDeliveryItem: false,
      savedProducts: [],
      subTotal: '0.00',
      total: '0.00',
      totalBeforeDiscount: '0.00',
      deliveryThresholdsJson: '%7B%7D',
    }
    const updateBasket = new UpdateBasketItem(null, null, {
      catEntryIdToDelete: 2,
      catEntryIdToAdd: 3,
    })
    const result = updateBasket.mapResponseBody(initialResponse)

    expect(result).toEqual(basketExpected)
  })

  it('should map correctly if product is low stock during update', async () => {
    const wcsResponseLowStock = {
      ...wcsResp,
      productDataQuantity: {
        ...wcsResp.productDataQuantity,
        item_1: {
          ...wcsResp.productDataQuantity.item_1,
          inventorys: [
            {
              ...wcsResp.productDataQuantity.item_1.inventorys[0],
              quantity: 2,
            },
          ],
          invavls: [
            {
              stlocIdentifier: 'STANDARD',
              cutofftime: '2259',
              quantity: 2,
              expressdates: ['2017-09-23', '2017-09-24'],
            },
          ],
        },
      },
    }

    utils.setWCSResponse({ body: wcsResponseLowStock })

    const resp = await execute({
      payload: {
        catEntryIdToAdd: catEntryId,
        catEntryIdToDelete: catEntryId,
        quantity: '5',
      },
    })

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/OrderItemUpdateAjax',
      query: {
        orderId,
        updatePrices: 1,
        calculationUsageId: [-1, -2, -7],
        langId: '-1',
        storeId: 12556,
        catalogId: '33057',
        catEntryId,
        calculateOrder: 1,
        quantity: '5',
        sourcePage: 'PaymentDetails',
        URL: 'OrderCalculate?URL=ShoppingBagUpdateItemAjaxView',
        getOrderItemFromCookie: true,
        isSizeUpdate: true,
        errorViewName: 'ShoppingBagUpdateItemAjaxView',
      },
      payload: {},
      method: 'post',
      headers: updateInputDefaults.headers,
      jsessionid: null,
      hostname: false,
    })

    expect(resp.body).toEqual(hapiMontyPartiallyOutOfStock)
  })

  it('should map the response correctly', async () => {
    const catEntryId = 21189329
    const quantity = 2

    utils.setWCSResponse({ body: wcsResp })

    const resp = await execute({
      payload: {
        catEntryIdToAdd: catEntryId,
        catEntryIdToDelete: catEntryId,
        quantity,
      },
    })

    expect(resp.body).toEqual(hapiMontyResp)
  })

  it('should map the order summary response correctly', async () => {
    const catEntryId = 21189329
    const quantity = 2

    utils.setWCSResponse({ body: { orderSummary: wcsResp } })

    await execute({
      payload: {
        catEntryIdToAdd: catEntryId,
        catEntryIdToDelete: catEntryId,
        quantity,
        responseType: 'orderSummary',
      },
    })

    expect(orderSummaryTransform).toHaveBeenCalledTimes(1)
    expect(orderSummaryTransform).toHaveBeenCalledWith(wcsResp, false, '£')
  })

  it('should throw for session timeout', () => {
    const updateBasketItem = new UpdateBasketItem(
      '',
      null,
      { catEntryIdToAdd: 123 },
      'put',
      null,
      null
    )
    expect(() =>
      updateBasketItem.mapResponseError({
        message: 'wcsSessionTimeout',
      })
    ).toThrow({
      message: 'wcsSessionTimeout',
    })
  })

  it('should rethrow boom errors', async () => {
    utils.setWCSResponse(Promise.reject(Boom.badRequest()))

    try {
      await execute({
        payload: {},
      })

      global.fail('expected execute to throw')
    } catch (error) {
      expect(error).toEqual(Boom.badRequest())
    }
  })
})
