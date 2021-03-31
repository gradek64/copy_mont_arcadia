import * as testUtils from '../../__test__/utils'
import * as configUtils from '../../../../config'

import SiteOptions from '../SiteOptions'
import * as transform from '../../transforms/siteOptions'
import wcs from '../../../../../../test/apiResponses/site-options/wcs.json'
import hapiMonty from '../../../../../../test/apiResponses/site-options/hapiMonty.json'
import mockdate from 'mockdate'

jest.mock('../../../utils')
jest.mock('../../../../config')

const execute = testUtils.buildExecutor(SiteOptions, {
  method: 'get',
})

describe('# SiteOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('# mapEndpoint', () => {
    it('should set "destinationEndpoint" property to the expected value', async () => {
      testUtils.setWCSResponse({ body: {} })
      await execute()
      testUtils.expectRequestMadeWithPartial({
        endpoint: '/webapp/wcs/stores/servlet/SiteOptions',
      })
    })
  })

  describe('# mapRequestParameters', () => {
    it('should set "query" property to the expeted value if no storeConfig available', async () => {
      testUtils.setWCSResponse({ body: {} })

      await execute()

      testUtils.expectRequestMadeWithPartial({
        query: {
          catalogId: undefined,
          langId: undefined,
          storeId: undefined,
        },
      })
    })

    it('should set "query" property to the expeted value if storeConfig is available', async () => {
      const catalogId = '33054'
      const langId = '-1'
      const siteId = 12553

      configUtils.getConfigByStoreCode.mockReturnValue({
        catalogId,
        langId,
        siteId,
      })

      testUtils.setWCSResponse({ body: {} })

      await execute()

      testUtils.expectRequestMadeWithPartial({
        query: {
          catalogId,
          langId,
          storeId: siteId,
        },
      })
    })
  })

  describe('# mapReponseBody', () => {
    it('should return the expected object', async () => {
      // Mocking the date is required as we generate the expiryYears fragment of the response.
      mockdate.set('1/1/2018')
      const spy = jest.spyOn(transform, 'default')

      testUtils.setWCSResponse({ body: wcs })

      expect(transform.default).not.toHaveBeenCalled()

      const response = await execute()

      expect(response.body).toEqual(hapiMonty)
      expect(transform.default).toHaveBeenCalled()
      expect(transform.default).toHaveBeenCalledWith(wcs)

      spy.mockRestore()
      mockdate.reset()
    })
  })
})
