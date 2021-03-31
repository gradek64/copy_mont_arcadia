import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'br', key: ['burton'] },
  { brand: 'ev', key: ['evans'] },
  { brand: 'dp', key: ['dorothyperkins'] },
  { brand: 'ms', key: ['missselfridge'] },
  { brand: 'wl', key: ['wallis'] },
  { brand: 'ts', key: ['topshop'] },
  { brand: 'tm', key: ['topman'] },
]

jest.unmock('superagent')
let response

describe('Peerius Apis', () => {
  describe('Peerius Page', () => {
    brandKeys.forEach((obj) => {
      brandConfig.forEach((item) => {
        if (obj.brand === item.brand) {
          item.sites.forEach((site) => {
            describe(`${site.site}: Get Peerius peerius.page response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://${obj.key}.peerius.com/tracker/peerius.page`
                  )
                } catch (e) {
                  response = e.response
                }
              }, 10000)

              it('should return status 200', () => {
                expect(response.status).toEqual(200)
              })
            })

            describe(`${site.site}: Get Peerius tracker.page response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://${obj.key}.peerius.com/tracker/tracker.page`
                  )
                } catch (e) {
                  response = e.response
                }
              }, 10000)

              it('should return status 200', () => {
                expect(response.status).toEqual(200)
              })
            })

            describe(`${
              site.site
            }: Get Peerius trackerform.page response`, () => {
              let response

              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://${obj.key}.peerius.com/tracker/trackerform.page`
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
