import * as utils from '../../../__test__/utils'
import DeleteSavedItem from '../DeleteSavedItem'
import wcs from '../../../../../../../test/apiResponses/saved-basket/deleteSavedItem/wcs.json'

describe('DeleteSavedItem mapper', () => {
  const orderId = '12345678'
  const catEntryId = '789789'
  const productId = '345345'

  const mockAPI = () => utils.setWCSResponse({ body: wcs })

  const payloadFromMonty = {
    catEntryId,
    productId,
  }

  const payloadToWCS = {
    updatePrices: 1,
    calculationUsageId: -1,
    URL: 'InterestItemsRemoveItemAjaxView',
    calculateOrder: 1,
    storeId: 12556,
    catalogId: '33057',
    langId: '-1',
    productId,
    catEntryId,
    orderId,
  }

  const defaults = {
    method: 'delete',
    endpoint: '',
    query: {},
    payload: payloadFromMonty,
    headers: {
      cookie: 'jsessionid=321321;',
    },
    params: {},
    getOrderId: () => Promise.resolve(orderId),
  }

  const execute = utils.buildExecutor(DeleteSavedItem, defaults)

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    mockAPI()

    utils.setUserSession({
      cookies: [utils.createCookies()(utils.createCartIdCookie(orderId))],
    })
  })

  it('should set the correct endpoint', async () => {
    await execute()
    expect(utils.getRequestArgs(0).endpoint).toBe(
      '/webapp/wcs/stores/servlet/InterestItemDelete'
    )
  })

  it('should use the correct method', async () => {
    await execute()
    expect(utils.getRequestArgs(0).method).toBe('post')
  })

  it('should set the payload correctly ', async () => {
    await execute()
    expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
  })

  it('should correctly map the response', async () => {
    await expect(
      execute({
        payload: payloadFromMonty,
      })
    ).resolves.toEqual({ body: wcs })
  })

  it('should throw an error if the WCS request fails', async () => {
    utils.setWCSResponse(Promise.reject('WCS crashed'))
    await expect(execute()).rejects.toBe('WCS crashed')
  })

  it('should thwo an error if the WCS response has a success value of false', async () => {
    utils.setWCSResponse({ success: false, message: 'Could not remove item' })
    await utils.expectFailedWith(execute(), {
      statusCode: 422,
      message: 'Could not remove item',
    })
  })

  it('should throw an error if there is no productId in the payload', async () => {
    await utils.expectFailedWith(
      execute({
        payload: {
          catEntryId: '123456',
        },
      }),
      {
        statusCode: 422,
        message: 'Invalid productId',
      }
    )
  })

  it('should throw an error if there is no catEntryId in the payload', async () => {
    await utils.expectFailedWith(
      execute({
        payload: {
          productId: '67890',
        },
      }),
      {
        statusCode: 422,
        message: 'Invalid catEntryId',
      }
    )
  })
})
