import Mapper from '../../Mapper'

export default class Navigation extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = `/navigation-${this.storeConfig.siteId}.json`
  }
  mapResponseBody(body) {
    return (body && body.navigationEntries) || {}
  }
}

export const navigationSpec = {
  summary: 'Get a list of categories to populate the navigation menu',
  parameters: [],
  responses: {
    200: {
      description: 'Main site navigation array',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            navigationEntryType: {
              type: 'string',
              example: 'NAV_ENTRY_TYPE_CATEGORY',
            },
            index: {
              type: 'number',
              example: 1,
            },
            label: {
              type: 'string',
              example: 'Shop By Category',
            },
            categoryId: {
              type: 'number',
              example: 3370518,
            },
            categoryFilter: {
              type: 'string',
              example: '3370518',
            },
            seoUrl: {
              type: 'string',
              example: '/en/tsuk/category/shop-by-category-5634548',
            },
            navigationEntries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  navigationEntryType: {
                    type: 'string',
                    example: 'NAV_ENTRY_TYPE_CATEGORY',
                  },
                  index: {
                    type: 'number',
                    example: 1,
                  },
                  label: {
                    type: 'string',
                    example: 'New In Fashion',
                  },
                  categoryId: {
                    type: 'number',
                    example: 3370518,
                  },
                  categoryFilter: {
                    type: 'string',
                    example: '3370518',
                  },
                  seoUrl: {
                    type: 'string',
                    example: '/en/tsuk/category/shop-by-category-5634548',
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
