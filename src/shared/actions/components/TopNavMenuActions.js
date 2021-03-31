import { closeProductsSearchBar } from '../components/search-bar-actions'

export function toggleTopNav() {
  return {
    type: 'TOGGLE_TOP_NAV_MENU',
  }
}

export function toggleTopNavMenu() {
  return (dispatch) => {
    dispatch(closeProductsSearchBar())
    dispatch(toggleTopNav())
  }
}

export function closeTopNavMenu() {
  return {
    type: 'CLOSE_TOP_NAV_MENU',
  }
}

export function toggleScrollToTop() {
  return {
    type: 'TOGGLE_SCROLL_TO_TOP',
  }
}
