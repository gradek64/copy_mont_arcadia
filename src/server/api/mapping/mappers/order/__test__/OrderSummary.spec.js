import * as utils from '../../../__test__/utils'
import OrderSummary from '../OrderSummary'
import { orderSummaryConstants } from '../../../constants/orderSummary'
import basketTransform from '../../../transforms/basket'

jest.mock('../../../transforms/basket')

import transform, {
  checkIfBasketObjectWithError,
} from '../../../transforms/orderSummary'

jest.mock('../../../transforms/orderSummary', () => ({
  __esModule: true,
  default: jest.fn(),
  checkIfBasketObjectWithError: jest.fn(),
}))

const payloadToWCS = {
  ...orderSummaryConstants({ storeId: 12556, catalogId: '33057' }),
  catalogId: '33057',
  langId: '-1',
  storeId: 12556,
  orderId: 7890,
  isTempUserNotRqrd: true,
  clearGuestDetails: false,
}

const transformedBody = {
  body: 'I am a transformed body for monty',
}

const getOrderId = jest.fn(() => Promise.resolve(7890))

const execute = utils.buildExecutor(OrderSummary, {
  params: {
    orderId: 7890,
  },
  getOrderId,
  query: {},
})

describe('OrderSummary Mapper', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should map request to/from WCS', async () => {
    transform.mockReturnValue(transformedBody)
    utils.setWCSResponse({
      body: {
        success: true,
        orderSummary: {},
      },
    })

    const res = await execute({
      headers: {
        cookie: 'jsessionid=1; ',
      },
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PreCheckout',
        payload: payloadToWCS,
      })
    )
    expect(getOrderId).not.toHaveBeenCalled()
    expect(transform).toBeCalledWith({}, false, '£')
    expect(res.body).toEqual(transformedBody)
  })

  it('should use the getOrderId utility to obtain the orderId from the session', async () => {
    utils.setWCSResponse({
      body: {
        success: true,
        orderSummary: {},
      },
    })
    const cookie = 'jsessionid=1; '

    await execute({
      params: {},
      headers: {
        cookie,
      },
    })

    expect(getOrderId).toHaveBeenCalledWith(cookie)
  })

  it('should throw a wcsSessionTimeout error when the body of the response is empty', async () => {
    utils.setWCSResponse({ body: undefined })

    try {
      await execute({
        headers: {
          cookie: 'jsessionid=1; ',
        },
      })
      global.fail('Promise should reject')
    } catch (e) {
      expect(e.message).toBe('wcsSessionTimeout')
    }
  })

  it('should NOT throw a wcsSessionTimeout error when success is false BUT we still receiving a orderSummary Object', async () => {
    transform.mockReturnValueOnce('returned!')
    utils.setWCSResponse({
      body: {
        success: false,
        error: 'some error',
        orderSummary: {
          not: 'empty',
        },
      },
    })

    const res = await execute({
      headers: {
        cookie: 'jsessionid=1; ',
      },
    })

    expect(res.body).toEqual('returned!')
  })

  it('should throw a wcsSessionTimeout error when not able to get order Id from cookies', async () => {
    getOrderId.mockReturnValueOnce(Promise.reject())

    try {
      await execute({
        params: {},
        headers: {
          cookie: 'jsessionid=1; ',
        },
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.message).toBe('wcsSessionTimeout')
    }
  })

  it('re-throws session timeout error', async () => {
    utils.setWCSResponse(Promise.reject(new Error('wcsSessionTimeout')))

    try {
      await execute({
        headers: {},
      })
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e.message).toBe('wcsSessionTimeout')
    }
  })

  it('should map an error if the basket has an error', async () => {
    const mockBasket = {
      messageForBuyer: 'This is a test error message',
      orderId: 1234,
      subTotal: 1,
      total: 1.2,
      totalBeforeDiscount: 1.0,
      deliveryOptions: [],
      promotions: [],
      discounts: [],
      products: [],
      savedProducts: [],
      ageVeficicationRequired: false,
      restrictedDeliveryItem: false,
      inventoryPosition: {},
      isDDPOrder: false,
    }
    utils.setWCSResponse({
      body: {
        Basket: mockBasket,
      },
    })
    checkIfBasketObjectWithError.mockImplementation(() => mockBasket)
    basketTransform.mockReturnValueOnce('transformedBasket')

    const response = await execute({
      headers: {},
    })

    expect(response.body).toBe('transformedBasket')
  })
})
