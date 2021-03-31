import Mapper from '../../Mapper'
import Boom from 'boom'
import {
  updateAccountQueryConstants,
  addressFields,
} from '../../constants/updatePaymentDetails'
import { path } from 'ramda'
import logonTransform from '../../transforms/logon'
import { authenticatedCookies } from './cookies'
import {
  mapAddress,
  mapIsoCode,
  mapPaymentInfo,
  mapAccountValues,
  mapAddressState,
} from './utils'

export default class UpdateAccount extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/QASAddress'
  }

  async getAccountInfo() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = { catalogId, langId, storeId }

    const result = await this.sendRequestToApi(
      this.destinationHostname,
      '/webapp/wcs/stores/servlet/ProfileFormView',
      this.query,
      {},
      'get',
      this.headers
    )
    this.accountInfo = result && result.body
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { quickCheckoutForm = {} } = this.accountInfo
    const isoCode = mapIsoCode(
      path(['billingDetails', 'address', 'country'], this.payload),
      path(['countryIsoCodes'], quickCheckoutForm)
    )

    this.payload = {
      catalogId,
      langId,
      storeId,
      billingIsoCode: isoCode,
      shippingIsoCode: isoCode,
      billing_nickName: `Default_Billing_${storeId}`,
      shipping_nickName: `Default_Shipping_${storeId}`,
      ...updateAccountQueryConstants,
      ...mapAccountValues(quickCheckoutForm),
      ...mapAddress('delivery', 'shipping', addressFields, this.payload),
      ...mapAddress('billing', 'billing', addressFields, this.payload),
      ...mapAddressState(this.payload),
      ...mapPaymentInfo(path(['creditCard'], this.payload)),
    }
  }

  mapResponseBody(body) {
    if (body.success === false) {
      throw Boom.badData(body.errorMessage)
    }
    return logonTransform(body, false)
  }

  async execute() {
    await this.getAccountInfo()
    this.mapRequestParameters()
    this.mapEndpoint()
    return this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      this.query,
      this.payload,
      'post',
      this.headers
    )
      .then((res) => this.mapResponse(res))
      .catch((apiResponseError) => {
        return this.mapResponseError(apiResponseError)
      })
  }

  mapResponse(res) {
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      setCookies: authenticatedCookies(),
    }
  }
}

export const updatePaymentDetailsSpec = {
  summary:
    'Update both the billing and delivery details of a registered user (Currently sets both to the same address)',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: 'Address and payment details',
      schema: {
        type: 'object',
        properties: {
          billingDetails: {
            type: 'object',
            properties: {
              address: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                    example: '123 Foobar House',
                  },
                  address2: {
                    type: 'string',
                    example: 'Batbaz street',
                  },
                  city: {
                    type: 'string',
                    example: 'Qux',
                  },
                  country: {
                    type: 'string',
                    example: 'United Kingdom',
                  },
                  postcode: {
                    type: 'string',
                    example: 'CT1 3PW',
                  },
                  state: {
                    type: 'string',
                    example: '',
                  },
                },
              },
              nameAndPhone: {
                type: 'object',
                properties: {
                  firstName: {
                    type: 'string',
                    example: 'Bob',
                  },
                  lastName: {
                    type: 'string',
                    example: 'Barker',
                  },
                  telephone: {
                    type: 'string',
                    example: '0123456790',
                  },
                  title: {
                    type: 'string',
                    example: 'Mr',
                  },
                },
              },
            },
          },
          deliveryDetails: {
            type: 'object',
            properties: {
              address: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                    example: '123 Foobar House',
                  },
                  address2: {
                    type: 'string',
                    example: 'Batbaz street',
                  },
                  city: {
                    type: 'string',
                    example: 'Qux',
                  },
                  country: {
                    type: 'string',
                    example: 'United Kingdom',
                  },
                  postcode: {
                    type: 'string',
                    example: 'CT1 3PW',
                  },
                  state: {
                    type: 'string',
                    example: '',
                  },
                },
              },
              nameAndPhone: {
                type: 'object',
                properties: {
                  firstName: {
                    type: 'string',
                    example: 'Bob',
                  },
                  lastName: {
                    type: 'string',
                    example: 'Barker',
                  },
                  telephone: {
                    type: 'string',
                    example: '0123456790',
                  },
                  title: {
                    type: 'string',
                    example: 'Mr',
                  },
                },
              },
            },
          },
          creditCard: {
            type: 'object',
            properties: {
              cardNumber: {
                type: 'string',
                example: '1234123412341234',
              },
              cardMonth: {
                type: 'string',
                example: '2',
              },
              expiryYear: {
                type: 'string',
                example: '2020',
              },
              type: {
                type: 'string',
                example: 'VISA',
              },
            },
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Account details object',
      schema: {
        $ref: '#/definitions/account',
      },
    },
    422: {
      description: 'Authentication failure',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 422,
          },
          error: {
            type: 'string',
            example: 'Unprocessable Entity',
          },
          message: {
            type: 'string',
            example: 'Please enter a valid state.',
          },
        },
      },
    },
  },
}
