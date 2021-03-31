require('dotenv').config()

import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

jest.unmock('superagent')
let response

describe('NewRelic', () => {
  brandConfig.forEach((brand) => {
    brand.sites.forEach((site) => {
      describe(`${site.site}: Get NewRelic agent response`, () => {
        beforeAll(async () => {
          try {
            response = await superagent.get(
              `https://js-agent.newrelic.com/nr-spa-1123.min.js`
            )
          } catch (e) {
            response = e.response
          }
        }, 10000)

        it('should return status 200', () => {
          expect(response.status).toEqual(200)
        })
      })

      describe(`${site.site}: Get NewRelic data response`, () => {
        beforeAll(async () => {
          try {
            response = await superagent.get(
              `https://bam.nr-data.net/1/855b9b9217?a=93373114`
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
