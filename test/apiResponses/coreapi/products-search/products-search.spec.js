/* eslint-disable no-unused-expressions */
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import { pathOr } from 'ramda'

import eps from '../routes_tests'
import {
  arrayType,
  booleanType,
  headers,
  numberType,
  objectType,
  stringType,
  stringTypeCanBeEmpty,
  stringTypeNumber,
  stringTypeEmpty,
  stringTypePattern,
} from '../utilis'

describe('It should return the Products Search Json Schema', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.products.productsListingPage.path)
      .query({ q: 'dresses' })
      .set(headers)
  }, 30000)

  it('Products List Search Schema', () => {
    const body = response.body
    const productsListSchema = {
      title: 'Products List Search Schema',
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
        'searchTerm',
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
        canonicalUrl: stringTypeEmpty,
        categoryDescription: stringTypeEmpty,
        categoryRefinement: objectType,
        categoryTitle: stringType,
        cmsPage: objectType,
        defaultImgType: stringType,
        globalEspot: objectType,
        plpContentSlot: objectType,
        products: arrayType(1),
        recordSpotlight: objectType,
        refinements: arrayType(1),
        searchTerm: stringType,
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
  }, 30000)

  it('Products List Search breadcrumbs Schema', () => {
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
  }, 30000)

  it('Products List Search categoryRefinement Schema', () => {
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
  }, 30000)

  it('Products List Search refinements Schema', () => {
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
  }, 30000)

  it('Products List Search Refinements => refinementOptions', () => {
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
  }, 30000)

  it('Products List Search products Schema', () => {
    response.body.products.forEach((obj) => {
      const productsSchema = {
        title: 'Products Schema',
        type: 'object',
        required: [
          'additionalAssets',
          'ageVerificationRequired',
          'assets',
          'attributes',
          'bundleProducts',
          'bundleSlots',
          'colourSwatches',
          'isBundleOrOutfit',
          'items',
          'lineNumber',
          'name',
          'productId',
          'seoUrl',
          'tpmLinks',
          'unitPrice',
          'productUrl',
          'productBaseImageUrl',
          'outfitBaseImageUrl',
        ],
        optional: ['content', 'wasWasPrice', 'wasPrice'],
        properties: {
          additionalAssets: arrayType(1),
          ageVerificationRequired: booleanType(false),
          assets: arrayType(1),
          attributes: objectType,
          bundleProducts: arrayType(),
          bundleSlots: arrayType(),
          colourSwatches: arrayType(),
          isBundleOrOutfit: booleanType(false),
          items: arrayType(),
          lineNumber: stringType,
          name: stringType,
          productId: numberType,
          seoUrl: stringType,
          tpmLinks: arrayType(),
          unitPrice: stringType,
          productUrl: stringType,
          productBaseImageUrl: stringType,
          outfitBaseImageUrl: stringType,
          wasPrice: stringTypeNumber,
          wasWasPrice: stringTypeNumber,
        },
      }
      expect(obj).toMatchSchema(productsSchema)
    })
  }, 30000)

  it('Products List Search products => assets Schema', () => {
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
  }, 30000)

  it('Products List Search products => additionalAssets Schema', () => {
    response.body.products.forEach((obj) => {
      obj.additionalAssets.forEach((objAddAssets) => {
        const assetsSchema = {
          title: 'Products => AdditionalAssets Schema',
          type: 'object',
          required: ['assetType', 'index', 'url'],
          optional: ['navigationState'],
          properties: {
            assetType: stringType,
            index: numberType,
            url: stringType,
            navigationState: stringType,
          },
        }
        expect(objAddAssets).toMatchSchema(assetsSchema)
      })
    })
  }, 30000)

  it('Products List Search sortOptions Schema', () => {
    response.body.sortOptions.forEach((opt) => {
      const productsSchema = {
        title: 'Sort Options Schema',
        type: 'object',
        required: ['label', 'value'],
        optional: ['navigationState'],
        properties: {
          label: stringType,
          value: stringType,
          navigationState: stringType,
        },
      }
      expect(opt).toMatchSchema(productsSchema)
    })
  }, 30000)

  it('Products List Search plpContentSlot Schema', () => {
    const body = response.body.plpContentSlot
    const plpContentSlotSchema = {
      title: 'Plp Content Slot Schema',
      required: ['records'],
      optional: ['type'],
      properties: {
        records: arrayType(),
        '@type': stringType,
      },
    }
    expect(body).toMatchSchema(plpContentSlotSchema)
  }, 30000)

  it('Products List Search plpContentSlot => records Schema', () => {
    response.body.plpContentSlot.records.forEach((obj) => {
      const plpContentSlotSchemaRecords = {
        title: 'Plp Content Slot => Records Schema',
        required: [
          'fromIndicator',
          'fromSearch',
          'id',
          'isCurrent',
          'name',
          'PageType',
          'Position',
          'productUrl',
          'url',
        ],
        optional: ['content', 'wasWasPrice', 'wasPrice', 'contentForMonty'],
        properties: {
          content: stringType,
          fromIndicator: booleanType(false),
          fromSearch: stringType,
          id: stringType,
          isCurrent: booleanType(false),
          name: stringType,
          PageType: stringType,
          Position: stringType,
          productUrl: stringType,
          url: stringType,
          wasPrice: stringTypeNumber,
          wasWasPrice: stringTypeNumber,
          contentForMonty: objectType,
        },
      }
      expect(obj).toMatchSchema(plpContentSlotSchemaRecords)
    })
  }, 30000)

  it('Products List Search plpContentSlot => records Schema', () => {
    response.body.plpContentSlot.records.forEach((obj) => {
      const productsSchema = {
        title: 'Plp Content Slot => Records Schema',
        required: [
          'fromIndicator',
          'fromSearch',
          'id',
          'isCurrent',
          'name',
          'PageType',
          'Position',
          'productUrl',
          'url',
        ],
        optional: ['plpContentSlot', 'content', 'contentForMonty'],
        properties: {
          content: stringType,
          fromIndicator: booleanType(false),
          fromSearch: stringType,
          id: stringType,
          isCurrent: booleanType(false),
          name: stringType,
          PageType: stringType,
          plpContentSlot: objectType,
          Position: stringType,
          productUrl: stringType,
          url: stringType,
          contentForMonty: objectType,
        },
      }
      expect(obj).toMatchSchema(productsSchema)
    })
  }, 30000)

  it('Products List Search plpContentSlot => records => plpContentSlot', () => {
    response.body.plpContentSlot.records.forEach((record) => {
      if (record.plpContentSlot !== undefined) {
        const body = record.plpContentSlot
        const plpContentSlotSchema = {
          title: 'PLP Content Slot Schema',
          type: 'object',
          required: [
            'baseline',
            'contentPath',
            'pageData',
            'pageId',
            'pageLastPublished',
            'pageName',
            'pagePublishedBy',
            'seoUrl',
            'templateName',
            'templatePublishDate',
            'version',
          ],
          properties: {
            baseline: stringType,
            contentPath: stringType,
            pageData: arrayType(1),
            pageId: stringType,
            pageLastPublished: stringType,
            pageName: stringType,
            pagePublishedBy: stringType,
            seoUrl: stringTypeEmpty,
            templateName: stringType,
            templatePublishDate: stringTypeEmpty,
            version: stringType,
          },
        }
        expect(body).toMatchSchema(plpContentSlotSchema)
      }
    })
  }, 30000)

  it('Products List Search plpContentSlot => records => plpContentSlot => pageData schema', () => {
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
  }, 30000)

  it('Products List Search plpContentSlot => records => plpContentSlot => pageData => data schema', () => {
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
  }, 30000)

  it('Products List Search plpContentSlot => records => plpContentSlot => pageData => data => assets schema', () => {
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
  }, 30000)

  it('Products List Search globalEspot Schema', () => {
    const body = response.body.globalEspot
    const globalEspotSchema = {
      title: 'Global ESpot Schema',
      required: ['EspotContents', 'EspotContents'],
      properties: {
        EspotContents: objectType,
      },
    }
    expect(body).toMatchSchema(globalEspotSchema)
  }, 30000)

  it('Products List Search globalEspot => Espot Contents Schema', () => {
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
  }, 30000)

  it('Products List Search globalEspot => Espot Contents => cmsMobileContent Schema', () => {
    const cmsMobileContent = pathOr(
      undefined,
      ['body', 'globalEspot', 'EspotContents', 'cmsMobileContent'],
      response
    )
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
    cmsMobileContent &&
      expect(cmsMobileContent).toMatchSchema(globalEspotSchema)
  }, 30000)
})
