import * as utils from '../../../__test__/utils'
import SaveFromBasket from '../SaveFromBasket'
import wcs from '../../../../../../../test/apiResponses/saved-basket/saveFromBasket/wcs.json'

describe('SaveFromBasket mapper', () => {
  const mockApi = () => utils.setWCSResponse({ body: wcs })

  const orderId = '0rder1d'
  const catEntryId = '123123123'
  const orderItemId = '456456456'
  const productId = '678678'

  const payloadToWCS = {
    calculationUsageId: [1, -1, -2, -7],
    updatePrices: 1,
    isLoggedIn: 'true',
    URL: 'AjaxOrderItemDelete?URL=AjaxOrderCalculate?URL=SaveForLaterAjaxView',
    catalogId: '33057',
    langId: '-1',
    storeId: 12556,
    orderId,
    orderItemId,
    catEntryId,
    productId,
    quantity: 1,
  }

  const payloadFromMonty = {
    orderId,
    orderItemId,
    catEntryId,
    quantity: 1,
    productId,
  }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    mockApi()
  })

  const defaults = {
    destinationEndpoint: 'saveItem',
    method: 'post',
    query: {},
    payload: {},
    headers: {
      cookie: 'jsessionid=123456789;',
    },
    params: {},
  }

  const execute = utils.buildExecutor(SaveFromBasket, defaults)

  it('should make a request with the correct endpoint', async () => {
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/AjaxInterestItemAdd'
    )
  })

  it('should use the correct method', async () => {
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should set the payload correctly', async () => {
    await execute({
      payload: payloadFromMonty,
    })
    expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
  })

  it('should correctly map the response', async () => {
    await expect(
      execute({
        payload: payloadFromMonty,
      })
    ).resolves.toEqual({ body: wcs })
  })

  it('should throw an error if the itemSaved value in the WCS response is false', async () => {
    utils.setWCSResponse({
      body: {
        itemSaved: false,
        message: 'Sorry, the item could not be saved at this time',
      },
    })

    await expect(execute()).rejects.toHaveProperty('output.payload', {
      error: 'Unprocessable Entity',
      message: 'Sorry, the item could not be saved at this time',
      statusCode: 422,
    })
  })

  it('should throw an error if the WCS request fails', async () => {
    utils.setWCSResponse(Promise.reject('Horrible WCS failure'))
    await expect(execute()).rejects.toBe('Horrible WCS failure')
  })
})
