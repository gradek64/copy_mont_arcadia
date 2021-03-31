import { browserHistory } from 'react-router'
import { clearSortOptions } from '../sortSelectorActions'
import { clearRefinements } from '../refinementsActions'
import { resetForm } from '../../common/formActions'
import { clearInfinityPage } from '../../common/infinityScrollActions'
import { analyticsSearchClickEvent } from '../../../analytics/tracking/site-interactions'
import { trackSearchBarSelected, toggleSearchBar } from './search-bar-actions'
import { isSearchBarOpen } from '../../../selectors/productSearchSelectors'

export function toggleProductsSearchBar() {
  return (dispatch, getState) => {
    dispatch(toggleSearchBar())
    if (isSearchBarOpen(getState())) {
      dispatch(trackSearchBarSelected())
    }
  }
}

export function submitSearch(searchTerm) {
  return (dispatch, getState) => {
    if (searchTerm) {
      analyticsSearchClickEvent(searchTerm)
      if (getState().productsSearch.open) dispatch(toggleProductsSearchBar())
      dispatch(clearSortOptions())
      dispatch(clearRefinements())
      dispatch(clearInfinityPage())

      // Free text search
      browserHistory.push({ pathname: '/search/', query: { q: searchTerm } })

      dispatch(resetForm('search', { searchTerm: '' }))
    }
  }
}
