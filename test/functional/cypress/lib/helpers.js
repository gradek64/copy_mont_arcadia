import { path } from 'ramda'
import { concatRoutes } from '../../mock-server/routes'
import routes from '../constants/routes'

export const isMobileLayout = () => Cypress.env('BREAKPOINT') === 'mobile'
export const isDesktopLayout = () => Cypress.env('BREAKPOINT') !== 'mobile'

export const removeDomainFromFullLink = (fullLink) => {
  const matches = /http(s)?:\/\/(?:.*?)(\/.+)$/.exec(fullLink)
  return matches[2]
}

export const setViewport = () => {
  if (isMobileLayout()) cy.viewport('iphone-6')
}

export const ifFeature = (feature) =>
  cy.window().then((window) => {
    const isEnabled = window.__qubitStore.getState().features.status[feature]
    return !!isEnabled
  })

export const setFeature = (feature, value = true) => {
  cy.window().then((window) => {
    const isEnabled = window.__qubitStore.getState().features.status[feature]

    if (value) {
      if (isEnabled) return cy.log(`${feature} is already turned on`)
      window.__qubitStore.dispatch({
        type: 'SET_FEATURE_STATE',
        feature,
        value,
      })
      cy.log(`${feature} has been turned on`)
    } else {
      if (!isEnabled) return cy.log(`${feature} is already turned off`)
      window.__qubitStore.dispatch({
        type: 'SET_FEATURE_STATE',
        feature,
        value,
      })
      cy.log(`${feature} has been turned off`)
    }
  })
}

export const setFeatureFlag = (feature, isOn = true) => {
  return cy.getCookie('featuresOverride').then((cookie) => {
    const featuresOverride = JSON.parse((cookie && cookie.value) || '{}')

    cy.setCookie(
      'featuresOverride',
      JSON.stringify({
        ...featuresOverride,
        [feature]: isOn,
      })
    )
  })
}

export const setupSessionTimeout = (method, url) => {
  cy.route({
    method,
    url,
    headers: {
      'session-expired': true,
    },
    response: {},
    status: 440,
  }).as('sessionTimeout')
}

export const setupPartialAuthState = () => {
  cy.setCookie('authenticated', 'partial')
  cy.window().then((window) => {
    window.__qubitStore.dispatch({
      type: 'SET_AUTHENTICATION',
      authentication: 'partial',
    })
    cy.log('AuthStateSet', window.__qubitStore.getState().auth)
  })
}

export const assertAuthState = (authState) => {
  cy.window().then((window) => {
    expect(window.__qubitStore.getState().auth.authentication).to.eq(authState)
  })
}

export const authStateCookieUpdate = (authState) => {
  if (authState !== undefined) {
    cy.setCookie('authenticated', authState, {
      domain: 'local.m.topshop.com',
      path: '/',
      expiry: Date.now() + 600000,
    })
  }
}

export const setNewCookieExpiry = (varianceInMinutes) => {
  const dt = new Date()
  const newTime = dt.setMinutes(dt.getMinutes() + varianceInMinutes)
  return JSON.stringify(newTime)
}

export const setFutureExpiryYear = () => {
  const today = new Date()
  const nextYear = today.getFullYear() + 1
  return nextYear.toString()
}

/**
 * We need to make the arguments to cy.task serialisable (e.g. JSON.stringify)
 * Therefore url matchers such as RegExps were being removed causing these routes to
 * call out a real environment, slowing everything down.
 */
export const serialiseRoute = (route) => {
  if (Object.prototype.toString.call(route.url) === '[object RegExp]') {
    return Object.assign({}, route, {
      url: {
        type: 'RegExp',
        source: route.url.source,
      },
    })
  }

  return route
}

export const isTruthy = (x) => !!x

/**
 * Sets up the mock server so that a monty SSR doesn't call out to a real environment
 * Uses cy.task because we need to wait until the mock server is ready before continuing the test
 *
 * @param  {Array<Route>} routes
 * @return {Promise}
 */
