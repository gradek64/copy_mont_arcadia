import Mapper from '../../Mapper'
import transform from '../../transforms/product'
import { wcsPaginate } from '../../../../lib/products-helper'

export default class GetProductsFromFilter extends Mapper {
  constructor(...args) {
    super(...args)
    this.dimSelected = wcsPaginate(decodeURIComponent(this.query.seoUrl))
  }

  mapEndpoint() {
    this.destinationEndpoint = `/webapp/wcs/stores/servlet/CatalogNavigationAjaxSearchResultCmd`
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      catalogId,
      langId,
      storeId,
      dimSelected: this.dimSelected,
    }
  }

  mapResponseBody(body) {
    return transform(
      body,
      this.storeConfig.brandName,
      this.storeConfig.storeCode,
      this.destinationHostname
    )
  }
}

export const getProductsFromFilterSpec = {
  summary: 'Get products based on a filter query',
  parameters: [
    {
      type: 'string',
      name: 'seoUrl',
      in: 'query',
      required: true,
      description: 'Seo url to apply filter',
      example:
        '/en/tsuk/category/clothing-427/dresses-442/mini/N-85cZr7lZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=208523',
    },
  ],
  responses: {
    200: {
      description: 'Listing of products matching the search query',
      schema: {
        type: 'object',
        properties: {
          breadcrumbs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: {
                  type: 'string',
                  example: 'Home',
                },
              },
            },
          },
          canonicalUrl: {
            type: 'string',
            example: 'http://ts.pplive.arcadiagroup.ltd.uk',
          },
          categoryDescription: {
            type: 'string',
            example: '',
          },
          categoryRefinement: {
            type: 'object',
            properties: {
              refinementOptions: {
                type: 'array',
                items: {
                  type: 'string',
                  example: '',
                },
              },
            },
          },
          categoryTitle: {
            type: 'string',
            example: 'gladiator',
          },
          cmsPage: {
            type: 'object',
            properties: {},
          },
          jessionid: {
            type: 'string',
            example: '00006QaC9CFgxWB0y-Pl37TS479',
          },
          plpContentSlot: {
            type: 'object',
            properties: {
              records: {
                type: 'array',
                items: {
                  type: 'string',
                  example: '',
                },
              },
            },
          },
          products: {
            type: 'array',
            items: {
              $ref: '#/definitions/plpProducts',
            },
          },
          recordSpotlight: {
            type: 'object',
            properties: {},
          },
          refinements: {
            type: 'array',
            items: {
              $ref: '#/definitions/plpRefinements',
            },
          },
          searchTerm: {
            type: 'string',
            example: 'gladiator',
          },
          sortOptions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: {
                  type: 'string',
                  example: 'Best Match',
                },
                value: {
                  type: 'string',
                  example: 'Relevance',
                },
              },
            },
          },
          tacticalEspot: {
            type: 'object',
            properties: {
              isJsonFormat: {
                type: 'boolean',
                example: true,
              },
              espotContents: {
                type: 'object',
                properties: {
                  pageId: {
                    type: 'string',
                    example: '116870',
                  },
                  pageName: {
                    type: 'string',
                    example: 'Mobile PLP POS1 eSpot',
                  },
                  baseline: {
                    type: 'string',
                    example: '29',
                  },
                  pageLastPublished: {
                    type: 'string',
                    example: '2017-05-25 09:48:22.18484',
                  },
                  pagePublishedBy: {
                    type: 'string',
                    example: 'Jake Stewart',
                  },
                  contentPath: {
                    type: 'string',
                    example:
                      '/cms/pages/json/json-0000116870/json-0000116870.json',
                  },
                  seoUrl: {
                    type: 'string',
                    example: '',
                  },
                  templateName: {
                    type: 'string',
                    example: 'Mobile Feature Page Data (REF 0000012221)',
                  },
                  templatePublishDate: {
                    type: 'string',
                    example: '2016-05-12 10:31:10.363931',
                  },
                  site: {
                    type: 'string',
                    example: 'TSUK',
                  },
                  type: {
                    type: 'string',
                    example: 'Page',
                  },
                  version: {
                    type: 'string',
                    example: '0',
                  },
                  pageData: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          example: 'imagelist',
                        },
                        data: {
                          type: 'object',
                          properties: {
                            options: {
                              type: 'object',
                            },
                            columns: {
                              type: 'number',
                              example: 1,
                            },
                            assets: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  target: {
                                    type: 'string',
                                    example: '',
                                  },
                                  alt: {
                                    type: 'string',
                                    example: 'Shipping Upgrade',
                                  },
                                  link: {
                                    type: 'string',
                                    example:
                                      '/en/tsuk/category/uk-delivery-4043283/home?TS=1421171569402&amp;cat2=2141530&amp;intcmpid=mobile_PLP_Delivery',
                                  },
                                  source: {
                                    type: 'string',
                                    example:
                                      'http://ts.pplive.arcadiagroup.ltd.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/json/json-0000116870/images/Monty-PLP-UK.svg',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  totalProducts: {
                    type: 'number',
                    example: 40,
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
