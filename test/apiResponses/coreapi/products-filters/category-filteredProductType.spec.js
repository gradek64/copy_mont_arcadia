require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import { filterUrl } from './filters.data'
import {
  arrayType,
  booleanType,
  headers,
  numberType,
  objectType,
  stringType,
  stringTypeCanBeEmpty,
  stringTypeNumber,
  stringTypePattern,
} from '../utilis'

describe('Category with active refinements for Product Type (not user selected)', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.products.productsFilter.path)
      .query(filterUrl.categoryProdTypeFilters)
      .set(headers)
  }, 30000)

  it('should match category with defined "Product Type" filter', () => {
    const body = response.body
    const productsFilterSchema = {
      title: 'Products Filter Schema',
      type: 'object',
      required: [
        'activeRefinements',
        'breadcrumbs',
        'canonicalUrl',
        'categoryBanner',
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
        'shouldIndex',
        'sortOptions',
        'title',
        'totalProducts',
        'removeAllRefinement',
      ],
      properties: {
        activeRefinements: arrayType(1),
        breadcrumbs: arrayType(1),
        canonicalUrl: stringType,
        categoryBanner: objectType,
        categoryDescription: stringTypeCanBeEmpty,
        categoryRefinement: objectType,
        categoryTitle: stringType,
        cmsPage: objectType,
        defaultImgType: stringType,
        globalEspot: objectType,
        plpContentSlot: objectType,
        products: arrayType(1),
        recordSpotlight: objectType,
        refinements: arrayType(1),
        shouldIndex: booleanType,
        sortOptions: arrayType(1),
        title: stringType,
        totalProducts: numberType,
        removeAllRefinement: objectType,
      },
    }
    expect(body).toMatchSchema(productsFilterSchema)
  })

  it('should contain 2 active refinement objects', () => {
    response.body.activeRefinements.length = 2
  })

  it('should match active refinements schema', () => {
    response.body.activeRefinements.forEach((obj) => {
      const activeRefinementSchema = {
        title: 'Active Refinement Schema',
        type: 'object',
        required: [
          'ancestors',
          'count',
          'dimensionName',
          'displayName',
          'label',
          'multiSelect',
          'properties',
          'removeAction',
        ],
        properties: {
          ancestors: arrayType,
          count: numberType,
          dimensionName: stringType,
          displayName: stringType,
          label: stringType,
          multiSelect: obj.dimensionName.includes('category')
            ? booleanType(false)
            : booleanType(true),
          properties: objectType,
          removeAction: objectType,
        },
      }
      expect(obj).toMatchSchema(activeRefinementSchema)
    })
  })

  it('should contain the valid active refinement.properties', () => {
    response.body.activeRefinements.forEach((obj) => {
      if (obj.multiSelect !== true) {
        const refinementPropertiesResp = obj.properties
        const refinementProperties = {
          title: 'Refinement Properties',
          type: 'object',
          required: [
            'DisplayOrder',
            'SourceId',
            'hiddenCategory',
            'hierarchical_level',
            'refinement_name',
            'seoCategoryToken',
            'seoCommonToken',
            'seo_description',
            'seo_title',
          ],
          properties: {
            DisplayOrder: stringType,
            SourceId: stringType,
            hiddenCategory: stringTypeNumber,
            hierarchical_level: stringType,
            refinement_name: stringType,
            seoCategoryToken: stringType,
            seoCommonToken: stringType,
            seo_description: stringType,
            seo_title: stringType,
          },
        }
        expect(refinementPropertiesResp).toMatchSchema(refinementProperties)
      } else {
        const refinementPropertiesResp = obj.properties
        const refinementProperties = {
          title: 'Refinement Properties',
          type: 'object',
          required: ['DisplayOrder', 'SourceId', 'refinement_name'],
          properties: {
            DisplayOrder: stringType,
            SourceId: stringType,
            refinement_name: stringType,
          },
        }
        expect(refinementPropertiesResp).toMatchSchema(refinementProperties)
      }
    })
  })

  it('should contain the valid active refinement.removeAction', () => {
    response.body.activeRefinements.forEach((obj) => {
      const removeActionResp = obj.removeAction
      const removeAction = {
        title: 'Remove Action',
        type: 'object',
        required: [
          'contentPath',
          'navigationState',
          'siteRootPath',
          'siteState',
        ],
        properties: {
          contentPath: stringType,
          navigationState: stringType,
          siteRootPath: stringType,
          siteState: objectType,
        },
      }
      expect(removeActionResp).toMatchSchema(removeAction)
      const siteStateRest = removeActionResp.siteState
      const siteState = {
        title: 'Site State',
        type: 'object',
        required: ['@class', 'contentPath', 'properties', 'siteId'],
        properties: {
          '@class': stringType,
          contentPath: stringType,
          properties: objectType,
          siteId: stringType,
        },
      }
      expect(siteStateRest).toMatchSchema(siteState)
    })
  })

  it('should contain an array of valid refinements', () => {
    const refinementLabels = [
      'Brands',
      'Product Type',
      'Colour',
      'Size',
      'Accessories',
      'Gifts & Novelty Style',
      'Price',
    ]

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
      expect(refinementLabels).toContain(obj.label)
    })
  })
})

