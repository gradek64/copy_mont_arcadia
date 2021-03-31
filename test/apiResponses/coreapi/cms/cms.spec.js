import chai from 'chai'

chai.use(require('chai-json-schema'))

import { getCmsPageName, getCmsSeo } from './cms'

describe('CMS', () => {
  it(
    'should return the cms pageName',
    async () => {
      const test = await getCmsPageName('eReceipts')
      expect(test.statusCode).toEqual(200)
      expect(typeof test.body).toEqual('object')
    },
    30000
  )

  it(
    'should return the cms Json response',
    async () => {
      const test = await getCmsSeo(
        '/en/tsuk/category/your-details-5655887/e-receipts-5651062'
      )
      expect(test.statusCode).toEqual(200)
      expect(typeof test.body).toEqual('object')
    },
    30000
  )
})
