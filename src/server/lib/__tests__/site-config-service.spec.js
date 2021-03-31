import nock from 'nock'
import fetchWCSSiteConfigs from '../site-config-service'
import * as apiUtils from '../../api/utils'

jest.spyOn(apiUtils, 'getDestinationHostFromStoreCode')

describe('fetchWCSSiteConfigs', () => {
  beforeEach(() => {
    apiUtils.getDestinationHostFromStoreCode.mockReturnValue('https://wcs.com')
    process.env.FUNCTIONAL_TESTS = ''
  })

  afterEach(nock.cleanAll)

  describe('if the request is unsuccessful', () => {
    it('should propagate the error', async () => {
      const fakeErrorBody = { message: 'no configs 4 u m8' }
      nock('https://wcs.com')
        .get(
          '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
        )
        .reply(401, fakeErrorBody)
      expect.assertions(2)
      return fetchWCSSiteConfigs().catch((err) => {
        expect(err.status).toBe(401)
        expect(err.response.body).toEqual(fakeErrorBody)
      })
    })
  })

  describe('if the request is successful', () => {
    it('should return the response body', async () => {
      const responseBody = { siteConfigs: [1, 2, 3] }
      nock('https://wcs.com')
        .get(
          '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
        )
        .reply(200, responseBody)
      expect.assertions(1)
      return fetchWCSSiteConfigs().then((body) => {
        expect(body).toEqual(responseBody)
      })
    })

    describe('WCS response is unparsed', () => {
      it('should parse the text property', () => {
        const responseBody = { siteConfigs: [1, 2, 3] }
        nock('https://wcs.com')
          .get(
            '/webapp/wcs/stores/servlet/Config?storeId=12552&catalogId=33053&langId=-1'
          )
          .reply(200, JSON.stringify(responseBody), {
            'Content-Type': 'text/plain',
          })
        expect.assertions(1)
        return fetchWCSSiteConfigs().then((body) => {
          expect(body).toEqual(responseBody)
        })
      })
    })
  })
})
