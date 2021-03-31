import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'br', key: [5146] },
  { brand: 'ev', key: [5147] },
  { brand: 'dp', key: [5145] },
  { brand: 'ms', key: [5148] },
  { brand: 'wl', key: [5149] },
  { brand: 'ts', key: [4700] },
  { brand: 'tm', key: [5144] },
]

jest.unmock('superagent')
let response

describe('Qubit', () => {
  brandKeys.forEach((obj) => {
    brandConfig.forEach((item) => {
      if (obj.brand === item.brand) {
        item.sites.forEach((site) => {
          describe(`${site.site}: Get Qubit response`, () => {
            beforeAll(async () => {
              try {
                response = await superagent.get(
                  `https://dd6zx4ibq538k.cloudfront.net/smartserve-${
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

          describe(`${site.site}: Get Qubit QTracker response`, () => {
            beforeAll(async () => {
              try {
                response = await superagent.get(
                  `https://dtxtngytz5im1.cloudfront.net/qtracker-5.0.0.min.js`
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
})
