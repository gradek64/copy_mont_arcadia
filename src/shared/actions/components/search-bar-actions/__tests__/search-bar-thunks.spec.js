import * as thunks from '../search-bar-thunks'
import { toggleSearchBar, trackSearchBarSelected } from '../search-bar-actions'

jest.mock('../search-bar-actions')

jest.mock('react-router', () => ({
  browserHistory: [],
}))
jest.mock('../../../../analytics/tracking/site-interactions')

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('Search bar thunks', () => {
  const dispatch = jest.fn((val) => val)
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('toggleProductsSearchBar()', () => {
    const getClosedSearchBarState = () => {
      return { productsSearch: { open: false } }
    }
    const getOpenSearchBarState = () => {
      return { productsSearch: { open: true } }
    }

    it('should always call toggleSearchBar', () => {
      const possibleStateFetchers = [
        getClosedSearchBarState,
        getOpenSearchBarState,
      ]
      possibleStateFetchers.forEach((stateFetcher) => {
        thunks.toggleProductsSearchBar()(dispatch, stateFetcher)
        expect(toggleSearchBar).toHaveBeenCalledTimes(1)
        toggleSearchBar.mockClear()
      })
    })

    it('should track event when toggling from closed to open', () => {
      thunks.toggleProductsSearchBar()(dispatch, getOpenSearchBarState)
      expect(trackSearchBarSelected).toHaveBeenCalledTimes(1)
    })

    it('should NOT track event when toggling from open to closed', () => {
      thunks.toggleProductsSearchBar()(dispatch, getClosedSearchBarState)
      expect(trackSearchBarSelected).not.toHaveBeenCalled()
    })
  })

  describe('submitSearch()', () => {
    it('submitSearch(searchTerm)', () => {
      snapshot(thunks.submitSearch('sample search'))
    })
  })
})
