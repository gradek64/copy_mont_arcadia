import { equals, isEmpty, omit } from 'ramda'
import { browserHistory } from 'react-router'

import { keyValueEncodeURI } from '../../lib/query-helper'
import {
  updateSeoUrlIfSearchFilter,
  encodeIfPriceSeoUrl,
} from '../../lib/products-utils'

import { removeQueryFromPathname } from '../../lib/get-product-route'

import { getLocation, getRoutePath } from '../../selectors/routingSelectors'
import { getRefinementOptions } from '../../selectors/refinementsSelectors'
import { getProductsLocation } from '../../selectors/productSelectors'

import { updateProductsRefinements } from '../common/productsActions'

export function setSeoRefinements(refinements, activeRefinements = []) {
  return {
    type: 'SET_SEO_REFINEMENTS',
    refinements,
    activeRefinements,
  }
}

export function openRefinements() {
  return {
    type: 'OPEN_REFINEMENTS',
  }
}
export function closeRefinements() {
  return {
    type: 'CLOSE_REFINEMENTS',
  }
}

export function toggleRefinements(isShown) {
  return (dispatch) => {
    return isShown ? dispatch(openRefinements()) : dispatch(closeRefinements())
  }
}

export function updateOptionRange(refinement, option) {
  return {
    type: 'UPDATE_OPTION_RANGE',
    refinement,
    option,
  }
}

export function removeOptionRange(refinement) {
  return {
    type: 'REMOVE_OPTION_RANGE',
    refinement,
  }
}

// FIXME: The `startsWith()` test will be unnecessary at some point when the
// backend stops providing an invalid SEO path.
const isValidSeoUrlPath = (seoUrlPath) =>
  seoUrlPath && !seoUrlPath.startsWith('/N-')

const getSeoBrowserState = (seoUrlPath, currentPath) =>
  seoUrlPath === currentPath ? undefined : { pathname: seoUrlPath }

const getSearchQueryBrowserState = (state) => {
  const { appliedOptions, selectedOptions } = getRefinementOptions(state)

  if (equals(appliedOptions, selectedOptions)) {
    return
  }

  // If the options have been changed - lets fetch some new stuff.
  const { pathname, query } = getLocation(state)
  // These are the non-seo refinements - if they are needed elsewhere extract some config
  // Push non-seo refinements into the URL bar

  // Move back to page 1 when refinements applied
  const newQuery = omit(['refinements', 'currentPage'], query)
  if (!isEmpty(selectedOptions))
    newQuery.refinements = keyValueEncodeURI(selectedOptions)

  return {
    pathname,
    query: newQuery,
  }
}

export function applyRefinements(seoUrl) {
  return (dispatch, getState) => {
    const seoUrlPath = removeQueryFromPathname(seoUrl)
    const state = getState()

    dispatch({
      type: 'APPLY_REFINEMENTS',
      seoUrl: seoUrlPath,
    })

    const browserState = isValidSeoUrlPath(seoUrlPath)
      ? getSeoBrowserState(seoUrlPath, getRoutePath(state))
      : getSearchQueryBrowserState(state)

    if (browserState) {
      browserHistory.push(browserState)
    }
  }
}

export function clearRefinements() {
  return {
    type: 'CLEAR_REFINEMENT_OPTIONS',
  }
}

export function cacheSeoUrl(seoUrl) {
  return {
    type: 'CACHE_SEOURL',
    seoUrl,
  }
}

export function clearSeoUrl() {
  return {
    type: 'CLEAR_SEOURL',
  }
}

export function loadingRefinements(isLoading) {
  return {
    type: 'LOADING_REFINEMENTS',
    isLoading,
  }
}

export const updateRefinements = (seoUrl) => {
  return (dispatch) => {
    dispatch(updateProductsRefinements(encodeIfPriceSeoUrl(seoUrl))).then(
      () => {
        return dispatch(cacheSeoUrl(encodeIfPriceSeoUrl(seoUrl)))
      }
    )
  }
}

export function resetRefinements() {
  return (dispatch, getState) => {
    const { pathname, search = '' } = getProductsLocation(getState())

    if (!pathname) return

    dispatch(updateProductsRefinements(`${pathname}${search}`)).then(() => {
      return dispatch(clearSeoUrl())
    })
  }
}

export function applyRefinementsMobile() {
  return (dispatch, getState) => {
    const { seoUrlCache } = getState().refinementsV2

    if (seoUrlCache)
      browserHistory.push(updateSeoUrlIfSearchFilter(seoUrlCache))
    dispatch(clearSeoUrl())
  }
}
