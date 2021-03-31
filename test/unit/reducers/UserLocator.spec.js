import { isEmpty } from 'ramda'
import { createStore } from 'redux'
import configureStore from '../../../src/shared/lib/configure-store'
import configureMockStore from '../lib/configure-mock-store'
import UserLocatorReducer from '../../../src/shared/reducers/components/UserLocatorReducer'
import { browserHistory } from 'react-router'
import * as actions from '../../../src/shared/actions/components/UserLocatorActions'
import { maps } from '../../mocks/google'

jest.mock('../../../src/shared/lib/woosmap-utils', () => ({
  woosmapFetch: jest.fn(() =>
    Promise.resolve([
      {
        description: 'abc',
        id: '2341r7u3yrgfh3o2i4gj',
        location: { lat: 1, long: 2 },
      },
    ])
  ),
}))

const searchTerm = 'Oxford Street'
const description = 'Oxford Street, London'
const place = {
  place_id: '1234',
  description: 'Oxford Street, London',
}

jest.useFakeTimers()

describe('UserLocatorActions', () => {
  const windowGoogleMaps = window.google.maps
  const googlePredictionsFake = ['Roma', 'Milano', 'Pisa']
  const woosmapPredictionFake = [
    {
      description: 'abc',
      id: '2341r7u3yrgfh3o2i4gj',
      location: { lat: 1, long: 2 },
    },
  ]

  beforeAll(() => {
    global.process.browser = true
    window.google.maps = {
      ...maps,
      places: {
        ...maps.places,
        AutocompleteService: () => ({
          getPlacePredictions(query, callback) {
            callback(
              googlePredictionsFake,
              window.google.maps.places.PlacesServiceStatus.OK
            )
          },
        }),
      },
    }
  })

  afterAll(() => {
    window.google.maps = windowGoogleMaps
  })

  it('RESET_SEARCH_TERM', () => {
    const store = configureStore({
      userLocator: {
        searchTerm: 'abc',
        predictions: [],
        selectedPlaceDetails: {},
        getCurrentLocationError: false,
      },
    })
    expect(store.getState().userLocator.searchTerm).toBe('abc')
    store.dispatch(actions.resetSearchTerm())
    expect(store.getState().userLocator.searchTerm).toBe('')
  })

  it('FILL_PREDICTIONS', () => {
    const store = createStore(UserLocatorReducer)
    store.dispatch(actions.fillPredictions(searchTerm, [{ description }]))
    expect(store.getState().predictions.length === 1).toBeTruthy()
    expect(store.getState().searchTerm).toBe(searchTerm)
    expect(store.getState().predictions[0].description).toBe(description)
  })

  it('RESET_PREDICTIONS', () => {
    const store = createStore(UserLocatorReducer)
    store.dispatch(actions.fillPredictions(searchTerm, [{ description }]))
    expect(store.getState().predictions.length === 1).toBeTruthy()
    store.dispatch(actions.resetPredictions())
    expect(store.getState().predictions.length === 0).toBeTruthy()
  })

  it('SET_SELECTED_PLACE', () => {
    const store = createStore(UserLocatorReducer)
    store.dispatch(actions.setSelectedPlace(place))
    expect(Object.is(store.getState().selectedPlaceDetails, place)).toBeTruthy()
  })

  it('SET_USER_LOCATOR_PENDING sets pending', () => {
    const store = createStore(UserLocatorReducer)
    expect(store.getState().pending).toBeFalsy()
    store.dispatch(actions.setUserLocatorPending(true))
    expect(store.getState().pending).toBeTruthy()
    store.dispatch(actions.setUserLocatorPending(false))
    expect(store.getState().pending).toBeFalsy()
  })

  it('RESET_SELECTED_PLACE', () => {
    const store = createStore(UserLocatorReducer)
    store.dispatch(actions.setSelectedPlace(place))
    expect(Object.is(store.getState().selectedPlaceDetails, place)).toBeTruthy()
    store.dispatch(actions.resetSelectedPlace())
    expect(isEmpty(store.getState().selectedPlaceDetails)).toBeTruthy()
  })

  it('searchStores navigates to store-locator passing coordinates when United Kingdom selected', () => {
    jest.spyOn(browserHistory, 'push').mockImplementation(() => {})
    const store = configureMockStore({
      userLocator: {
        searchTerm: '',
        predictions: [],
        selectedPlaceDetails: {
          place_id: '123',
        },
        getCurrentLocationError: false,
      },
      storeLocator: {
        selectedCountry: 'United Kingdom',
      },
    })

    store.dispatch(actions.searchStores())

    expect(browserHistory.push).toHaveBeenCalledWith({
      pathname: '/store-locator',
      query: {
        latitude: '1.11111',
        longitude: '2.22222',
      },
    })
  })

  it('searchStores navigates to store-locator passing country when United Kingdom not selected', () => {
    jest.spyOn(browserHistory, 'push').mockImplementation(() => {})
    const store = configureMockStore({
      userLocator: {
        searchTerm: '',
        predictions: [],
        selectedPlaceDetails: {},
        getCurrentLocationError: false,
      },
      storeLocator: {
        selectedCountry: 'Spain',
      },
    })

    store.dispatch(actions.searchStores())

    expect(browserHistory.push).toHaveBeenCalledWith({
      pathname: '/store-locator',
      query: {
        country: 'Spain',
      },
    })
  })

  it('Woosmap "autocomplete" fills the predictions once these are returned by woosmapFetch', async () => {
    const preferredISOs = ['GB', 'US', 'SP']
    const store = configureStore({
      userLocator: { predictions: [] },
      config: { preferredISOs },
    })
    expect(store.getState().userLocator.predictions).toEqual([])
    await store
      .dispatch(actions.fetchAutocomplete('abc'))
      .then(() =>
        expect(store.getState().userLocator.predictions).toEqual(
          woosmapPredictionFake
        )
      )
  })

  it('Google "autocomplete" fills the predictions once these are returned by the autocompletion service', async () => {
    const store = configureStore({ userLocator: { predictions: [] } })
    expect(store.getState().userLocator.predictions).toEqual([])
    await store
      .dispatch(actions.fetchAutocomplete('abc'))
      .catch(() =>
        expect(store.getState().userLocator.predictions).toEqual(
          googlePredictionsFake
        )
      )
  })

  it('"autocomplete" clears the predictions if the search term provided is empty', async () => {
    const store = configureStore({
      userLocator: { predictions: googlePredictionsFake },
    })
    expect(store.getState().userLocator.predictions).toEqual(
      googlePredictionsFake
    )
    await store.dispatch(actions.fetchAutocomplete(''))
    expect(store.getState().userLocator.predictions).toEqual([])
  })

  it('"onGetCurrentPositionSuccess" update geoLocation userGeoLongLat with long lat', () => {
    const store = configureStore({
      userLocator: { selectedPlaceDetails: {} },
      forms: {
        userLocator: {
          fields: {
            userLocation: {
              value: 'Current Location',
            },
          },
        },
      },
    })

    const expectedCoords = { lat: 123, long: 456 }

    store.dispatch(
      actions.onGetCurrentPositionSuccess({
        coords: {
          latitude: expectedCoords.lat,
          longitude: expectedCoords.long,
        },
      })
    )

    expect(store.getState().userLocator.selectedPlaceDetails).toEqual({})
    expect(store.getState().userLocator.geoLocation.userGeoLongLat).toEqual(
      expectedCoords
    )
    expect(store.getState().forms.userLocator.fields.userLocation.value).toBe(
      'Current Location'
    )
  })
})
