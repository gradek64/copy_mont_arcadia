import * as utils from '../../../__test__/utils'
import CMSSeoUrl from '../CMSSeoUrl'

describe('CMSSeoUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  const defaults = {
    endpoint: '/foo',
    hostname: false,
    query: {
      pathname: '/en/tsuk/category/topshop-receipt-4957579/home',
    },
    payload: {},
    method: 'get',
    headers: {},
    params: {},
  }

  const execute = utils.buildExecutor(CMSSeoUrl, defaults)

  it('should set the endpoint to the expected value', async () => {
    await execute()
    utils.expectRequestMadeWith({
      ...defaults,
      endpoint: `/en/tsuk/category/topshop-receipt-4957579/home`,
    })
  })

  it('should throw an error if no pathname provided in the query', async () => {
    expect(() =>
      execute({
        ...defaults,
        query: {},
      })
    ).toThrow('Missing query parameter "pathname"')
  })
})
