require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import {
  headers,
  stringType,
  stringTypeNumber,
  stringTypePattern,
  booleanType,
  booleanTypeAny,
  arrayType,
  objectType,
  numberType,
} from '../utilis'

describe('It should return the Site Options Json Schema', () => {
  let response
  beforeAll(async () => {
    response = await superagent.get(eps.siteOptions.path).set(headers)
  }, 30000)

  it('Site Options Schema', () => {
    const body = response.body
    const siteOptionsSchema = {
      title: 'Site Options Schema',
      type: 'object',
      required: [
        'billingCountries',
        'billingCountryIso',
        'creditCardOptions',
        'currencyCode',
        'deliveryCountryISOs',
        'expiryMonths',
        'expiryYears',
        'titles',
        'USStates',
        'data',
        'wpcse',
        'ddp',
        'deliveryCountries',
        'ddpLandingPageUrl',
      ],
      properties: {
        billingCountries: arrayType(122, false, 'string'),
        billingCountryIso: objectType,
        creditCardOptions: arrayType(7),
        currencyCode: stringType,
        deliveryCountryISOs: arrayType(84, undefined, 'string'),
        expiryMonths: arrayType(12, undefined, 'string'),
        expiryYears: arrayType(12, undefined, 'string'),
        titles: arrayType(5, undefined, 'string'),
        USStates: arrayType(51, undefined, 'string'),
        data: objectType,
        wpcse: stringType,
        ddp: objectType,
        keywords: stringType,
        description: stringType,
        title: stringType,
        deliveryCountries: arrayType(84, undefined, 'string'),
        ddpLandingPageUrl: stringType,
      },
    }

    expect(body).toMatchSchema(siteOptionsSchema)
  })

  it('DDP product schema', () => {
    const body = response.body.ddp.ddpProduct
    const ddpSchema = {
      title: 'DDP product schema',
      type: 'object',
      required: ['ddpSkus', 'productId', 'name', 'description', 'partNumber'],
      properties: {
        ddpSkus: arrayType,
        productId: stringTypeNumber,
        name: stringTypePattern('DDP VIP Sub'),
        description: stringTypePattern('DDP VIP Sub'),
        partNumber: stringTypePattern('ARCDDP'),
      },
    }
    expect(body).toMatchSchema(ddpSchema)
  })

  it('DDP Skus schema', () => {
    const body = response.body.ddp.ddpProduct.ddpSkus
    body.forEach((obj) => {
      const ddpSkusSchema = {
        title: 'DDP Skus schema',
        type: 'object',
        required: [
          'sku',
          'default',
          'catentryId',
          'name',
          'description',
          'timePeriod',
          'unitPrice',
        ],
        optional: ['wasPrice', 'wasWasPrice'],
        properties: {
          sku: stringTypeNumber,
          default: booleanTypeAny,
          catentryId: stringTypeNumber,
          name: stringTypePattern('DDP VIP Subscription'),
          description: stringTypePattern('DDP VIP'),
          timePeriod: stringTypeNumber,
          wasPrice: numberType,
          wasWasPrice: numberType,
          unitPrice: numberType,
        },
      }
      expect(obj).toMatchSchema(ddpSkusSchema)
    })
  })

  it('Site Options Credit Card Schema', () => {
    const body = response.body.creditCardOptions
    body.forEach((obj) => {
      const cardsOptionsSchema = {
        title: 'Navigation Mobile Sub-Categories Schema',
        type: 'object',
        required: ['defaultPayment', 'label', 'value'],
        properties: {
          defaultPayment: booleanType(true),
          label: stringType,
          value: stringType,
        },
      }
      expect(obj).toMatchSchema(cardsOptionsSchema)
    })
  })
})
