import { createStore } from 'redux'
import * as actions from '../../../actions/components/StoreLocatorActions'

import storeLocatorReducer, {
  enabledFilters,
  defaultStoreLocatorState,
} from '../StoreLocatorReducer'

const snapshot = (reducer) => expect(reducer).toMatchSnapshot()

describe('StoreLocator Reducer', () => {
  describe('SET_FULFILMENT_STORE', () => {
    it('single store set in state', () => {
      const store = createStore(storeLocatorReducer)
      const selectedStore = {
        id: 'fake-store-id',
        name: 'Fake Store Name',
      }
      expect(store.getState().selectedStore).toEqual({})
      store.dispatch({
        type: 'SET_FULFILMENT_STORE',
        payload: selectedStore,
      })
      expect(store.getState().selectedStore).toEqual(selectedStore)
    })
  })
  describe('SET_SELECTED_STORE_ID', () => {
    it('store id set in state', () => {
      const store = createStore(storeLocatorReducer)
      const selectedStoreId = 'fake-store-id'
      expect(store.getState().selectedStoreId).not.toBeDefined()
      store.dispatch({
        type: 'SET_SELECTED_STORE_ID',
        selectedStoreId,
      })
      expect(store.getState().selectedStoreId).toEqual(selectedStoreId)
    })
  })
  describe('SELECT_STORE', () => {
    it('set store index', () => {
      const store = createStore(storeLocatorReducer)
      const selectedStoreIndex = 3
      expect(store.getState().selectedStoreIndex).not.toBeDefined()
      store.dispatch({
        type: 'SELECT_STORE',
        index: selectedStoreIndex,
      })
      expect(store.getState().selectedStoreIndex).toEqual(selectedStoreIndex)
    })
  })
  describe('APPLY_FILTERS', () => {
    it('when today filter is applied it disables parcel and others', () => {
      const store = createStore(storeLocatorReducer)
      const filters = ['today']
      store.dispatch({
        type: 'APPLY_FILTERS',
        filters,
      })
      snapshot(store.getState().filters)
    })
    it('when parcel filter is applied it does not disables parcel and others', () => {
      const store = createStore(storeLocatorReducer)
      const filters = ['parcel']
      store.dispatch({
        type: 'APPLY_FILTERS',
        filters,
      })
      snapshot(store.getState().filters)
    })
  })
  describe('APPLY_CHECKOUT_FILTERS', () => {
    let store

    beforeEach(() => {
      store = createStore(storeLocatorReducer)
    })
    it('applies and enables `brand` & `other` filters while disabling the rest', () => {
      store.dispatch(actions.applyCheckoutFilters(['brand', 'other']))
      expect(store.getState().filters).toEqual({
        today: { applied: false, selected: false, disabled: true },
        brand: { applied: true, selected: true, disabled: false },
        parcel: { applied: false, selected: false, disabled: true },
        other: { applied: true, selected: true, disabled: false },
      })
    })
    it('applies and enables `parcel` filter while disabling the rest', () => {
      store.dispatch(actions.applyCheckoutFilters(['parcel']))
      expect(store.getState().filters).toEqual({
        today: { applied: false, selected: false, disabled: true },
        brand: { applied: false, selected: false, disabled: true },
        parcel: { applied: true, selected: true, disabled: false },
        other: { applied: false, selected: false, disabled: true },
      })
    })
  })
  describe('SET_FILTERS', () => {
    it('set filters', () => {
      const store = createStore(storeLocatorReducer)
      const filters = {
        today: {
          applied: true,
          selected: true,
          disabled: false,
        },
        brand: {
          applied: false,
          selected: true,
          disabled: false,
        },
        parcel: {
          applied: false,
          selected: true,
          disabled: false,
        },
        other: {
          applied: true,
          selected: true,
          disabled: false,
        },
      }
      store.dispatch(actions.setFilters(filters))
      snapshot(store.getState().filters)
      expect(store.getState().filters).toEqual(filters)
    })
  })
  describe('SET_FULFILMENT_STORE_SKU', () => {
    it('should set selectedStoreSKU', () => {
      const store = createStore(storeLocatorReducer)
      const sku = '90210'
      store.dispatch({
        type: 'SET_FULFILMENT_STORE_SKU',
        sku,
      })
      snapshot(store.getState())
      expect(store.getState().selectedStoreSKU).toBe(sku)
    })
  })
  describe('RESET_STORE_LOCATOR', () => {
    it('should persist filters and selectedStore', () => {
      const initialState = {
        selectedStore: { storeId: 'TM0007' },
        filters: { today: { applied: true } },
      }

      expect(
        storeLocatorReducer(initialState, {
          type: 'RESET_STORE_LOCATOR',
        })
      ).toMatchSnapshot()
    })
  })

  // EXP-313
  describe('SET_STORE_WITH_PARCEL', () => {
    const disabledOptions = {
      applied: false,
      selected: false,
      disabled: true,
    }
    const disabledFilters = {
      brand: {
        ...disabledOptions,
      },
      parcel: {
        ...disabledOptions,
      },
      other: {
        ...disabledOptions,
      },
    }
    let store

    beforeEach(() => {
      store = createStore(storeLocatorReducer)
      // set filters to non-standard values so we can detect
      // if they change or don't change properly
      store.dispatch({
        type: 'SET_FILTERS',
        filters: disabledFilters,
      })
    })
    it('if storeWithParcel is true, brand, parcel and other filters are enabled', () => {
      store.dispatch({
        type: 'SET_STORE_WITH_PARCEL',
        storeWithParcel: true,
      })
      const updatedState = store.getState()
      expect(updatedState.filters).toEqual({
        ...enabledFilters,
      })
    })
    it('if storeWithParcel is true, brand, parcel and other filters are enabled', () => {
      store.dispatch({
        type: 'SET_STORE_WITH_PARCEL',
        storeWithParcel: false,
      })
      const updatedState = store.getState()
      expect(updatedState).toEqual({
        ...defaultStoreLocatorState,
        filters: {
          ...disabledFilters,
        },
      })
    })
  })
})
