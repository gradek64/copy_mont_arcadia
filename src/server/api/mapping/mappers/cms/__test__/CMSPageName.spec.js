import * as utils from '../../../__test__/utils'
import CMSPageName from '../CMSPageName'

describe('CMSPageName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const defaults = {
    endpoint: '/foo',
    hostname: false,
    query: {},
    payload: {},
    method: 'get',
    headers: {},
    params: {
      pageName: 'test1234',
    },
  }

  const execute = utils.buildExecutor(CMSPageName, defaults)

  it('should set the endpoint to the expected value', async () => {
    await execute()
    utils.expectRequestMadeWith({
      ...defaults,
      endpoint: `/wcs/resources/store/${config.siteId}/cmsPage/byName`,
      query: {
        storeId: config.siteId,
        langId: config.langId,
        pageName: defaults.params.pageName,
      },
    })
  })

  it('should throw an error if no pageName provided in the params', () => {
    expect(() =>
      execute({
        ...defaults,
        params: {},
      })
    ).toThrow('Missing url parameter "pageName"')
  })
})
