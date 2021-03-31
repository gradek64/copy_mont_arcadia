import * as utils from '../../../__test__/utils'
import TransferBasket from '../TransferBasket'
import wcs from '../../../../../../../test/apiResponses/shopping-bag/transfer/wcs.json'

const orderId = 1822719
const jsessionid = '12345'

const montyRequest = {
  originEndpoint: '/api/shopping_bag/transfer',
  query: {},
  payload: {
    transferStoreID: 13056,
    transferOrderID: orderId,
  },
  method: 'post',
  headers: {},
  params: {},
}

const wcsPayload = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  transferStoreID: 13056,
  transferOrderID: orderId,
}

const execute = utils.buildExecutor(TransferBasket, montyRequest)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
}

describe('TransferBasket', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('calling the wcs endpoint for transfering a basket', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/BasketTransferCmd', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/BasketTransferCmd'
      )
    })
    it('should call with the post method', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })
    it('should call with the correct payload', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).payload).toEqual(wcsPayload)
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
