import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'br', key: ['burton', 6028] },
  { brand: 'ev', key: ['evans', 6027] },
  { brand: 'dp', key: ['dorothyperkins', 6026] },
  { brand: 'ms', key: ['missselfridge', 6029] },
  { brand: 'wl', key: ['wallis', 6030] },
]

jest.unmock('superagent')
let response

describe('BazararVoice', () => {
  describe('Bazarar Voice', () => {
    brandKeys.forEach((obj) => {
      brandConfig.forEach((item) => {
        if (obj.brand === item.brand) {
          item.sites.forEach((site) => {
            describe(`${site.site}: Get bazaarVoice response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://apps.nexus.bazaarvoice.com/${obj.key[0]}-en/${
                      obj.key[1]
                    }-en_gb/bv.js`
                  )
                } catch (e) {
                  response = e.response
                }
              }, 10000)

              it('should return status 200', () => {
                expect(response.status).toEqual(200)
              })
            })

            describe(`${site.site}: Get bazaarVoice api response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://${obj.key[0]}.ugc.bazaarvoice.com/static/${
                      obj.key[1]
                    }-en_gb/bvapi.js`
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
