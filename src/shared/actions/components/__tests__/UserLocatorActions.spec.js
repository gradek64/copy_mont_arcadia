import * as UserLocatorActions from '../UserLocatorActions'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import { maps } from '../../../../../test/mocks/google'
import { browserHistory } from 'react-router'
import { pollForGoogleService } from '../../../lib/google-utils'
import { setGenericError } from '../../common/errorMessageActions'
import {
  getUserInputGeoLocation,
  getGeoLocatorCoordinatesLat,
  getGeoLocatorCoordinatesLong,
} from '../../../selectors/userLocatorSelectors'
import * as StoreLocatorActions from '../StoreLocatorActions'
import { woosmapFetch } from '../../../lib/woosmap-utils'
import { createStore } from '../../../../../test/unit/helpers/get-redux-mock-store'

jest.mock('../../../lib/woosmap-utils', () => ({
  woosmapFetch: jest.fn(),
}))

jest.mock('react-router', () => ({ browserHistory: { push: jest.fn() } }))

jest.mock('../../common/errorMessageActions', () => ({
  setGenericError: jest.fn(() => () => {}),
}))
jest.spyOn(StoreLocatorActions, 'setStoreLocatorQuery')
jest.mock('../../../lib/google-utils', () => ({
  pollForGoogleService: jest.fn(),
}))
jest.mock('../../../selectors/userLocatorSelectors')

jest.useFakeTimers()

if (!window.google) {
  window.google = {}
}
window.google.maps = maps

const snapshot = (action) => expect(action).toMatchSnapshot()

const preferredISOs = ['GB']

const getStore = () => ({
  userLocator: {
    selectedPlaceDetails: {
      place_id: {
        placeId: 'id',
        location: {
          lat: '1.11111',
          lng: '2.22222',
        },
      },
    },
  },
  checkout: {
    orderSummary: {
      basket: {
        inventoryPositions: {
          item_1: {
            partNumber: '12345',
            catentry: '987',
            inventory: [{ cutofftime: '2100', quantity: 28 }],
          },
        },
        products: [
          {
            productId: 12345,
            catEntryId: 987,
            quantity: 1,
            sku: '12347',
          },
        ],
      },
    },
  },
  features: {
    status: {
      FEATURE_CFSI: false,
    },
  },
  config: {
    siteId: 42,
    locale: 'gb',
    preferredISOs,
  },
})

const allDeliveryTypes = 'brand,parcel,other,today'

describe('User locator actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('fillRecentStores', () => {
    snapshot(UserLocatorActions.fillRecentStores(['Topshop, Oxford Street']))
  })

  it('completeRecentStores', () => {
    snapshot(
      UserLocatorActions.completeRecentStores(['Topshop, Oxford Street'])
    )
  })

  it('resetRecentStores', () => {
    snapshot(UserLocatorActions.resetRecentStores())
  })

  it('searchStores', () => {
    snapshot(UserLocatorActions.searchStores(false))
  })

  describe('getPlaceCoordinates', () => {
    const store = configureMockStore({
      userLocator: {
        searchTerm: '',
        predictions: [],
        selectedPlaceDetails: {
          key: '123',
          location: {
            lat: '1.11111',
            lng: '2.22222',
          },
        },
        getCurrentLocationError: false,
      },
    })
    it('should return lat/long of place', () => {
      store.dispatch(
        UserLocatorActions.getPlaceCoordinates(
          'id',
          ({ latitude, longitude }) => {
            expect(latitude).toEqual('1.11111')
            expect(longitude).toEqual('2.22222')
          }
        )
      )
    })
    it('should dispatch an error, on issue with woosmap service', () => {
      const store = configureMockStore({
        userLocator: {
          selectedPlaceDetails: {
            key: '123',
            location: {},
          },
        },
      })
      store.dispatch(
        UserLocatorActions.getPlaceCoordinates({ location: {} }, () => {})
      )
      expect(setGenericError).toHaveBeenCalledTimes(1)
      expect(setGenericError).toHaveBeenCalledWith(
        'Sorry could not find your location'
      )
    })
    it('should dispatch an error, on issue with woosmap service', () => {
      const store = configureMockStore({
        userLocator: {
          selectedPlaceDetails: {
            key: '123',
            location: {},
          },
        },
      })
      store.dispatch(
        UserLocatorActions.getPlaceCoordinates({ location: {} }, () => {})
      )
      expect(setGenericError).toHaveBeenCalledTimes(1)
      expect(setGenericError).toHaveBeenCalledWith(
        'Sorry could not find your location'
      )
    })
    it('should dispatch an error, on issue with geocoding service', () => {
      window.google.maps.GeocoderStatus.OK = false
      store.dispatch(UserLocatorActions.getPlaceCoordinates('id', () => {}))
      expect(setGenericError).toHaveBeenCalledTimes(1)
      expect(setGenericError).toHaveBeenCalledWith(
        'Error with googleGeocodeService: OK'
      )
      window.google.maps.GeocoderStatus.OK = 'OK'
    })
  })
})

