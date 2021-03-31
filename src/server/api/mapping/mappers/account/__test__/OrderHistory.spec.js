import OrderHistory from '../OrderHistory'

jest.mock('../../../transforms/orderHistory')

import transformOrderHistory from '../../../transforms/orderHistory'

const storeConfig = {
  catalogId: 12345,
  langId: -1,
  siteId: 67890,
  currencySymbol: '£',
}

const orderQueryToWCS = {
  catalogId: storeConfig.catalogId,
  langId: storeConfig.langId,
  storeId: storeConfig.siteId,
}

const responseBody = {
  body: 'WCS body',
}

const transformedBody = {
  body: 'Monty body',
}

describe('OrderHistory mapper', () => {
  describe('mapEndpoint', () => {
    it('sets the destination endpoint to /webapp/wcs/stores/servlet/TrackOrderStatus', () => {
      const orderHistory = new OrderHistory()
      expect(orderHistory.destinationEndpoint).toBeUndefined()
      orderHistory.mapEndpoint()
      expect(orderHistory.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/TrackOrderStatus'
      )
    })
  })

  describe('mapRequestParameters', () => {
    it('maps the langId, categoryId, and siteId parameters correctly', () => {
      const orderHistory = new OrderHistory()
      orderHistory.storeConfig = storeConfig
      expect(orderHistory.query).toBeUndefined()
      orderHistory.mapRequestParameters()
      expect(orderHistory.query).toEqual(orderQueryToWCS)
    })
  })

  describe('mapResponseBody', () => {
    it('maps the response body using the orderHistory transform function, using the correct parameters', () => {
      const orderHistory = new OrderHistory()
      orderHistory.storeConfig = storeConfig
      transformOrderHistory.mockReturnValue(transformedBody)
      expect(orderHistory.mapResponseBody(responseBody)).toBe(transformedBody)
      expect(transformOrderHistory).toHaveBeenCalledTimes(1)
      expect(transformOrderHistory).toHaveBeenCalledWith(responseBody, '£')
    })
  })
})
