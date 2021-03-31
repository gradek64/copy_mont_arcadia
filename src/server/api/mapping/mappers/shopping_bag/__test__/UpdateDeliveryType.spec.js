import * as utils from '../../../__test__/utils'
import UpdateDeliveryType from '../UpdateDeliveryType'
import wcsResp from '../../../../../../../test/apiResponses/shopping-bag/delivery/wcs.json'
import hapiMontyResp from '../../../../../../../test/apiResponses/shopping-bag/delivery/hapiMonty.json'
import wcsErrResp from '../../../../../../../test/apiResponses/shopping-bag/delivery/wcs-error.json'

describe('UpdateDeliveryType', () => {
  const orderId = '123'
  const nominatedDate = '2017-09-26'
  const inputDefaults = {
    endpoint: '/foo',
    query: '',
    payload: {
      deliveryOptionId: 47524,
    },
    method: 'PUT',
    headers: {
      cookie: `jsessionid=1;`,
    },
    params: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
    utils.setUserSession({
      cookies: [
        `cartId=${orderId};`,
        `nominatedDeliveryDate=${nominatedDate};`,
      ],
    })
    utils.setWCSResponse({ body: wcsResp })
  })

  const execute = utils.buildExecutor(UpdateDeliveryType, inputDefaults)

  it('should map the request correctly', async () => {
    await execute()
    const expectedPayload = {
      orderId,
      langId: '-1',
      storeId: 12556,
      catalogId: '33057',
      sourcePage: 'OrderItemDisplay',
      selectedNominatedDate: nominatedDate,
      shippingMethod: inputDefaults.payload.deliveryOptionId,
    }

    utils.expectRequestMadeWith({
      hostname: false,
      endpoint:
        '/webapp/wcs/stores/servlet/ProcessShoppingBagSummaryDeliverySelection',
      query: {},
      payload: expectedPayload,
      method: 'post',
      headers: inputDefaults.headers,
    })
  })

  it('should map the response correctly', async () => {
    const res = await execute()
    expect(res.body).toEqual(hapiMontyResp)
  })

  it('should map the error response correctly', async () => {
    utils.setWCSResponse({ body: wcsErrResp })

    try {
      await execute({ payload: { orderId: 123, deliveryOptionId: 'INVALID' } })
    } catch (err) {
      expect(err.isBoom).toBe(true)
      expect(err.output.statusCode).toBe(404)
    }
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
