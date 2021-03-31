import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

jest.unmock('superagent')

describe('Dressipi', () => {
  brandConfig.forEach((item) => {
    if (item.brand === 'ts') {
      item.sites.forEach((site) => {
        describe(`${site.site}: Get dressipi response`, () => {
          let response

          beforeAll(async () => {
            try {
              response = await superagent.get(
                `https://dressipi-production.topshop.com/widgets/track?product_code=noproduct`
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
    }
  })
})
