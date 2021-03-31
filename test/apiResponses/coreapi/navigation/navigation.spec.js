require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import { isAbsoluteUrl } from '../../../../src/shared/lib/url-utils'

import eps from '../routes_tests'
import {
  headers,
  stringType,
  stringTypeCanBeEmpty,
  numberType,
  arrayType,
  objectType,
  booleanTypeAny,
} from '../utilis'

describe('It should return the Navigation Json Schema', () => {
  describe('Mobile Navigation', () => {
    let response
    beforeAll(async () => {
      response = await superagent.get(eps.navigation.mobile.path).set(headers)
    }, 60000)

    it('Mobile Navigation Schema', () => {
      response.body.forEach((obj) => {
        const mobCategoriesSchema = {
          title: 'Navigation Mobile Schema',
          type: 'object',
          required: [
            'navigationEntryType',
            'index',
            'label',
            'categoryId',
            'categoryFilter',
            'seoUrl',
            'navigationEntries',
          ],
          optional: ['redirectionUrl'],
          properties: {
            navigationEntryType: stringType,
            index: numberType,
            label: stringType,
            categoryId: numberType,
            categoryFilter: stringType,
            seoUrl: stringType,
            redirectionUrl: stringType,
            navigationEntries: arrayType(0),
          },
        }
        expect(obj).toMatchSchema(mobCategoriesSchema)
      })
    })

    it('Mobile Navigation navigationEntries Schema', () => {
      response.body.forEach((obj) => {
        obj.navigationEntries.forEach((subObj) => {
          const mobSubCategoriesSchema = {
            title: 'Navigation Mobile Sub-NavigationEntries Schema',
            type: 'object',
            required: [
              'navigationEntryType',
              'index',
              'label',
              'categoryId',
              'categoryFilter',
              'seoUrl',
              'navigationEntries',
            ],
            optional: ['canonicalUrl', 'redirectionUrl'],
            properties: {
              navigationEntryType: stringType,
              index: numberType,
              label: stringType,
              categoryId: numberType,
              categoryFilter: stringType,
              canonicalUrl: stringType,
              seoUrl: stringType,
              redirectionUrl: stringType,
              navigationEntries: arrayType(0),
            },
          }
          expect(subObj).toMatchSchema(mobSubCategoriesSchema)
        })
      })
    })
  })

  describe('Desktop Navigation', () => {
    let response
    beforeAll(async () => {
      response = await superagent.get(eps.navigation.desktop.path).set(headers)
    })

    it('Desktop Navigation Schema', () => {
      const body = response.body
      const desNavigationSchema = {
        title: 'Navigation Desktop Schema',
        type: 'object',
        required: [
          'categories',
          'globalEspot',
          'headerEspot',
          'montyHeaderEspot',
          'keywords',
          'description',
          'title',
        ],
        properties: {
          categories: arrayType(1),
          globalEspot: objectType,
          headerEspot: objectType,
          montyHeaderEspot: objectType,
          keywords: stringType,
          description: stringType,
          title: stringType,
        },
      }
      expect(body).toMatchSchema(desNavigationSchema)
    })

    it('Desktop Navigation categories Schema', () => {
      const body = response.body.categories
      body.forEach((obj) => {
        const desNavigationSchema = {
          title: 'Navigation Desktop Categories Schema',
          type: 'object',
          required: ['categoryId', 'url', 'label', 'redirectionUrl'],
          optional: [
            'totalcolumns',
            'columns',
            'paddingTop',
            'isHidden',
            'bold',
            'sale',
          ],
          properties: {
            categoryId: stringType,
            label: stringType,
            url: stringType,
            redirectionUrl: stringTypeCanBeEmpty,
            totalcolumns: numberType,
            columns: arrayType(),
            paddingTop: stringTypeCanBeEmpty,
            isHidden: booleanTypeAny,
            bold: booleanTypeAny,
            sale: booleanTypeAny,
          },
        }
        expect(obj).toMatchSchema(desNavigationSchema)
      })
    })
    it('Desktop Navigation categories => columns Schema', () => {
      response.body.categories.forEach((category) => {
        // eslint-disable-next-line no-unused-expressions
        category.columns &&
          category.columns.forEach((column) => {
            const columnsSchema = {
              title: 'Navigation Desktop Columns Schema',
              type: 'object',
              required: ['span', 'subcategories'],
              properties: {
                span: stringType,
                subcategories: arrayType(1),
              },
            }
            expect(column).toMatchSchema(columnsSchema)
          })
      })
    })

    it('Desktop Navigation categories => subCategories Schema', () => {
      response.body.categories.forEach((category) => {
        // eslint-disable-next-line no-unused-expressions
        category.columns &&
          category.columns.forEach((column) => {
            column.subcategories.forEach((subCat) => {
              Object.keys(subCat).forEach((subCatHeader) => {
                subCat[subCatHeader].forEach((subCatItem) => {
                  const subcategoriesSchema = {
                    title: 'SKU schema in Product Data Quantity',
                    type: 'object',
                    required: ['categoryId', 'url', 'label', 'redirectionUrl'],
                    optional: [
                      'paddingTop',
                      'isHidden',
                      'bold',
                      'sale',
                      'image',
                    ],
                    properties: {
                      categoryId: stringType,
                      url: stringType,
                      label: stringType,
                      redirectionUrl: stringTypeCanBeEmpty,
                      paddingTop: stringTypeCanBeEmpty,
                      isHidden: booleanTypeAny,
                      bold: booleanTypeAny,
                      sale: booleanTypeAny,
                      image: objectType,
                    },
                  }
                  expect(subCatItem).toMatchSchema(subcategoriesSchema)
                })
              })
            })
          })
      })
    })

    it('Desktop Navigation categories => subCategory Image Schema', () => {
      response.body.categories.forEach((category) => {
        // eslint-disable-next-line no-unused-expressions
        category.columns &&
          category.columns.forEach((column) => {
            column.subcategories.forEach((subCat) => {
              Object.keys(subCat).forEach((subCatHeader) => {
                subCat[subCatHeader].forEach((subCatItem) => {
                  const imgProps = {
                    title: 'SKU schema in Product Data Quantity',
                    type: 'object',
                    required: [
                      'width',
                      'openNewWindow',
                      'height',
                      'span',
                      'url',
                    ],
                    properties: {
                      width: numberType,
                      openNewWindow: booleanTypeAny,
                      height: numberType,
                      span: stringType,
                      url: stringType,
                    },
                  }
                  // eslint-disable-next-line no-unused-expressions
                  subCatItem.image &&
                    expect(subCatItem.image).toMatchSchema(imgProps)
                })
              })
            })
          })
      })
    })

    it('Desktop Navigation categories => url relative links always have relative path ', () => {
      const regexRelativePath = new RegExp('^\\/')

      response.body.categories.forEach((category) => {
        if (!isAbsoluteUrl(category)) {
          expect(category.url).toMatch(regexRelativePath)
        }
        // eslint-disable-next-line no-unused-expressions
        category.columns &&
          category.columns.forEach((column) => {
            column.subcategories.forEach((subCat) => {
              Object.keys(subCat).forEach((subCatHeader) => {
                subCat[subCatHeader].forEach((subCatItem) => {
                  if (!isAbsoluteUrl(subCatItem.url)) {
                    expect(category.url).toMatch(regexRelativePath)
                  }
                })
              })
            })
          })
      })
    })
  })
})
