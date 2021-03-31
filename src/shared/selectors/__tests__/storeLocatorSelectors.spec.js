import deepFreeze from 'deep-freeze'
import * as storeLocatorSelectors from '../storeLocatorSelectors'
import reducer from '../../reducers/components/StoreLocatorReducer'

describe('Store locator selectors', () => {
  describe('getStoreLocatorStores()', () => {
    it('should return the list of stores', () => {
      const stores = deepFreeze([
        { foo: 'bar' },
        { bar: 'baz' },
        { baz: 'qux' },
      ])
      const state = { storeLocator: { stores } }
      expect(storeLocatorSelectors.getStoreLocatorStores(state)).toBe(stores)
    })
  })

  describe('getStoresCoordinates()', () => {
    const stores = [
      {
        store: 'store1',
        latitude: 5,
        longitude: 3,
      },
      {
        store: 'store2',
        latitude: 10,
        longitude: 13,
      },
    ]
    const state = { storeLocator: { stores } }
    const spyfn = jest.spyOn(storeLocatorSelectors, 'getStoreLocatorStores')
    const expectedResult = [[5, 3], [10, 13]]

    it('should return an array of store coordinates', () => {
      const storeLocatorSelector = storeLocatorSelectors.getStoresCoordinates(
        state
      )
      expect(spyfn).toHaveBeenCalledTimes(1)
      expect(storeLocatorSelector).toEqual(expectedResult)
    })
  })

  describe('getStoreByIndex()', () => {
    it('should return the requested store', () => {
      const state = {
        storeLocator: {
          stores: [{ foo: 'bar' }, { bar: 'baz' }, { baz: 'qux' }],
        },
      }
      expect(storeLocatorSelectors.getStoreByIndex(state, 1)).toEqual({
        bar: 'baz',
      })
    })
  })

  describe('getStoreLocatorFilters()', () => {
    it('should return the store locator filters', () => {
      const state = {
        storeLocator: {
          filters: 'some filters',
        },
        // EXP-313
        checkout: {
          storeWithParcel: false,
        },
      }
      expect(storeLocatorSelectors.getStoreLocatorFilters(state)).toBe(
        'some filters'
      )
    })
    // EXP-313
    it('should return all filters with disabled set to false if storeWithParcel is true', () => {
      const state = {
        storeLocator: {
          filters: {
            brand: {
              applied: true,
              selected: true,
              disabled: true,
            },
            parcel: {
              selected: true,
              applied: true,
              disabled: true,
            },
            other: {
              applied: true,
              selected: true,
              disabled: true,
            },
          },
        },
        checkout: {
          storeWithParcel: true,
        },
      }
      expect(storeLocatorSelectors.getStoreLocatorFilters(state)).toEqual({
        brand: {
          applied: true,
          selected: true,
          disabled: false,
        },
        parcel: {
          selected: true,
          applied: true,
          disabled: false,
        },
        other: {
          applied: true,
          selected: true,
          disabled: false,
        },
      })
    })
  })

  describe('isMapExpanded()', () => {
    it('should return the `mapExpanded` flag', () => {
      const state = {
        storeLocator: {
          mapExpanded: 'some boolean',
        },
      }
      expect(storeLocatorSelectors.isMapExpanded(state)).toBe('some boolean')
    })
  })

  describe('getActiveItem()', () => {
    it('should return the currently active item', () => {
      const state = {
        findInStore: {
          activeItem: 'some active item',
        },
      }
      expect(storeLocatorSelectors.getActiveItem(state)).toBe(
        'some active item'
      )
    })
  })

  describe('getSelectedStoreIndex', () => {
    it('should return a store index if selectedStoreIndex exist', () => {
      const state = {
        storeLocator: {
          selectedStoreIndex: 0,
        },
      }
      expect(storeLocatorSelectors.getSelectedStoreIndex(state)).toBe(0)
    })
  })

  describe('getMapCentrePointAndZoom', () => {
    it('when no store is selected returns the default lat, long and zoom', () => {
      const state = reducer(undefined, {})
      expect(
        storeLocatorSelectors.getMapCentrePointAndZoom({ storeLocator: state })
      ).toEqual({
        lat: state.currentLat,
        long: state.currentLng,
        zoom: 14,
        markers: [],
      })
    })

    it('when an area is selected returns an increased zoom', () => {
      let state = reducer(undefined, {})
      state = reducer(state, {
        type: 'RECEIVE_STORES',
        stores: [
          {
            store: 'A',
            latitude: 1,
            longitude: 2,
          },
          {
            store: 'B',
            latitude: 3,
            longitude: 4,
          },
        ],
      })

      expect(
        storeLocatorSelectors.getMapCentrePointAndZoom({ storeLocator: state })
      ).toEqual({
        lat: state.currentLat,
        long: state.currentLng,
        zoom: 13,
        markers: [
          [state.stores[0].latitude, state.stores[0].longitude],
          [state.stores[1].latitude, state.stores[1].longitude],
        ],
      })
    })

    it('returns store lat, long and zoom when selected', () => {
      let state = reducer(undefined, {})
      state = reducer(state, {
        type: 'RECEIVE_STORES',
        stores: [
          {
            store: 'A',
            latitude: 1,
            longitude: 2,
          },
        ],
      })
      state = reducer(state, {
        type: 'SELECT_STORE',
        index: 0,
      })

      expect(
        storeLocatorSelectors.getMapCentrePointAndZoom({ storeLocator: state })
      ).toEqual({
        lat: 1,
        long: 2,
        zoom: 15,
        markers: [[state.stores[0].latitude, state.stores[0].longitude]],
      })
    })

    it('if no stores but has selected index then return default state', () => {
      let state = reducer(undefined, {})
      state = reducer(state, {
        type: 'SELECT_STORE',
        index: 10,
      })
      state = reducer(state, {
        type: 'RECEIVE_STORES',
        stores: [],
      })

      expect(
        storeLocatorSelectors.getMapCentrePointAndZoom({ storeLocator: state })
      ).toEqual({
        lat: 51.515615,
        long: -0.1432734,
        zoom: 14,
        markers: [],
      })
    })
  })
})
