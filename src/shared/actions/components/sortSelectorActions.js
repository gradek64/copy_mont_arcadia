import { browserHistory } from 'react-router'
import { analyticsPlpClickEvent } from '../../analytics/tracking/site-interactions'

// Selectors
import { getCurrentSortOption } from '../../selectors/productSelectors'

// Helpers
import { updateSeoUrlIfSearchFilter } from '../../lib/products-utils'

// Update sort option state if a sort option value exist within the seoURl
export function updateSortOption() {
  return (dispatch, getState) => {
    const {
      sorting: { currentSortOption },
      routing: {
        location: { pathname, search },
      },
      products: { sortOptions },
    } = getState()

    const seoUrl = `${pathname}${search}`
      .replace('/filter', '')
      .replace(/&currentPage=(\d)+/, '')

    const option = sortOptions.reduce((acc, cur) => {
      return cur.navigationState === seoUrl ? cur.value : acc
    }, currentSortOption)

    dispatch({
      type: 'SELECT_SORT_OPTION',
      option,
    })
  }
}

export function selectSortOption(option) {
  return (dispatch, getState) => {
    const { currentSortOption } = getState().sorting

    if (currentSortOption !== option) {
      analyticsPlpClickEvent(`sortoption-${option.toLowerCase()}`)
      dispatch({
        type: 'SELECT_SORT_OPTION',
        option,
      })

      const sortOption = getCurrentSortOption(getState())

      if (sortOption && sortOption.navigationState) {
        browserHistory.push(
          updateSeoUrlIfSearchFilter(sortOption.navigationState)
        )
      }
    }
  }
}

export function clearSortOptions() {
  return {
    type: 'CLEAR_SORT_OPTIONS',
  }
}
