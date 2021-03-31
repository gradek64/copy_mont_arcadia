require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import {
  headers,
  stringType,
  stringTypeCanBeEmpty,
  stringTypeEmpty,
  stringTypePattern,
  numberType,
  booleanType,
  objectType,
  arrayType,
} from '../utilis'

describe('It should return the Products Listing Json Schema', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.products.productsListingPage.path)
      .query('?currentPage=2&category=203984,208523')
      .set(headers)
  }, 30000)

  it(
    'Products List Schema',
    () => {
      const body = response.body
      const productsListSchema = {
        title: 'Products List Schema',
        type: 'object',
        required: [
          'breadcrumbs',
          'canonicalUrl',
          'categoryDescription',
          'categoryRefinement',
          'categoryTitle',
          'cmsPage',
          'defaultImgType',
          'globalEspot',
          'plpContentSlot',
          'products',
          'recordSpotlight',
          'refinements',
          'sortOptions',
          'totalProducts',
          'removeAllRefinement',
          'categoryBanner',
          'activeRefinements',
          'title',
          'shouldIndex',
        ],
        properties: {
          breadcrumbs: arrayType(1),
          canonicalUrl: stringType,
          categoryDescription: stringType,
          categoryRefinement: objectType,
          categoryTitle: stringType,
          cmsPage: objectType,
          defaultImgType: stringType,
          globalEspot: objectType,
          plpContentSlot: objectType,
          products: arrayType(1),
          recordSpotlight: objectType,
          refinements: arrayType(1),
          sortOptions: arrayType(1),
          totalProducts: numberType,
          removeAllRefinement: objectType,
          categoryBanner: objectType,
          activeRefinements: arrayType,
          title: stringType,
          shouldIndex: booleanType(true),
        },
      }
      expect(body).toMatchSchema(productsListSchema)
    },
    30000
  )

  it(
    'Products List breadcrumbs Schema',
    () => {
      response.body.breadcrumbs.forEach((obj) => {
        if (obj.label !== 'Home') {
          const productsBreadCrumbsSchema = {
            title: 'BreadCrumbs Schema',
            type: 'object',
            required: ['label', 'category'],
            optional: ['url'],
            properties: {
              label: stringType,
              category: stringType,
              url: stringType,
            },
          }
          expect(obj).toMatchSchema(productsBreadCrumbsSchema)
        } else {
          const productsBreadCrumbsSchema = {
            title: 'BreadCrumbs Schema',
            type: 'object',
            required: ['label'],
            optional: ['url'],
            properties: {
              label: stringType,
              url: stringType,
            },
          }
          expect(obj).toMatchSchema(productsBreadCrumbsSchema)
        }
      })
    },
    30000
  )

  it(
    'Products List categoryRefinement Schema',
    () => {
      const body = response.body.categoryRefinement
      const productsCategoryRefinementSchema = {
        title: 'Category Refinement Schema',
        type: 'object',
        required: ['refinementOptions'],
        properties: {
          refinementOptions: arrayType(),
        },
      }
      expect(body).toMatchSchema(productsCategoryRefinementSchema)
    },
    30000
  )

  it(
    'Products List refinements Schema',
    () => {
      response.body.refinements.forEach((obj) => {
        const refinementsSchema = {
          title: 'Refinements Schema',
          type: 'object',
          required: ['label', 'refinementOptions'],
          properties: {
            label: stringType,
            refinementOptions: arrayType(1),
          },
        }
        expect(obj).toMatchSchema(refinementsSchema)
      })
    },
    30000
  )

  it(
    'Products List Refinements => refinementOptions',
    () => {
      response.body.refinements.forEach((refinement) => {
        refinement.refinementOptions.forEach((obj) => {
          const refinementOptionSchema = {
            title: 'Refinement Options Schema',
            type: 'object',
            required: ['type'],
            optional: [
              'count',
              'label',
              'maxValue',
              'minValue',
              'seoUrl',
              'value',
            ],
            properties: {
              type:
                obj.label != null
                  ? stringTypePattern('VALUE')
                  : stringTypePattern('RANGE'),
              count: numberType,
              label: stringType,
              maxValue: stringType,
              minValue: stringType,
              seoUrl: stringType,
              value: stringType,
            },
          }
          expect(obj).toMatchSchema(refinementOptionSchema)
        })
      })
    },
    30000
  )

  it(
    'Products List products Schema',
    () => {
      response.body.products.forEach((obj) => {
        const productsSchema = {
          title: 'Products Schema',
          type: 'object',
          required: [
            'productId',
            'lineNumber',
            'name',
            'unitPrice',
            'seoUrl',
            'assets',
            'additionalAssets',
            'items',
            'bundleProducts',
            'attributes',
            'colourSwatches',
            'tpmLinks',
            'bundleSlots',
            'ageVerificationRequired',
            'isBundleOrOutfit',
            'productUrl',
            'productBaseImageUrl',
            'outfitBaseImageUrl',
          ],
          properties: {
            productId: numberType,
            lineNumber: stringType,
            name: stringType,
            unitPrice: stringType,
            seoUrl: stringType,
            assets: arrayType(1),
            additionalAssets: arrayType(1),
            items: arrayType(),
            bundleProducts: arrayType(),
            attributes: objectType,
            colourSwatches: arrayType(),
            tpmLinks: arrayType(),
            bundleSlots: arrayType(),
            ageVerificationRequired: booleanType(false),
            isBundleOrOutfit: booleanType(false),
            productUrl: stringType,
            productBaseImageUrl: stringType,
            outfitBaseImageUrl: stringType,
          },
        }
        expect(obj).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List products => assets Schema',
    () => {
      response.body.products.forEach((obj) => {
        obj.assets.forEach((objAssets) => {
          const assetsSchema = {
            title: 'Products => Assets Schema',
            type: 'object',
            required: ['assetType', 'index', 'url'],
            properties: {
              assetType: stringType,
              index: numberType,
              url: stringType,
            },
          }
          expect(objAssets).toMatchSchema(assetsSchema)
        })
      })
    },
    30000
  )

  it(
    'Products List products => additionalAssets Schema',
    () => {
      response.body.products.forEach((obj) => {
        obj.additionalAssets.forEach((objAddAssets) => {
          const assetsSchema = {
            title: 'Products => AdditionalAssets Schema',
            type: 'object',
            required: ['assetType', 'index', 'url'],
            properties: {
              assetType: stringType,
              index: numberType,
              url: stringType,
            },
          }
          expect(objAddAssets).toMatchSchema(assetsSchema)
        })
      })
    },
    30000
  )

  it(
    'Products List sortOptions Schema',
    () => {
      response.body.sortOptions.forEach((opt) => {
        const productsSchema = {
          title: 'Sort Options Schema',
          type: 'object',
          required: ['label', 'value', 'navigationState'],
          properties: {
            label: stringType,
            value: stringType,
            navigationState: stringType,
          },
        }
        expect(opt).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List plpContentSlot Schema',
    () => {
      const body = response.body.plpContentSlot
      const productsSchema = {
        title: 'Plp Content Slot Schema',
        required: ['records'],
        optional: ['@type'],
        properties: {
          records: arrayType(0),
          '@type': stringType,
        },
      }
      expect(body).toMatchSchema(productsSchema)
    },
    30000
  )

  it(
    'Products List plpContentSlot => records Schema',
    () => {
      response.body.plpContentSlot.records.forEach((obj) => {
        const productsSchema = {
          title: 'Plp Content Slot => Records Schema',
          required: [
            'productUrl',
            'fromSearch',
            'fromIndicator',
            'Position',
            'PageType',
            'id',
            'name',
            'url',
            'isCurrent',
            'contentForMonty',
          ],
          optional: ['plpContentSlot', 'content'],
          properties: {
            productUrl: stringType,
            fromSearch: stringType,
            plpContentSlot: objectType,
            fromIndicator: booleanType(false),
            Position: stringType,
            PageType: stringType,
            content: stringType,
            id: stringType,
            name: stringType,
            url: stringType,
            isCurrent: booleanType(false),
            contentForMonty: objectType,
          },
        }
        expect(obj).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List plpContentSlot => records => plpContentSlot',
    () => {
      response.body.plpContentSlot.records.forEach((record) => {
        if (record.plpContentSlot !== undefined) {
          const body = record.plpContentSlot
          const plpContentSlotSchema = {
            title: 'PLP Content Slot Schema',
            type: 'object',
            required: [
              'seoUrl',
              'templatePublishDate',
              'templateName',
              'baseline',
              'pagePublishedBy',
              'version',
              'pageData',
              'pageLastPublished',
              'pageName',
              'pageId',
              'contentPath',
            ],
            properties: {
              seoUrl: stringTypeEmpty,
              templatePublishDate: stringTypeEmpty,
              templateName: stringType,
              baseline: stringType,
              pagePublishedBy: stringType,
              version: stringType,
              pageData: arrayType(1),
              pageLastPublished: stringType,
              pageName: stringType,
              pageId: stringType,
              contentPath: stringType,
            },
          }
          expect(body).toMatchSchema(plpContentSlotSchema)
        }
      })
    },
    30000
  )

  it(
    'Products List plpContentSlot => records => plpContentSlot => pageData schema',
    () => {
      response.body.plpContentSlot.records.forEach((record) => {
        if (record.plpContentSlot !== undefined) {
          record.plpContentSlot.pageData.forEach((obj) => {
            const pageDataSchema = {
              title: 'Page Data Schema',
              type: 'object',
              required: ['data'],
              properties: {
                data: objectType,
              },
            }
            expect(obj).toMatchSchema(pageDataSchema)
          })
        }
      })
    },
    30000
  )

  it(
    'Products List plpContentSlot => records => plpContentSlot => pageData => data schema',
    () => {
      response.body.plpContentSlot.records.forEach((record) => {
        if (record.plpContentSlot !== undefined) {
          record.plpContentSlot.pageData.forEach((obj) => {
            const body = obj.data
            const dataSchema = {
              title: 'Data Schema in pageData',
              type: 'object',
              required: ['assets'],
              properties: {
                assets: arrayType(1),
              },
            }
            expect(body).toMatchSchema(dataSchema)
          })
        }
      })
    },
    30000
  )

  it(
    'Products List plpContentSlot => records => plpContentSlot => pageData => data => assets schema',
    () => {
      response.body.plpContentSlot.records.forEach((record) => {
        if (record.plpContentSlot !== undefined) {
          record.plpContentSlot.pageData.forEach((obj) => {
            obj.data.assets.forEach((asset) => {
              const assetSchema = {
                title: 'Asset Schema in page data => data',
                type: 'object',
                required: ['target', 'alt', 'link', 'source'],
                properties: {
                  target: stringTypeEmpty,
                  alt: stringType,
                  link: stringTypeEmpty,
                  source: stringType,
                },
              }
              expect(asset).toMatchSchema(assetSchema)
            })
          })
        }
      })
    },
    30000
  )

  it(
    'Products List globalEspot Schema',
    () => {
      const body = response.body.globalEspot
      const globalEspotSchema = {
        title: 'Global ESpot Schema',
        required: ['EspotContents', 'EspotContents'],
        properties: {
          EspotContents: objectType,
        },
      }
      expect(body).toMatchSchema(globalEspotSchema)
    },
    30000
  )

  it(
    'Products List globalEspot => Espot Contents Schema',
    () => {
      const body = response.body.globalEspot.EspotContents
      const globalEspotSchema = {
        title: 'Global ESpot => Espot Contents',
        required: ['cmsMobileContent', 'encodedcmsMobileContent'],
        properties: {
          cmsMobileContent: objectType,
          encodedcmsMobileContent: stringType,
        },
      }
      expect(body).toMatchSchema(globalEspotSchema)
    },
    30000
  )

  it(
    'Products List globalEspot => Espot Contents => cmsMobileContent Schema',
    () => {
      const body = response.body.globalEspot.EspotContents.cmsMobileContent
      const globalEspotSchema = {
        title: 'cmsMobileContent Schema',
        required: [
          'baseline',
          'contentPath',
          'lastPublished',
          'mobileCMSUrl',
          'pageId',
          'pageName',
          'revision',
          'seoUrl',
          'breadcrumb',
          'responsiveCMSUrl',
        ],
        properties: {
          baseline: stringType,
          contentPath: stringType,
          hello: stringType,
          lastPublished: stringType,
          mobileCMSUrl: stringTypeCanBeEmpty,
          pageId: numberType,
          pageName: stringType,
          revision: stringType,
          seoUrl: stringTypeCanBeEmpty,
          breadcrumb: arrayType,
          responsiveCMSUrl: stringTypeCanBeEmpty,
        },
      }
      expect(body).toMatchSchema(globalEspotSchema)
    },
    30000
  )

  it(
    'Products List removeAllRefinement Schema',
    () => {
      const body = response.body.removeAllRefinement
      const removeAllRefinementSchema = {
        title: 'removeAllRefinement Schema',
        required: ['contentPath', 'navigationState', 'siteRootPath'],
        properties: {
          contentPath: stringType,
          navigationState: stringType,
          siteRootPath: stringType,
        },
      }
      expect(body).toMatchSchema(removeAllRefinementSchema)
    },
    30000
  )
})
