import Mapper from '../Mapper'
import transform from '../transforms/siteOptions'

export default class SiteOptions extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/SiteOptions'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    this.query = { langId, catalogId, storeId }
  }

  mapResponseBody(body) {
    return transform(body)
  }
}

export const siteOptionsSpec = {
  summary: 'Get Site Options (e.g. delivery countries, person titles)',
  responses: {
    200: {
      description: 'The site options',
      schema: {
        type: 'object',
        properties: {
          titles: {
            type: 'array',
            items: {
              type: 'string',
              example: 'Mr',
            },
          },
          billingCountries: {
            type: 'array',
            items: {
              type: 'string',
              example: 'United Kingdom',
            },
          },
          currencyCode: {
            type: 'string',
            example: 'GBP',
          },
          creditCardOptions: {
            type: 'array',
            item: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  example: 'VISA',
                },
                label: {
                  type: 'string',
                  example: 'Visa',
                },
                defaultPayment: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
          expiryMonths: {
            type: 'array',
            items: {
              type: 'string',
              example: '02',
            },
          },
          expiryYears: {
            type: 'array',
            items: {
              type: 'string',
              example: '2017',
            },
          },
          USStates: {
            type: 'array',
            items: {
              type: 'string',
              example: 'AL',
            },
          },
        },
      },
    },
  },
}
