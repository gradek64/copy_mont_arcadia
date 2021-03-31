import * as utils from '../../../__test__/utils'
import ConfirmPSD2Order from '../ConfirmPSD2Order'

import * as serverSideAnalytics from '../server_side_analytics'

import wcs3DSOrderConfirmed from 'test/apiResponses/orders/putOrder/3ds-visa-order-process/wcs.json'
import hapi3DSOrderConfirmed from 'test/apiResponses/orders/putOrder/3ds-visa-order-process/hapi.json'

jest.mock('../server_side_analytics', () => ({
  logPurchase: jest.fn(),
}))

const execute = utils.buildExecutor(ConfirmPSD2Order)

describe('ConfirmPSD2Order Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps the request to and from WCS', async () => {
    utils.setWCSResponse(wcs3DSOrderConfirmed)
    const jsessionid = 1
    const headers = {
      cookis: `jsessionid=${jsessionid}; `,
    }
    const orderId = '9543676'

    const res = await execute({
      payload: {
        orderId,
      },
      headers,
    })

    expect(utils.getRequestArgs()).toEqual(
      expect.objectContaining({
        hostname: false,
        endpoint: '/webapp/wcs/stores/servlet/OrderProcess',
        headers,
        query: {
          orderId,
          catalogId: '33057',
          langId: '-1',
          storeId: '12556',
        },
      })
    )
    expect(res.body).toEqual(hapi3DSOrderConfirmed.body)
  })

  it('should log serverSideAnalytics when the request comes from Monty', async () => {
    utils.setWCSResponse(wcs3DSOrderConfirmed)
    const orderId = '9543676'

    await execute({
      payload: {
        orderId,
      },
      headers: { 'monty-client-device-type': 'desktop' },
    })

    expect(serverSideAnalytics.logPurchase).toHaveBeenCalled()
  })

  it('should not log serverSideAnalytics when the request comes from the Apps', async () => {
    utils.setWCSResponse(wcs3DSOrderConfirmed)
    const orderId = '9543676'

    await execute({
      payload: {
        orderId,
      },
      headers: { 'monty-client-device-type': 'apps' },
    })

    expect(serverSideAnalytics.logPurchase).not.toHaveBeenCalled()
  })

  it('should return 502 when WCS responds with a malformed error response', async () => {
    utils.setWCSResponse(Promise.resolve({}))
    const orderId = '9543676'

    const p = execute({
      payload: {
        orderId,
      },
    })

    await utils.expectFailedWith(p, {
      status: 502,
      message: 'PSD2 order confirmation: malformed response from WCS',
    })
  })

  it('should return 502 when WCS responds with a well formed error response', async () => {
    const errorMessage = 'Card declined'
    utils.setWCSResponse(
      Promise.resolve({
        body: {
          OrderConfirmation: {},
          success: false,
          errorMessage,
        },
      })
    )
    const orderId = '9543676'

    const p = execute({
      payload: {
        orderId,
      },
    })

    await utils.expectFailedWith(p, {
      status: 502,
      message: errorMessage,
    })
  })

  it('should throw an error when sendRequestToApi returns an unsuccessful response', async () => {
    utils.setWCSResponse(Promise.reject(new Error('An error has occurred')))
    const orderId = '9543676'

    const p = execute({
      payload: {
        orderId,
      },
    })

    await utils.expectFailedWith(p, {
      status: 502,
      message: 'An error has occurred',
    })
  })

  it('should throw an error by default when sendRequestToApi returns an unsuccessful response', async () => {
    utils.setWCSResponse(Promise.reject(new Error()))
    const orderId = '9543676'

    const p = execute({
      payload: {
        orderId,
      },
    })

    await utils.expectFailedWith(p, {
      status: 502,
      message: 'Unable to confirm PSD2 order',
    })
  })
})
