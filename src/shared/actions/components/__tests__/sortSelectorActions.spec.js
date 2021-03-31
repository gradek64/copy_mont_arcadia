import { browserHistory } from 'react-router'

import * as sortSelectorActions from '../sortSelectorActions'

// Mocks
import { analyticsPlpClickEvent } from '../../../analytics/tracking/site-interactions'

jest.mock('../../../analytics/tracking/site-interactions', () => ({
  analyticsPlpClickEvent: jest.fn(),
}))

describe('Sort Selector Actions', () => {
  describe('updateSortOption', () => {
    const getState = () => ({
      sorting: {
        currentSortOption: 'Newness',
      },
      routing: {
        location: {
          pathname:
            '/en/tsuk/category/bags-accessories-1702216/bags-purses-462/N-7unZdgl?Nrpp=24&Ns=product.freshnessRank%7C0&currentPage=2&siteId=%2F12556',
          search: '',
          query: {
            q: 'bags',
          },
        },
      },
      products: {
        sortOptions: [
          {
            label: 'Best Match',
            value: 'Relevance',
            navigationState:
              '/en/tsuk/category/bags-accessories-1702216/bags-purses-462/N-7unZdgl?Nrpp=24&siteId=%2F12556',
          },
          {
            label: 'Newest',
            value: 'Newness',
            navigationState:
              '/en/tsuk/category/bags-accessories-1702216/bags-purses-462/N-7unZdgl?Nrpp=24&Ns=product.freshnessRank%7C0&siteId=%2F12556',
          },
        ],
      },
    })

    it('should update sort option with the value newest', () => {
      const dispatchMock = jest.fn()
      const action = sortSelectorActions.updateSortOption()
      action(dispatchMock, getState)

      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'SELECT_SORT_OPTION',
        option: 'Newness',
      })
    })
  })
  describe('selectSortOption', () => {
    const getState = () => ({
      sorting: {
        currentSortOption: 'Newness',
      },
      routing: {
        location: {
          pathname: '/search/',
          query: {
            q: 'jeans',
          },
        },
      },
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should do nothing if already sorting by the sort option', () => {
      const dispatchMock = jest.fn()
      const getState = () => ({
        sorting: {
          currentSortOption: 'Newness',
        },
      })
      const action = sortSelectorActions.selectSortOption('Newness')
      action(dispatchMock, getState)
      expect(dispatchMock).not.toHaveBeenCalled()
    })

    it('should sort by option if it’s changed', () => {
      const dispatchMock = jest.fn()
      const mockOption = 'Relevance'
      const action = sortSelectorActions.selectSortOption('Relevance')
      action(dispatchMock, getState)
      expect(analyticsPlpClickEvent).toHaveBeenCalledWith(
        `sortoption-${mockOption.toLowerCase()}`
      )
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'SELECT_SORT_OPTION',
        option: 'Relevance',
      })
    })

    it('should trigger the new url based on new filter params if new filter', () => {
      const newState = () => ({
        ...getState(),
        products: {
          sortOptions: [
            {
              label: 'Best Match',
              value: 'Relevance',
              navigationState:
                '/en/tsuk/category/bags-accessories-1702216/belts-466/N-7v1Zdgl?Nrpp=24&siteId=%2F12556',
            },
            {
              label: 'Newest',
              value: 'Newness',
              navigationState:
                '/en/tsuk/category/bags-accessories-1702216/belts-466/N-7v1Zdgl?Nrpp=24&Ns=product.freshnessRank%7C0&siteId=%2F12556',
            },
            {
              label: 'Price - Low To High',
              value: 'Price Ascending',
              navigationState:
                '/en/tsuk/category/bags-accessories-1702216/belts-466/N-7v1Zdgl?Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556',
            },
            {
              label: 'Price - High To Low',
              value: 'Price Descending',
              navigationState:
                '/en/tsuk/category/bags-accessories-1702216/belts-466/N-7v1Zdgl?Nrpp=24&Ns=promoPrice%7C1&siteId=%2F12556',
            },
          ],
        },
      })

      const browserHistoryPush = jest
        .spyOn(browserHistory, 'push')
        .mockImplementation(() => {})
      const dispatchMock = jest.fn()
      const action = sortSelectorActions.selectSortOption('Relevance')
      action(dispatchMock, newState)
      expect(browserHistoryPush).toHaveBeenCalled()
    })
  })
})
