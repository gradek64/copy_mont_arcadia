require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from './../routes_tests'
import { getProducts } from '../utilis/selectProducts'
import { headers, numberType, removeReqsFromSchema } from '../utilis'
import { itemsSchema } from '../pdp/sharedSchemas'

let stock
let products

describe('Products-Stock', () => {
  beforeAll(async () => {
    products = await getProducts()
    try {
      stock = await superagent
        .get(
          eps.products.productsStock.path(products.productsSimpleId.productId)
        )
        .set(headers)
    } catch (error) {
      stock = error
    }
  }, 30000)

  it('should match the expected stock schema', () => {
    const stockProductSchema = {
      ...itemsSchema,
      properties: {
        ...itemsSchema.properties,
        skuid: numberType,
      },
    }

    const prods = stock.body
    prods.forEach((obj) => {
      expect(obj).toMatchSchema(
        removeReqsFromSchema(stockProductSchema, ['sizeMapping'])
      )
    })
  })
})
