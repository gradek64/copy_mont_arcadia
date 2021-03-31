require('dotenv').config()

import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

jest.unmock('superagent')
let response

describe('Google static maps ', () => {
  brandConfig.forEach((brand) => {
    brand.sites.forEach((site) => {
      describe(`${site.site}: Get google static map response`, () => {
        beforeAll(async () => {
          try {
            response = await superagent.get(
              `https://maps.googleapis.com/maps/api/staticmap?center=53.55574,-0.0632196&size=523x680&key=${
                process.env.GOOGLE_API_KEY
              }`
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
