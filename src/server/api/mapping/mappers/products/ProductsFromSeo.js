import Mapper from '../../Mapper'
import transform from '../../transforms/product'
import { wcsPaginate } from '../../../../lib/products-helper'

export default class ProductsFromSeo extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = wcsPaginate(this.query.seoUrl)
    this.timeout = 10000
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

export const productsFromSeoSpec = {
  summary: 'Get list of products from an SEO url',
  parameters: [
    {
      name: 'seoUrl',
      in: 'query',
      description: 'SEO identifier for the category of products',
      required: true,
      example: '/en/tsuk/category/clothing-427/dresses-442',
      type: 'string',
    },
  ],
  responses: {
    200: {
      description: 'Product details',
      schema: {
        type: 'object',
        properties: {
          contentSlotContentHTML: {
            type: 'string',
            example:
              '%3C%21--+CMS+Page+Version%3A+static-0000104259+baseline%3A+3+revision%3A+0+published%3A+2015-11-25+14%3A44%3A30.98948%3Acogz+cogz%0A+++++++++CMS+Temp+Version%3A+template-0000011825+baseline%3A+1+revision%3A+0+description%3A+Home+Page+Module+-+Basic+%28REF+0000011783%29+published%3A+2015-06-25+10%3A42%3A08.412652+--%3E%0A%0A%0A++%0A%3Clink+rel%3D%22stylesheet%22+type%3D%22text%2Fcss%22+href%3D%22http%3A%2F%2Fts.pplive.arcadiagroup.ltd.uk%2Fwcsstore%2FConsumerDirectStorefrontAssetStore%2Fimages%2Fcolors%2Fcolor7%2Fcms%2Ftemplates%2Fstatic%2Ftemplate-0000011825%2Fcss%2Ftheme1.css%22+%2F%3E%3Cstyle+type%3D%22text%2Fcss%22%3E%0A%2F*%3C%21%5BCDATA%5B*%2F%0A%2F*%5D%5D%3E*%2F%0A%3C%2Fstyle%3E%0A%0A++++%0A++%0A%0A++%0A++++%3Cdiv+id%3D%22static-0000104259%22+class%3D%27theme1+masonry-item+module-basic%27%3E%0A++++++%3Cdiv+class%3D%22masonry-item-inner%22%3E%0A++++++++%3Cimg+src%3D%22http%3A%2F%2Fts.pplive.arcadiagroup.ltd.uk%2Fwcsstore%2FConsumerDirectStorefrontAssetStore%2Fimages%2Fcolors%2Fcolor7%2Fcms%2Fpages%2Fstatic%2Fstatic-0000104259%2Fimages%2F35B66IBLK_2_thumb.jpg%22+alt%3D%22image%22+width%3D%22170%22+height%3D%22255%22+%2F%3E%0A++++++%3C%2Fdiv%3E%0A++++%3C%2Fdiv%3E%3C%21--Using+Master+Template%3A+%2Fstatic%2Ftemplate-0000011783+--%3E%0A++%0A%0A',
          },
          productId: {
            type: 'number',
            example: 20298281,
          },
          grouping: {
            type: 'string',
            example: 'TS32L02HBLK',
          },
          lineNumber: {
            type: 'string',
            example: '32L02HBLK',
          },
          colour: {
            type: 'string',
            example: 'BLACK',
          },
          name: {
            type: 'string',
            example: 'LILAH Pony Platforms',
          },
          description: {
            type: 'string',
            example:
              '&#39;70s platforms keep it fresh with this pony and croc-effect pair. An ultra high heel with an adjustable ankle strap fastening. Heel height - 5 inches. 80% Polyurethane, 20% Leather. Specialist leather clean only.  ',
          },
          unitPrice: {
            type: 'string',
            example: '43.74',
          },
          stockEmail: {
            type: 'boolean',
            example: false,
          },
          storeDelivery: {
            type: 'boolean',
            example: true,
          },
          stockThreshold: {
            type: 'number',
            example: 0,
          },
          wcsColourKey: {
            type: 'string',
            example: '96454425',
          },
          wcsColourADValueId: {
            type: 'string',
            example: 'BLACK',
          },
          wcsSizeKey: {
            type: 'string',
            example: '96454426',
          },
          assets: {
            type: 'array',
            items: {
              $ref: '#/definitions/productAssets',
            },
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/definitions/pdpProductSizesAndQuantities',
            },
          },
          bundleProducts: {
            type: 'array',
            items: {},
          },
          attributes: {
            type: 'object',
            properties: {
              COLOUR_CODE: {
                type: 'string',
                example: '000080',
              },
              hasVideo: {
                type: 'string',
                example: 'N',
              },
              ProductDefaultCopy: {
                type: 'string',
                example: '',
              },
              b_has360: {
                type: 'string',
                example: 'N',
              },
              SearchKeywords: {
                type: 'string',
                example: '',
              },
              has360: {
                type: 'string',
                example: 'N',
              },
              countryExclusion: {
                type: 'string',
                example: '',
              },
              STYLE_CODE: {
                type: 'string',
                example: 'NO_SWATCH_3863124',
              },
              ECMC_PROD_COLOUR_1: {
                type: 'string',
                example: 'BLACK',
              },
              StyleCode: {
                type: 'string',
                example: '0',
              },
              b_hasImage: {
                type: 'string',
                example: 'N',
              },
              IFSeason: {
                type: 'string',
                example: 'AW15',
              },
              NotifyMe: {
                type: 'string',
                example: 'N',
              },
              ecmcCreatedTimestamp: {
                type: 'string',
                example: '2015-06-17-13.21.33.000867',
              },
              b_thumbnailImageSuffixes: {
                type: 'string',
                example: '',
              },
              shopTheOutfitBundleCode: {
                type: 'string',
                example: '',
              },
              ECMC_PROD_SIZE_GUIDE_1: {
                type: 'string',
                example: 'Shoes',
              },
              thumbnailImageSuffixes: {
                type: 'string',
                example: '_|_2|_3|_4',
              },
              EmailBackInStock: {
                type: 'string',
                example: 'N',
              },
              ecmcUpdatedTimestamp: {
                type: 'string',
                example: '2015-10-29-11.58.44.000100',
              },
              SizeFit: {
                type: 'string',
                example: '',
              },
              STORE_DELIVERY: {
                type: 'string',
                example: 'true',
              },
              Department: {
                type: 'string',
                example: '32',
              },
              ECMC_PROD_PRODUCT_TYPE_1: {
                type: 'string',
                example: 'Shoes',
              },
              CE3ThumbnailSuffixes: {
                type: 'string',
                example: '',
              },
              CE3BThumbnailSuffixes: {
                type: 'string',
                example: '',
              },
              ThresholdMessage: {
                type: 'string',
                example: '',
              },
              b_hasVideo: {
                type: 'string',
                example: 'N',
              },
            },
          },
        },
      },
      colourSwatches: {
        type: 'array',
        items: {},
      },
      tpmLinks: {
        type: 'array',
        items: {},
      },
      bundleSlots: {
        type: 'array',
        items: {},
      },
      sourceUrl: {
        type: 'string',
        example:
          'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/lilah-pony-platforms-4893997',
      },
      ageVerificationRequired: {
        type: 'boolean',
        example: false,
      },
      isBundleOrOutfit: {
        type: 'boolean',
        example: false,
      },
      productDataQuantity: {
        type: 'object',
        properties: {
          colourAttributes: {
            type: 'object',
            properties: {
              attrName: {
                type: 'string',
                example: '96454425',
              },
              attrValue: {
                type: 'string',
                example: 'BLACK',
              },
            },
          },
          quantities: {
            type: 'array',
            items: {
              type: 'number',
              example: 4,
            },
          },
          inventoryPositions: {
            type: 'array',
            items: {
              $ref: '#/definitions/inventoryPositions',
            },
          },
          SKUs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                skuid: {
                  type: 'string',
                  example: '20298287',
                },
                value: {
                  type: 'string',
                  example: '36',
                },
                availableinventory: {
                  type: 'string',
                  example: '4',
                },
                partnumber: {
                  type: 'string',
                  example: '602015000851659',
                },
                attrName: {
                  type: 'string',
                  example: '9645442',
                },
              },
            },
          },
        },
      },
      CEProductEspotCol1Pos1: {
        type: 'string',
        example: 'mobilePDPESpotPos2',
      },
      additionalAssets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            assetType: {
              type: 'string',
              enum: ['IMAGE_ZOOM', 'IMAGE_2COL', 'IMAGE_3COL', 'IMAGE_4COL'],
              example: 'IMAGE_ZOOM',
            },
            index: {
              type: 'number',
              example: 1,
            },
            url: {
              type: 'string',
              example: 'TS32L02HBLK_Zoom__',
            },
          },
        },
      },
      wasPrice: {
        type: 'string',
        example: '60.00',
      },
      wasWasPrice: {
        type: 'string',
        example: '48.60',
      },
      jsessionid: {
        type: 'string',
        example: '0000IIzdjn6oktpUS_qvTjQTjg_',
      },
    },
  },
}
