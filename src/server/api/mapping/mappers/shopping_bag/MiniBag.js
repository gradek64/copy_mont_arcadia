import Mapper from '../../Mapper'

export default class MiniBag extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/Bag'
    this.method = 'get'
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      langId,
      storeId,
      catalogId,
    }
    this.payload = {}
  }

  mapResponseBody(body) {
    return {
      ...body,
      espots: {
        espotMiniBagBottom: body.espot,
      },
      espot: undefined,
    }
  }
}

export const miniBagSpec = {
  summary: 'Get the mini bag of the user',
  parameters: [],
  responses: {
    200: {
      description:
        'MiniBag response. This is currently not transformed from WCS',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'View Minibag details.',
          },
          items: {
            type: 'integer',
            example: 1,
          },
          total: {
            type: 'number',
            example: 34.0,
          },
          orderId: {
            type: 'number',
            example: 700333025,
          },
          productDetails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                orderItemId: {
                  type: 'number',
                  example: 7715608,
                },
                productId: {
                  type: 'number',
                  example: 21919934,
                },
                catentryId: {
                  type: 'string',
                  example: '21919940',
                },
                title: {
                  type: 'string',
                  example: '**Suedette Tuxedo Dress by Love',
                },
                imageUrl: {
                  type: 'string',
                  example:
                    'http://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62Z39IGRY_thumb.jpg',
                },
                size: {
                  type: 'string',
                  example: 'XS',
                },
                quantity: {
                  type: 'integer',
                  example: 1,
                },
                avlQuantity: {
                  type: 'integer',
                  example: 4,
                },
                price: {
                  type: 'object',
                  properties: {
                    was1Price: {
                      type: 'number',
                      example: 36.0,
                    },
                    was2Price: {
                      type: 'number',
                      example: 40.0,
                    },
                    nowPrice: {
                      type: 'number',
                      example: 20.0,
                    },
                  },
                },
              },
            },
          },
          espots: {
            type: 'object',
            properties: {
              espotMiniBagBottom: {
                type: 'string',
                example:
                  '%3C%21--+Start-+JSP+File+Name%3A+eMarketingSpotDisplay.jsp+--%3E%0A%09%09%09%09%09%09%3Cdiv+class%3D%22espot_advertisement+activity_1%22%3E%0A%09%09%09%09%09%09%09%3CB%3E+Buy+products+amounting+greater+than+100+and+get+free+shipping+%3C%2FB%3E%0A%09%09%09%09%09%09%3C%2Fdiv%3E%0A%09%09%09%09%09%09%3C%21--+End+-+JSP+File+Name%3A+eMarketingSpotDisplay.jsp+--%3E',
              },
            },
          },
        },
      },
    },
  },
}
