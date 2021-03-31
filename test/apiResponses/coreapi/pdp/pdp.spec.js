/* eslint-disable no-unused-expressions */
require('@babel/register')

import chai from 'chai'

import { getProducts } from './../utilis/selectProducts'
import {
  booleanTypeAny,
  stringType,
  stringTypeEmpty,
  numberType,
  booleanType,
  objectType,
  arrayType,
  arrayOrBooleanType,
  stringTypePattern,
  stringTypeNumber,
  stringOrNull,
  stringTypeCanBeEmpty,
  nullType,
  wcsEnv,
} from '../utilis'
import {
  pdpProductOnSale,
  pdpColourSwatches,
  pdpFixedBundleProduct,
  pdpFlexibleBundleProduct,
  pdpProductQuickViewQuery,
} from './pdp-data'
import {
  assetsSchema,
  itemsSchema,
  dataQuantitySchema,
  shopLookProductSchema,
  additionalAssetsSchema,
  colourAttributesSchema,
  quantitySchema,
  inventoryPositionSchema,
  inventorySchema,
  expressdateSchema,
  skuSchema,
  espotsSchema,
  CEProductEspotSchemaForEspotContents,
  CEProductEspotSchemaWithOnlyContentText,
  CEProductEspotContentsSchemaWithCmsMobileContent,
  cmsMobileContentSchema,
} from './sharedSchemas'
import { getPdp, getPdpQuickView } from '../utilis/getPdp'

chai.use(require('chai-json-schema'))

const { assert } = chai