describe('Category defined product type and user selected refinements schema', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.products.productsFilter.path)
      .query(filterUrl.prodTypeAndUserColourFilters)
      .set(headers)
  }, 30000)

  it('should list user selected "Colour" filters', () => {
    let refinementOptions
    response.body.refinements.forEach((item) => {
      item.refinementOptions.forEach((refItem) => {
        if (item.label.includes('Price')) {
          refinementOptions = {
            title: 'Refinement Options Schema',
            type: 'object',
            required: ['type', 'minValue', 'maxValue'],
            properties: {
              type: stringTypePattern('RANGE'),
              minValue: stringTypeNumber,
              maxValue: stringTypeNumber,
            },
          }
        } else {
          refinementOptions = {
            title: 'Refinement Options Schema',
            type: 'object',
            required: ['count', 'label', 'seoUrl', 'type', 'value'],
            optional: ['selectedFlag'],
            properties: {
              count: numberType,
              label: stringType,
              selectedFlag: item.label.includes('Colour')
                ? booleanType(true)
                : undefined,
              seoUrl: stringType,
              type: stringType,
              value: stringType,
            },
          }
        }
        expect(refItem).toMatchSchema(refinementOptions)
      })
    })
  })
})

describe('Category with price refinements schema', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.products.productsFilter.path)
      .query(filterUrl.categoryUserPriceFilters)
      .set(headers)
  }, 30000)

  it('should list user selected "Price" filters', () => {
    let refinementOptions
    response.body.refinements.forEach((item) => {
      item.refinementOptions.forEach((refItem) => {
        if (item.label.includes('Price')) {
          refinementOptions = {
            title: 'Refinement Options Schema',
            type: 'object',
            required: ['type', 'minValue', 'maxValue'],
            properties: {
              type: stringTypePattern('RANGE'),
              minValue: stringTypeNumber,
              maxValue: stringTypeNumber,
            },
          }
          expect(refItem).toMatchSchema(refinementOptions)
        }
      })
    })
  })

  it('should match active refinement price selection response', () => {
    response.body.activeRefinements.forEach((obj) => {
      if (obj.propertyName === 'nowPrice') {
        const refinementPriceProperties = {
          title: 'Refinement Price Properties',
          type: 'object',
          required: [
            'propertyName',
            'operation',
            'removeAction',
            'name',
            'upperBound',
            'lowerBound',
          ],
          properties: {
            propertyName: stringType,
            operation: stringTypePattern('BTWN'),
            removeAction: objectType,
            name: stringTypePattern('nowPrice'),
            upperBound: stringTypePattern('160.0'),
            lowerBound: stringTypePattern('11.0'),
          },
        }
        expect(obj).toMatchSchema(refinementPriceProperties)
      }
    })
  })
})
