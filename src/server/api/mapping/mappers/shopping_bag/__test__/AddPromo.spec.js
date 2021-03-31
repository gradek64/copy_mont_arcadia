import * as utils from '../../../__test__/utils'
import AddPromo from '../AddPromo'
import { cookieOptionsUnset } from '../../../../../lib/auth'
import { addPromoConstants } from '../../../constants/addPromo'
import orderSummaryTransform from '../../../transforms/orderSummary'
import basketTransform from '../../../transforms/basket'

jest.mock('../../../transforms/orderSummary')
jest.mock('../../../transforms/basket')

const payloadToWCS = {
  ...addPromoConstants,
  catalogId: '33057',
  langId: '-1',
  URL: 'OrderCalculate?URL=OrderPrepare?URL=PromotionCodeAjaxView',
  storeId: 12556,
  promoCode: 'TSUK10',
  orderId: 'order123',
}

const cookies = ['cookie1=foobar;', 'cartId=123456;', 'anotherCookie=batbaz;']

const cookiesToSet = [
  {
    name: 'arcpromocode',
    value: '',
    options: cookieOptionsUnset,
  },
]

const queryToOrderCalc = {
  URL: 'OrderItemDisplay',
  calculateOrder: 1,
  calculationUsageId: [-1, -2, -7],
  catalogId: '33057',
  langId: '-1',
  orderId: '.',
  storeId: 12556,
  updatePrices: 1,
}

const getOrderId = jest.fn(() => Promise.resolve('order123'))
const execute = utils.buildExecutor(AddPromo, {
  method: 'post',
  payload: { promotionId: 'TSUK10' },
  headers: { cookie: 'jsessionid=1; ' },
  getOrderId,
})

describe('AddPromo Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps request to/from WCS', async () => {
    const jsessionid = 1
    basketTransform.mockReturnValueOnce('transformedBasket')
    utils.setWCSResponse({ body: { success: true } })
    utils.setWCSResponse(
      { body: { success: true, Basket: {} }, jsessionid },
      { n: 1 }
    )

    const res = await execute()

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PromotionCodeManage',
        method: 'post',
        payload: payloadToWCS,
      })
    )
    expect(utils.getRequestArgs(1)).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/OrderCalculate',
        method: 'get',
        query: queryToOrderCalc,
      })
    )
    expect(res.body).toEqual('transformedBasket')
    expect(basketTransform).toHaveBeenCalledWith({}, '£')
    expect(res.jsessionid).toBe(jsessionid)
    expect(res.setCookies).toEqual(cookiesToSet)
  })

  it('maps request to/from WCS for order summary', async () => {
    const jsessionid = 1
    orderSummaryTransform.mockReturnValueOnce('transformedOrderSummary')
    utils.setWCSResponse({
      body: { success: true, orderSummary: {} },
      jsessionid,
    })

    const res = await execute({
      payload: { promotionId: 'TSUK10', responseType: 'orderSummary' },
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PromotionCodeManage',
        method: 'post',
        payload: {
          ...payloadToWCS,
          URL: 'OrderCalculate?URL=OrderPrepare?URL=DeliveryPageUpdateAjaxView',
        },
      })
    )
    expect(utils.getRequests().length).toBe(1)
    expect(res.body).toEqual('transformedOrderSummary')
    expect(orderSummaryTransform).toHaveBeenCalledWith({}, false, '£')
    expect(res.jsessionid).toBe(jsessionid)
    expect(res.setCookies).toEqual(cookiesToSet)
  })

  it('throws when add promo request fails', async () => {
    utils.setWCSResponse(Promise.reject({ body: { message: 'Error!' } }))

    try {
      await execute()
      global.fail('Expected promise to reject')
    } catch (e) {
      expect(e).not.toBe(undefined)
    }
  })

  it('errorCode "_API_CANT_RESOLVE_FFMCENTER.2" is still successful', async () => {
    basketTransform.mockReturnValueOnce('transformedBasket')
    utils.setWCSResponse({
      body: {
        success: false,
        errorCode: '_API_CANT_RESOLVE_FFMCENTER.2',
      },
    })
    utils.setWCSResponse({ body: { success: true } }, { n: 1 })

    const res = await execute()

    expect(res.body).toEqual('transformedBasket')
  })

  it('errorCode "_API_CANT_RESOLVE_FFMCENTER.2" is still successful - stringy "false"', async () => {
    basketTransform.mockReturnValueOnce('transformedBasket')
    utils.setWCSResponse({
      body: {
        success: 'false',
        errorCode: '_API_CANT_RESOLVE_FFMCENTER.2',
      },
    })
    utils.setWCSResponse({ body: { success: true } }, { n: 1 })

    const res = await execute()

    expect(res.body).toEqual('transformedBasket')
  })

  describe('execute', () => {
    describe('if wcs returns an errorCode on the response body', () => {
      const asssertErrorThrown = (errorCode, statusCode) => {
        it(`should throw a ${statusCode} if wcs returns errorCode '${errorCode}'`, async () => {
          utils.setWCSResponse(
            Promise.resolve({
              body: {
                errorCode,
                message: 'oh no not again',
              },
            })
          )
          return utils.expectFailedWith(
            execute({
              headers: { cookie: cookies },
              method: 'post',
              payload: { promotionId: 'TSUK10' },
            }),
            {
              statusCode,
              message: 'oh no not again',
              wcsErrorCode: errorCode,
            }
          )
        })
      }

      asssertErrorThrown('ERR_PROMOTION_CODE_INVALID.-1200', 406)

      asssertErrorThrown('_ERR_GENERIC', 409)

      asssertErrorThrown('_ERR_PROMOTION_PER_SHOPPER_LIMIT_EXCEEDED', 409)

      asssertErrorThrown('ERR_PROMOTION_PER_SHOPPER_LIMIT_EXCEEDED.-1800', 409)
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
        await execute({
          payload: {},
          method: 'post',
          headers: { jsessionid: '12345', cookie: cookies },
        })

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
