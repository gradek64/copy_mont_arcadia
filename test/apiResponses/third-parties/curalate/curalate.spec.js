import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'ms', key: ['missselfridge', '-348/gallery'] },
  { brand: 'ts', key: ['topshopstyle', '-1579/carousel'] },
  { brand: 'tm', key: ['topman', '-1826/carousel'] },
]

jest.unmock('superagent')
let response

describe('Curalate', () => {
  describe('Curalate carousel', () => {
    brandKeys.forEach((obj) => {
      brandConfig.forEach((item) => {
        if (obj.brand === item.brand) {
          item.sites.forEach((site) => {
            describe(`${site.site}: Get curalate carousel response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://d116tqlcqfmz3v.cloudfront.net/${obj.key[0]}${
                      obj.key[1]
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

            describe(`${site.site}: Get curalate fanreel response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://api.curalate.com/js-min/fanreel-gallery-impl.min.js`
                  )
                } catch (e) {
                  response = e.response
                }
              }, 10000)

              it('should return status 200', () => {
                expect(response.status).toEqual(200)
              })
            })

            describe(`${site.site}: Get curalate reels response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://api.curalate.com/v1/reels/${obj.key[0]}.jsonp`
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
})
