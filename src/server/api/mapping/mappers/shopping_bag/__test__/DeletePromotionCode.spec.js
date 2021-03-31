import * as utils from '../../../__test__/utils'
import DeletePromotionCode from '../DeletePromotionCode'
import basketTransform from '../../../transforms/basket'
import orderSummaryTransform from '../../../transforms/orderSummary'

jest.mock('../../../transforms/basket')
jest.mock('../../../transforms/orderSummary')

const promotionCode = 'MONEYOFF'

const payloadToWCS = {
  orderId: '12345',
  actionType: 'verify_promo',
  updatePrices: 1,
  calculationUsageId: [-1, -2, -7],
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  promoCode: promotionCode,
  calculateOrder: 1,
  sourcePage: 'OrderItemDisplay',
  URL: 'OrderCalculate?URL=OrderPrepare?URL=PromotionCodeAjaxView',
  errorViewName: 'PromotionCodeAjaxView',
  taskType: 'R',
}

const execute = utils.buildExecutor(DeletePromotionCode, {
  headers: {},
  payload: { promotionCode },
  method: 'delete',
  getOrderId: () => Promise.resolve('12345'),
})

describe('DeletePromotionCode Mapper', () => {
  it('maps a request to/from WCS', async () => {
    const transformedBasket = 'transformedBasket'
    basketTransform.mockReturnValueOnce(transformedBasket)
    utils.setWCSResponse({ body: { orderSummary: 'orderSummary' } })

    const res = await execute()

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PromotionCodeManage',
        method: 'post',
        payload: payloadToWCS,
      })
    )
    expect(res.body).toBe(transformedBasket)
    expect(basketTransform).toHaveBeenCalledWith(
      { orderSummary: 'orderSummary' },
      '£'
    )
  })

  it('maps a request to/from WCS for order summary', async () => {
    orderSummaryTransform.mockReturnValueOnce('transformedOS')
    utils.setWCSResponse({ body: { orderSummary: 'foo' } })

    const res = await execute({
      payload: {
        promotionCode,
        responseType: 'orderSummary',
      },
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        endpoint: '/webapp/wcs/stores/servlet/PromotionCodeManage',
        method: 'post',
        payload: {
          ...payloadToWCS,
          URL: 'OrderCalculate?URL=OrderPrepare?URL=PromotionCodeAjaxView',
        },
      })
    )
    expect(res.body).toBe('transformedOS')
    expect(orderSummaryTransform).toHaveBeenCalledWith('foo', false, '£')
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
