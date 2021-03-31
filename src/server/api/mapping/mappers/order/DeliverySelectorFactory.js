import Boom from 'boom'
import HomeDeliverySelector from './delivery/HomeDeliverySelector'
import ParcelDeliverySelector from './delivery/ParcelDeliverySelector'
import StoreDeliverySelector from './delivery/StoreDeliverySelector'

/**
 * This Factory class produces instances of Mappers associated with the requests
 * for updating the selected delivery options in the order summary.
 */
export default class DeliverySelectorFactory {
  /**
   * Based on the delivery type provided in the arguments (payload.deliveryType) this function
   * creates and returns an instance of the associated delivery selector mapper.
   *
   * @param {*} args [pathname, query, payload, method, headers, params]
   *                    {String} pathname [hapi endpoint hit by the current request]
   *                    {String} query          [query parameters of the current hapi request]
   *                    {Object} payload        [payload object of the current request]
   *                    {String} method         [current request's method]
   *                    {Object} headers        [headers passed in the current request]
   *                    {Object} params         [contains the request parameters passed throgh the path (e.g.: /api/products/{identifier} => params = { identifier: '123' })]
   * @return {Object} [An instance of a delivery selector mapper]
   */
  static createMapper(...args) {
    const [, , payload] = args
    const deliveryType = payload && payload.deliveryType
    if (!deliveryType || typeof deliveryType !== 'string')
      Boom.badRequest('Malformed "payload" argument')

    if (deliveryType.includes('HOME')) {
      return new HomeDeliverySelector(...args)
    } else if (deliveryType.includes('PARCEL')) {
      return new ParcelDeliverySelector(...args)
    } else if (deliveryType.includes('STORE')) {
      return new StoreDeliverySelector(...args)
    }

    return new HomeDeliverySelector(...args)
  }
}

export const deliverySelectorSpec = {
  summary: 'Change the delivery type of an order from the order summary',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          orderId: {
            type: 'number',
            example: 2230213,
          },
          deliveryType: {
            type: 'string',
            example: 'STORE_STANADARD',
          },
          deliveryStoreCode: {
            type: 'string',
            example: 'TS0001',
          },
          shipModeId: {
            type: 'number',
            example: 33097,
          },
          shippingCountry: {
            type: 'string',
            example: 'United Kingdom',
          },
          storeAddress1: {
            type: 'string',
            example: '214 Oxford Street',
          },
          storeAddress2: {
            type: 'string',
            example: 'Oxford Circus',
          },
          storeCity: {
            type: 'string',
            example: 'West End',
          },
          storePostcode: {
            type: 'string',
            example: 'W1W 8LG',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Order Summary object',
      $ref: '#/definitions/orderSummary',
    },
  },
}
