import superagent from 'superagent'
import { brandConfig } from '../brandUrlConfig'

const brandKeys = [
  { brand: 'bruk', key: ['burton'] },
  { brand: 'dpuk', key: ['dorothyperkins'] },
  { brand: 'msuk', key: ['missselfridge'] },
]

jest.unmock('superagent')
let response

describe('NewDay Apis', () => {
  brandKeys.forEach((obj) => {
    brandConfig.forEach((item) => {
      item.sites.forEach((item) => {
        if (obj.brand === item.site) {
          describe(`${item.site}: Get iframed content response`, () => {
            beforeAll(async () => {
              try {
                response = await superagent.get(
                  `https://${obj.key}.datacapture.newdaycards.com/`
                )
              } catch (e) {
                response = e.response
              }
            }, 10000)

            it('should return status 200', () => {
              expect(response.status).toEqual(200)
            })
          })

          describe(`${item.site}: Get brand iframe script response`, () => {
            beforeAll(async () => {
              try {
                response = await superagent.get(
                  `https://${
                    obj.key
                  }.datacapture.newdaycards.com/scripts/main?v=lC5DC0TndIQAPNQb9ScXxcuBKaTsxK6TXSmAl8Donj01`
                )
              } catch (e) {
                response = e.response
              }
            }, 10000)

            it('should return status 200', () => {
              expect(response.status).toEqual(200)
            })
          })

          describe(`${item.site}: Get iframe script response response`, () => {
            beforeAll(async () => {
              try {
                response = await superagent.get(
                  `https://az416426.vo.msecnd.net/scripts/a/ai.0.js`
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
