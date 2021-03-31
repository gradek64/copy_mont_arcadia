import OrderDetails from '../OrderDetails'
import orderDetailsWCSResponseWithStatusP from 'test/apiResponses/coreapi/order-details/order-details-P.json'
import Boom from 'boom'

jest.mock('../../../transforms/orderDetails')

import transformOrderDetails from '../../../transforms/orderDetails'

const queryParams = {
  orderId: 5678,
  CarrierAndTracking: 'OrderDetailDisplay',
}

const storeConfig = {
  catalogId: 12345,
  langId: -1,
  siteId: 67890,
  brandName: 'Whoa',
  currencySymbol: '£',
}

const queryStoreConfig = {
  storeId: storeConfig.siteId,
  langId: storeConfig.langId,
  catalogId: storeConfig.catalogId,
}

const orderQueryToWcs = {
  ...queryStoreConfig,
  orderId: 5678,
  CarrierAndTracking: 'OrderDetailDisplay',
}

const responseBody = { body: "I'm the body from WCS." }
const transformedBody = { body: "I'm the new Monty body." }

describe('OrderDetails mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('mapEndpoint', () => {
    it('sets the destination endpoint to /webapp/wcs/stores/servlet/OrderDetail', () => {
      const orderDetails = new OrderDetails()
      expect(orderDetails.destinationEndpoint).toBeUndefined()
      orderDetails.mapEndpoint()
      expect(orderDetails.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/OrderDetail'
      )
    })
  })

  describe('mapRequestParameters', () => {
    it('maps the orderId request parameter', () => {
      const orderDetails = new OrderDetails()
      orderDetails.storeConfig = storeConfig
      orderDetails.query = queryStoreConfig
      orderDetails.params = queryParams
      orderDetails.mapRequestParameters()
      expect(orderDetails.query).toEqual(orderQueryToWcs)
    })
  })

  describe('mapResponseBody', () => {
    it('maps the response body using the orderByID transform function', () => {
      const orderDetails = new OrderDetails()
      orderDetails.storeConfig = storeConfig
      orderDetails.query = orderQueryToWcs
      transformOrderDetails.mockReturnValue(transformedBody)
      expect(orderDetails.mapResponseBody(responseBody)).toBe(transformedBody)
      expect(transformOrderDetails).toHaveBeenCalledTimes(1)
      expect(transformOrderDetails).toHaveBeenCalledWith(responseBody, '£')
    })
    it('throws 422 "An error has occurred please try again" error for order with status P', () => {
      const orderDetails = new OrderDetails()

      orderDetails.headers = {
        'monty-client-device-type': 'apps',
      }

      expect(() =>
        orderDetails.mapResponseBody(orderDetailsWCSResponseWithStatusP)
      ).toThrow(Boom.badData('An error has occurred please try again'))
      expect(transformOrderDetails).not.toHaveBeenCalled()
    })
    it('does not throw for monty client even if the order has status P', () => {
      const orderDetails = new OrderDetails()

      orderDetails.headers = {
        'monty-client-device-type': 'mobile',
      }

      expect(() =>
        orderDetails.mapResponseBody(orderDetailsWCSResponseWithStatusP)
      ).not.toThrow()
      expect(transformOrderDetails).toHaveBeenCalled()
    })
  })
})