export function setupServerMocks(routes) {
  return cy.task(
    'mock-server-setup',
    routes.filter(isTruthy).map(serialiseRoute)
  )
}

export const forceSync = (key) => {
  cy.window().then((window) => {
    const item = JSON.parse(window.localStorage.getItem(key))
    item.lastPersistTime = +new Date()
    window.localStorage.setItem(key, JSON.stringify(item))

    const customStorageEvent = window.document.createEvent('HTMLEvents')
    customStorageEvent.initEvent('storage', true, true)
    customStorageEvent.key = key
    window.dispatchEvent(customStorageEvent)
  })
}

export const setBagCountCookie = (count) => {
  if (count) {
    cy.setCookie('bagCount', count)
  }
}

/**
 * Allows the mapping of routes with and without an aliasing.
 * for example, combining getCommon routes with aliased route
 * otherwise returns an error.
 */

export const setUpMocksForRouteList = (routes) => {
  setupServerMocks(routes).then(() => {
    cy.server()
    routes
      .filter(Boolean)
      .map(
        (routeObj) =>
          routeObj.alias
            ? cy.route(routeObj).as(routeObj.alias)
            : cy.route(routeObj)
      )
  })
}

/*  TODO: These mock setups are getting more and more. Move them out into a
    seperate `mockHelpers.js` file to keep this file single-purposed.       */

export const setUpMocksForStoreLocator = () => {
  cy.server()
  cy.route('GET', routes.storeLocator(), 'fixture:general/storeLocator').as(
    'get-stores'
  )
}

export const setupMocksCountryStoreLocator = () => {
  cy.server()
  cy.route(
    'GET',
    routes.storeLocator('?country=Russia*'),
    'fixture:general/storeLocator--russia'
  ).as('getCountryLocatorRussia')
  cy.route(
    'GET',
    routes.storeLocator('?country=Netherlands*'),
    'fixture:general/storeLocator--netherlands'
  ).as('getCountryLocatorNetherlands')
  cy.route(
    'GET',
    routes.storeLocator('?latitude=*'),
    'fixture:general/storeLocator'
  ).as('getCountryLocatorUK')
}

export const injectPeeriusRecommends = (recommends) => {
  cy.window().then((window) => {
    window.PeeriusCallbacks.smartRecs(recommends)
  })
}

export const injectRecentlyViewed = (recentlyViewed) => {
  const setupRecentlyViewedItems = (window, prods) =>
    window.localStorage.setItem('recentlyViewed', JSON.stringify(prods))

  cy.window().then((window) => {
    setupRecentlyViewedItems(window, recentlyViewed)
  })
}

export const checkLocalStorage = (key, property, value) => {
  const window = cy.state('window')
  expect(JSON.parse(window.localStorage.getItem(key))[property]).to.eq(value)
}

export const setInLocalStorage = (key, data) => {
  const window = cy.state('window')
  window.localStorage.setItem(key, JSON.stringify(data))
}

export const checkExistenceOfClass = (domElement, requiredClass) => {
  cy.get(domElement).should('have.class', requiredClass)
}

export const setupMocksForRefinements = (routes) => {
  setupServerMocks(concatRoutes(routes)).then(() => {
    cy.server()
    routes.map((o) => cy.route(o).as(o.alias))
  })
}

export const visitPageWithGeoLocation = (iso, page = '/') => {
  cy.visit(page, {
    headers: {
      'X-User-Geo': iso,
    },
  })
}

export const eventTypeFilter = (eventType, searchPath = []) => {
  const timeout = 8000

  // This is for when we need to grab second to last even with non-empty array of products/values
  if (searchPath.length > 0)
    return {
      filter: (dlItem) =>
        dlItem.event === eventType && path(searchPath, dlItem).length > 0,
      timeout,
    }

  return { filter: (dlItem) => dlItem.event === eventType, timeout }
}
