require('dotenv').config()

import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

jest.unmock('superagent')
let response

describe('Woosmap type ahead', () => {
  brandConfig.forEach((brand) => {
    brand.sites.forEach((site) => {
      describe(`${site.site}: Get woosmap type ahead response`, () => {
        beforeAll(async () => {
          try {
            response = await superagent
              .get(
                `https://api.woosmap.com/localities/autocomplete/?components=country:GB&input=we&key=${
                  process.env.WOOSMAP_API_KEY
                }`
              )
              .set('Origin', site.url)
          } catch (e) {
            response = e.response
          }
        }, 10000)

        it('should return status 200', () => {
          expect(response.status).toEqual(200)
        })

        it('should contain access control for origin', () => {
          expect(JSON.stringify(response.request.header)).toContain(
            `Origin":"${site.url}`
          )
        })
      })
    })
  })
})
