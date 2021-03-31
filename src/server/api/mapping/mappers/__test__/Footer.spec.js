import * as utils from '../../__test__/utils'
import Footer from '../Footer'
import wcs from '../../../../../../test/apiResponses/footer/wcs.json'

const jsessionid = '12345'

const montyRequest = {
  originEndpoint: '/api/footers',
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

const execute = utils.buildExecutor(Footer, montyRequest)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
}

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('calling the wcs endpoint for the footer', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/FooterDisplay', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/FooterDisplay'
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
    it('should contain the wcs response in the body', async () => {
      const result = await execute()
      expect(result.body).toEqual(wcs)
    })
    it('should contain the jsessionid', async () => {
      const result = await execute()
      expect(result.jsessionid).toBe(jsessionid)
    })
  })
})
