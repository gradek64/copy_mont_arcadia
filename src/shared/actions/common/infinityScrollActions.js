import { addToProducts } from './productsActions'
import { browserHistory } from 'react-router'
import { omit, not } from 'ramda'
import { getProductsLength } from '../../selectors/productSelectors'
import { isMobile as checkIsMobile } from '../../selectors/viewportSelectors'
import { getHiddenPagesAbove } from '../../selectors/infinityScrollSelectors'

import { productListPageSize } from '../../../server/api/mapping/constants/plp'

export function setInfinityActive() {
  return {
    type: 'SET_INFINITY_ACTIVE',
  }
}

export function setInfinityInactive() {
  return {
    type: 'SET_INFINITY_INACTIVE',
  }
}

export function nextPageInfinity() {
  return {
    type: 'NEXT_PAGE_INFINITY',
  }
}

export function setInfinityPage(page, shouldResetHiddenPageState = false) {
  return {
    type: 'SET_INFINITY_PAGE',
    page,
    shouldResetHiddenPageState,
  }
}

export function clearInfinityPage() {
  return (dispatch, getState) => {
    dispatch(setInfinityPage(1, true))
    const newFilters = getState().features.status.FEATURE_NEW_FILTERS
    if (not(newFilters)) {
      const { pathname, query } = getState().routing.location
      if (query && query.currentPage) {
        browserHistory.replace({
          pathname,
          query: omit(['currentPage'], query),
        })
      }
    }
  }
}

export const hideProductsAbove = () => {
  return (dispatch, getState) => {
    const isMobile = checkIsMobile(getState())
    const iOS = getState().viewport && getState().viewport.iosAgent

    if (isMobile && iOS) {
      const numberOfFetchedProducts = getProductsLength(getState())
      const waypointNumber = numberOfFetchedProducts / productListPageSize

      if (waypointNumber > 1) {
        const productOne = document.querySelector("[data-product-number='0']")
        const productTwo = document.querySelector("[data-product-number='23']")

        if (productOne && productTwo) {
          const productOneDistanceToTop = productOne.getBoundingClientRect().top
          const productTwoDistanceFromBottom = productTwo.getBoundingClientRect()
            .bottom
          const totalHeightBetweenOneandTwo =
            productTwoDistanceFromBottom - productOneDistanceToTop
          dispatch({
            type: 'HIDE_PRODUCTS_ABOVE',
            height: totalHeightBetweenOneandTwo,
          })
        }
      }
    }
  }
}

export function showMoreProducts() {
  return (dispatch, getState) => {
    const { numberOfPagesHiddenAtEnd } = getState().infinityScroll.hiddenPages
    if (numberOfPagesHiddenAtEnd) {
      dispatch({
        type: 'UNHIDE_PRODUCTS_BELOW',
      })
    } else {
      dispatch(addToProducts())
    }
  }
}

export function hitWaypointBottom() {
  return (dispatch, getState) => {
    const { isActive } = getState().infinityScroll
    dispatch(setInfinityInactive())
    if (isActive) {
      dispatch(hideProductsAbove())
      dispatch(showMoreProducts())
    }
  }
}

export function hitWaypointTop(pageNoToUnhideAbove) {
  return (dispatch) => {
    dispatch({
      type: 'UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW',
      pageNoToUnhideAbove,
    })
  }
}

export function removeHiddenPages(isPlp) {
  return (dispatch, getState) => {
    const state = getState()
    const hiddenPagesAbove = getHiddenPagesAbove(state)

    const isPlpAndHasHiddenPagesAbove = hiddenPagesAbove.length && isPlp

    if (isPlpAndHasHiddenPagesAbove) {
      const totalPlpProductsFetched = getProductsLength(state)
      // we hide all pages after the second to prevent the browser from crashing
      const numberOfPagesHiddenAtEnd =
        Math.ceil(totalPlpProductsFetched / productListPageSize) - 2

      dispatch({
        type: 'PLP_RETURNED_TOP',
        numberOfPagesHiddenAtEnd:
          numberOfPagesHiddenAtEnd > 0 ? numberOfPagesHiddenAtEnd : 0,
      })
    }
  }
}

export function preserveScroll(preservedScroll) {
  return {
    type: 'PRESERVE_SCROLL',
    preservedScroll,
  }
}
