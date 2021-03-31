import Mapper from '../../Mapper'

export default class DeleteDeliveryAddress extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/AddressBookDelete'
  }

  async mapRequestParameters() {
    this.method = 'post'
    const orderId = await this.getOrderId(this.headers.cookie)

    const { catalogId, langId, siteId: storeId } = this.storeConfig

    this.payload = {
      catalogId,
      langId,
      storeId,
      orderId,
      addressId: this.payload.addressId,
    }
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
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const deleteDeliveryAddressSpec = {
  summary:
    'Remove a saved address from a user account. This response is currently not transformed from WCS.',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: 'true',
      schema: {
        type: 'object',
        properties: {
          addressId: {
            type: 'string',
            example: '550505',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'WCS response object. Irrelevant properties omitted.',
      schema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            example: 'update',
          },
          success: {
            type: 'string',
            example: 'true',
          },
          message: {
            type: 'string',
            example: 'Address removed',
          },
          DeliveryOptionsDetails: {
            type: 'object',
            properties: {
              orderId: {
                type: 'number',
                example: 700335010,
              },
              deliveryoptionsform: {
                type: 'object',
                properties: {
                  selectedAddressID: {
                    type: 'string',
                    example: '828936',
                  },
                  deliveryDetails: {
                    type: 'object',
                    properties: {
                      addressDetailsId: {
                        type: 'string',
                        example: '828936',
                      },
                      nameAndPhone: {
                        type: 'object',
                        properties: {
                          title: {
                            type: 'string',
                            example: 'Mr',
                          },
                          firstName: {
                            type: 'string',
                            example: 'GGGG',
                          },
                          lastName: { type: 'string', example: 'PPPPPP' },
                          telephone: { type: 'string', example: '07776260690' },
                        },
                      },
                      address: {
                        type: 'object',
                        properties: {
                          address1: {
                            type: 'string',
                            example: '123 Sesame STreet',
                          },
                          city: {
                            type: 'string',
                            example: 'London',
                          },
                          postcode: { type: 'string', example: 'NW3 1HS' },
                          country: {
                            type: 'string',
                            example: 'United Kingdom',
                          },
                        },
                      },
                    },
                  },
                  estimatedDeliveryDate: {
                    type: 'string',
                    example: 'Friday 1 December 2017',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
