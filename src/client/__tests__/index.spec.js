global.process.browser = false
import { getItem } from '../lib/cookie'
import { setupLoaders } from '../../shared/lib/image-loader/image-loader'
import {
  clearCacheData,
  getSelectedStore,
  loadRecentlyViewedState,
} from '../lib/storage'
import * as multiTabSyncActions from '../../shared/actions/common/multiTabSyncActions'
import * as localisationUtils from '../../shared/lib/localisation'
import { UPDATE_LOCATION } from 'react-router-redux'
import configureMockStore from 'redux-mock-store'
import configureStore from '../../shared/lib/configure-store'

jest.mock('../../shared/lib/image-loader/image-loader')

jest.mock('../lib/cookie', () => ({
  getItem: jest.fn(() => 'TS0001'),
  getJSON: jest.fn(),
}))

jest.mock('../lib/storage', () => ({
  clearCacheData: jest.fn(() => {}),
  getSelectedStore: jest.fn(() => {}),
  loadRecentlyViewedState: jest.fn(() => ({})),
}))

jest.mock('react-dom', () => ({
  hydrate: jest.fn(),
}))
jest.mock('../../shared/lib/price', () => ({
  format: jest.fn(() => {}),
  formatPrice: jest.fn(() => {}),
}))
jest.mock('../Root.jsx', () => '')
jest.mock('../../shared/lib/localisation', () => ({
  setClientSideDictionaries: jest.fn(() => 'TS0001'),
  localise: jest.fn(() => {}),
}))
jest.mock('../../shared/lib/context-provider', () => '')
jest.mock('../../shared/lib/configure-store', () => jest.fn())

describe('Index', () => {
  const localisation = {
    dictionary: [],
    geoIPDictionary: {},
  }
  global.__INITIAL_STATE__ = {
    localisation,
    config: {
      language: 'EN',
      brandName: 'Topshop',
    },
    storeLocator: {},
    checkout: {},
  }

  let store
  beforeAll(() => {
    store = configureMockStore()()
    configureStore.mockReturnValue(store)
  })

  it('calls the top-level setup functions', () => {
    const setUpMultiTabSyncListenersSpy = jest.spyOn(
      multiTabSyncActions,
      'setUpMultiTabSyncListeners'
    )

    // index has global code so it needs to be required after mocks, instead of being imported
    require('../index')

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: UPDATE_LOCATION,
          payload: {
            pathname: expect.any(String),
          },
        },
      ])
    )
    expect(loadRecentlyViewedState).toHaveBeenCalledTimes(1)
    expect(getItem).toHaveBeenCalledWith('WC_pickUpStore')
    expect(setupLoaders).toHaveBeenCalledTimes(1)
    expect(setupLoaders).toHaveBeenCalledWith(window)
    expect(getSelectedStore).toHaveBeenCalledTimes(1)
    expect(clearCacheData).toHaveBeenCalledTimes(1)
    expect(clearCacheData).toHaveBeenCalledWith('account')
    expect(setUpMultiTabSyncListenersSpy).toHaveBeenCalledTimes(1)
    expect(setUpMultiTabSyncListenersSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    )
    expect(localisationUtils.setClientSideDictionaries).toHaveBeenCalledTimes(1)
    expect(localisationUtils.setClientSideDictionaries).toHaveBeenCalledWith(
      localisation
    )
  })
})
