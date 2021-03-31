import { createStore, combineReducers } from 'redux'
import searchBarReducer from '../SearchBarReducer'
import { isSearchBarOpen } from '../../../selectors/productSearchSelectors'
import {
  toggleProductsSearchBar,
  closeProductsSearchBar,
} from '../../../actions/components/search-bar-actions'
import configureStore from '../../../lib/configure-store'

describe('SearchBarReducer', () => {
  it('TOGGLE_PRODUCTS_SEARCH_BAR', () => {
    const store = createStore(
      combineReducers({ productsSearch: searchBarReducer })
    )
    toggleProductsSearchBar()(store.dispatch, store.getState)

    expect(isSearchBarOpen(store.getState())).toBe(true)

    toggleProductsSearchBar()(store.dispatch, store.getState)

    expect(isSearchBarOpen(store.getState())).toBe(false)
  })

  it('CLOSE_PRODUCTS_SEARCH_BAR', () => {
    const initialState = {
      productsSearch: { open: true },
    }
    const store = configureStore(initialState)

    store.dispatch(closeProductsSearchBar())

    expect(isSearchBarOpen(store.getState())).toBe(false)
  })
})
