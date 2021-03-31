require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'

describe('Geo-ip-pixel', () => {
  let response
  beforeAll(async () => {
    response = await superagent.get(eps.geoIpPixel.path('GB')).set(headers)
  }, 30000)

  it('should succesfully return a response', () => {
    const body = response.body
    expect(response.status).toBe(200)
    expect(body).toBeDefined()
  })
})
