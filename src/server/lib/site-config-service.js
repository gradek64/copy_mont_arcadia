import superagent from 'superagent'
import {
  getDestinationHostFromStoreCode,
  getBodyOnWcsResponse,
} from '../api/utils'
import { info } from './logger'

const wcsConfigEndpoint = '/Config'

export default function fetchWCSSiteConfigs() {
  if (process.env.FUNCTIONAL_TESTS) {
    /**
     * this data returned is used to mock shipping/delivery dropdown data in functional tests
     */
    const body = require('../api/__mocks__/siteConfigMock').default
    return Promise.resolve(body)
  }
  /**
   * the data fetched is global across all brands and sites, and so the store
   * used is arbitrary
   */
  const storeCode = 'dpuk'
  const storeId = 12552
  const langId = -1
  const catalogId = 33053
  const hostname = getDestinationHostFromStoreCode(
    process.env.WCS_ENVIRONMENT,
    storeCode
  )
  return new Promise((resolve, reject) => {
    superagent
      .get(
        `${hostname}/webapp/wcs/stores/servlet${wcsConfigEndpoint}?storeId=${storeId}&catalogId=${catalogId}&langId=${langId}`
      )
      .end((err, res) => {
        if (err) {
          reject(err)
        } else if (!(res && res.body)) {
          reject(
            new Error(`invalid response from WCS ${wcsConfigEndpoint} endpoint`)
          )
        } else {
          const body = getBodyOnWcsResponse(res)

          info('site-config-service', {
            loggerMessage: 'Loaded WCS site configs',
          })
          resolve(body)
        }
      })
  })
}
