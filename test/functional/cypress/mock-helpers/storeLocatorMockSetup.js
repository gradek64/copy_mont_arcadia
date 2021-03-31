import routes from '../constants/routes'
import defaultStores from '../fixtures/general/storeLocator.json'
import { setUpMocksForRouteList } from '../lib/helpers'

export default class storeLocatorMocks {
  mocksForStoreLocator = (response = defaultStores, query) => {
    const strLocRoutes = [
      {
        method: 'GET',
        url: routes.storeLocator(query),
        response,
        alias: 'get-stores',
      },
    ]
    setUpMocksForRouteList(strLocRoutes)
  }
}

/**
 * Allow to stub and mock the function for geoLocation
 * @param latitude
 * @param longitude
 * @returns {{onBeforeLoad(*): void}}
 */
export function getFakeGPSLocation(
  { latitude, longitude } = {},
  errorCode = 1
) {
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition', (cb, err) => {
        if (latitude && longitude) {
          return cb({ coords: { latitude, longitude } })
        }
        throw err({ code: errorCode }) // 1: rejected, 2: unable, 3: timeout
      })
    },
  }
}
