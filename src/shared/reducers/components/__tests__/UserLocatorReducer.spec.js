import testReducer from '../UserLocatorReducer'

import { createStore } from 'redux'

const snapshot = (reducer) => expect(reducer).toMatchSnapshot()

const RESET_SELECTED_PLACE = 'RESET_SELECTED_PLACE'
describe('UserLocator Reducer', () => {
  describe('FILL_RECENT_STORES', () => {
    it('set array of stores', () => {
      snapshot(
        testReducer(
          {},
          {
            type: 'FILL_RECENT_STORES',
            recentStores: [{ storeId: 'TS0001' }],
          }
        )
      )
    })
  })
  describe('RESET_RECENT_STORES', () => {
    it('set recentStores to empty array', () => {
      snapshot(
        testReducer(
          {},
          {
            type: 'RESET_RECENT_STORES',
            recentStores: [],
          }
        )
      )
    })
  })
  describe('RESET_SELECTED_PLACE', () => {
    it('selectedPlaceDetails returns default object state', () => {
      snapshot(
        testReducer(
          {
            selectedPlaceDetails: {
              place_id: '',
            },
          },
          {
            type: RESET_SELECTED_PLACE,
            selectedPlaceDetails: {
              place_id: '',
            },
            prevSelectedPlaceDetails: {
              place_id: '',
            },
          }
        )
      )
    })

    it('prevSelectedPlace state returns selectedPlaceDetails place_id', () => {
      const store = createStore(testReducer, {
        selectedPlaceDetails: {
          place_id: 'mock_id',
        },
      })
      store.dispatch({ type: RESET_SELECTED_PLACE })
      expect(store.getState().prevSelectedPlaceDetails.place_id).toEqual(
        'mock_id'
      )
    })
  })
  describe('Geolocation', () => {
    describe('SET_CURRENT_LOCATION_ERROR', () => {
      it('sets current geolocation error', () => {
        snapshot(
          testReducer(
            {},
            {
              type: 'SET_CURRENT_LOCATION_ERROR',
              error: 'test err',
            }
          )
        )
      })
    })
    describe('SET_USER_INPUT_GEO_LOCATED', () => {
      it('sets geolocation to true', () => {
        snapshot(
          testReducer(
            {},
            {
              type: 'SET_USER_INPUT_GEO_LOCATED',
              condition: true,
            }
          )
        )
      })
    })
    describe('SET_USER_GEO_LOCATION_LAT_LONG', () => {
      it('sets the latitude and longitude', () => {
        snapshot(
          testReducer(
            {},
            {
              type: 'SET_USER_GEO_LOCATION_LAT_LONG',
              latLong: { lat: 1, long: 2 },
            }
          )
        )
      })
    })
    describe('RESET_GEO_USER_LOCATION', () => {
      it('resets the geolocation reducer', () => {
        snapshot(
          testReducer(
            {},
            {
              type: 'RESET_GEO_USER_LOCATION',
            }
          )
        )
      })
    })
  })
})
