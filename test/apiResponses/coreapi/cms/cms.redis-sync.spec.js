import chai from 'chai'

chai.use(require('chai-json-schema'))

import { getCmsPageName, getCmsSeo } from './cms'
import { getResponseAndSessionCookies } from '../utilis/redis'

describe('CMS', () => {
  describe('cmsPageName', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const test = await getCmsPageName('eReceipts')
        const { responseCookies, session } = await getResponseAndSessionCookies(
          test
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('cms Json response', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const test = await getCmsSeo(
          '/en/tsuk/category/your-details-5655887/e-receipts-5651062'
        )
        const { responseCookies, session } = await getResponseAndSessionCookies(
          test
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })
})