describe('@fillRecentStores', () => {
  it('sets recent stores', () => {
    const store = configureMockStore({
      userLocator: {
        recentStores: [],
      },
    })
    expect(store.getState().userLocator.recentStores).toEqual([])
    store.dispatch(UserLocatorActions.fillRecentStores(['recent store']))
    expect(store.getState().userLocator.recentStores).toEqual(['recent store'])
  })
})

describe('@resetRecentStores', () => {
  it('set recent stores to empty array', () => {
    const store = configureMockStore({
      userLocator: {
        recentStores: ['test store'],
      },
    })
    expect(store.getState().userLocator.recentStores).toEqual(['test store'])
    store.dispatch(UserLocatorActions.resetRecentStores())
    expect(store.getState().userLocator.recentStores).toEqual([])
  })
})

describe('@completeRecentStores', () => {
  let store = null
  let searchTerm = null

  beforeEach(() => {
    process.browser = true
    store = createStore({
      config: {
        brandName: 'brandName',
      },
    })
    searchTerm = [
      {
        name: 'name',
        brandName: 'topshop',
        address: {
          postcode: 'postcode',
        },
      },
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.google = { maps }
    process.browser = false
  })

  it('calls fillRecentStores', async () => {
    await store.dispatch(UserLocatorActions.completeRecentStores(searchTerm))

    expect(pollForGoogleService).toHaveBeenCalledWith(
      ['places', 'AutocompleteService'],
      3000
    )
    expect(store.getActions()).toEqual([
      {
        type: 'FILL_RECENT_STORES',
        recentStores: [
          {
            description: 'topshop, name',
          },
        ],
      },
    ])
  })

  it('Should log error, if AutocompleteService not found', async () => {
    const google = window.google
    window.google = undefined
    const noticeError = jest.fn()
    window.NREUM = {
      noticeError,
    }
    const promise = store.dispatch(
      UserLocatorActions.completeRecentStores(searchTerm)
    )
    jest.advanceTimersByTime(33000)
    await promise
    expect(noticeError).toHaveBeenCalled()
    window.google = google
  })

  it('should load Google map script when completeRecentStores is called', async () => {
    const google = window.google
    window.google = undefined

    const loadScript = window.loadScript
    const googleApiKey = window.GOOGLE_API_KEY
    window.GOOGLE_API_KEY = 'googleApiKeyMock'

    window.loadScript = jest.fn((obj) => {
      window.google = {
        maps: {
          places: {
            AutocompleteService: () => ({
              getPlacePredictions: jest.fn((obj, func) => {
                func({ map: () => {} }, 'success')
              }),
              searchTerm: [],
            }),
            PlacesServiceStatus: {
              OK: 'success',
            },
          },
        },
      }
      obj.onload()
    })
    await store.dispatch(UserLocatorActions.completeRecentStores(searchTerm))
    expect(window.loadScript).toHaveBeenCalledWith({
      id: 'googleMapsScript',
      defer: true,
      isAsync: true,
      src: `https://maps.googleapis.com/maps/api/js?key=${
        window.GOOGLE_API_KEY
      }&libraries=places&language=en&region=uk`,
      onload: expect.anything(),
      onerror: expect.anything(),
    })

    window.GOOGLE_API_KEY = googleApiKey
    window.google = google
    window.loadScript = loadScript
  })

  it('does not call fillRecentStores if 400 returned', () => {
    woosmapFetch.mockImplementation(() => Promise.reject({}))
    pollForGoogleService.mockImplementation(() => Promise.resolve({}))

    window.google.maps.places.AutocompleteService = () => {
      return {
        getPlacePredictions: (obj, func) => {
          func(
            [
              {
                description: '',
                storeId: '',
              },
            ],
            400
          )
        },
      }
    }

    store.dispatch(UserLocatorActions.completeRecentStores(searchTerm))

    expect(store.getActions()).toEqual([])
  })
})

describe('@fetchAutocomplete', () => {
  let store
  let searchTerm

  beforeEach(() => {
    store = createStore(getStore())
    searchTerm = 'test'
    process.browser = true
  })

  beforeAll(() => {
    jest.spyOn(UserLocatorActions, 'fillPredictions')
    jest.spyOn(UserLocatorActions, 'resetPredictions')
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.google = { maps }
    process.browser = false
  })

  it('calls fillPredictions woosmap', async () => {
    woosmapFetch.mockImplementation(() => Promise.resolve({}))
    await store.dispatch(UserLocatorActions.fetchAutocomplete(searchTerm))

    expect(woosmapFetch).toHaveBeenCalledWith(preferredISOs, searchTerm)
    expect(store.getActions()).toEqual([
      {
        type: 'FILL_PREDICTIONS',
        searchTerm: 'test',
        predictions: {},
      },
    ])
  })

  it('Google autocomplete service calls fillPredictions after woosmap error ', async () => {
    woosmapFetch.mockImplementation(() => Promise.reject({}))
    pollForGoogleService.mockImplementation(() => Promise.resolve({}))
    window.google.maps.places.AutocompleteService = () => {
      return {
        getPlacePredictions: (obj, func) => {
          func(
            [
              {
                description: '',
                storeId: '',
              },
            ],
            200
          )
        },
      }
    }

    await store.dispatch(UserLocatorActions.fetchAutocomplete(searchTerm))
    expect(pollForGoogleService).toHaveBeenCalledWith(
      ['places', 'AutocompleteService'],
      3000
    )
    expect(store.getActions()).toEqual([
      {
        type: 'FILL_PREDICTIONS',
        searchTerm: 'test',
        predictions: [
          {
            description: '',
            id: undefined,
            key: undefined,
          },
        ],
      },
    ])
  })

  it('woosmap calls resetPredictions', async () => {
    woosmapFetch.mockImplementation(() => Promise.resolve({}))

    await store.dispatch(UserLocatorActions.fetchAutocomplete(''))

    expect(store.getActions()).toEqual([{ type: 'RESET_PREDICTIONS' }])
  })

  it('should load Google map script if woosmapFetch fails', async () => {
    const google = window.google
    window.google = undefined
    woosmapFetch.mockImplementation(() => Promise.reject({}))

    const loadScript = window.loadScript
    const googleApiKey = window.GOOGLE_API_KEY
    window.GOOGLE_API_KEY = 'googleApiKeyMock'

    window.loadScript = jest.fn((obj) => {
      window.google = {
        maps: {
          places: {
            AutocompleteService: () => ({
              getPlacePredictions: jest.fn((obj, func) => {
                func({ map: () => {} }, 'success')
              }),
            }),
            PlacesServiceStatus: {
              OK: 'success',
            },
          },
        },
      }
      obj.onload()
    })

    await store.dispatch(UserLocatorActions.fetchAutocomplete(searchTerm))

    expect(window.loadScript).toHaveBeenCalledWith({
      id: 'googleMapsScript',
      defer: true,
      isAsync: true,
      src: `https://maps.googleapis.com/maps/api/js?key=${
        window.GOOGLE_API_KEY
      }&libraries=places&language=en&region=uk`,
      onload: expect.anything(),
      onerror: expect.anything(),
    })

    window.GOOGLE_API_KEY = googleApiKey
    window.google = google
    window.loadScript = loadScript
  })

  it('Google service calls resetPredictions after woosmap error', async () => {
    woosmapFetch.mockImplementation(() => Promise.reject({}))
    pollForGoogleService.mockImplementation(() => Promise.resolve({}))

    await store.dispatch(UserLocatorActions.fetchAutocomplete(''))

    expect(pollForGoogleService).toHaveBeenCalledWith(
      ['places', 'AutocompleteService'],
      3000
    )

    expect(store.getActions()).toEqual([{ type: 'RESET_PREDICTIONS' }])
  })

  it('Should log error, if Google AutocompleteService not found', async () => {
    woosmapFetch.mockImplementation(() => Promise.reject({}))
    pollForGoogleService.mockImplementation(() => Promise.reject())

    window.google.maps = undefined
    const noticeError = jest.fn()
    window.NREUM = { noticeError }

    await store
      .dispatch(UserLocatorActions.fetchAutocomplete(''))
      .catch(() => expect(noticeError).toHaveBeenCalled())
  })
})

describe('@searchStoresCheckout', () => {
  let store

  const initialState = {
    userLocator: {
      selectedPlaceDetails: {
        place_id: '123',
        location: {
          lat: '1.11111',
          long: '2.22222',
        },
      },
    },
    checkout: {
      orderSummary: {
        basket: {
          inventoryPositions: {
            item_1: {
              partNumber: '12345',
              catentry: '987',
              inventory: [{ cutofftime: '2100', quantity: 28 }],
            },
          },
          products: [
            {
              productId: 12345,
              catEntryId: 987,
              quantity: 1,
              sku: '12347',
            },
          ],
        },
      },
    },
    features: {
      status: {
        FEATURE_CFSI: true,
      },
    },
    config: {
      siteId: 42,
      locale: 'gb',
    },
  }

  beforeEach(() => {
    store = createStore(initialState)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls setStoreLocatorQuery', () => {
    store.dispatch(UserLocatorActions.searchStoresCheckout())
    expect(store.getActions()).toEqual([
      {
        query: {
          basketDetails: '12347:1',
          brandPrimaryEStoreId: 12556,
          deliverToStore: true,
          latitude: '1.11111',
          longitude: '2.22222',
          types: 'brand,parcel,other,today',
        },
        type: 'SET_STORE_LOCATOR_QUERY',
      },
    ])
  })

  it('calls setStoreLocatorQuery with cfsi false', () => {
    const store = createStore({
      ...initialState,
      features: {
        status: {
          FEATURE_CFSI: false,
        },
      },
    })
    const expectedQuery = {
      pathname: '/checkout/delivery/collect-from-store',
      query: {
        brandPrimaryEStoreId: 12556,
        deliverToStore: true,
        latitude: '1.11111',
        longitude: '2.22222',
        basketDetails: '',
        types: allDeliveryTypes,
      },
    }

    store.dispatch(UserLocatorActions.searchStoresCheckout())

    expect(browserHistory.push).toBeCalledWith(expectedQuery)
  })

  it('calls setStoreLocatorQuery with cfsi true', () => {
    const store = createStore({
      ...initialState,
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
    })

    const expectedQuery = {
      pathname: '/checkout/delivery/collect-from-store',
      query: {
        brandPrimaryEStoreId: 12556,
        deliverToStore: true,
        latitude: '1.11111',
        longitude: '2.22222',
        basketDetails: '12347:1',
        types: allDeliveryTypes,
      },
    }

    store.dispatch(UserLocatorActions.searchStoresCheckout())

    expect(browserHistory.push).toBeCalledWith(expectedQuery)
  })

  it('calls getPlaceCoordinates', () => {
    // TODO: needs expanding - what exactly is this testing?
    store.dispatch(UserLocatorActions.searchStoresCheckout())
    expect(store.getActions()).toEqual([
      {
        query: {
          basketDetails: '12347:1',
          brandPrimaryEStoreId: 12556,
          deliverToStore: true,
          latitude: '1.11111',
          longitude: '2.22222',
          types: 'brand,parcel,other,today',
        },
        type: 'SET_STORE_LOCATOR_QUERY',
      },
    ])
  })

  describe('Geolocator API is enabled', () => {
    beforeEach(() => {
      getUserInputGeoLocation.mockReturnValue(true)
      getGeoLocatorCoordinatesLat.mockReturnValue('1.11111')
      getGeoLocatorCoordinatesLong.mockReturnValue('2.22222')
    })

    it('calls setStoreLocatorQuery without calling getPlaceCoordinates', () => {
      const store = createStore({
        ...initialState,
        userLocator: {
          selectedPlaceDetails: {
            place_id: {
              placeId: 'id',
            },
          },
        },
        features: {
          status: {
            FEATURE_CFSI: true,
            FEATURE_STORE_LOCATOR_GPS: true,
          },
        },
        config: {
          siteId: 42,
        },
      })

      const expectedQuery = {
        pathname: '/checkout/delivery/collect-from-store',
        query: {
          brandPrimaryEStoreId: 12556,
          deliverToStore: true,
          latitude: '1.11111',
          longitude: '2.22222',
          basketDetails: '12347:1',
          types: allDeliveryTypes,
        },
      }

      store.dispatch(UserLocatorActions.searchStoresCheckout())
      expect(browserHistory.push).toBeCalledWith(expectedQuery)
    })
  })
})

describe('@createStoreLocatorQuery', () => {
  let store

  const initialState = {
    userLocator: {
      selectedPlaceDetails: {
        place_id: '123',
        location: {
          lat: '1.11111',
          long: '2.22222',
        },
      },
    },
    checkout: {
      orderSummary: {
        isGuestOrder: true,
        basket: {
          inventoryPositions: {
            item_1: {
              partNumber: '12345',
              catentry: '987',
              inventory: [{ cutofftime: '2100', quantity: 28 }],
            },
          },
          products: [
            {
              productId: 12345,
              catEntryId: 987,
              quantity: 1,
              sku: '12347',
            },
          ],
        },
      },
    },
    features: {
      status: {
        FEATURE_CFSI: true,
      },
    },
    config: {
      siteId: 42,
      locale: 'gb',
    },
  }

  beforeEach(() => {
    store = createStore(initialState)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load collect from store for guest checkout', () => {
    const latitude = '1.11111'
    const longitude = '2.22222'
    store.dispatch(
      UserLocatorActions.createStoreLocatorQuery(latitude, longitude)
    )

    const expectedQuery = {
      pathname: '/guest/checkout/delivery/collect-from-store',
      query: {
        brandPrimaryEStoreId: 12556,
        deliverToStore: true,
        latitude: '1.11111',
        longitude: '2.22222',
        basketDetails: '12347:1',
        types: allDeliveryTypes,
      },
    }

    expect(browserHistory.push).toBeCalledWith(expectedQuery)
  })
})
