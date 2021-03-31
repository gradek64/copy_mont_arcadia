require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import chai from 'chai'

chai.use(require('chai-json-schema'))

const assert = chai.assert
import eps from '../routes_tests'
import {
  headers,
  stringType,
  stringTypeEmpty,
  stringTypePattern,
  numberType,
  booleanType,
  objectType,
  arrayType,
  stringTypeCanBeEmpty,
  booleanTypeAny,
  categorySeo,
} from '../utilis'

describe('It should return the Products SEO Json Schema', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.products.productsListingSEO.path)
      .query({ seoUrl: categorySeo })
      .set(headers)
  }, 30000)

  it(
    'Products List SEO Schema',
    () => {
      const body = response.body
      const productsListSchema = {
        title: 'Products List SEO Schema',
        type: 'object',
        required: [
          'breadcrumbs',
          'categoryRefinement',
          'refinements',
          'canonicalUrl',
          'categoryBanner',
          'cmsPage',
          'products',
          'categoryTitle',
          'categoryDescription',
          'totalProducts',
          'sortOptions',
          'plpContentSlot',
          'recordSpotlight',
          'activeRefinements',
          'globalEspot',
          'defaultImgType',
          'title',
          'shouldIndex',
          'removeAllRefinement',
        ],
        properties: {
          breadcrumbs: arrayType(1),
          categoryRefinement: objectType,
          refinements: arrayType(1),
          canonicalUrl: stringType,
          categoryBanner: objectType,
          cmsPage: objectType,
          products: arrayType(1),
          categoryTitle: stringTypePattern('T-Shirts'),
          categoryDescription: stringTypeCanBeEmpty,
          totalProducts: numberType,
          sortOptions: arrayType(1),
          plpContentSlot: objectType,
          recordSpotlight: objectType,
          activeRefinements: arrayType(1),
          globalEspot: objectType,
          defaultImgType: stringTypePattern('Outfit'),
          title: 'T-Shirts | Clothing | Topshop',
          shouldIndex: booleanTypeAny,
          removeAllRefinement: objectType,
        },
      }
      expect(body).toMatchSchema(productsListSchema)
    },
    30000
  )

  it(
    'Products List SEO breadcrumbs Schema',
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
            required: ['label', 'url'],
            properties: {
              label: stringType,
              url: stringTypePattern('/'),
            },
          }
          expect(obj).toMatchSchema(productsBreadCrumbsSchema)
        }
      })
    },
    30000
  )

  it(
    'Products List SEO categoryRefinement Schema',
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
    'Products List SEO categoryRefinement => refinementOptions Schema',
    () => {
      const obj = response.body.categoryRefinement.refinementOptions
      expect(obj).toEqual([])
    },
    30000
  )

  it(
    'Products List SEO refinements Schema',
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
    'Products List SEO Refinements => refinementOptions',
    () => {
      response.body.refinements.forEach((refinement) => {
        refinement.refinementOptions.forEach((obj) => {
          const refinementOptionSchema = {
            title: 'Refinement Options Schema',
            type: 'object',
            required: ['type'],
            optional: [
              'label',
              'value',
              'count',
              'seoUrl',
              'minValue',
              'maxValue',
            ],
            properties: {
              type:
                obj.label != null
                  ? stringTypePattern('VALUE')
                  : stringTypePattern('RANGE'),
              label: stringType,
              value: stringType,
              count: numberType,
              seoUrl: stringType,
              minValue: stringType,
              maxValue: stringType,
            },
          }
          expect(obj).toMatchSchema(refinementOptionSchema)
        })
      })
    },
    30000
  )

  it(
    'Products List SEO products Schema',
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
            'productUrl',
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
            'productBaseImageUrl',
            'outfitBaseImageUrl',
          ],
          optional: ['wasWasPrice', 'wasPrice'],
          properties: {
            wasWasPrice: stringType,
            wasPrice: stringType,
            productId: numberType,
            lineNumber: stringType,
            name: stringType,
            unitPrice: stringType,
            productUrl: stringType,
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
    'Products List SEO products => assets Schema',
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
    'Products List SEO products => additionalAssets Schema',
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
    'Products List SEO sortOptions Schema',
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
    'Products List SEO plpContentSlot Schema',
    () => {
      const body = response.body.plpContentSlot
      const productsSchema = {
        title: 'Plp Content Slot Schema',
        required: ['records'],
        optional: ['@type'],
        properties: {
          records: arrayType(),
          '@type': stringType,
        },
      }
      expect(body).toMatchSchema(productsSchema)
    },
    30000
  )

  it(
    'Products List SEO plpContentSlot => records Schema',
    () => {
      response.body.plpContentSlot.records.forEach((obj) => {
        const productsSchema = {
          title: 'Plp Content Slot => Records Schema',
          required: [
            'productUrl',
            'contentForMonty',
            'fromSearch',
            'fromIndicator',
            'Position',
            'PageType',
            'id',
            'name',
            'url',
            'isCurrent',
          ],
          optional: ['content'],
          properties: {
            productUrl: stringType,
            contentForMonty: objectType,
            fromSearch: stringType,
            fromIndicator: booleanType(false),
            Position: stringType,
            PageType: stringType,
            content: stringType,
            id: stringType,
            name: stringType,
            url: stringType,
            isCurrent: booleanType(false),
          },
        }
        expect(obj).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO plpContentSlot => records => contentMonty Schema ',
    () => {
      response.body.plpContentSlot.records.forEach((obj) => {
        const productsSchema = {
          title: 'Plp Content Slot => Records => Content For Monty Schema',
          type: 'object',
          required: ['members'],
          properties: { members: objectType },
        }
        expect(obj.contentForMonty).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO plpContentSlot => records => contentMonty => members Schema ',
    () => {
      response.body.plpContentSlot.records.forEach((obj) => {
        const productsSchema = {
          title: 'Plp Content Slot => Records => Content For Monty Schema',
          type: 'object',
          required: ['encodedcmsMobileContent', 'cmsMobileContent'],
          properties: {
            encodedcmsMobileContent: stringType,
            cmsMobileContent: objectType,
          },
        }
        expect(obj.contentForMonty.members).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO plpContentSlot => records => contentMonty => members => cmsMobileContent Schema ',
    () => {
      response.body.plpContentSlot.records.forEach((obj) => {
        const productsSchema = {
          title: 'Plp Content Slot => Records => Content For Monty Schema',
          type: 'object',
          required: [
            'seoUrl',
            'breadcrumb',
            'baseline',
            'lastPublished',
            'mobileCMSUrl',
            'pageId',
            'pageName',
            'responsiveCMSUrl',
            'revision',
            'contentPath',
          ],
          properties: {
            seoUrl: stringTypeCanBeEmpty,
            breadcrumb: stringTypeCanBeEmpty,
            baseline: stringType,
            lastPublished: stringType,
            mobileCMSUrl: stringTypeCanBeEmpty,
            pageId: numberType,
            pageName: stringType,
            responsiveCMSUrl: stringTypeCanBeEmpty,
            revision: stringType,
            contentPath: stringType,
          },
        }
        expect(obj.contentForMonty.members.cmsMobileContent).toMatchSchema(
          productsSchema
        )
      })
    },
    30000
  )

  it(
    'Products List SEO plpContentSlot => records => plpContentSlot',
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
    'Products List SEO plpContentSlot => records => plpContentSlot => pageData schema',
    () => {
      response.body.plpContentSlot.records.forEach((record) => {
        if (record.plpContentSlot !== undefined) {
          record.plpContentSlot.pageData.forEach((obj) => {
            const pageDataSchema = {
              title: 'Page Data Schema',
              type: 'object',
              required: ['data', 'type'],
              properties: {
                data: objectType,
                type: stringType,
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
    'Products List SEO plpContentSlot => records => plpContentSlot => pageData => data schema',
    () => {
      response.body.plpContentSlot.records.forEach((record) => {
        if (record.plpContentSlot !== undefined) {
          record.plpContentSlot.pageData.forEach((obj) => {
            const body = obj.data
            const dataSchema = {
              title: 'Data Schema in pageData',
              type: 'object',
              required: ['assets', 'columns'],
              properties: {
                assets: arrayType(1),
                columns: numberType,
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
    'Products List SEO plpContentSlot => records => plpContentSlot => pageData => data => assets schema',
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
    'Products List SEO activeRefinements Schema',
    () => {
      response.body.activeRefinements.forEach((obj) => {
        const productsSchema = {
          title: 'ActiveRefinements Schema',
          required: [
            'ancestors',
            'dimensionName',
            'properties',
            'label',
            'multiSelect',
            'removeAction',
            'displayName',
            'count',
          ],
          properties: {
            ancestors: arrayType(1),
            dimensionName: stringType,
            properties: objectType,
            label: stringTypePattern('T-Shirts'),
            multiSelect: booleanTypeAny,
            removeAction: objectType,
            displayName: stringType,
            count: numberType,
          },
        }
        expect(obj).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO activeRefinements => ancestors Schema',
    () => {
      response.body.activeRefinements.forEach((obj) => {
        const productsSchema = {
          title: 'ActiveRefinements Ancestors Schema',
          type: 'array',
          required: [
            'properties',
            'label',
            'navigationState',
            'contentPath',
            'siteRootPath',
          ],
          properties: {
            properties: objectType,
            label: stringType,
            navigationState: stringType,
            contentPath: stringType,
            siteRootPath: stringType,
          },
        }
        assert.jsonSchema(obj.ancestors, productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO activeRefinements => properties Schema',
    () => {
      response.body.activeRefinements.forEach((obj) => {
        const productsSchema = {
          title: 'ActiveRefinements properties Schema',
          required: [
            'SourceId',
            'catNavigationState',
            'hiddenCategory',
            'DisplayOrder',
            'hierarchical_level',
            'seoCategoryToken',
            'refinement_name',
            'catpath_name',
          ],
          properties: {
            SourceId: stringType,
            catNavigationState: stringType,
            hiddenCategory: stringType,
            DisplayOrder: stringType,
            hierarchical_level: stringType,
            seoCategoryToken: stringType,
            refinement_name: stringType,
            catpath_name: stringType,
          },
        }
        expect(obj.properties).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO activeRefinements => removeAction Schema',
    () => {
      response.body.activeRefinements.forEach((obj) => {
        const productsSchema = {
          title: 'ActiveRefinements removeAction Schema',
          required: [
            'siteState',
            'navigationState',
            'contentPath',
            'siteRootPath',
          ],
          properties: {
            siteState: objectType,
            navigationState: stringType,
            contentPath: stringType,
            siteRootPath: stringType,
          },
        }
        expect(obj.removeAction).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO activeRefinements => removeAction => siteState Schema',
    () => {
      response.body.activeRefinements.forEach((obj) => {
        const productsSchema = {
          title: 'ActiveRefinements removeAction siteState Schema',
          required: ['siteId', 'properties', 'contentPath', '@class'],
          properties: {
            siteId: stringType,
            properties: objectType,
            contentPath: stringType,
            '@class': stringType,
          },
        }
        expect(obj.removeAction.siteState).toMatchSchema(productsSchema)
      })
    },
    30000
  )

  it(
    'Products List SEO globalEspot Schema',
    () => {
      const body = response.body.globalEspot
      const globalEspotSchema = {
        title: 'Global ESpot Schema',
        required: ['EspotContents'],
        properties: {
          EspotContents: objectType,
        },
      }
      expect(body).toMatchSchema(globalEspotSchema)
    },
    30000
  )

  it(
    'Products List SEO globalEspot => Espot Contents Schema',
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
    'Products List SEO globalEspot => Espot Contents => cmsMobileContent Schema',
    () => {
      const body = response.body.globalEspot.EspotContents.cmsMobileContent
      const globalEspotSchema = {
        title: 'cmsMobileContent Schema',
        required: [
          'pageId',
          'pageName',
          'breadcrumb',
          'baseline',
          'revision',
          'lastPublished',
          'contentPath',
          'seoUrl',
          'mobileCMSUrl',
          'responsiveCMSUrl',
        ],
        properties: {
          pageId: numberType,
          pageName: stringType,
          baseline: stringType,
          breadcrumb: stringTypeCanBeEmpty,
          revision: stringType,
          lastPublished: stringType,
          contentPath: stringType,
          seoUrl: stringTypeCanBeEmpty,
          hello: stringType,
          mobileCMSUrl: stringTypeCanBeEmpty,
          responsiveCMSUrl: stringTypeCanBeEmpty,
        },
      }
      expect(body).toMatchSchema(globalEspotSchema)
    },
    30000
  )
})
