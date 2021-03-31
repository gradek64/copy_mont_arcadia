import ReturnDetails from '../ReturnDetails'

jest.mock('../../../Mapper')
jest.mock('../../../transforms/returnDetails')

import transform from '../../../transforms/returnDetails'

const storeCodes = {
  siteId: 12556,
  catalogId: '33057',
  langId: '-1',
}
const montyParams = {
  orderId: 12345,
  rmaId: 65432,
}
const expectedQuery = {
  storeId: 12556,
  catalogId: '33057',
  langId: '-1',
  ...montyParams,
}

const responseBody = { success: true, body: 'wcs', userTrackingId: 1848001 }
const transformedBody = { body: 'monty', userTrackingId: 1848001 }

describe('ReturnDetails', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('expects to set "destinationEndpoint" property to the expected value', () => {
      const returnDetails = new ReturnDetails()
      expect(returnDetails.destinationEndpoint).toBeUndefined()
      returnDetails.mapEndpoint()
      expect(returnDetails.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/ReturnDetail'
      )
    })
  })
  describe('mapRequestParameters', () => {
    it('expects to set "query" property to the expected value', () => {
      const returnDetails = new ReturnDetails()
      returnDetails.storeConfig = storeCodes
      returnDetails.params = montyParams
      expect(returnDetails.query).toBeUndefined()
      returnDetails.mapRequestParameters()
      expect(returnDetails.query).toEqual(expectedQuery)
    })
  })
  describe('mapResponseBody', () => {
    it('calls transform with the body passed in', () => {
      transform.mockReturnValue(transformedBody)
      const returnDetails = new ReturnDetails()
      expect(returnDetails.mapResponseBody(responseBody)).toBe(transformedBody)
      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(responseBody)
    })
  })
})
