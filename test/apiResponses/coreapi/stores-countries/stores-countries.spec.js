jest.unmock('superagent')

import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'

describe('It should return the Site Options Json Schema', () => {
  let response
  beforeAll(async () => {
    try {
      response = await superagent
        .get(eps.storeLocator.storeCountries.path)
        .set(headers)
        .query('brandPrimaryEStoreId=12556')
    } catch (e) {
      response = e
    }
  }, 30000)

  it('should return an array of countries that includes "United Kingdom"', () => {
    expect(response.body).toEqual(expect.arrayContaining(['United Kingdom']))
  })
})
