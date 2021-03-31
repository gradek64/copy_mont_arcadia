require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import {
  headers,
  stringTypePattern,
  booleanType,
  addPropsToSchema,
} from '../utilis'
import { emailMeInStockRequest } from './email-me-stock-data'

describe('It should return the Email Me In Stock Json Schema', () => {
  let response
  let responseApp
  beforeAll(async () => {
    response = await superagent
      .get(eps.emailMeInStock.path)
      .set(headers)
      .query(emailMeInStockRequest)

    responseApp = await superagent
      .post(eps.emailMeInStockApp.path)
      .set(headers)
      .send(emailMeInStockRequest)
  }, 30000)

  const emailMeInStockSchema = {
    title: 'Email Me In Stock Schema',
    type: 'object',
    required: ['success', 'action', 'message'],
    properties: {
      success: booleanType(true),
      action: stringTypePattern(`NotifyMe`),
      message: stringTypePattern(
        `Your request has been received, and you will receive an email`
      ),
    },
  }

  it('Email Me and Notify Me In Stock Schema', () => {
    const body = response.body
    expect(body).toMatchSchema(emailMeInStockSchema)
  })

  it('Email Me and Notify Me In Stock Schema for Apps', () => {
    const body = responseApp.body

    expect(body).toMatchSchema(
      addPropsToSchema(emailMeInStockSchema, {
        action: stringTypePattern(`stockEmail`),
      })
    )
  })
})
