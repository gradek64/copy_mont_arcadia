import * as utils from '../../../__test__/utils'
import GetSeeMore from '../GetSeeMore'
import { getConfigByStoreCode } from '../../../../../config'
import wcsResponse from 'test/apiResponses/products-see-more/wcs.json'

const input = {
  endpoint: '/api/products/seemore',
  method: 'get',
  payload: {},
  headers: {
    'brand-code': 'tsuk',
  },
  query: {
    endecaUrl: '/_/N-2f83Z1xjf',
  },
  params: {},
}
const execute = utils.buildExecutor(GetSeeMore, input)
const config = getConfigByStoreCode(input.headers['brand-code'])

describe('server/api/mapping/mappers/products/GetSeeMore', () => {
  beforeEach(() => {
    utils.setWCSResponse(wcsResponse)
  })

  it('maps the request correctly', async () => {
    await execute()

    utils.expectRequestMadeWith({
      endpoint: '/webapp/wcs/stores/servlet/ArcadiaSeeMoreDisplay',
      method: 'get',
      query: {
        storeId: config.siteId,
        langId: config.langId,
        catalogId: config.catalogId,
        endecaUrl: input.query.endecaUrl,
      },
      params: {},
      payload: {},
      headers: input.headers,
      jsessionid: null,
      hostname: false,
    })
  })

  it('maps the response like for like', async () => {
    const resp = await execute()

    expect(resp).toEqual(resp)
  })

  it('missing endecaUrl reponds 400 Bad Request', async () => {
    await utils.expectFailedWith(execute({ query: {} }), {
      statusCode: 400,
      message: 'Missing endecaUrl query string parameter',
    })
  })
})
