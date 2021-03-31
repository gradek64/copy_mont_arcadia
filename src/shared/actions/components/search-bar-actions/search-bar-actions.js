import {
  sendAnalyticsClickEvent,
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../../analytics'

export function toggleSearchBar() {
  return {
    type: 'TOGGLE_PRODUCTS_SEARCH_BAR',
  }
}

export function closeProductsSearchBar() {
  return {
    type: 'CLOSE_PRODUCTS_SEARCH_BAR',
  }
}

export function trackSearchBarSelected() {
  return sendAnalyticsClickEvent({
    category: GTM_CATEGORY.SEARCH_SELECTED,
    action: GTM_ACTION.SEARCH_BAR,
  })
}
