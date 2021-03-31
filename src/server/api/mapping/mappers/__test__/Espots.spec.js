import * as utils from '../../__test__/utils'
import Espot from '../Espots'
import wcs from '../../../../../../test/apiResponses/espot/wcs.json'

const jsessionid = '12345'

const montyRequest = {
  query: {
    items: ['homeEspot1'],
  },
  method: 'get',
}

const wcsQuery = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  espots: ['homeEspot1'],
}

const execute = utils.buildExecutor(Espot, montyRequest)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
}

describe('Espot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    happyApi()
  })

  describe('request', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/EspotDetails', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/EspotDetails'
      )
    })

    it('should call with the get method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })

    it('should call with the correct query', async () => {
      await execute()
      expect(utils.getRequestArgs(0).query).toEqual(wcsQuery)
    })
  })

  describe('error handling', () => {
    const errorSpec = {
      statusCode: 400,
      message: 'No Espot names provided',
    }

    it('should return a 400 if the items list is not provided', () => {
      return utils.expectFailedSynchronouslyWith(
        () =>
          execute({
            ...montyRequest,
            query: {},
          }),
        errorSpec
      )
    })

    it('should return a 400 if the items list is empty', () => {
      return utils.expectFailedSynchronouslyWith(
        () =>
          execute({
            ...montyRequest,
            query: { items: '' },
          }),
        errorSpec
      )
    })
  })

  describe('response', () => {
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
