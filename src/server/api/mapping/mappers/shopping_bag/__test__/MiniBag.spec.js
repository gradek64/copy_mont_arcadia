import * as utils from '../../../__test__/utils'
import MiniBag from '../MiniBag'
import wcs from '../../../../../../../test/apiResponses/mini-bag/wcs.json'
import hapi from '../../../../../../../test/apiResponses/mini-bag/hapiMonty.json'

const jsessionid = '12345'

const montyRequest = {
  originEndpoint: '/api/shopping_bag/mini_bag',
  query: {},
  payload: {},
  method: 'get',
  headers: {},
  params: {},
}

const wcsQuery = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
}

const execute = utils.buildExecutor(MiniBag, montyRequest)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
}

describe('MiniBag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('calling the wcs endpoint for the mini bag', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/Bag', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/Bag'
      )
    })
    it('should call with the get method', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })
    it('should call with the correct query', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).query).toEqual(wcsQuery)
    })
  })
  describe('response', () => {
    beforeEach(() => {
      happyApi()
    })
    it('should contain the transformed response in the body', async () => {
      const result = await execute()
      expect(result.body).toEqual(hapi)
    })
    it('should contain the jsessionid', async () => {
      const result = await execute()
      expect(result.jsessionid).toBe(jsessionid)
    })
  })
})
