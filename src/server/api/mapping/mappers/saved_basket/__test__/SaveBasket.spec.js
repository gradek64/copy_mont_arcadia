import * as utils from '../../../__test__/utils'
import SaveBasket from '../SaveBasket'
import wcsResp from '../../../../../../../test/apiResponses/shopping-bag/wcs-saved-basket.json'

const input = {
  method: 'post',
  headers: {
    'brand-code': 'tsuk',
  },
}
const execute = utils.buildExecutor(SaveBasket, input)
const config = utils.getConfigByStoreCode(input.headers['brand-code'])

describe('SaveBasket', () => {
  it('saves the basket to the saved basket', async () => {
    utils.setWCSResponse(wcsResp)

    const resp = await execute()

    utils.expectRequestMadeWith({
      method: 'post',
      endpoint: '/webapp/wcs/stores/servlet/SaveBasket',
      payload: {
        langId: config.langId,
        storeId: config.siteId,
        catalogId: config.catalogId,
        isLoggedIn: 'true',
      },
      headers: input.headers,
      jsessionid: null,
      hostname: false,
    })
    expect(resp.body).toEqual(wcsResp)
  })

  it('maps an error from WCS', () => {
    utils.setWCSResponse({
      success: false,
      message: 'An error occurred.',
    })

    return utils.expectFailedWith(execute(), {
      statusCode: 422,
      message: 'An error occurred.',
    })
  })
})
