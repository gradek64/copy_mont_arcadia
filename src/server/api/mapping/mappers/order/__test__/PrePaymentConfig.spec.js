import deepFreeze from 'deep-freeze'
import * as utils from '../../../__test__/utils'
import PrePaymentConfig from '../PrePaymentConfig'

describe('PrePaymentConfig Mapper', () => {
  const orderId = 'test-order-id'
  const defaults = {
    payload: {
      orderId,
    },
  }

  const execute = utils.buildExecutor(PrePaymentConfig, defaults)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should use the correct endpoint', async () => {
    utils.setWCSResponse({})
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/getPrePaymentConfig'
    )
  })

  it('should use the correct method', async () => {
    utils.setWCSResponse({})
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should have a payload containing the orderId', async () => {
    utils.setWCSResponse({})
    await execute()
    expect(utils.getRequestArgs(0).payload).toEqual({ orderId })
  })

  it('should respond with binNumber, orderId, ddcJwt, and ddcUrl when successful', async () => {
    const binNumber = 'test-bin-number'
    const ddcJwt = 'test-ddc-jwt'
    const ddcUrl = 'test-ddc-url'
    const response = deepFreeze({
      body: {
        binNumber,
        orderId,
        ddcJwt,
        ddcUrl,
      },
    })
    utils.setWCSResponse(response)
    await expect(execute()).resolves.toEqual(response)
  })

  it('should fail with 403 (Forbidden) when WCS responds with _ERR_USER_AUTHORITY', async () => {
    const errorMessage = 'wcs-error-message'
    utils.setWCSResponse({
      errorMessageKey: '_ERR_USER_AUTHORITY',
      errorMessage,
    })

    try {
      await execute()
    } catch (error) {
      expect(error).toEqual(new Error(errorMessage))
      expect(error.output.statusCode).toEqual(403)
    }
  })

  it('should fail with 502 (Bad Gateway) when WCS responds with any other error', async () => {
    const errorMessage = 'wcs-error-message'
    utils.setWCSResponse({
      errorMessageKey: '_ERR_PSD_GENERIC_EXCEPTION',
      errorMessage,
    })

    try {
      await execute()
    } catch (error) {
      expect(error).toEqual(new Error(errorMessage))
      expect(error.output.statusCode).toEqual(502)
    }
  })
})
