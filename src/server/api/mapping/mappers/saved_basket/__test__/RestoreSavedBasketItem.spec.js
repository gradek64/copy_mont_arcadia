import * as utils from '../../../__test__/utils'
import RestoreSavedBasketItem from '../RestoreSavedBasketItem'
import wcsBasket from '../../../../../../../test/apiResponses/shopping-bag/wcs-restore-saved-basket-item.json'

const orderId = '111111'
const getOrderId = jest.fn(() => Promise.resolve(orderId))
const input = {
  headers: {
    'brand-code': 'tsuk',
    cookie: utils.createCookies()(utils.createJSessionIdCookie(1)),
  },
  payload: {
    catEntryId: '123456',
    productId: '987654',
    quantity: 2,
  },
  getOrderId,
}
const execute = utils.buildExecutor(RestoreSavedBasketItem, input)
const config = utils.getConfigByStoreCode(input.headers['brand-code'])

describe('RestoreSavedBasketItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    utils.setUserSession({
      cookies: utils.createCookies('array')(utils.createCartIdCookie(orderId)),
    })
  })

  it('restores a saved basket item', async () => {
    utils.setWCSResponse(wcsBasket)

    const resp = await execute()

    utils.expectRequestMadeWith({
      method: 'post',
      endpoint: '/webapp/wcs/stores/servlet/InterestItemDelete',
      payload: {},
      query: {
        calculationUsageId: [-1, -2, -7],
        catalogId: config.catalogId,
        catEntryId: [input.payload.catEntryId],
        updatePrices: 1,
        langId: config.langId,
        storeId: config.siteId,
        productId: input.payload.productId,
        orderId,
        calculateOrder: 1,
        quantity: input.payload.quantity,
        pageName: 'shoppingBag',
        savedItem: 'true',
        URL:
          'OrderItemAddAjax?URL=OrderCalculate?URL=AddToBagFromIntListAjaxView',
      },
      headers: input.headers,
      jsessionid: null,
      hostname: false,
    })
    expect(resp.body).toEqual(wcsBasket)
  })

  it('fails if missing productId', () => {
    return utils.expectFailedWith(
      execute({ payload: { catEntryId: '123123' } }),
      {
        statusCode: 406,
        message: 'Missing `productId` in request body',
      }
    )
  })

  it('fails if missing catEntryId', () => {
    return utils.expectFailedWith(
      execute({ payload: { productId: '123123' } }),
      {
        statusCode: 406,
        message: 'Missing `catEntryId` in request body',
      }
    )
  })

  it('maps the error correctly', () => {
    utils.setWCSResponse({
      success: 'false',
      message: 'Foo bar',
    })

    return utils.expectFailedWith(execute(), {
      statusCode: 422,
      message: 'Foo bar',
    })
  })

  it("passes '.' as orderId if cartId cookie is not set", async () => {
    utils.setUserSession({
      cookies: utils.createCookies('array')(utils.createCartIdCookie('')),
    })
    getOrderId.mockReturnValueOnce(Promise.resolve(''))
    utils.setWCSResponse(wcsBasket)

    await execute()

    expect(utils.getRequestArgs(0).query.orderId).toBe('.')
  })
})