describe('It should return the PDP Json Schema', () => {
  describe('PDP Basic assertions: Dynamic products', () => {
    let response
    beforeAll(async () => {
      const { productsSimpleId } = await getProducts()
      response = await getPdp(productsSimpleId.productId)
    }, 60000)

    it(
      'PDP Json Schema',
      () => {
        const pdpSchema = {
          title: 'PDP Schema',
          type: 'object',
          required: [
            'breadcrumbs',
            'productId',
            'grouping',
            'lineNumber',
            'colour',
            'name',
            'description',
            'unitPrice',
            'stockEmail',
            'storeDelivery',
            'stockThreshold',
            'wcsColourKey',
            'wcsColourADValueId',
            'wcsSizeKey',
            'assets',
            'items',
            'bundleProducts',
            'attributes',
            'colourSwatches',
            'tpmLinks',
            'bundleSlots',
            'sourceUrl',
            'ageVerificationRequired',
            'isBundleOrOutfit',
            'productDataQuantity',
            'version',
            'espots',
            'shopTheLookProducts',
            'additionalAssets',
            'amplienceAssets',
            'pageTitle',
            'iscmCategory',
            'notifyMe',
            'storeDelivery',
            'isDDPProduct',
            'canonicalUrl',
          ],
          optional: [
            'bundleDisplayURL',
            'contentSlotContentHTML',
            'deliveryMessage',
            'promotionDisplayURL',
            'promoTitle',
            'canonicalUrlSet',
            'bnplPaymentOptions',
          ],
          properties: {
            contentSlotContentHTML: objectType,
            breadcrumbs: arrayType(1),
            productId: numberType,
            grouping: stringType,
            lineNumber: stringType,
            colour: stringType,
            name: stringType,
            description: stringType,
            unitPrice: stringType,
            stockEmail: booleanType(false),
            storeDetails: booleanType(true),
            stockThreshold: numberType,
            wcsColourKey: stringType,
            wcsColourADValueId: stringType,
            wcsSizeKey: stringType,
            assets: arrayType(1),
            items: arrayType(1),
            bundleProducts: arrayType(),
            attributes: objectType,
            colourSwatches: arrayType(),
            tpmLinks: arrayType(),
            bundleSlots: arrayType(),
            sourceUrl: stringType,
            ageVerificationRequired: booleanType(false),
            isBundleOrOutfit: booleanType(false),
            productDataQuantity: objectType,
            version: stringType,
            espots: objectType,
            deliveryMessage: stringTypeEmpty,
            shopTheLookProducts: arrayOrBooleanType(1),
            bundleDisplayURL: stringTypeCanBeEmpty,
            additionalAssets: arrayType(1),
            amplienceAssets: objectType,
            pageTitle: stringType,
            iscmCategory: stringType,
            notifyMe: booleanTypeAny,
            storeDelivery: booleanTypeAny,
            isDDPProduct: booleanType(false),
            canonicalUrl: stringTypeCanBeEmpty,
            promotionDisplayURL: stringTypeCanBeEmpty,
            promoTitle: stringTypeCanBeEmpty,
            canonicalUrlSet: booleanTypeAny,
            bnplPaymentOptions: objectType,
          },
        }
        expect(response).toMatchSchema(pdpSchema)
      },
      60000
    )
  })

  describe('PDP Simple', () => {
    let response
    beforeAll(async () => {
      const { productsSimpleId } = await getProducts()
      response = await getPdp(productsSimpleId.productId)
    }, 60000)

    it(
      'PDP contentSlotContentHTML Schema',
      () => {
        const content = response.contentSlotContentHTML
        const contentSlotContentHTMLSchema = {
          title: 'PDP contentSlotContentHTML Schema',
          type: 'object',
          required: ['cmsMobileContent', 'encodedcmsMobileContent'],
          properties: {
            cmsMobileContent: objectType,
            encodedcmsMobileContent: stringType,
          },
        }
        content &&
          expect(response.contentSlotContentHTML).toMatchSchema(
            contentSlotContentHTMLSchema
          )
      },
      30000
    )

    it(
      'PDP contentSlotContentHTML => cmsMobileContent Schema',
      () => {
        const content =
          response.contentSlotContentHTML &&
          response.contentSlotContentHTML.cmsMobileContent
        const cmsMobileContentSchema = {
          title: 'PDP cmsMobileContent Schema',
          type: 'object',
          required: [
            'pageId',
            'pageName',
            'baseline',
            'revision',
            'lastPublished',
            'contentPath',
            'seoUrl',
            'hello',
            'mobileCMSUrl',
          ],
          properties: {
            pageId: numberType,
            pageName: stringType,
            baseline: stringType,
            revision: stringType,
            lastPublished: stringType,
            contentPath: stringType,
            seoUrl: stringTypeEmpty,
            hello: stringType,
            mobileCMSUrl: stringType,
          },
        }
        content && expect(content).toMatchSchema(cmsMobileContentSchema)
      },
      30000
    )

    it(
      'PDP Assets Schema',
      () => {
        response.assets.forEach((assets) => {
          expect(assets).toMatchSchema(assetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Items Schema',
      () => {
        response.items.forEach((items) => {
          expect(items).toMatchSchema(itemsSchema)
        })
      },
      30000
    )

    it(
      'PDP Attributes Schema',
      () => {
        const itemsSchema = {
          title: 'PDP Attributes Schema',
          type: 'object',
          required: [
            'b_has360',
            'b_hasImage',
            'b_hasVideo',
            'b_thumbnailImageSuffixes',
            'CE3BThumbnailSuffixes',
            'CE3ThumbnailSuffixes',
            'COLOUR_CODE',
            'countryExclusion',
            'Department',
            'ecmcUpdatedTimestamp',
            'EmailBackInStock',
            'has360',
            'hasVideo',
            'IFSeason',
            'NotifyMe',
            'ProductDefaultCopy',
            'RRP',
            'SearchKeywords',
            'shopTheOutfitBundleCode',
            'SizeFit',
            'STORE_DELIVERY',
            'STYLE_CODE',
            'StyleCode',
            'ThresholdMessage',
            'thumbnailImageSuffixes',
            'IOThumbnailSuffixes',
            'IOBThumbnailSuffixes',
            'REAL_COLOURS',
          ],
          optional: [
            'ECMC_PROD_PINTREST_1',
            'ECMC_PROD_CE3_PRODUCT_TYPE_1',
            'ECMC_PROD_COLOUR_1',
            'ECMC_PROD_PRODUCT_TYPE_1',
            'ECMC_PROD_SIZE_GUIDE_1',
            'ECMC_PROD_CE3_HEEL_HEIGHT_1',
            'ECMC_PROD_CE3_SHOE_STYLE_1',
            'ECMC_PROD_CE3_COLLECTION_1',
            'ECMC_PROD_CE3_BANNERS_1',
            'ECMC_PROD_CE3_BRANDS_1',
            'ECMC_PROD_CE3_FABRIC_1',
            'ECMC_PROD_CE3_TOP_STYLE_1',
            'ECMC_PROD_FIT_1',
            'ECMC_PROD_CE3_SLEEVE_TYPE_1',
            'ECMC_PROD_CE3_DRESS_LENGTH_1',
            'ECMC_PROD_CE3_DRESS_TYPE_1',
            'ECMC_PROD_CE3_DRESS_STYLE_1',
            'ecmcCreatedTimestamp',
          ],
          properties: {
            b_has360: stringType,
            b_hasImage: stringType,
            b_hasVideo: stringType,
            b_thumbnailImageSuffixes: stringTypeEmpty,
            CE3BThumbnailSuffixes: stringTypeEmpty,
            CE3ThumbnailSuffixes: stringType,
            COLOUR_CODE: stringTypeCanBeEmpty,
            countryExclusion: stringTypeEmpty,
            Department: stringType,
            ECMC_PROD_COLOUR_1: stringType,
            ECMC_PROD_PINTREST_1: stringType,
            ECMC_PROD_PRODUCT_TYPE_1: stringType,
            ECMC_PROD_SIZE_GUIDE_1: stringType,
            ecmcCreatedTimestamp: stringType,
            ecmcUpdatedTimestamp: stringType,
            EmailBackInStock: stringType,
            has360: stringType,
            hasVideo: stringType,
            IFSeason: stringType,
            NotifyMe: stringType,
            ProductDefaultCopy: stringTypeEmpty,
            RRP: stringType,
            SearchKeywords: stringTypeEmpty,
            shopTheOutfitBundleCode: stringTypeEmpty,
            SizeFit: stringTypeEmpty,
            STORE_DELIVERY: stringType,
            STYLE_CODE: stringType,
            StyleCode: stringType,
            ThresholdMessage: stringTypeEmpty,
            thumbnailImageSuffixes: stringType,
            IOThumbnailSuffixes: stringType,
            IOBThumbnailSuffixes: stringTypeCanBeEmpty,
            ECMC_PROD_CE3_COLLECTION_1: stringType,
            REAL_COLOURS: stringTypeCanBeEmpty,
            ECMC_PROD_CE3_PRODUCT_TYPE_1: stringType,
            ECMC_PROD_CE3_HEEL_HEIGHT_1: stringType,
            ECMC_PROD_CE3_BANNERS_1: stringType,
            ECMC_PROD_CE3_SHOE_STYLE_1: stringType,
            ECMC_PROD_CE3_BRANDS_1: stringType,
            ECMC_PROD_CE3_FABRIC_1: stringType,
            ECMC_PROD_CE3_TOP_STYLE_1: stringType,
            ECMC_PROD_FIT_1: stringType,
            ECMC_PROD_CE3_SLEEVE_TYPE_1: stringType,
            ECMC_PROD_CE3_DRESS_LENGTH_1: stringType,
            ECMC_PROD_CE3_DRESS_TYPE_1: stringType,
            ECMC_PROD_CE3_DRESS_STYLE_1: stringType,
          },
        }
        expect(response.attributes).toMatchSchema(itemsSchema)
      },
      30000
    )

    it(
      'PDP Product Data Quantity Schema',
      () => {
        expect(response.productDataQuantity).toMatchSchema(
          dataQuantitySchema(1, 10, 'object')
        )
      },
      30000
    )

    it(
      'PDP Product Data Quantity => Colour Attributes',
      () => {
        expect(response.productDataQuantity.colourAttributes).toMatchSchema(
          colourAttributesSchema
        )
      },
      30000
    )

    it(
      'PDP Product Data Quantity => quantities',
      () => {
        expect(response.productDataQuantity.quantities).toMatchSchema(
          quantitySchema(10)
        )
      },
      30000
    )

    it(
      'PDP Product Data Quantity => Inventory Positions',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            expect(inventoryPosition).toMatchSchema(inventoryPositionSchema)
          }
        )
      },
      30000
    )

    it(
      'PDP Product Data Quantity => Inventory Positions => Inventorys',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            if (inventoryPosition.inventorys !== undefined) {
              inventoryPosition.inventorys.forEach((inventory) => {
                expect(inventory).toMatchSchema(inventorySchema)
              })
            }
          }
        )
      },
      30000
    )

    it(
      'PDP Product Data Quantity => Inventory Positions => Inventorys => Expressdates',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            if (inventoryPosition.inventorys !== undefined) {
              inventoryPosition.inventorys.forEach((inventory) => {
                expect(inventory.expressdates).toMatchSchema(expressdateSchema)
              })
            }
          }
        )
      },
      30000
    )

    it(
      'PDP Product Data Quantity => SKUs',
      () => {
        response.productDataQuantity.SKUs.forEach((sku) => {
          expect(sku).toMatchSchema(skuSchema)
          assert.jsonSchema(sku, skuSchema)
        })
      },
      30000
    )

    it(
      'PDP Simple Product Shop The Look Products',
      () => {
        response.shopTheLookProducts &&
          response.shopTheLookProducts.forEach((shopLookProduct) => {
            expect(shopLookProduct).toMatchSchema(shopLookProductSchema)
          })
      },
      30000
    )

    it(
      'PDP Simple Product espots Schema',
      () => {
        expect(response.espots).toMatchSchema(espotsSchema('PDP Simple'))
      },
      30000
    )

    it(
      'PDP Simple Product espots => CEProductEspotCol1Pos1 Schema ',
      () => {
        if (response.espots.CEProductEspotCol1Pos1 !== undefined) {
          // eSpot might not exist
          if (typeof response.espots.CEProductEspotCol1Pos1 !== 'string') {
            // if it does, it could be a string
            if (
              response.espots.CEProductEspotCol1Pos1.EspotContents === undefined
            ) {
              // it may be one of two types
              expect(response.espots.CEProductEspotCol1Pos1).toMatchSchema(
                CEProductEspotSchemaWithOnlyContentText(
                  'CEProductEspotCol1Pos1'
                )
              )
            } else {
              expect(response.espots.CEProductEspotCol1Pos1).toMatchSchema(
                CEProductEspotSchemaForEspotContents('CEProductEspotCol1Pos1')
              )
            }
          }
        }
      },
      30000
    )

    it(
      'PDP Simple Product espots => CEProductEspotCol2Pos2 Schema',
      () => {
        if (response.espots.CEProductEspotCol1Pos2 !== undefined) {
          expect(response.espots.CEProductEspotCol2Pos2).toMatchSchema(
            CEProductEspotSchemaForEspotContents(
              'CEProductEspotCol2Pos2',
              'PDP Simple'
            )
          )
        }
      },
      30000
    )

    it(
      'PDP Simple Product espots => CEProductEspotCol2Pos2 => EspotContents Schema',
      () => {
        if (response.espots.CEProductEspotCol1Pos2 !== undefined) {
          expect(
            response.espots.CEProductEspotCol2Pos2.EspotContents
          ).toMatchSchema(
            CEProductEspotContentsSchemaWithCmsMobileContent(
              'CEProductEspotCol2Pos2',
              'PDP Simple'
            )
          )
        }
      },
      30000
    )

    it(
      'PDP Simple Product espots => CEProductEspotCol2Pos2 => EspotContents => cmsMobileContent Schema',
      () => {
        if (response.espots.CEProductEspotCol1Pos2 !== undefined) {
          expect(
            response.espots.CEProductEspotCol2Pos2.EspotContents
              .cmsMobileContent
          ).toMatchSchema(cmsMobileContentSchema())
        }
      },
      30000
    )

    it(
      'PDP Simple Product espots => CEProductEspotCol2Pos4 Schema  ',
      () => {
        if (response.espots.CEProductEspotCol2Pos4 !== undefined) {
          // eSpot might not exist
          if (typeof response.espots.CEProductEspotCol2Pos4 !== 'string') {
            // if it does, it could be a string
            if (
              response.espots.CEProductEspotCol2Pos4.EspotContents === undefined
            ) {
              // it may be one of two types
              expect(response.espots.CEProductEspotCol2Pos4).toMatchSchema(
                CEProductEspotSchemaWithOnlyContentText(
                  'CEProductEspotCol2Pos4'
                )
              )
            } else {
              expect(response.espots.CEProductEspotCol2Pos4).toMatchSchema(
                CEProductEspotSchemaForEspotContents('CEProductEspotCol2Pos4')
              )
            }
          }
        }
      },
      30000
    )

    it(
      'PDP Simple Product espots => CE3ContentEspot1 Schema',
      () => {
        expect(response.espots.CE3ContentEspot1).toMatchSchema(
          CEProductEspotSchemaForEspotContents('CE3ContentEspot1', 'PDP Simple')
        )
      },
      30000
    )

    it(
      'PDP Simple Product espots => CE3ContentEspot1 => EspotContents Schema',
      () => {
        expect(response.espots.CE3ContentEspot1.EspotContents).toMatchSchema(
          CEProductEspotContentsSchemaWithCmsMobileContent(
            'CE3ContentEspot1',
            'PDP Simple'
          )
        )
      },
      30000
    )

    it(
      'PDP Simple Product espots => CE3ContentEspot1 => EspotContents => cmsMobileContent Schema',
      () => {
        expect(
          response.espots.CE3ContentEspot1.EspotContents.cmsMobileContent
        ).toMatchSchema(cmsMobileContentSchema())
      },
      30000
    )
  })

  describe('PDP Product On Sale', () => {
    let response
    beforeAll(async () => {
      response = await getPdp(pdpProductOnSale)
    }, 60000)

    it('PDP Product On Sale Json Schema', () => {
      const pdpSchema = {
        title: 'PDP On Sale Schema',
        type: 'object',
        required: [
          'additionalAssets',
          'ageVerificationRequired',
          'assets',
          'attributes',
          'bundleDisplayURL',
          'bundleProducts',
          'bundleSlots',
          'espots',
          'colour',
          'colourSwatches',
          'description',
          'grouping',
          'isBundleOrOutfit',
          'items',
          'lineNumber',
          'name',
          'productDataQuantity',
          'productId',
          'shopTheLookProducts',
          'sourceUrl',
          'stockEmail',
          'stockThreshold',
          'storeDelivery',
          'tpmLinks',
          'totalMarkdownValue',
          'unitPrice',
          'version',
          'wasPrice',
          'wcsColourADValueId',
          'wcsColourKey',
          'wcsSizeKey',
          'pageTitle',
          'iscmCategory',
          'breadcrumbs',
          'notifyMe',
          'amplienceAssets',
          'isDDPProduct',
          'canonicalUrl',
        ],
        optional: [
          'contentSlotContentHTML',
          'deliveryMessage',
          'promotionDisplayURL',
          'promoTitle',
          'wasWasPrice',
          'canoicalUrlSet',
          'bnplPaymentOptions',
        ],
        properties: {
          additionalAssets: arrayType(1),
          ageVerificationRequired: booleanType(false),
          assets: arrayType(1),
          attributes: objectType,
          bundleDisplayURL: stringTypeEmpty,
          bundleProducts: arrayType(),
          bundleSlots: arrayType(),
          espots: objectType,
          colour: stringType,
          colourSwatches: arrayType(),
          contentSlotContentHTML: objectType,
          deliveryMessage: stringTypeEmpty,
          description: stringType,
          grouping: stringType,
          isBundleOrOutfit: booleanType(false),
          items: arrayType(1),
          lineNumber: stringType,
          name: stringType,
          productDataQuantity: objectType,
          productId: numberType,
          promotionDisplayURL: stringType,
          promoTitle: stringType,
          shopTheLookProducts: booleanType(false),
          sourceUrl: stringType,
          stockEmail: booleanType(false),
          stockThreshold: numberType,
          storeDelivery: booleanType(true),
          tpmLinks: arrayType(),
          totalMarkdownValue: stringType,
          unitPrice: stringType,
          version: stringType,
          wasPrice: stringType,
          wasWasPrice: stringType,
          wcsColourADValueId: stringType,
          wcsColourKey: stringType,
          wcsSizeKey: stringType,
          pageTitle: stringType,
          iscmCategory: stringType,
          notifyMe: booleanTypeAny,
          isDDPProduct: booleanType(false),
          breadcrumbs: arrayType(),
          amplienceAssets: objectType,
          canonicalUrl: stringTypeCanBeEmpty,
          canonicalUrlSet: booleanTypeAny,
          bnplPaymentOptions: objectType,
        },
      }
      expect(response).toMatchSchema(pdpSchema)
    })

    it(
      'PDP Product On Sale Assets Schema',
      () => {
        response.assets.forEach((assets) => {
          expect(assets).toMatchSchema(assetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Product On Sale Additional Assets Schema',
      () => {
        response.additionalAssets.forEach((additionalAssets) => {
          expect(additionalAssets).toMatchSchema(additionalAssetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Product On Sale Items Schema',
      () => {
        response.items.forEach((items) => {
          expect(items).toMatchSchema(itemsSchema)
        })
      },
      30000
    )

    it(
      'PDP Product On Sale Attributes Schema',
      () => {
        const itemsSchema = {
          title: 'PDP On Sale Attributes Schema',
          type: 'object',
          required: [
            'b_has360',
            'b_hasImage',
            'b_hasVideo',
            'b_thumbnailImageSuffixes',
            'CE3BThumbnailSuffixes',
            'CE3ThumbnailSuffixes',
            'COLOUR_CODE',
            'countryExclusion',
            'Department',
            'ECMC_PROD_CE3_PRODUCT_TYPE_1',
            'ECMC_PROD_COLOUR_1',
            'ECMC_PROD_PRODUCT_TYPE_1',
            'ECMC_PROD_SIZE_GUIDE_1',
            'ecmcCreatedTimestamp',
            'ecmcUpdatedTimestamp',
            'EmailBackInStock',
            'has360',
            'hasVideo',
            'IFSeason',
            'NotifyMe',
            'ProductDefaultCopy',
            'SearchKeywords',
            'shopTheOutfitBundleCode',
            'SizeFit',
            'STORE_DELIVERY',
            'STYLE_CODE',
            'StyleCode',
            'ThresholdMessage',
            'thumbnailImageSuffixes',
            'IOThumbnailSuffixes',
            'IOBThumbnailSuffixes',
            'ECMC_PROD_CE3_COLLECTION_1',
            'REAL_COLOURS',
            'ECMC_PROD_CE3_HEEL_HEIGHT_1',
            'ECMC_PROD_CE3_SHOE_STYLE_1',
            'RRP',
          ],
          properties: {
            b_has360: stringType,
            b_hasImage: stringType,
            b_hasVideo: stringType,
            b_thumbnailImageSuffixes: stringTypeCanBeEmpty,
            CE3BThumbnailSuffixes: stringTypeCanBeEmpty,
            CE3ThumbnailSuffixes: stringTypeCanBeEmpty,
            COLOUR_CODE: stringType,
            countryExclusion: stringTypeCanBeEmpty,
            Department: stringType,
            ECMC_PROD_CE3_PRODUCT_TYPE_1: stringType,
            ECMC_PROD_COLOUR_1: stringType,
            ECMC_PROD_PRODUCT_TYPE_1: stringType,
            ECMC_PROD_SIZE_GUIDE_1: stringType,
            ecmcCreatedTimestamp: stringType,
            ecmcUpdatedTimestamp: stringType,
            EmailBackInStock: stringType,
            has360: stringType,
            hasVideo: stringType,
            IFSeason: stringType,
            NotifyMe: stringType,
            ProductDefaultCopy: stringTypeCanBeEmpty,
            SearchKeywords: stringTypeCanBeEmpty,
            shopTheOutfitBundleCode: stringTypeCanBeEmpty,
            SizeFit: stringTypeCanBeEmpty,
            STORE_DELIVERY: stringType,
            STYLE_CODE: stringType,
            StyleCode: stringType,
            ThresholdMessage: stringTypeCanBeEmpty,
            thumbnailImageSuffixes: stringType,
            IOThumbnailSuffixes: stringType,
            IOBThumbnailSuffixes: stringTypeCanBeEmpty,
            ECMC_PROD_CE3_COLLECTION_1: stringType,
            REAL_COLOURS: stringType,
            ECMC_PROD_CE3_HEEL_HEIGHT_1: stringType,
            ECMC_PROD_CE3_SHOE_STYLE_1: stringType,
            RRP: stringTypeNumber,
          },
        }
        expect(response.attributes).toMatchSchema(itemsSchema)
      },
      30000
    )

    it(
      'PDP Product On Sale Product Data Quantity Schema',
      () => {
        expect(response.productDataQuantity).toMatchSchema(
          dataQuantitySchema(1, 10, 'object')
        )
      },
      30000
    )

    it(
      'PDP Product On Sale ProductData Quantity => Colour Attributes',
      () => {
        expect(response.productDataQuantity.colourAttributes).toMatchSchema(
          colourAttributesSchema
        )
      },
      30000
    )

    it(
      'PDP Product On Sale Product Data Quantity => quantities',
      () => {
        expect(response.productDataQuantity.quantities).toMatchSchema(
          quantitySchema(10)
        )
      },
      30000
    )

    it(
      'PDP Product On Sale Product Data Quantity => Inventory Positions',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            expect(inventoryPosition).toMatchSchema(inventoryPositionSchema)
          }
        )
      },
      30000
    )

    it(
      'PDP Product On Sale Product Data Quantity => Inventory Positions => Inventorys',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            inventoryPosition.inventorys &&
              inventoryPosition.inventorys.forEach((inventory) => {
                expect(inventory).toMatchSchema(inventorySchema)
              })
          }
        )
      },
      30000
    )

    it(
      'PDP Product On Sale Product Data Quantity => Inventory Positions => Inventorys => Expressdates',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            inventoryPosition.inventorys &&
              inventoryPosition.inventorys.forEach((inventory) => {
                expect(inventory.expressdates).toMatchSchema(expressdateSchema)
              })
          }
        )
      },
      30000
    )

    it(
      'PDP Product On sale Product Data Quantity => SKUs',
      () => {
        response.productDataQuantity.SKUs.forEach((sku) => {
          expect(sku).toMatchSchema(skuSchema)
        })
      },
      30000
    )

    it(
      'PDP Product On sale espots Schema',
      () => {
        expect(response.espots).toMatchSchema(
          espotsSchema('PDP Product On sale')
        )
      },
      30000
    )

    it(
      'PDP Product On sale espots => CEProductEspotCol1Pos1 Schema ',
      () => {
        if (response.espots.CEProductEspotCol1Pos1 !== undefined) {
          if (typeof response.espots.CEProductEspotCol1Pos1 !== 'string') {
            expect(response.espots.CEProductEspotCol1Pos1).toMatchSchema(
              CEProductEspotSchemaWithOnlyContentText('CEProductEspotCol1Pos1')
            )
          }
        }
      },
      30000
    )

    it(
      'PDP Product On sale espots => CEProductEspotCol2Pos2 Schema',
      () => {
        if (response.espots.CEProductEspotCol2Pos2 !== undefined) {
          expect(response.espots.CEProductEspotCol2Pos2).toMatchSchema(
            CEProductEspotSchemaForEspotContents(
              'CEProductEspotCol2Pos2',
              'PDP Product On sale'
            )
          )
        }
      },
      30000
    )

    it(
      'PDP Product On sale espots => CEProductEspotCol2Pos2 => EspotContents Schema',
      () => {
        if (response.espots.CEProductEspotCol2Pos2 !== undefined) {
          expect(
            response.espots.CEProductEspotCol2Pos2.EspotContents
          ).toMatchSchema(
            CEProductEspotContentsSchemaWithCmsMobileContent(
              'CEProductEspotCol2Pos2',
              'PDP Product On sale'
            )
          )
        }
      },
      30000
    )

    it(
      'PDP Product On sale espots => CEProductEspotCol2Pos2 => EspotContents => cmsMobileContent Schema',
      () => {
        if (response.espots.CEProductEspotCol2Pos2 !== undefined) {
          expect(
            response.espots.CEProductEspotCol2Pos2.EspotContents
              .cmsMobileContent
          ).toMatchSchema(cmsMobileContentSchema())
        }
      },
      30000
    )

    it(
      'PDP Product On sale espots => CEProductEspotCol2Pos4 Schema ',
      () => {
        if (response.espots.CEProductEspotCol2Pos4 !== undefined) {
          // eSpot might not exist
          if (typeof response.espots.CEProductEspotCol2Pos4 !== 'string') {
            // if it does, it could be a string
            if (
              response.espots.CEProductEspotCol2Pos4.EspotContents === undefined
            ) {
              // it may be one of two types
              expect(response.espots.CEProductEspotCol2Pos4).toMatchSchema(
                CEProductEspotSchemaWithOnlyContentText(
                  'CEProductEspotCol2Pos4'
                )
              )
            } else {
              expect(response.espots.CEProductEspotCol2Pos4).toMatchSchema(
                CEProductEspotSchemaForEspotContents('CEProductEspotCol2Pos4')
              )
            }
          }
        }
      },
      30000
    )

    it(
      'PDP Product On sale espots => CE3ContentEspot1 Schema',
      () => {
        expect(response.espots.CE3ContentEspot1).toMatchSchema(
          CEProductEspotSchemaForEspotContents(
            'CE3ContentEspot1',
            'PDP Product On sale'
          )
        )
      },
      30000
    )

    it(
      'PDP Product On sale espots => CE3ContentEspot1 => EspotContents Schema',
      () => {
        expect(response.espots.CE3ContentEspot1.EspotContents).toMatchSchema(
          CEProductEspotContentsSchemaWithCmsMobileContent(
            'CE3ContentEspot1',
            'PDP Product On sale'
          )
        )
      },
      30000
    )

    it(
      'PDP Product On sale espots => CE3ContentEspot1 => EspotContents => cmsMobileContent Schema',
      () => {
        expect(
          response.espots.CE3ContentEspot1.EspotContents.cmsMobileContent
        ).toMatchSchema(cmsMobileContentSchema())
      },
      30000
    )
  })

  describe('PDP Colour Swatches', () => {
    let response
    beforeAll(async () => {
      response = await getPdp(pdpColourSwatches)
    }, 60000)

    it('PDP Colour Swatches Json Schema', () => {
      const pdpSchema = {
        title: 'PDP Colour Swatches Schema',
        type: 'object',
        required: [
          'additionalAssets',
          'ageVerificationRequired',
          'assets',
          'attributes',
          'bundleDisplayURL',
          'bundleProducts',
          'bundleSlots',
          'espots',
          'colour',
          'colourSwatches',
          'description',
          'grouping',
          'isBundleOrOutfit',
          'items',
          'lineNumber',
          'name',
          'productDataQuantity',
          'productId',
          'shopTheLookProducts',
          'sourceUrl',
          'stockEmail',
          'stockThreshold',
          'storeDelivery',
          'tpmLinks',
          'totalMarkdownValue',
          'unitPrice',
          'version',
          'wasPrice',
          'wcsColourADValueId',
          'wcsColourKey',
          'wcsSizeKey',
          'pageTitle',
          'iscmCategory',
          'breadcrumbs',
          'notifyMe',
          'amplienceAssets',
          'isDDPProduct',
          'canonicalUrl',
        ],
        optional: [
          'contentSlotContentHTML',
          'promotionDisplayURL',
          'promoTitle',
          'wasWasPrice',
          'deliveryMessage',
          'canonicalUrlSet',
          'bnplPaymentOptions',
        ],
        properties: {
          additionalAssets: arrayType(1),
          ageVerificationRequired: booleanType(false),
          assets: arrayType(1),
          attributes: objectType,
          bundleDisplayURL: stringTypeCanBeEmpty,
          bundleProducts: arrayType(),
          bundleSlots: arrayType(),
          espots: objectType,
          colour: stringType,
          colourSwatches: arrayType(4),
          contentSlotContentHTML: objectType,
          deliveryMessage: stringTypeEmpty,
          description: stringType,
          grouping: stringType,
          isBundleOrOutfit: booleanType(false),
          items: arrayType(1),
          lineNumber: stringType,
          name: stringType,
          productDataQuantity: objectType,
          productId: numberType,
          promotionDisplayURL: stringType,
          promoTitle: stringType,
          shopTheLookProducts: arrayOrBooleanType,
          sourceUrl: stringType,
          stockEmail: booleanType(false),
          stockThreshold: numberType,
          storeDelivery: booleanType(true),
          tpmLinks: arrayType(),
          totalMarkdownValue: stringType,
          unitPrice: stringType,
          version: stringType,
          wasPrice: stringType,
          wasWasPrice: stringType,
          wcsColourADValueId: stringType,
          wcsColourKey: stringType,
          wcsSizeKey: stringType,
          pageTitle: stringType,
          iscmCategory: stringType,
          notifyMe: booleanTypeAny,
          isDDPProduct: booleanType(false),
          breadcrumbs: arrayType(),
          amplienceAssets: objectType,
          canonicalUrl: stringTypeCanBeEmpty,
          canonicalUrlSet: booleanTypeAny,
          bnplPaymentOptions: objectType,
        },
      }
      expect(response).toMatchSchema(pdpSchema)
    })

    it(
      'PDP Colour Swatches Assets Schema',
      () => {
        response.assets.forEach((assets) => {
          expect(assets).toMatchSchema(assetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Colour Swatches Additional Assets Schema',
      () => {
        response.additionalAssets.forEach((additionalAssets) => {
          expect(additionalAssets).toMatchSchema(additionalAssetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Colour Swatches Items Schema',
      () => {
        response.items.forEach((items) => {
          expect(items).toMatchSchema(itemsSchema)
        })
      },
      30000
    )

    it(
      'PDP Colour Swatches Attributes Schema',
      () => {
        const itemsSchema = {
          title: 'PDP Colour Swatches Attributes Schema',
          type: 'object',
          required: [
            'b_has360',
            'b_hasImage',
            'b_hasVideo',
            'b_thumbnailImageSuffixes',
            'CE3BThumbnailSuffixes',
            'CE3ThumbnailSuffixes',
            'COLOUR_CODE',
            'countryExclusion',
            'Department',
            'ECMC_PROD_COLOUR_1',
            'ECMC_PROD_PRODUCT_TYPE_1',
            'ECMC_PROD_SIZE_GUIDE_1',
            'ecmcCreatedTimestamp',
            'ecmcUpdatedTimestamp',
            'EmailBackInStock',
            'has360',
            'hasVideo',
            'IFSeason',
            'NotifyMe',
            'ProductDefaultCopy',
            'SearchKeywords',
            'shopTheOutfitBundleCode',
            'SizeFit',
            'STORE_DELIVERY',
            'STYLE_CODE',
            'StyleCode',
            'ThresholdMessage',
            'thumbnailImageSuffixes',
            'IOThumbnailSuffixes',
            'IOBThumbnailSuffixes',
            'ECMC_PROD_CE3_COLLECTION_1',
            'REAL_COLOURS',
            'ECMC_PROD_CE3_PRODUCT_TYPE_1',
            'ECMC_PROD_CE3_HEEL_HEIGHT_1',
            'ECMC_PROD_CE3_SHOE_STYLE_1',
            'ECMC_PROD_CE3_FABRIC_1',
            'AverageOverallRating',
            'RRP',
            'NumReviews',
          ],
          properties: {
            b_has360: stringType,
            b_hasImage: stringType,
            b_hasVideo: stringType,
            b_thumbnailImageSuffixes: stringTypeEmpty,
            CE3BThumbnailSuffixes: stringTypeEmpty,
            CE3ThumbnailSuffixes: stringType,
            COLOUR_CODE: stringType,
            countryExclusion: stringTypeEmpty,
            Department: stringType,
            ECMC_PROD_COLOUR_1: stringType,
            ECMC_PROD_PINTREST_1: stringType,
            ECMC_PROD_PRODUCT_TYPE_1: stringType,
            ECMC_PROD_SIZE_GUIDE_1: stringType,
            ecmcCreatedTimestamp: stringType,
            ecmcUpdatedTimestamp: stringType,
            EmailBackInStock: stringType,
            has360: stringType,
            hasVideo: stringType,
            IFSeason: stringType,
            NotifyMe: stringType,
            ProductDefaultCopy: stringTypeEmpty,
            SearchKeywords: stringTypeEmpty,
            shopTheOutfitBundleCode: stringTypeEmpty,
            SizeFit: stringTypeEmpty,
            STORE_DELIVERY: stringType,
            STYLE_CODE: stringType,
            StyleCode: stringType,
            ThresholdMessage: stringTypeEmpty,
            thumbnailImageSuffixes: stringType,
            IOThumbnailSuffixes: stringType,
            IOBThumbnailSuffixes: stringTypeCanBeEmpty,
            ECMC_PROD_CE3_COLLECTION_1: stringType,
            REAL_COLOURS: stringTypeCanBeEmpty,
            ECMC_PROD_CE3_PRODUCT_TYPE_1: stringType,
            ECMC_PROD_CE3_HEEL_HEIGHT_1: stringType,
            ECMC_PROD_CE3_SHOE_STYLE_1: stringType,
            ECMC_PROD_CE3_FABRIC_1: stringType,
            AverageOverallRating: stringOrNull,
            RRP: stringTypeNumber,
            NumReviews: stringTypeNumber,
          },
        }
        expect(response.attributes).toMatchSchema(itemsSchema)
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity Schema',
      () => {
        expect(response.productDataQuantity).toMatchSchema(
          dataQuantitySchema(1, 10, 'object')
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity => Colour Attributes',
      () => {
        expect(response.productDataQuantity.colourAttributes).toMatchSchema(
          colourAttributesSchema
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity => quantities',
      () => {
        expect(response.productDataQuantity.quantities).toMatchSchema(
          quantitySchema(10)
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity => Inventory Positions',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            expect(inventoryPosition).toMatchSchema(inventoryPositionSchema)
          }
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity => Inventory Positions => Inventorys',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            inventoryPosition.inventorys.forEach((inventory) => {
              expect(inventory).toMatchSchema(inventorySchema)
            })
          }
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity => Inventory Positions => Inventorys => Expressdates',
      () => {
        response.productDataQuantity.inventoryPositions.forEach(
          (inventoryPosition) => {
            inventoryPosition.inventorys.forEach((inventory) => {
              expect(inventory.expressdates).toMatchSchema(expressdateSchema)
            })
          }
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Data Quantity => SKUs',
      () => {
        response.productDataQuantity.SKUs.forEach((sku) => {
          expect(sku).toMatchSchema(skuSchema)
        })
      },
      30000
    )

    it(
      'PDP Colour Swatches Product Shop The Look Products',
      () => {
        response.shopTheLookProducts &&
          response.shopTheLookProducts.forEach((shopLookProduct) => {
            expect(shopLookProduct).toMatchSchema(shopLookProductSchema)
          })
      },
      30000
    )

    it(
      'PDP Colour Swatches espots Schema',
      () => {
        expect(response.espots).toMatchSchema(
          espotsSchema('PDP Colour Swatches')
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CEProductEspotCol1Pos1 Schema ',
      () => {
        if (response.espots.CEProductEspotCol1Pos1 !== undefined) {
          if (typeof response.espots.CEProductEspotCol1Pos1 !== 'string') {
            expect(response.espots.CEProductEspotCol1Pos1).toMatchSchema(
              CEProductEspotSchemaWithOnlyContentText('CEProductEspotCol1Pos1')
            )
          }
        }
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CEProductEspotCol2Pos2 Schema',
      () => {
        if (response.espots.CEProductEspotCol2Pos2 !== undefined) {
          expect(response.espots.CEProductEspotCol2Pos2).toMatchSchema(
            CEProductEspotSchemaForEspotContents(
              'CEProductEspotCol2Pos2',
              'PDP Colour Swatches'
            )
          )
        }
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CEProductEspotCol2Pos2 => EspotContents Schema',
      () => {
        if (response.espots.CEProductEspotCol2Pos2 !== undefined) {
          expect(
            response.espots.CEProductEspotCol2Pos2.EspotContents
          ).toMatchSchema(
            CEProductEspotContentsSchemaWithCmsMobileContent(
              'CEProductEspotCol2Pos2',
              'PDP Colour Swatches'
            )
          )
        }
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CEProductEspotCol2Pos2 => EspotContents => cmsMobileContent Schema',
      () => {
        if (response.espots.CEProductEspotCol2Pos2 !== undefined) {
          expect(
            response.espots.CEProductEspotCol2Pos2.EspotContents
              .cmsMobileContent
          ).toMatchSchema(cmsMobileContentSchema())
        }
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CEProductEspotCol2Pos4 Schema ',
      () => {
        if (wcsEnv !== 'dev2') {
          expect(response.espots.CEProductEspotCol2Pos4).toMatchSchema(
            CEProductEspotSchemaWithOnlyContentText('CEProductEspotCol2Pos4')
          )
        }
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CE3ContentEspot1 Schema',
      () => {
        expect(response.espots.CE3ContentEspot1).toMatchSchema(
          CEProductEspotSchemaForEspotContents(
            'CE3ContentEspot1',
            'PDP Colour Swatches'
          )
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CE3ContentEspot1 => EspotContents Schema',
      () => {
        expect(response.espots.CE3ContentEspot1.EspotContents).toMatchSchema(
          CEProductEspotContentsSchemaWithCmsMobileContent(
            'CE3ContentEspot1',
            'PDP Colour Swatches'
          )
        )
      },
      30000
    )

    it(
      'PDP Colour Swatches espots => CE3ContentEspot1 => EspotContents => cmsMobileContent Schema',
      () => {
        expect(
          response.espots.CE3ContentEspot1.EspotContents.cmsMobileContent
        ).toMatchSchema(cmsMobileContentSchema())
      },
      30000
    )
  })

  describe('PDP Fixed Bundle', () => {
    let response
    beforeAll(async () => {
      response = await getPdp(pdpFixedBundleProduct)
    }, 60000)

    it(
      'PDP Fixed Bundle Json Schema',
      () => {
        const pdpFixedBundleSchema = {
          title: 'PDP Fixed Bundle Schema',
          type: 'object',
          required: [
            'ageVerificationRequired',
            'assets',
            'attributes',
            'bundleProducts',
            'bundleSlots',
            'bundleType',
            'espots',
            'colourSwatches',
            'description',
            'grouping',
            'isBundleOrOutfit',
            'items',
            'lineNumber',
            'name',
            'productId',
            'sourceUrl',
            'stockEmail',
            'stockThreshold',
            'storeDelivery',
            'tpmLinks',
            'unitPrice',
            'version',
            'pageTitle',
            'iscmCategory',
            'breadcrumbs',
            'storeDelivery',
            'amplienceAssets',
            'canonicalUrl',
          ],
          optional: [
            'contentSlotContentHTML',
            'deliveryMessage',
            'canonicalUrlSet',
            'bnplPaymentOptions',
          ],
          properties: {
            ageVerificationRequired: booleanType(false),
            assets: arrayType(1),
            attributes: objectType,
            bundleProducts: arrayType(),
            bundleSlots: arrayType(),
            bundleType: stringTypePattern('Fixed'),
            espots: objectType,
            colourSwatches: arrayType(),
            contentSlotContentHTML: objectType,
            description: stringType,
            grouping: stringType,
            isBundleOrOutfit: booleanType(true),
            items: arrayType(1),
            lineNumber: stringType,
            name: stringType,
            productId: numberType,
            sourceUrl: stringType,
            stockEmail: booleanType(false),
            stockThreshold: numberType,
            storeDetails: booleanType(true),
            tpmLinks: arrayType(),
            unitPrice: stringType,
            version: stringTypeEmpty,
            wasPrice: stringType,
            pageTitle: stringType,
            iscmCategory: stringTypeCanBeEmpty,
            breadcrumbs: arrayType,
            storeDelivery: booleanTypeAny,
            deliveryMessage: stringTypeCanBeEmpty,
            amplienceAssets: arrayType,
            canonicalUrl: stringTypeCanBeEmpty,
            canonicalUrlSet: booleanTypeAny,
            bnplPaymentOptions: objectType,
          },
        }
        expect(response).toMatchSchema(pdpFixedBundleSchema)
      },
      30000
    )

    it(
      'PDP Fixed Bundle Assets Schema',
      () => {
        response.assets.forEach((assets) => {
          expect(assets).toMatchSchema(assetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle Items Schema',
      () => {
        response.items.forEach((items) => {
          const itemsProps = {
            size: items.size,
            sku: items.sku,
            quantity: items.quantity,
            selected: items.selected,
          }
          const itemsSchema = {
            title: 'PDP Fixed Bundle Items Schema',
            type: 'object',
            required: ['size', 'sku', 'quantity', 'selected'],
            properties: {
              size: stringType,
              sku: stringType,
              quantity: numberType,
              selected: booleanType(false),
            },
          }
          expect(itemsProps).toMatchSchema(itemsSchema)
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle bundleSlots Schema',
      () => {
        response.bundleSlots.forEach((obj) => {
          const bundleSlotSchema = {
            title: 'PDP Fixed Bundle bundleSlots Schema',
            type: 'object',
            required: ['slotNumber', 'products'],
            properties: {
              slotNumber: numberType,
              products: arrayType(),
            },
          }
          expect(obj).toMatchSchema(bundleSlotSchema)
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle bundleSlots Products Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            const bundleSlotSchema = {
              title: 'PDP Fixed Bundle bundleSlots Products Schema',
              type: 'object',
              required: [
                'ageVerificationRequired',
                'assets',
                'attributes',
                'bundleProducts',
                'bundleSlots',
                'colour',
                'colourSwatches',
                'description',
                'isBundleOrOutfit',
                'items',
                'lineNumber',
                'name',
                'productId',
                'stockEmail',
                'stockThreshold',
                'storeDelivery',
                'tpmLinks',
                'unitPrice',
                'wasPrice',
                'wcsColourKey',
                'wcsSizeKey',
                'amplienceAssets',
              ],
              optional: ['wasWasPrice'],
              properties: {
                ageVerificationRequired: booleanType(false),
                assets: arrayType(4),
                attributes: objectType,
                bundleProducts: arrayType(),
                bundleSlots: arrayType(),
                colour: stringType,
                colourSwatches: arrayType(),
                description: stringType,
                grouping: stringType,
                isBundleOrOutfit: booleanType(true),
                items: arrayType(1),
                lineNumber: stringType,
                name: stringType,
                productId: numberType,
                stockEmail: booleanType(false),
                stockThreshold: numberType,
                storeDelivery: booleanType(false),
                tpmLinks: arrayType(),
                unitPrice: stringType,
                wasPrice: { type: ['boolean', 'string'] },
                wasWasPrice: { type: ['boolean', 'string'] },
                wcsColourKey: stringType,
                wcsSizeKey: stringType,
                amplienceAssets: arrayType,
              },
            }
            expect(prod).toMatchSchema(bundleSlotSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle bundleSlots => Products => Attribute Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            const att = prod.attributes
            const bundleSlotProdAttSchema = {
              title:
                'PDP Fixed Bundle bundleSlots => Products => Attribute Schema',
              type: 'object',
              required: [
                'ECMC_PROD_SIZE_GUIDE_1',
                'b_hasImage',
                'CEThumbnailSuffixes',
                'b_has360',
                'EmailBackInStock',
                'BundleType',
                'b_hasVideo',
                'STORE_DELIVERY',
                'hasVideo',
                'Department',
                'CE3BThumbnailSuffixes',
                'has360',
                'SearchKeywords',
                'ThresholdMessage',
                'IFSeason',
                'thumbnailImageSuffixes',
                'ECMC_PROD_COLOUR_1',
                'StyleCode',
                'COLOUR_CODE',
                'STYLE_CODE',
                'NotifyMe',
                'countryExclusion',
                'SizeFit',
                'ProductDefaultCopy',
                'shopTheOutfitBundleCode',
              ],
              properties: {
                ECMC_PROD_SIZE_GUIDE_1: stringType,
                b_hasImage: stringType,
                CEThumbnailSuffixes: stringTypeEmpty,
                b_has360: stringType,
                EmailBackInStock: stringType,
                BundleType: stringType,
                b_hasVideo: stringType,
                STORE_DELIVERY: stringType,
                hasVideo: stringType,
                Department: stringTypeEmpty,
                CE3BThumbnailSuffixes: stringTypeEmpty,
                has360: stringType,
                SearchKeywords: stringTypeEmpty,
                ThresholdMessage: stringTypeEmpty,
                IFSeason: stringType,
                thumbnailImageSuffixes: stringType,
                ECMC_PROD_COLOUR_1: stringTypeEmpty,
                StyleCode: stringType,
                COLOUR_CODE: stringTypeEmpty,
                STYLE_CODE: stringTypeEmpty,
                NotifyMe: stringType,
                countryExclusion: stringTypeEmpty,
                SizeFit: stringTypeEmpty,
                ProductDefaultCopy: stringTypeEmpty,
                shopTheOutfitBundleCode: stringTypeEmpty,
              },
            }
            expect(att).toMatchSchema(bundleSlotProdAttSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle bundleSlots => Products => Assets Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            prod.assets.forEach((asset) => {
              const bundleSlotProdAssetsSchema = {
                title: 'PDP Fixed Bundle bundleSlots Products => Assets Schema',
                type: 'object',
                required: ['assetType', 'index', 'url'],
                properties: {
                  assetType: stringType,
                  index: numberType,
                  url: stringType,
                },
              }
              expect(asset).toMatchSchema(bundleSlotProdAssetsSchema)
            })
          })
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle bundleSlots => Products => Items Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            prod.items.forEach((item) => {
              const bundleSlotProdAssetsSchema = {
                title: 'PDP Fixed Bundle bundleSlots Products => Items Schema',
                type: 'object',
                required: ['sku', 'size', 'quantity', 'selected', 'catEntryId'],
                properties: {
                  sku: stringType,
                  size: stringType,
                  quantity: numberType,
                  selected: booleanType(false),
                  catEntryId: numberType,
                },
              }
              expect(item).toMatchSchema(bundleSlotProdAssetsSchema)
            })
          })
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle bundleProducts Schema',
      () => {
        response.bundleProducts.forEach((obj) => {
          const bundleProductsSchema = {
            title: 'PDP Fixed Bundle bundleProducts Schema',
            type: 'object',
            required: [
              'ageVerificationRequired',
              'assets',
              'attributes',
              'bundleProducts',
              'bundleSlots',
              'colour',
              'colourSwatches',
              'description',
              'grouping',
              'isBundleOrOutfit',
              'items',
              'lineNumber',
              'name',
              'productId',
              'stockEmail',
              'stockThreshold',
              'storeDelivery',
              'tpmLinks',
              'unitPrice',
              'wasPrice',
              'wcsColourKey',
              'wcsSizeKey',
              'amplienceAssets',
            ],
            optional: ['wasWasPrice'],
            properties: {
              ageVerificationRequired: booleanType(false),
              assets: arrayType(4),
              attributes: objectType,
              bundleProducts: arrayType(),
              bundleSlots: arrayType(),
              colour: stringType,
              colourSwatches: arrayType(),
              description: stringType,
              grouping: stringType,
              isBundleOrOutfit: booleanType(true),
              items: arrayType(1),
              lineNumber: stringType,
              name: stringType,
              productId: numberType,
              stockEmail: booleanType(false),
              stockThreshold: numberType,
              storeDelivery: booleanType(false),
              tpmLinks: arrayType(),
              unitPrice: stringType,
              wasPrice: { type: ['boolean', 'string'] },
              wasWasPrice: { type: ['boolean', 'string'] },
              wcsColourKey: stringType,
              wcsSizeKey: stringType,
              amplienceAssets: arrayType,
            },
          }
          expect(obj).toMatchSchema(bundleProductsSchema)
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle => bundleProducts => Assets Schema',
      () => {
        response.bundleProducts.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const bundleProductsAssetsAssetsSchema = {
              title: 'PDP Fixed Bundle bundleProducts => assets Schema',
              type: 'object',
              required: ['assetType', 'index', 'url'],
              properties: {
                assetType: stringType,
                index: numberType,
                url: stringType,
              },
            }
            expect(asset).toMatchSchema(bundleProductsAssetsAssetsSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle => bundleProducts => Items Schema',
      () => {
        response.bundleProducts.forEach((prod) => {
          prod.items.forEach((item) => {
            const bundleProductsItemsAssetsSchema = {
              title: 'PDP Fixed Bundle bundleProducts => Items Schema',
              type: 'object',
              required: ['sku', 'size', 'quantity', 'selected', 'catEntryId'],
              properties: {
                sku: stringType,
                size: stringType,
                quantity: numberType,
                selected: booleanType(false),
                catEntryId: numberType,
              },
            }
            expect(item).toMatchSchema(bundleProductsItemsAssetsSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle => bundleProducts => Attribute Schema',
      () => {
        response.bundleProducts.forEach((bundleProd) => {
          const att = bundleProd.attributes
          const bundleProductsAttSchema = {
            title: 'PDP Fixed Bundle bundleProducts => Attribute Schema',
            type: 'object',
            required: [
              'b_has360',
              'b_hasImage',
              'b_hasVideo',
              'BundleType',
              'CE3BThumbnailSuffixes',
              'CEThumbnailSuffixes',
              'COLOUR_CODE',
              'countryExclusion',
              'Department',
              'ECMC_PROD_COLOUR_1',
              'ECMC_PROD_SIZE_GUIDE_1',
              'EmailBackInStock',
              'has360',
              'hasVideo',
              'IFSeason',
              'NotifyMe',
              'ProductDefaultCopy',
              'SearchKeywords',
              'shopTheOutfitBundleCode',
              'SizeFit',
              'STORE_DELIVERY',
              'STYLE_CODE',
              'StyleCode',
              'ThresholdMessage',
              'thumbnailImageSuffixes',
            ],
            properties: {
              b_has360: stringType,
              b_hasImage: stringType,
              b_hasVideo: stringType,
              BundleType: stringType,
              CE3BThumbnailSuffixes: stringTypeEmpty,
              CEThumbnailSuffixes: stringTypeEmpty,
              COLOUR_CODE: stringTypeEmpty,
              countryExclusion: stringTypeEmpty,
              Department: stringTypeEmpty,
              ECMC_PROD_COLOUR_1: stringTypeEmpty,
              ECMC_PROD_SIZE_GUIDE_1: stringType,
              EmailBackInStock: stringType,
              has360: stringType,
              hasVideo: stringType,
              IFSeason: stringType,
              NotifyMe: stringType,
              ProductDefaultCopy: stringTypeEmpty,
              SearchKeywords: stringTypeEmpty,
              shopTheOutfitBundleCode: stringTypeEmpty,
              SizeFit: stringTypeEmpty,
              STORE_DELIVERY: stringType,
              STYLE_CODE: stringTypeEmpty,
              StyleCode: stringType,
              ThresholdMessage: stringTypeEmpty,
              thumbnailImageSuffixes: stringType,
            },
          }
          expect(att).toMatchSchema(bundleProductsAttSchema)
        })
      },
      30000
    )

    it(
      'PDP Fixed Bundle espots Schema',
      () => {
        expect(response.espots).toMatchSchema(espotsSchema('PDP Fixed Bundle'))
      },
      30000
    )

    it(
      'PDP Fixed Bundle espots => CEProductEspotCol1Pos1 Schema ',
      () => {
        if (response.espots.CEProductEspotCol1Pos1 !== undefined) {
          if (typeof response.espots.CEProductEspotCol1Pos1 !== 'string') {
            expect(response.espots.CEProductEspotCol1Pos1).toMatchSchema(
              CEProductEspotSchemaWithOnlyContentText('CEProductEspotCol1Pos1')
            )
          }
        }
      },
      30000
    )

    it(
      'PDP Fixed Bundle espots => CE3ContentEspot1 Schema',
      () => {
        expect(response.espots.CE3ContentEspot1).toMatchSchema(
          CEProductEspotSchemaForEspotContents(
            'CE3ContentEspot1',
            'PDP Fixed Bundle'
          )
        )
      },
      30000
    )

    it(
      'PDP Fixed Bundle espots => CE3ContentEspot1 => EspotContents Schema',
      () => {
        expect(response.espots.CE3ContentEspot1.EspotContents).toMatchSchema(
          CEProductEspotContentsSchemaWithCmsMobileContent(
            'CE3ContentEspot1',
            'PDP Fixed Bundle'
          )
        )
      },
      30000
    )

    it(
      'PDP Fixed Bundle espots => CE3ContentEspot1 => EspotContents => cmsMobileContent Schema',
      () => {
        expect(
          response.espots.CE3ContentEspot1.EspotContents.cmsMobileContent
        ).toMatchSchema(cmsMobileContentSchema())
      },
      30000
    )
  })

  describe('PDP Flexible Bundles', () => {
    let response
    beforeAll(async () => {
      response = await getPdp(pdpFlexibleBundleProduct)
    }, 60000)

    it(
      'PDP Flexible Bundle Json Schema',
      () => {
        const pdpFixedBundleSchema = {
          title: 'PDP Flexible Bundle Schema',
          type: 'object',
          required: [
            'ageVerificationRequired',
            'assets',
            'attributes',
            'bundleProducts',
            'bundleSlots',
            'espots',
            'colourSwatches',
            'description',
            'grouping',
            'isBundleOrOutfit',
            'items',
            'lineNumber',
            'name',
            'productId',
            'sourceUrl',
            'stockEmail',
            'stockThreshold',
            'storeDelivery',
            'tpmLinks',
            'unitPrice',
            'version',
            'pageTitle',
            'iscmCategory',
            'breadcrumbs',
            'amplienceAssets',
            'canonicalUrl',
          ],
          optional: [
            'contentSlotContentHTML',
            'deliveryMessage',
            'canonicalUrlSet',
            'bnplPaymentOptions',
          ],
          properties: {
            ageVerificationRequired: booleanType(false),
            assets: arrayType(1),
            attributes: objectType,
            bundleProducts: arrayType(),
            bundleSlots: arrayType(),
            bundleType: stringTypePattern('Flexible'),
            espots: objectType,
            colourSwatches: arrayType(),
            contentSlotContentHTML: objectType,
            description: stringType,
            grouping: stringType,
            isBundleOrOutfit: booleanType(true),
            items: arrayType(1),
            KlarnaPDPEspot2: objectType,
            lineNumber: stringType,
            name: stringType,
            productId: numberType,
            sourceUrl: stringType,
            stockEmail: booleanType(false),
            stockThreshold: numberType,
            storeDetails: booleanType(true),
            tpmLinks: arrayType(),
            unitPrice: stringType,
            version: stringTypeEmpty,
            wasPrice: stringType,
            pageTitle: stringType,
            iscmCategory: stringTypeCanBeEmpty,
            breadcrumbs: arrayType,
            storeDelivery: booleanTypeAny,
            deliveryMessage: stringTypeCanBeEmpty,
            amplienceAssets: arrayType,
            canonicalUrl: stringTypeCanBeEmpty,
            canonicalUrlSet: booleanTypeAny,
            bnplPaymentOptions: objectType,
          },
        }
        expect(response).toMatchSchema(pdpFixedBundleSchema)
      },
      30000
    )

    it(
      'PDP Flexible Bundle Assets Schema',
      () => {
        response.assets.forEach((assets) => {
          expect(assets).toMatchSchema(assetsSchema)
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle Items Schema',
      () => {
        response.items.forEach((items) => {
          const itemsProps = {
            size: items.size,
            sku: items.sku,
            quantity: items.quantity,
            selected: items.selected,
          }
          const itemsSchema = {
            title: 'PDP Flexible Bundle Items Schema',
            type: 'object',
            required: ['size', 'sku', 'quantity', 'selected'],
            properties: {
              size: stringType,
              sku: stringType,
              quantity: numberType,
              selected: booleanType(false),
            },
          }
          expect(itemsProps).toMatchSchema(itemsSchema)
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle bundleSlots Schema',
      () => {
        response.bundleSlots.forEach((obj) => {
          const bundleSlotSchema = {
            title: 'PDP Flexible Bundle bundleSlots Schema',
            type: 'object',
            required: ['slotNumber', 'products'],
            properties: {
              slotNumber: numberType,
              products: arrayType(),
            },
          }
          expect(obj).toMatchSchema(bundleSlotSchema)
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle bundleSlots Products Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            const bundleSlotSchema = {
              title: 'PDP Flexible Bundle bundleSlots Products Schema',
              type: 'object',
              required: [
                'ageVerificationRequired',
                'assets',
                'attributes',
                'bundleProducts',
                'bundleSlots',
                'colourSwatches',
                'description',
                'grouping',
                'isBundleOrOutfit',
                'items',
                'lineNumber',
                'name',
                'productId',
                'stockEmail',
                'stockThreshold',
                'storeDelivery',
                'tpmLinks',
                'unitPrice',
                'wasPrice',
                'wcsColourKey',
                'wcsSizeKey',
                'amplienceAssets',
              ],
              optional: ['wasWasPrice'],
              properties: {
                ageVerificationRequired: booleanType(false),
                assets: arrayType(4),
                attributes: objectType,
                bundleProducts: arrayType(),
                bundleSlots: arrayType(),
                colourSwatches: arrayType(),
                description: stringType,
                grouping: stringType,
                isBundleOrOutfit: booleanType(true),
                items: arrayType(1),
                lineNumber: stringType,
                name: stringType,
                productId: numberType,
                stockEmail: booleanType(false),
                stockThreshold: numberType,
                storeDelivery: booleanType(false),
                tpmLinks: arrayType(),
                unitPrice: stringType,
                wasPrice: { type: ['boolean', 'string'] },
                wasWasPrice: { type: ['boolean', 'string'] },
                wcsColourKey: stringType,
                wcsSizeKey: stringType,
                amplienceAssets: arrayType,
              },
            }
            expect(prod).toMatchSchema(bundleSlotSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle bundleSlots => Products => Attribute Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            const att = prod.attributes
            const bundleSlotProdAttSchema = {
              title:
                'PDP Flexible Bundle bundleSlots => Products => Attribute Schema',
              type: 'object',
              required: [
                'b_has360',
                'b_hasImage',
                'b_hasVideo',
                'BundleType',
                'CE3BThumbnailSuffixes',
                'CEThumbnailSuffixes',
                'COLOUR_CODE',
                'countryExclusion',
                'Department',
                'ECMC_PROD_COLOUR_1',
                'ECMC_PROD_SIZE_GUIDE_1',
                'EmailBackInStock',
                'has360',
                'hasVideo',
                'IFSeason',
                'NotifyMe',
                'ProductDefaultCopy',
                'SearchKeywords',
                'shopTheOutfitBundleCode',
                'SizeFit',
                'STORE_DELIVERY',
                'STYLE_CODE',
                'StyleCode',
                'ThresholdMessage',
                'thumbnailImageSuffixes',
              ],
              properties: {
                b_has360: stringType,
                b_hasImage: stringType,
                b_hasVideo: stringType,
                BundleType: stringType,
                CE3BThumbnailSuffixes: stringTypeEmpty,
                CEThumbnailSuffixes: stringTypeEmpty,
                COLOUR_CODE: stringTypeEmpty,
                countryExclusion: stringTypeEmpty,
                Department: stringTypeEmpty,
                ECMC_PROD_COLOUR_1: stringTypeEmpty,
                ECMC_PROD_SIZE_GUIDE_1: stringType,
                EmailBackInStock: stringType,
                has360: stringType,
                hasVideo: stringType,
                IFSeason: stringType,
                NotifyMe: stringType,
                ProductDefaultCopy: stringTypeEmpty,
                SearchKeywords: stringTypeEmpty,
                shopTheOutfitBundleCode: stringTypeEmpty,
                SizeFit: stringTypeEmpty,
                STORE_DELIVERY: stringType,
                STYLE_CODE: stringTypeEmpty,
                StyleCode: stringType,
                ThresholdMessage: stringTypeEmpty,
                thumbnailImageSuffixes: stringType,
              },
            }
            expect(att).toMatchSchema(bundleSlotProdAttSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle bundleSlots => Products => Assets Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            prod.assets.forEach((asset) => {
              const bundleSlotProdAssetsSchema = {
                title:
                  'PDP Flexible Bundle bundleSlots Products => Assets Schema',
                type: 'object',
                required: ['assetType', 'index', 'url'],
                properties: {
                  assetType: stringType,
                  index: numberType,
                  url: stringType,
                },
              }
              expect(asset).toMatchSchema(bundleSlotProdAssetsSchema)
            })
          })
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle bundleSlots => Products => Items Schema',
      () => {
        response.bundleSlots.forEach((product) => {
          product.products.forEach((prod) => {
            prod.items.forEach((item) => {
              const bundleSlotProdAssetsSchema = {
                title:
                  'PDP Flexible Bundle bundleSlots Products => Items Schema',
                type: 'object',
                required: ['sku', 'size', 'quantity', 'selected', 'catEntryId'],
                properties: {
                  sku: stringType,
                  size: stringType,
                  quantity: numberType,
                  selected: booleanType(false),
                  catEntryId: numberType,
                },
              }
              expect(item).toMatchSchema(bundleSlotProdAssetsSchema)
            })
          })
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle bundleProducts Schema',
      () => {
        response.bundleProducts.forEach((obj) => {
          const bundleProductsSchema = {
            title: 'PDP Flexible Bundle bundleProducts Schema',
            type: 'object',
            required: [
              'ageVerificationRequired',
              'assets',
              'attributes',
              'bundleProducts',
              'bundleSlots',
              'colourSwatches',
              'description',
              'grouping',
              'isBundleOrOutfit',
              'items',
              'lineNumber',
              'name',
              'productId',
              'stockEmail',
              'stockThreshold',
              'storeDelivery',
              'tpmLinks',
              'unitPrice',
              'wasPrice',
              'wcsColourKey',
              'wcsSizeKey',
              'amplienceAssets',
            ],
            optional: ['wasWasPrice'],
            properties: {
              ageVerificationRequired: booleanType(false),
              assets: arrayType(4),
              attributes: objectType,
              bundleProducts: arrayType(),
              bundleSlots: arrayType(),
              colourSwatches: arrayType(),
              description: stringType,
              grouping: stringType,
              isBundleOrOutfit: booleanType(true),
              items: arrayType(1),
              lineNumber: stringType,
              name: stringType,
              productId: numberType,
              stockEmail: booleanType(false),
              stockThreshold: numberType,
              storeDelivery: booleanType(false),
              tpmLinks: arrayType(),
              unitPrice: stringType,
              wasPrice: { type: ['boolean', 'string'] },
              wasWasPrice: { type: ['boolean', 'string'] },
              wcsColourKey: stringType,
              wcsSizeKey: stringType,
              amplienceAssets: arrayType,
            },
          }
          expect(obj).toMatchSchema(bundleProductsSchema)
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle => bundleProducts => Assets Schema',
      () => {
        response.bundleProducts.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const bundleProductsAssetsAssetsSchema = {
              title: 'PDP Flexible Bundle bundleProducts => assets Schema',
              type: 'object',
              required: ['assetType', 'index', 'url'],
              properties: {
                assetType: stringType,
                index: numberType,
                url: stringType,
              },
            }
            expect(asset).toMatchSchema(bundleProductsAssetsAssetsSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle => bundleProducts => Items Schema',
      () => {
        response.bundleProducts.forEach((prod) => {
          prod.items.forEach((item) => {
            const bundleProductsItemsAssetsSchema = {
              title: 'PDP Flexible Bundle bundleProducts => Items Schema',
              type: 'object',
              required: ['sku', 'size', 'quantity', 'selected', 'catEntryId'],
              properties: {
                sku: stringType,
                size: stringType,
                quantity: numberType,
                selected: booleanType(false),
                catEntryId: numberType,
              },
            }
            expect(item).toMatchSchema(bundleProductsItemsAssetsSchema)
          })
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundle => bundleProducts => Attribute Schema',
      () => {
        response.bundleProducts.forEach((bundleProd) => {
          const att = bundleProd.attributes
          const bundleProductsAttSchema = {
            title: 'PDP Flexible Bundle bundleProducts => Attribute Schema',
            type: 'object',
            required: [
              'b_has360',
              'b_hasImage',
              'b_hasVideo',
              'BundleType',
              'CE3BThumbnailSuffixes',
              'CEThumbnailSuffixes',
              'COLOUR_CODE',
              'countryExclusion',
              'Department',
              'ECMC_PROD_COLOUR_1',
              'ECMC_PROD_SIZE_GUIDE_1',
              'EmailBackInStock',
              'has360',
              'hasVideo',
              'IFSeason',
              'NotifyMe',
              'ProductDefaultCopy',
              'SearchKeywords',
              'shopTheOutfitBundleCode',
              'SizeFit',
              'STORE_DELIVERY',
              'STYLE_CODE',
              'StyleCode',
              'ThresholdMessage',
              'thumbnailImageSuffixes',
            ],
            properties: {
              b_has360: stringType,
              b_hasImage: stringType,
              b_hasVideo: stringType,
              BundleType: stringType,
              CE3BThumbnailSuffixes: stringTypeEmpty,
              CEThumbnailSuffixes: stringTypeEmpty,
              COLOUR_CODE: stringTypeEmpty,
              countryExclusion: stringTypeEmpty,
              Department: stringTypeEmpty,
              ECMC_PROD_COLOUR_1: stringTypeEmpty,
              ECMC_PROD_SIZE_GUIDE_1: stringType,
              EmailBackInStock: stringType,
              has360: stringType,
              hasVideo: stringType,
              IFSeason: stringType,
              NotifyMe: stringType,
              ProductDefaultCopy: stringTypeEmpty,
              SearchKeywords: stringTypeEmpty,
              shopTheOutfitBundleCode: stringTypeEmpty,
              SizeFit: stringTypeEmpty,
              STORE_DELIVERY: stringType,
              STYLE_CODE: stringTypeEmpty,
              StyleCode: stringType,
              ThresholdMessage: stringTypeEmpty,
              thumbnailImageSuffixes: stringType,
            },
          }
          expect(att).toMatchSchema(bundleProductsAttSchema)
        })
      },
      30000
    )

    it(
      'PDP Flexible Bundles espots Schema',
      () => {
        expect(response.espots).toMatchSchema(espotsSchema('PDP Fixed Bundle'))
      },
      30000
    )

    it(
      'PDP Flexible Bundles espots => CEProductEspotCol1Pos1 Schema ',
      () => {
        if (response.espots.CEProductEspotCol1Pos1 !== undefined) {
          if (typeof response.espots.CEProductEspotCol1Pos1 !== 'string') {
            expect(response.espots.CEProductEspotCol1Pos1).toMatchSchema(
              CEProductEspotSchemaWithOnlyContentText('CEProductEspotCol1Pos1')
            )
          }
        }
      },
      30000
    )

    it(
      'PDP Flexible Bundles espots => CE3ContentEspot1 Schema',
      () => {
        expect(response.espots.CE3ContentEspot1).toMatchSchema(
          CEProductEspotSchemaForEspotContents(
            'CE3ContentEspot1',
            'PDP Flexible Bundles'
          )
        )
      },
      30000
    )

    it(
      'PDP Flexible Bundles espots => CE3ContentEspot1 => EspotContents Schema',
      () => {
        expect(response.espots.CE3ContentEspot1.EspotContents).toMatchSchema(
          CEProductEspotContentsSchemaWithCmsMobileContent(
            'CE3ContentEspot1',
            'PDP Flexible Bundles'
          )
        )
      },
      30000
    )

    it(
      'PDP Flexible Bundles espots => CE3ContentEspot1 => EspotContents => cmsMobileContent Schema',
      () => {
        expect(
          response.espots.CE3ContentEspot1.EspotContents.cmsMobileContent
        ).toMatchSchema(cmsMobileContentSchema())
      },
      30000
    )
  })

  describe('PDP Product Quick View', () => {
    let response
    beforeAll(async () => {
      response = await getPdpQuickView(pdpProductQuickViewQuery)
    }, 30000)

    it('It should return Product Quick View Schema', () => {
      const pdpSchema = {
        title: 'PDP Quick view Schema',
        type: 'object',
        required: [
          'attributes',
          'averageOverallRating',
          'catentryId',
          'code',
          'colourSwatches',
          'dayPrices',
          'ecmcProductType',
          'fullImage',
          'hourlyPromoPrices',
          'imageUrls',
          'name',
          'notifyMeEnabled',
          'nowPrice',
          'partNumber',
          'prdtLongDesc',
          'productDataQuantity',
          'productDescriptionAttributes',
          'productDetailPageUrl',
          'productType',
          'sizeGuideUrl',
          'SKUs',
          'storeId',
          'thresholdValue',
          'title',
          'TPMlinks',
          'was1Price',
          'was2Price',
        ],
        properties: {
          attributes: arrayType(3),
          catentryId: stringType,
          code: stringType,
          colourSwatches: nullType,
          dayPrices: nullType,
          ecmcProductType: stringType,
          fullImage: stringType,
          hourlyPromoPrices: nullType,
          imageUrls: objectType,
          name: stringType,
          notifyMeEnabled: booleanType(false),
          nowPrice: stringType,
          partNumber: stringType,
          prdtLongDesc: { type: 'string' },
          productDataQuantity: arrayType(1),
          productDescriptionAttributes: objectType,
          productDetailPageUrl: stringType,
          productType: nullType,
          sizeGuideUrl: nullType,
          SKUs: nullType,
          storeId: stringType,
          thresholdValue: stringType,
          title: stringType,
          TPMlinks: nullType,
          was1Price: stringType,
          was2Price: nullType,
          averageOverallRating: stringOrNull,
        },
      }
      expect(response).toMatchSchema(pdpSchema)
    })

    it('It should return Product Quick View => Attributes Schema', () => {
      response.attributes.forEach((attribute) => {
        const attributeSchema = {
          title: 'Attributes in Product Quick view',
          type: 'object',
          required: ['value', 'name'],
          properties: {
            averageOverallRating: stringOrNull,
            value: stringType,
            name: stringType,
          },
        }
        expect(attribute).toMatchSchema(attributeSchema)
      })
    })

    it('It should return Product Quick View => imageUrls Schema', () => {
      const imageUrlsSchema = {
        title: 'PDP Quick view => imageUrls Schema',
        // type: 'object',
        required: [
          'Thumbnailimageurls',
          'isBServerUrl',
          'smallImageUrl',
          'thumbImageUrl',
          'largeImageUrl',
          'zoomImageUrl',
          'normalImageUrl',
          'baseImageUrl',
        ],
        properties: {
          Thumbnailimageurls: arrayType(1),
          isBServerUrl: stringTypePattern('false'),
          smallImageUrl: stringType,
          thumbImageUrl: stringType,
          largeImageUrl: stringType,
          zoomImageUrl: stringType,
          normalImageUrl: stringType,
          baseImageUrl: stringType,
        },
      }
      expect(response.imageUrls).toMatchSchema(imageUrlsSchema)
    })

    it('It should return Product Quick View => imageUrls => Thumbnailimageurls Schema', () => {
      response.imageUrls.Thumbnailimageurls.forEach((imageUrl) => {
        const imageUrlSchema = {
          title: 'Image urls in Product Quick view',
          type: 'object',
          required: [
            '360',
            'bundleCatentryId',
            'large',
            'normal',
            'shopTheOutfit',
            'small',
            'video',
            'baseImageUrl',
          ],
          properties: {
            360: nullType,
            bundleCatentryId: nullType,
            large: stringType,
            normal: stringType,
            shopTheOutfit: stringType,
            small: stringType,
            video: nullType,
            baseImageUrl: stringType,
          },
        }
        expect(imageUrl).toMatchSchema(imageUrlSchema)
      })
    })

    it(
      'It should return Product Quick View => Product Data Quantity Schema',
      () => {
        assert.jsonSchema(
          response.productDataQuantity,
          dataQuantitySchema(1, 10, 'array')
        )
      },
      30000
    )

    it(
      'It should return Product Quick View => Product Data Quantity => Colour Attributes',
      () => {
        response.productDataQuantity.forEach((productDataQuantity) => {
          const body = productDataQuantity.colourAttributes
          expect(body).toMatchSchema(colourAttributesSchema)
        })
      },
      30000
    )

    it(
      'It should return Product Quick View => Product Data Quantity => quantities',
      () => {
        response.productDataQuantity.forEach((productDataQuantity) => {
          const quantities = productDataQuantity.quantities
          expect(quantities).toMatchSchema(quantitySchema(6))
        })
      },
      30000
    )

    it(
      'It should return Product Quick View => Product Data Quantity => Inventory Positions',
      () => {
        response.productDataQuantity.forEach((productDataQuantity) => {
          productDataQuantity.inventoryPositions.forEach(
            (inventoryPosition) => {
              const inventoryPositionSchemaForQuickView = {
                title: 'Inventory position Schema in Product Data Quantity',
                type: 'object',
                required: ['partNumber', 'catentryId', 'inventorys', 'invavls'],
                properties: {
                  partNumber: nullType,
                  catentryId: numberType,
                  inventorys:
                    inventoryPosition.inventorys !== null
                      ? arrayType(1)
                      : nullType,
                  invavls: nullType,
                },
              }
              expect(inventoryPosition).toMatchSchema(
                inventoryPositionSchemaForQuickView
              )
            }
          )
        })
      },
      30000
    )

    it(
      'It should return Product Quick View => Product Data Quantity => Inventory Positions => Inventorys',
      () => {
        response.productDataQuantity.forEach((productDataQuantity) => {
          productDataQuantity.inventoryPositions.forEach(
            (inventoryPosition) => {
              if (inventoryPosition.inventorys !== null) {
                inventoryPosition.inventorys.forEach((inventory) => {
                  expect(inventory).toMatchSchema(inventorySchema)
                })
              }
            }
          )
        })
      },
      30000
    )

    it(
      'It should return Product Quick View => Product Data Quantity => Inventory Positions => Inventorys => Expressdates',
      () => {
        response.productDataQuantity.forEach((productDataQuantity) => {
          productDataQuantity.inventoryPositions.forEach(
            (inventoryPosition) => {
              if (inventoryPosition.inventorys !== null) {
                inventoryPosition.inventorys.forEach((inventory) => {
                  expect(inventory.expressdates).toMatchSchema(
                    expressdateSchema
                  )
                })
              }
            }
          )
        })
      },
      30000
    )
  })
})
