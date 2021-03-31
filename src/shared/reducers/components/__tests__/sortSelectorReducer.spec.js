import { UPDATE_LOCATION } from 'react-router-redux'

import sortSelectorReducer from '../sortSelectorReducer'

describe('Sort Selector Reducer', () => {
  describe('UPDATE_LOCATION_SERVER', () => {
    it('should update refinements', () => {
      const action = {
        type: 'UPDATE_LOCATION_SERVER',
        location: {
          query: {
            sort: 'Newness',
          },
        },
      }
      const { currentSortOption } = sortSelectorReducer({}, action)
      expect(currentSortOption).toBe('Newness')
    })
  })

  describe(UPDATE_LOCATION, () => {
    it('should update sort selector', () => {
      const action = {
        type: UPDATE_LOCATION,
        payload: {
          query: {
            sort: 'Newness',
          },
        },
      }
      const { currentSortOption } = sortSelectorReducer({}, action)
      expect(currentSortOption).toBe('Newness')
    })

    it('should update sort selector to `null` no sort query', () => {
      const state = {
        currentSortOption: 'Relevance',
      }
      const action = {
        type: UPDATE_LOCATION,
        payload: {},
      }
      const { currentSortOption } = sortSelectorReducer(state, action)
      expect(currentSortOption).toBe(null)
    })

    it('should return the same state if new filter', () => {
      const state = {
        currentSortOption: 'Relevance',
      }
      const action = {
        type: UPDATE_LOCATION,
        payload: {
          query: {
            Ns: 'newSort',
          },
        },
      }
      const newState = sortSelectorReducer(state, action)
      expect(newState).toEqual(state)
    })
  })
})
