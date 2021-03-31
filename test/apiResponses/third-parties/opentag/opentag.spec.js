import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'bruk', key: ['montyburtonukmobile'] },
  { brand: 'evuk', key: ['montyevansukmobile'] },
  { brand: 'dpuk', key: ['montydorothyperkinsukmobile'] },
  { brand: 'msuk', key: ['montymissselfridgeukmobile'] },
  { brand: 'wluk', key: ['montywallisukmobile'] },
  { brand: 'tsuk', key: ['montytopshopukmobile'] },
  { brand: 'tmuk', key: ['montytopmanukmobile'] },
]

jest.unmock('superagent')
let response

describe('Opentag Page', () => {
  brandKeys.forEach((obj) => {
    brandConfig.forEach((item) => {
      item.sites.forEach((item) => {
        if (obj.brand === item.site) {
          describe(`${obj.brand}: Get opentag response`, () => {
            beforeAll(async () => {
              try {
                response = await superagent.get(
                  `https://d3c3cq33003psk.cloudfront.net/opentag-31935-${
                    obj.key
                  }.js`
                )
              } catch (e) {
                response = e.response
              }
            }, 10000)

            it('should return status 200', () => {
              expect(response.status).toEqual(200)
            })
          })
        }
      })
    })
  })
})
