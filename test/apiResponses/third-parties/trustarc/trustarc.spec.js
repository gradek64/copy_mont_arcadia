import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'br', key: ['burton.co.uk'] },
  { brand: 'ev', key: ['evans.co.uk'] },
  { brand: 'dp', key: ['dorothyperkins.com'] },
  { brand: 'ms', key: ['missselfridge.com'] },
  { brand: 'wl', key: ['wallis.co.uk'] },
  { brand: 'ts', key: ['topshop.com'] },
  { brand: 'tm', key: ['topman.com'] },
]

jest.unmock('superagent')
let response

describe('TrustArc', () => {
  brandKeys.forEach((obj) => {
    brandConfig.forEach((item) => {
      if (obj.brand === item.brand) {
        item.sites.forEach((site) => {
          if (!site.site.includes('us')) {
            describe(`${
              site.site
            }: get trustArc cookie consent response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    `https://consent.trustarc.com/notice?domain=${obj.key[0]}`
                  )
                } catch (e) {
                  response = e.response
                }
              }, 10000)

              it('should return status 200', () => {
                expect(response.status).toEqual(200)
              })
            })

            describe(`${site.site}: get trustArc asset notice response`, () => {
              beforeAll(async () => {
                try {
                  response = await superagent.get(
                    'https://consent.trustarc.com/asset/notice.js/v/v1.7-2'
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
      }
    })
  })
})
