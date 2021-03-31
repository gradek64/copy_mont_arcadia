require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import {
  headers,
  stringType,
  objectType,
  stringTypeCanBeEmpty,
  arrayType,
  stringTypeNumber,
  stringTypeTimestamp,
  booleanTypeAny,
} from '../utilis'

describe('Footers', () => {
  let response
  let pd
  beforeAll(async () => {
    response = await superagent.get(eps.footers.path).set(headers)
    pd = response.body.pageData
  }, 30000)

  it('Footers Schema', () => {
    const footers = response.body
    const footersSchema = {
      title: 'Footers Schema',
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
        'site',
        'templateName',
        'templatePublishDate',
        'type',
        'version',
      ],
      properties: {
        baseline: stringType,
        contentPath: stringType,
        pageData: arrayType,
        pageId: stringTypeNumber,
        pageLastPublished: stringTypeTimestamp,
        pageName: stringType,
        pagePublishedBy: stringType,
        seoUrl: stringTypeCanBeEmpty,
        site: stringType,
        templateName: stringType,
        templatePublishDate: stringTypeTimestamp,
        type: stringType,
        version: stringType,
      },
    }
    expect(footers).toMatchSchema(footersSchema)
  })

  it('Footers: > Page Data Schema', () => {
    pd.forEach((pageData) => {
      const pageDataScema = {
        title: 'Page Data',
        type: 'object',
        required: ['data', 'type'],
        properties: {
          data: objectType,
          type: stringType,
        },
      }
      expect(pageData).toMatchSchema(pageDataScema)
    })
  })

  it('Footers: Page Data > Data Schema', () => {
    pd.forEach((obj) => {
      const pdd = obj.data
      const PageDataData = {
        title: 'Data',
        type: 'object',
        required: ['categories', 'newsletter'],
        properties: {
          categories: arrayType,
          newsletter: arrayType,
        },
      }
      expect(pdd).toMatchSchema(PageDataData)
    })
  })

  it('Footers: => Data > Categories Schema', () => {
    pd.forEach((pdObj) => {
      pdObj.data.categories.forEach((pddObj) => {
        const categories = pddObj
        const categoriesSchema = {
          title: 'Categories',
          type: 'object',
          required: ['label', 'links'],
          properties: {
            label: stringType,
            links: arrayType,
          },
        }
        expect(categories).toMatchSchema(categoriesSchema)
      })
    })
  })

  it('Footers: => => Categories > Category Links Schema', () => {
    pd.forEach((pdObj) => {
      pdObj.data.categories.forEach((pddObj) => {
        pddObj.links.forEach((catLink) => {
          const categoryLinks = catLink
          const categoryLinksSchema = {
            title: 'Categories',
            type: 'object',
            required: ['label', 'linkUrl', 'openNewWindow'],
            properties: {
              label: stringType,
              linkUrl: stringType,
              openNewWindow: booleanTypeAny,
            },
          }
          expect(categoryLinks).toMatchSchema(categoryLinksSchema)
        })
      })
    })
  })

  it('Footers: => Data > Newsletter Schema', () => {
    pd.forEach((pdObj) => {
      const newsletter = pdObj.data.newsletter
      const newsletterSchema = {
        title: 'Newsletter',
        type: 'object',
        required: [
          'button',
          'label',
          'openNewWindow',
          'placeholder',
          'signUpUrl',
        ],
        properties: {
          button: stringType,
          label: stringType,
          openNewWindow: booleanTypeAny,
          placeholder: stringType,
          signUpUrl: stringType,
        },
      }
      expect(newsletter).toMatchSchema(newsletterSchema)
    })
  })
})
