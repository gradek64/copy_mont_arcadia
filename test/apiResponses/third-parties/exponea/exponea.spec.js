import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

jest.unmock('superagent')
let response

describe('Exponea Type-ahead', () => {
  brandConfig.forEach((brand) => {
    brand.sites.forEach((site) => {
      describe(`${site.site}: Get exponea response`, () => {
        beforeAll(async () => {
          try {
            response = await superagent.get(
              `https://api.mktg.arcadiagroup.co.uk/js/exponea.min.js`
            )
          } catch (e) {
            response = e.response
          }
        }, 10000)

        it('should return status 200', () => {
          expect(response.status).toEqual(200)
        })
      })
    })
  })
})
