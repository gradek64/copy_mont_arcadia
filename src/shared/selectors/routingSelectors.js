import { createSelector } from 'reselect'
import { isCheckoutPath } from '../lib/checkout'

const getRouting = (state) => state.routing || {}

const getLocation = (state) => {
  const { location } = getRouting(state)

  return location || {}
}

const querySelector = (state) => {
  const { query } = getLocation(state)

  return query || {}
}

const getCurrentPageFromRouting = (state) => {
  const { currentPage } = querySelector(state)
  return parseInt(currentPage, 10) || 1
}

const getLocationQuery = querySelector

const getRoutePath = (state) => {
  const { pathname } = getLocation(state)

  return pathname || ''
}

const getRouteSearch = (state) => {
  const { search } = getLocation(state)

  return search || ''
}

const getRouteQuery = (state) => {
  const { query } = getLocation(state)

  return query || null
}

const getRoutePathWithParams = (state) => {
  return `${getRoutePath(state)}${getRouteSearch(state)}`
}

const getVisitedPaths = (state) => {
  const { visited } = getRouting(state)

  return visited || []
}

const getPageStatusCode = (state) => {
  const { pageStatusCode } = getRouting(state)

  return pageStatusCode || null
}

const isNotFound = (state) => {
  const code = getPageStatusCode(state)

  return code === 404
}

const getPrevPath = (state) => {
  const visitedPaths = getVisitedPaths(state)
  const currentPath = getRoutePath(state)
  const currentPathIndex = visitedPaths.lastIndexOf(currentPath)
  return currentPathIndex ? visitedPaths[currentPathIndex - 1] : 'direct link'
}

const isInCheckout = (state) => {
  const pathname = getRoutePath(state)

  return isCheckoutPath(pathname)
}

const isHomePage = (state) => {
  return getRoutePath(state) === '/'
}

const selectInDeliveryAndPayment = createSelector(
  getRoutePath,
  (pathName) => pathName !== '' && pathName.endsWith('/delivery-payment')
)

const getRedirect = (state) => {
  return state.routing.redirect
}

const getCurrentCountry = (state) => {
  const { currentCountry } = querySelector(state)

  return currentCountry
}

export const selectHostname = (state) => {
  const { hostname } = getLocation(state)

  return hostname || ''
}

export const isLoginPage = createSelector(getRoutePath, (path) =>
  /(?:\/checkout)?\/login/.test(path)
)

export const isMyAccount = (state) => {
  const pathname = getRoutePath(state)

  return /^\/my-account/.test(pathname)
}

export const isOrderComplete = (state) => {
  const pathname = getRoutePath(state)

  return /\/order-complete/.test(pathname)
}

export const isOrderSuccess = (state) => {
  const pathname = getRoutePath(state)

  return /\/psd2-order-success/.test(pathname)
}

export const isRestrictedPath = (state) =>
  isLoginPage(state) || isMyAccount(state) || isInCheckout(state)

export {
  getLocation,
  getLocationQuery,
  getPageStatusCode,
  getRoutePath,
  getRouteSearch,
  getRouteQuery,
  getRoutePathWithParams,
  getVisitedPaths,
  getPrevPath,
  isInCheckout,
  isHomePage,
  selectInDeliveryAndPayment,
  getRedirect,
  getCurrentCountry,
  isNotFound,
  getCurrentPageFromRouting,
}
