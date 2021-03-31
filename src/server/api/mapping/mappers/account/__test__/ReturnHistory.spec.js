import ReturnHistory from '../ReturnHistory'

jest.mock('../../../Mapper')
jest.mock('../../../transforms/returnHistory')

import transform from '../../../transforms/returnHistory'

const storeCodes = {
  siteId: 12556,
  catalogId: '33057',
  langId: '-1',
}
const expectedQuery = {
  storeId: 12556,
  catalogId: '33057',
  langId: '-1',
  orderId: '',
}

const responseBody = { success: true, body: 'wcs', userTrackingId: 1848001 }
const transformedBody = { body: 'monty', userTrackingId: 1848001 }

describe('ReturnHistory', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('expects to set "destinationEndpoint" property to the expected value', () => {
      const returnHistory = new ReturnHistory()
      expect(returnHistory.destinationEndpoint).toBeUndefined()
      returnHistory.mapEndpoint()
      expect(returnHistory.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/TrackRMAStatus'
      )
    })
  })
  describe('mapRequestParameters', () => {
    it('expects to set "query" property to the expected value', () => {
      const returnHistory = new ReturnHistory()
      returnHistory.storeConfig = storeCodes
      expect(returnHistory.query).toBeUndefined()
      returnHistory.mapRequestParameters()
      expect(returnHistory.query).toEqual(expectedQuery)
    })
  })
  describe('mapResponseBody', () => {
    it('calls transform with the body passed in', () => {
      transform.mockReturnValue(transformedBody)
      const returnHistory = new ReturnHistory()
      expect(returnHistory.mapResponseBody(responseBody)).toEqual(
        transformedBody
      )
      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(responseBody)
    })
  })
})
