import { path, pathOr } from 'ramda'
import Boom from 'boom'
import Mapper from '../../Mapper'
import { isAuthenticated } from '../../utils/sessionUtils'
import { addDeliveryAddressConstants } from '../../constants/orderSummary'
import transform from '../../transforms/addDeliveryAddress'
import orderSummaryTransform from '../../transforms/orderSummary'
import {
  removeDiacritics,
  removeStateDiacritics,
  removeCanadaDiacritics,
  removeBillingShippingStateDiacritics,
} from '../../utils/genericUtils'

export default class AddDeliveryAddress extends Mapper {
  async mapRequestParameters() {
    const { langId, catalogId, siteId: storeId } = this.storeConfig

    const orderId = await this.getOrderId(this.headers.cookie)
    const state = path(['address', 'state'], this.payload)
    const shippingCountry = path(['address', 'country'], this.payload)
    const country = path(['address', 'country'], this.payload)
    const address1 = path(['address', 'address1'], this.payload)
    const address2 = path(['address', 'address2'], this.payload)
    const shippingCity = path(['address', 'city'], this.payload)

    this.responseType = this.payload.responseType
    this.payload = {
      orderId,
      storeId,
      catalogId,
      langId,
      shipping_nickName: `Default_Shipping_${storeId}`,
      shipping_personTitle: path(['nameAndPhone', 'title'], this.payload),
      shipping_firstName: path(['nameAndPhone', 'firstName'], this.payload),
      shipping_lastName: path(['nameAndPhone', 'lastName'], this.payload),
      shipping_phone1: path(['nameAndPhone', 'telephone'], this.payload),
      shipping_country: removeDiacritics(country),
      shipping_address1: removeDiacritics(address1),
      shipping_address2: removeDiacritics(address2),
      shipping_city: removeDiacritics(shippingCity),
      shipping_state_input: removeStateDiacritics(state, shippingCountry),
      shipping_state_select: removeStateDiacritics(state, shippingCountry),
      shipping_state_select_canada: removeCanadaDiacritics(
        state,
        shippingCountry
      ),
      shipping_state_hidden: removeBillingShippingStateDiacritics(state),
      shipping_zipCode: path(['address', 'postcode'], this.payload),
      ...addDeliveryAddressConstants,
    }
  }

  mapEndpoint() {
    const isGuest = !isAuthenticated(this.headers.cookie)
    const wcs = '/webapp/wcs/stores/servlet/'
    this.destinationEndpoint = isGuest
      ? `${wcs}ProcessDeliveryDetails`
      : `${wcs}UserRegistrationUpdate`
  }

  mapResponseBody(body = {}) {
    if (!body.orderSummary || body.errorMessage)
      return this.mapResponseError(body)
    return this.responseType === 'orderSummary'
      ? orderSummaryTransform(
          body.orderSummary,
          false,
          this.storeConfig.currencySymbol
        )
      : transform(body.orderSummary)
  }

  mapWCSErrorCodes = {
    '_ERR_CMD_INVALID_PARAM.ERROR_CODE_INVALID_PHONE_NUMBER': 406,
    ERROR_CODE_INVALID_PHONE_NUMBER: 406,
    ERROR_INVALID_STATE: 406,
    '_ERR_CMD_INVALID_PARAM.ERROR_INVALID_STATE': 406,
    2020: 406,
  }

  mapResponseError(body) {
    const { wcsErrorCode } = pathOr({}, ['data'], body)
    throw body.errorMessage && !wcsErrorCode
      ? Boom.badData(body.errorMessage)
      : body
  }

  async execute() {
    await this.mapRequestParameters()
    this.mapEndpoint()
    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        this.query,
        this.payload,
        this.method,
        this.headers
      )
      this.mapErrorCode(res)
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const addDeliveryAddressSpec = {
  summary: 'Add a delivery address to a user account',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: 'Delivery details',
      schema: {
        type: 'object',
        properties: {
          addressDetailsId: {
            type: 'integer',
            example: 12345,
          },
          address: {
            type: 'object',
            properties: {
              state: {
                type: 'string',
                example: 'Greater London',
              },
              address1: {
                type: 'string',
                example: '1 Oxford Street',
              },
              address2: {
                type: 'string',
                example: 'Westminster',
              },
              postcode: {
                type: 'string',
                example: 'W1 1A1',
              },
              city: {
                type: 'string',
                example: 'London',
              },
              country: {
                type: 'string',
                example: 'United Kingdom',
              },
            },
          },
          nameAndPhone: {
            type: 'object',
            properties: {
              lastName: {
                type: 'string',
                example: 'Barker',
              },
              firstName: {
                type: 'string',
                example: 'Bob',
              },
              title: {
                type: 'string',
                example: 'Mr',
              },
              telephone: {
                type: 'string',
                example: '020111222',
              },
            },
          },
          responseType: {
            type: 'string',
            required: false,
            example: 'orderSummary',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'All Saved Addresses',
      schema: {
        type: 'object',
        properties: {
          savedAddresses: {
            $ref: '#/definitions/savedAddresses',
          },
          deliveryDetails: {
            $ref: '#/definitions/userDetails',
          },
          billingDetails: {
            $ref: '#/definitions/userDetails',
          },
          creditCard: {
            $ref: '#/definitions/creditCard',
          },
        },
      },
    },
  },
}
