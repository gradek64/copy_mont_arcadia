import configureMockStore from 'test/unit/lib/configure-mock-store'
import {
  getMockStoreWithInitialReduxState,
  mockStoreCreator,
  createStore,
} from 'test/unit/helpers/get-redux-mock-store'
import stores from 'test/mocks/store-locator'
import { maps } from 'test/mocks/google'
import nock from 'nock'
import { getItem } from '../../../../client/lib/cookie'
import {
  shouldFetchBagStock,
  getBasketDetails,
  getAppliedFilters,
} from '../../../lib/store-locator-utilities'
import {
  getSelectedPlaceId,
  getUserInputGeoLocation,
  getGeoLocatorCoordinatesLat,
  getGeoLocatorCoordinatesLong,
} from '../../../selectors/userLocatorSelectors'
import * as UserLocatorActions from '../UserLocatorActions'
import * as StoreLocatorActions from '../StoreLocatorActions'
import * as productSelectors from '../../../selectors/productSelectors'
import * as storeLocatorSelectors from '../../../selectors/storeLocatorSelectors'
import * as analytics from '../../../analytics/analytics-actions'
import { getLang, getRegion } from '../../../selectors/configSelectors'

jest.mock('../../../lib/google-static-map', () => ({
  createStaticMapUrl: jest.fn(() => 'test.static.url'),
}))

function seedGeocoderCoords(lat, lng) {
  return function Geocoder() {
    const geocode = (address, cb) => {
      const results = [
        {
          geometry: { location: { lat: () => lat, lng: () => lng } },
        },
      ]
      const status = true
      cb(results, status)
    }

    return {
      geocode,
    }
  }
}

jest.mock('../../../../server/lib/newrelic')

jest.mock('../../../lib/store-locator-utilities', () => ({
  shouldFetchBagStock: jest.fn().mockReturnValue(true),
  getAppliedFilters: jest.fn().mockReturnValue([]),
  getSkuList: jest.fn().mockReturnValue('sku_1,sku_2'),
  getBasketDetails: jest.fn().mockReturnValue('sku1:1,sku2:3'),
}))

jest.mock('../../../../client/lib/cookie', () => ({
  setItem: jest.fn(() => 'TS0001'),
  getItem: jest.fn(() => 'TS0001'),
  setStoreCookie: jest.fn(),
}))

jest.mock('../../../../client/lib/storage', () => ({
  setSelectedStore: jest.fn(),
  loadRecentlyViewedState: jest.fn(() => []),
}))

jest.mock('../../../selectors/userLocatorSelectors', () => ({
  getSelectedPlaceId: jest.fn(),
  getPreviousSelectedPlaceId: jest.fn(),
  getUserInputGeoLocation: jest.fn(),
  getGeoLocatorCoordinatesLat: jest.fn(),
  getGeoLocatorCoordinatesLong: jest.fn(),
}))

let originalBrowser

jest.useFakeTimers()

describe('Store locator actions', () => {
  beforeAll(() => {
    if (!window.google) {
      window.google = {}
    }
    window.google.maps = maps
    originalBrowser = process.browser
    Object.defineProperty(process, 'browser', {
      value: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    delete window.global
    jest.resetAllMocks()
    Object.defineProperty(process, 'browser', {
      value: originalBrowser,
    })
  })

  describe('@applyCheckoutFilters', () => {
    it('should dispatch action creator', () => {
      const store = mockStoreCreator({
        storeLocator: {
          filters: {
            today: { applied: false, selected: false, disabled: true },
            brand: { applied: false, selected: false, disabled: false },
            parcel: { applied: true, selected: true, disabled: false },
            other: { applied: false, selected: false, disabled: false },
          },
        },
      })
      const expectedActions = [
        {
          type: 'APPLY_CHECKOUT_FILTERS',
          filters: ['brand', 'other'],
        },
      ]
      store.dispatch(
        StoreLocatorActions.applyCheckoutFilters(['brand', 'other'])
      )
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('@setFulfilmentStore', () => {
    it('should update selectedStore', () => {
      const store = configureMockStore({
        storeLocator: {
          selectedStore: { storeId: 'TS0001' },
        },
      })
      expect(store.getState().storeLocator.selectedStore.storeId).toBe('TS0001')
      store.dispatch(
        StoreLocatorActions.setFulfilmentStore({ storeId: 'TS0002' })
      )
      expect(store.getState().storeLocator.selectedStore.storeId).toBe('TS0002')
    })
  })

  describe('@getSelectedStoreIdFromCookie', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('sets selected store id from cookie', async () => {
      const store = createStore()

      await store.dispatch(StoreLocatorActions.getSelectedStoreIdFromCookie())
      const expected = [
        { type: 'SET_SELECTED_STORE_ID', selectedStoreId: 'TS0001' },
      ]

      expect(store.getActions()).toEqual(expected)
      expect(getItem).toHaveBeenLastCalledWith('WC_pickUpStore')
      expect(getItem).toHaveBeenCalledTimes(1)
    })
  })

  describe('@setFilters', () => {
    it('sets filters for store types', () => {
      const store = configureMockStore({
        storeLocator: {
          selectedStoreId: 'TS0002',
        },
      })
      const filters = {
        today: { applied: true, selected: true, disabled: false },
        brand: { applied: true, selected: true, disabled: false },
        parcel: { applied: true, selected: false, disabled: true },
        other: { applied: true, selected: false, disabled: true },
      }

      store.dispatch(StoreLocatorActions.setFilters(filters))

      expect(store.getState().storeLocator.filters).toEqual({
        today: { applied: true, selected: true, disabled: false },
        brand: { applied: true, selected: true, disabled: false },
        parcel: { applied: true, selected: false, disabled: true },
        other: { applied: true, selected: false, disabled: true },
      })
    })
  })

  describe('changeFulfilmentStore', () => {
    it('sets store address and storeId', async () => {
      const storeObj = {
        storeId: 'TS0001',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'postcode',
          country: 'country',
        },
      }
      const store = createStore()
      await store.dispatch(StoreLocatorActions.changeFulfilmentStore(storeObj))

      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'SET_FULFILMENT_STORE' }),
          expect.objectContaining({ type: 'SET_SELECTED_STORE_ID' }),
          expect.objectContaining({ type: 'SET_DELIVERY_STORE' }),
        ])
      )
    })
  })

  describe('@selectStore', () => {
    it('should dispatch an analytics click event', async () => {
      const productId = 'foo123'
      jest.spyOn(analytics, 'sendAnalyticsClickEvent')
      jest.spyOn(storeLocatorSelectors, 'getStoreByIndex').mockReturnValue({})
      jest.spyOn(productSelectors, 'getCurrentProductId')
      productSelectors.getCurrentProductId.mockReturnValue(productId)

      const fakeAnalyticsAction = Object.freeze({ type: 'FAKE_CLICK_EVENT' })
      analytics.sendAnalyticsClickEvent.mockReturnValue(fakeAnalyticsAction)

      const store = getMockStoreWithInitialReduxState({})
      await store.dispatch(StoreLocatorActions.selectStore(123))
      expect(analytics.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([fakeAnalyticsAction])
      )
    })
  })

  describe('@getStoreForModal', () => {
    beforeEach(() => {
      jest.spyOn(UserLocatorActions, 'getPlaceCoordinates')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('Calls @getPlaceCoordinates if isFeatureStoreLocatorGpsEnabled is false', async () => {
      const getState = {
        features: {
          status: {
            FEATURE_STORE_LOCATOR_GPS: false,
          },
        },
        userLocator: {
          geoLocation: {
            userInputGeoLocation: false,
          },
        },
      }

      const store = createStore(getState)

      nock('http://localhost:3000')
        .get(
          '/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&cfsi=false&deliverToStore=true&types='
        )
        .reply(200, { stores: [] })

      await store.dispatch(
        StoreLocatorActions.getStoreForModal('collectFromStore')
      )

      expect(UserLocatorActions.getPlaceCoordinates).toHaveBeenCalled()
    })

    it('Should bypass @getPlaceCoordinates if isFeatureStoreLocatorGpsEnabled is true', async () => {
      const getState = {
        features: {
          status: {
            FEATURE_STORE_LOCATOR_GPS: true,
          },
        },
        userLocator: {
          geoLocation: {
            userInputGeoLocation: true,
            userGeoLongLat: {},
          },
        },
      }

      const store = createStore(getState)

      getUserInputGeoLocation.mockReturnValue(true)
      getGeoLocatorCoordinatesLong.mockReturnValue(1)
      getGeoLocatorCoordinatesLat.mockReturnValue(2)

      await store.dispatch(
        StoreLocatorActions.getStoreForModal('collectFromStore')
      )

      expect(UserLocatorActions.getPlaceCoordinates).toHaveBeenCalledTimes(0)
    })
  })

  describe('@buildQueryAndSearchStores', () => {
    const store = createStore({
      userLocator: {
        selectedPlaceDetails: {
          place_id: 'id',
        },
      },
      storeLocator: {
        filters: {
          today: {
            applied: true,
            selected: true,
            disabled: false,
          },
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
        },
      },
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
      findInStore: {
        activeItem: {
          sku: 'sku',
        },
      },
      config: {
        siteId: 42,
      },
    })

    afterEach(() => {
      nock.cleanAll()
    })

    it('getStoreModal with `collectFromStore` as locator type queries the store locator with the provided filters as the `types` url query param', async () => {
      getAppliedFilters.mockReturnValueOnce(['today', 'brand', 'parcel'])
      const expectedUrl =
        '/api/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&cfsi=true&deliverToStore=true&types=today%2Cbrand%2Cparcel'

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(200)

      await store.dispatch(
        StoreLocatorActions.buildQueryAndSearchStores(
          'collectFromStore',
          undefined,
          '1.11111',
          '2.22222'
        )
      )

      expect(scope.isDone()).toBe(true)
    })

    it('getStoreModal with `findInStore` as the locator type queries the store locator with a `types` url query param of `brand` as well as a `sku` query param', async () => {
      const expectedUrl =
        '/api/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&cfsi=true&types=brand&sku=sku'

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(200)

      await store.dispatch(
        StoreLocatorActions.buildQueryAndSearchStores(
          'findInStore',
          undefined,
          '1.11111',
          '2.22222'
        )
      )

      expect(scope.isDone()).toBe(true)
    })

    it('should dispatch an analytics click event which tracks the product ID', () => {
      jest.spyOn(analytics, 'sendAnalyticsClickEvent')

      store.dispatch(
        StoreLocatorActions.buildQueryAndSearchStores(
          'findInStore',
          undefined,
          '1.11111',
          '2.22222'
        )
      )
      expect(analytics.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
    })

    it('loads a store list on a successful response from the store locator query', async () => {
      const expectedUrl =
        '/api/store-locator?latitude=1.11112&longitude=2.22222&brandPrimaryEStoreId=12556&cfsi=true&types=brand&sku=sku'

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(200, stores)

      await store.dispatch(
        StoreLocatorActions.buildQueryAndSearchStores(
          'findInStore',
          undefined,
          '1.11112',
          '2.22222'
        )
      )

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'GET_STORES_LOADING',
            loading: true,
          }),
          expect.objectContaining({ type: 'RECEIVE_STORES', stores }),
        ])
      )
    })

    it('loads a store list on a successful response from the store locator query and calls `noStoresFound` when no stores are present', async () => {
      const expectedUrl =
        '/api/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&cfsi=true&types=brand&sku=sku'

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(200, [])

      await store.dispatch(
        StoreLocatorActions.buildQueryAndSearchStores(
          'findInStore',
          undefined,
          '1.11111',
          '2.22222'
        )
      )

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'GET_STORES_LOADING',
            loading: true,
          }),
          expect.objectContaining({
            type: 'RECEIVE_STORES',
            stores: [],
          }),
          expect.objectContaining({ type: 'NO_STORES_FOUND' }),
        ])
      )
    })

    it('calls dispatch with `getStoresError` if the store locator query promise is rejected', async () => {
      const expectedUrl =
        '/api/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&cfsi=true&types=brand&sku=sku'

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(500, {})

      await store.dispatch(
        StoreLocatorActions.buildQueryAndSearchStores(
          'findInStore',
          undefined,
          '1.11111',
          '2.22222'
        )
      )

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'GET_STORES_ERROR' }),
        ])
      )
    })
  })

  describe('@getStoresForCheckoutModal', () => {
    beforeEach(() => {
      jest.spyOn(UserLocatorActions, 'getPlaceCoordinates')
    })

    afterEach(() => {
      jest.restoreAllMocks()
      nock.cleanAll()
    })
    it('should fetch stores for CollectFromStore component', (done) => {
      const expectedUrl =
        '/api/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&deliverToStore=true&types=&cfsi=false&basketDetails='

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(200, stores)

      const store = createStore({
        userLocator: {
          selectedPlaceDetails: {
            key: 'id',
          },
        },
      })

      store.dispatch(StoreLocatorActions.getStoresForCheckoutModal())

      expect(UserLocatorActions.getPlaceCoordinates).toHaveBeenCalled()

      setImmediate(() => {
        expect(scope.isDone()).toBe(true)
        done()
      })
    })

    it('should include basketDetails in the url to fetch stores with stock data if CFSI is ON', (done) => {
      const expectedUrl =
        '/api/store-locator?latitude=1.11111&longitude=2.22222&brandPrimaryEStoreId=12556&deliverToStore=true&types=&cfsi=true&basketDetails=sku1%3A1%2Csku2%3A3'

      const scope = nock('http://localhost:3000')
        .get(expectedUrl)
        .reply(200, stores)

      const store = createStore({
        features: {
          status: { FEATURE_CFSI: true },
        },
        config: {
          siteId: 1234,
        },
      })

      store.dispatch(StoreLocatorActions.getStoresForCheckoutModal())

      setImmediate(() => {
        expect(scope.isDone()).toBe(true)
        done()
      })

      expect(getSelectedPlaceId).toHaveBeenCalled()
      expect(getBasketDetails).toHaveBeenCalledTimes(1)
      expect(getBasketDetails).toHaveBeenCalledWith({})
    })
  })

  describe('@getStores', () => {
    const getState = jest.fn().mockReturnValue({
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
      config: {
        siteId: 42,
      },
      routing: {
        location: {
          query: {
            types: 'x,y',
          },
        },
      },
    })
    const dispatch = jest.fn((fn) => Promise.resolve(fn))

    beforeAll(() => {
      jest.spyOn(StoreLocatorActions, 'getStores')
    })

    it('calls applyQueryFilters', () => {
      const location = {
        search: 'search',
      }
      const action = StoreLocatorActions.getStores(location)

      action(dispatch, getState)

      expect(dispatch).toHaveBeenCalledTimes(2)

      dispatch.mock.calls[0][0](dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith({
        type: 'APPLY_FILTERS',
        filters: ['x', 'y'],
      })
    })

    it('returns if no search', () => {
      const location = { search: false }
      const action = StoreLocatorActions.getStores(location)

      action(dispatch, getState)

      expect(dispatch).toHaveBeenCalledTimes(0)
    })
  })

  describe('@getRecentStores', () => {
    beforeEach(() => {
      jest.spyOn(UserLocatorActions, 'completeRecentStores')
    })

    afterEach(() => {
      nock.cleanAll()
      jest.restoreAllMocks()
    })

    it('does not call getStores', () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, stores)
      const location = { search: false }

      store.dispatch(StoreLocatorActions.getRecentStores(location))

      expect(scope.isDone()).toBe(false)
      expect(UserLocatorActions.completeRecentStores).not.toHaveBeenCalled()
    })

    it('calls getStores', async () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, stores)

      const location = { search: 'test' }

      await store.dispatch(StoreLocatorActions.getRecentStores(location))

      expect(scope.isDone()).toBe(true)
      expect(UserLocatorActions.completeRecentStores).toHaveBeenCalled()
    })
  })

  describe('@getFulfilmentStore', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('does not call getStores', async () => {
      const store = createStore()
      const location = { search: false }
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, stores)

      await store.dispatch(StoreLocatorActions.getFulfilmentStore(location))

      expect(scope.isDone()).toBe(false)
    })

    it('calls getStores', async () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, stores)
      const location = { search: 'test' }

      await store.dispatch(StoreLocatorActions.getFulfilmentStore(location))

      expect(scope.isDone()).toBe(true)
    })

    it('calls setFulfilmentStore when getstores return body', async () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [{}])
      const location = { search: 'test' }

      await store.dispatch(StoreLocatorActions.getFulfilmentStore(location))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'SET_FULFILMENT_STORE',
            payload: {},
          }),
        ])
      )
    })

    it('does not call setFulfilmentStore if no stores array', async () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [])
      const location = { search: 'test' }

      await store.dispatch(StoreLocatorActions.getFulfilmentStore(location))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(expect.arrayContaining([]))
    })

    it('calls setFulfilmentStoreSKU when getFulfilmentStore is called with isFFS as true and with a sku', async () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [{}])
      const location = { search: 'test' }
      const isFFS = true
      const sku = '90210'

      await store.dispatch(
        StoreLocatorActions.getFulfilmentStore(location, isFFS, sku)
      )

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'SET_FULFILMENT_STORE',
            payload: {},
          }),
          expect.objectContaining({
            type: 'SET_FULFILMENT_STORE_SKU',
            sku: '90210',
          }),
        ])
      )
    })

    it('calls getStoresError when get stores returns a promise rejecttion', async () => {
      const store = createStore()
      const url = '/api/store-locatortest&brand=12556&cfsi=false'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(500, {})
      const location = { search: 'test' }

      await store.dispatch(StoreLocatorActions.getFulfilmentStore(location))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'GET_STORES_ERROR' }),
        ])
      )
    })
  })

  describe('@storeSearch', () => {
    afterEach(() => {
      jest.clearAllMocks()
      nock.cleanAll()
    })

    describe('when irrelevant params are passed in', () => {
      it('does not call getStores', () => {
        const location = { search: '?dual_run=monty&' }
        const store = createStore()

        store.dispatch(StoreLocatorActions.storeSearch(location))

        expect(store.getActions()).toEqual(expect.arrayContaining([]))
      })
    })

    describe('when search is equal to false', () => {
      it('does not call getStores', () => {
        const location = { search: false }
        const store = createStore()

        store.dispatch(StoreLocatorActions.storeSearch(location))

        expect(store.getActions()).toEqual(expect.arrayContaining([]))
      })
    })

    describe('when right params are passed in', () => {
      it('calls getStores if lat and long params', async () => {
        const location = {
          search:
            '?lat=51.5073509&long=-0.12775829999998223&region=uk&brand=12556&cfsi=true',
        }
        const store = createStore()
        const url =
          '/api/store-locator?lat=51.5073509&long=-0.12775829999998223&region=uk&brand=12556&cfsi=true&brand=12556&cfsi=false'

        const scope = nock('http://localhost:3000')
          .get(url)
          .reply(200, stores)

        await store.dispatch(StoreLocatorActions.storeSearch(location))

        expect(scope.isDone()).toBe(true)
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'GET_STORES_LOADING',
              loading: true,
            }),
            expect.objectContaining({ type: 'RECEIVE_STORES', stores }),
          ])
        )
      })

      it('calls getStores if latitude and longitude params', async () => {
        const location = {
          search:
            '?latitude=51.5073509&longitude=-0.12775829999998223&region=uk&brand=12556&cfsi=true',
        }
        const store = createStore()
        const url =
          '/api/store-locator?latitude=51.5073509&longitude=-0.12775829999998223&region=uk&brand=12556&cfsi=true&brand=12556&cfsi=false'
        const scope = nock('http://localhost:3000')
          .get(url)
          .reply(200, stores)

        await store.dispatch(StoreLocatorActions.storeSearch(location))

        expect(scope.isDone()).toBe(true)
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'GET_STORES_LOADING',
              loading: true,
            }),
            expect.objectContaining({ type: 'RECEIVE_STORES', stores }),
          ])
        )
      })

      it('calls getStores if country params', async () => {
        const location = {
          search: '?country=Netherlands',
        }
        const store = createStore()

        const url =
          '/api/store-locator?country=Netherlands&brand=12556&cfsi=false'

        const scope = nock('http://localhost:3000')
          .get(url)
          .reply(200, stores)

        await store.dispatch(StoreLocatorActions.storeSearch(location))

        expect(scope.isDone()).toBe(true)
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'GET_STORES_LOADING',
              loading: true,
            }),
            expect.objectContaining({ type: 'RECEIVE_STORES', stores }),
          ])
        )
      })
    })

    it("doesn't refetch stores if already fetched", async () => {
      const store = createStore({
        storeLocator: { stores: [{ some: 'thing' }] },
      })

      await store.dispatch(StoreLocatorActions.storeSearch({ search: 'test' }))

      expect(store.getActions()).toEqual(expect.arrayContaining([]))
    })
  })

  describe('getDeliveryStoreDetails', () => {
    const storeId = 'fake-id'
    const state = {
      selectedBrandFulfilmentStore: {},
      shoppingBag: {
        bag: 'fake-shopping-bag',
      },
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
    }

    const store = createStore(state)

    afterEach(() => {
      nock.cleanAll()
    })

    it('should call shouldFetchBagStock', () => {
      shouldFetchBagStock.mockReturnValueOnce(false)

      store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(shouldFetchBagStock).toHaveBeenCalledTimes(1)
      expect(shouldFetchBagStock).toHaveBeenLastCalledWith(
        state.shoppingBag.bag,
        state.selectedBrandFulfilmentStore,
        storeId
      )
    })

    it('should call getItem("WC_pickUpStore") if storeId is undefined and should call shouldFetchBagStock with new storeId', () => {
      shouldFetchBagStock.mockReturnValueOnce(false)

      store.dispatch(StoreLocatorActions.getDeliveryStoreDetails())

      expect(getItem).toHaveBeenCalledTimes(1)
      expect(shouldFetchBagStock).toHaveBeenLastCalledWith(
        state.shoppingBag.bag,
        state.selectedBrandFulfilmentStore,
        'TS0001'
      )
    })

    it('should not dispatch if shouldFetchBagStock return false', () => {
      shouldFetchBagStock.mockReturnValueOnce(false)

      store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(store.getActions()).toEqual(expect.arrayContaining([]))
    })

    it('should not dispatch if cfsi feature is off', () => {
      const newState = {
        ...state,
        features: {
          status: {
            FEATURE_CFSI: false,
          },
        },
      }
      const store = createStore(newState)

      store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(store.getActions()).toEqual(expect.arrayContaining([]))
    })

    it('should dispatch and call getStores if cfsi is on and shouldFetchBagStock is true', async () => {
      const url =
        '/api/store-locator?storeIds=fake-id&skuList=sku_1,sku_2&brand=12556&cfsi=true'

      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [{}])

      await store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'SET_BRAND_FULFILMENT_STORE',
            store: {},
          }),
        ])
      )
    })

    it('should dispatch setSelectedBrandFulfilmentStore if getStores resolves with single store array', async () => {
      const url =
        '/api/store-locator?storeIds=fake-id&skuList=sku_1,sku_2&brand=12556&cfsi=true'

      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [{}])

      await store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'SET_BRAND_FULFILMENT_STORE',
            store: {},
          }),
        ])
      )
    })

    it('should not dispatch setSelectedBrandFulfilmentStore if getStores resolves with empty array', async () => {
      const url =
        '/api/store-locator?storeIds=fake-id&skuList=sku_1,sku_2&brand=12556&cfsi=true'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [])

      await store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(expect.arrayContaining([]))
    })

    it('should not dispatch setSelectedBrandFulfilmentStore if getStores resolves with non array', async () => {
      const url =
        '/api/store-locator?storeIds=fake-id&skuList=sku_1,sku_2&brand=12556&cfsi=true'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, {})

      await store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(expect.arrayContaining([]))
    })

    it('should not dispatch setSelectedBrandFulfilmentStore if getStores resolves with ', async () => {
      const url =
        '/api/store-locator?storeIds=fake-id&skuList=sku_1,sku_2&brand=12556&cfsi=true'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(500)

      await store.dispatch(StoreLocatorActions.getDeliveryStoreDetails(storeId))

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'GET_STORES_ERROR' }),
        ])
      )
    })
  })

  describe('findStore', () => {
    // branches
    // =========
    // if process.browser is false then nothing should happen

    // process.browser is true
    //  runs buildStoreAddress
    //  if no address provided then null returned and noStoresFound dispatched and END

    //  calls pollForGoogleService Geocoder
    //  .then call lookupAddress
    //  catches any error returned from pollForGoogleService or lookupAddress

    // calls gecoder.geocode() with callback
    // if GeocoderStatus.OK then carry on else dispatch noStoresFound and END

    // if results returned from geocode are 0 in length dispatch noStoresFound and END

    // call get() with store locator query

    // if error then noStoresFound dispatched and END

    // if stores returned from get() and store found with matching postcode,
    // dispatch selectByStore and receiveStores
    // else return noStoresFound and reject

    let store

    beforeEach(() => {
      global.process.browser = true
      window.google.maps.GeocoderStatus.OK = true
      jest.clearAllMocks()
      const state = {
        storeLocator: {
          stores: [
            {
              storeId: 'TS1234',
              address: {
                line1: 'fake line 1',
                line2: 'fake line 2',
                city: 'fake city',
                postcode: 'fake postcode',
              },
            },
          ],
        },
        features: {
          status: {},
        },
        config: { brandCode: 'tsuk', region: 'uk', siteId: 12556 },
      }
      store = createStore(state)
    })

    afterEach(() => {
      window.google.maps = maps
    })

    it('should call noticeError, if google maps not loaded, and NREUM exists', async () => {
      window.google.maps = undefined
      const noticeError = jest.fn()
      global.NREUM = {
        noticeError,
      }
      const promise = StoreLocatorActions.findStore({
        address2: 'no match 1',
        address3: 'no match 2',
        address4: 'no match city',
        address5: 'no match postcode',
        country: 'no match country',
      })()
      jest.advanceTimersByTime(33000)
      await promise
      expect(noticeError).toHaveBeenCalled()
    })

    it('should dispatch getStoresError if there is an error with get', async () => {
      const lat = 1.1115
      const lng = 2.1234
      window.google.maps.Geocoder = seedGeocoderCoords(lat, lng)
      const url = `/api/store-locator?brandPrimaryEStoreId=12556&latitude=${lat}&longitude=${lng}&deliverToStore=true&types=brand&cfsi=false`

      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(500)

      await store.dispatch(
        StoreLocatorActions.findStore({
          address2: 'no match 1',
          address3: 'no match 2',
          address4: 'no match city',
          address5: 'no match postcode',
          country: 'no match country',
        })
      )

      expect(scope.isDone()).toBe(true)

      const actions = store.getActions()
      const getStoresError = actions.find((a) => a.type === 'GET_STORES_ERROR')

      expect(getStoresError).toBeDefined()
      expect(getStoresError.error.status).toEqual(500)
      expect(actions[actions.length - 2]).toEqual({
        type: 'GET_STORES_LOADING',
        loading: false,
      })
      expect(actions[actions.length - 1]).toEqual({
        type: 'NO_STORES_FOUND',
      })
    })

    it('should dispatch noStoresFound if address does not match store from store-locator', async () => {
      const address = {
        line1: 'fake line 1',
        line2: 'fake line 2',
        city: 'fake city',
        postcode: 'fake postcode',
      }

      const lat = 1.1145
      const lng = 2.1212
      window.google.maps.Geocoder = seedGeocoderCoords(lat, lng)
      const url = `/api/store-locator?brandPrimaryEStoreId=12556&latitude=${lat}&longitude=${lng}&deliverToStore=true&types=brand&cfsi=false`

      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [{ storeId: 'TS1234', address }])

      await store.dispatch(
        StoreLocatorActions.findStore({
          address2: 'no match 1',
          address3: 'no match 2',
          address4: 'no match city',
          address5: 'no match postcode',
          country: 'no match country',
        })
      )

      expect(scope.isDone()).toBe(true)

      const actions = store.getActions()

      expect(actions[actions.length - 1]).toEqual({
        type: 'GET_STORES_LOADING',
        loading: false,
      })
      expect(actions[actions.length - 2]).toEqual({
        type: 'NO_STORES_FOUND',
      })
    })

    it('should dispatch noStoresFound if address postcode does not match', async () => {
      const address = {
        line1: 'fake line 1',
        line2: 'fake line 2',
        city: 'fake city',
        postcode: 'fake postcode',
      }

      const lat = 52.8901
      const lng = 98.3485
      window.google.maps.Geocoder = seedGeocoderCoords(lat, lng)
      const url = `/api/store-locator?brandPrimaryEStoreId=12556&latitude=${lat}&longitude=${lng}&deliverToStore=true&types=brand&cfsi=false`
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [{ address }])

      await store.dispatch(
        StoreLocatorActions.findStore({
          address2: 'no match 1',
          address3: 'no match 2',
          address5: 'no match postcode',
          country: 'no match country',
        })
      )

      expect(scope.isDone()).toBe(true)

      const actions = store.getActions()
      expect(actions[actions.length - 1]).toEqual({
        type: 'GET_STORES_LOADING',
        loading: false,
      })
      expect(actions[actions.length - 2]).toEqual({
        type: 'NO_STORES_FOUND',
      })
    })

    it('should dispatch noStoresFound if address is missing', async () => {
      await store.dispatch(StoreLocatorActions.findStore())
      const actions = store.getActions()

      expect(actions).toEqual([
        {
          type: 'NO_STORES_FOUND',
        },
      ])
    })

    it('should dispatch SET_DELIVERY_STORE_WITH_DETAILS action', async () => {
      const storeId = 'TS1234'
      const address = {
        line1: 'fake line 1',
        line2: 'fake line 2',
        city: 'fake city',
        postcode: 'fake postcode',
      }
      const mockStore = {
        storeId,
        address,
      }

      const lat = 40.4325
      const lng = 54.8439
      window.google.maps.Geocoder = seedGeocoderCoords(lat, lng)

      const url = `/api/store-locator?brandPrimaryEStoreId=12556&latitude=${lat}&longitude=${lng}&deliverToStore=true&types=brand&cfsi=false`

      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, [mockStore])

      await store.dispatch(
        StoreLocatorActions.findStore({
          address2: 'fake line 1',
          address3: 'fake line 2',
          address4: 'fake city',
          address5: 'fake postcode',
          country: 'fake country',
        })
      )

      expect(scope.isDone()).toBe(true)

      const actions = store.getActions()

      const targetAction = actions.find(
        (a) => a.type === 'SET_DELIVERY_STORE_WITH_DETAILS'
      )

      expect(targetAction).toBeDefined()
      expect(targetAction.store).toEqual(mockStore)
    })
  })

  describe('setMarkerIcon', () => {
    const dispatchMock = jest.fn()
    const getStateMock = () => ({
      storeLocator: {
        stores: [
          {
            brandName: 'Topshop',
            storeId: 'TS0001',
          },
          {
            brandName: 'Hermes',
            storeId: 'S08313',
          },
        ],
      },
      config: {
        brandName: 'topshop',
        logoVersion: '2',
      },
    })

    it('should set store markers for Arcadia stores', () => {
      const savedWindow = global.window
      global.window.markers = [{ setIcon: jest.fn() }]

      StoreLocatorActions.setMarkerIcon(0)(dispatchMock, getStateMock)
      expect(global.window.markers[0].setIcon).toHaveBeenCalledWith({
        anchor: {},
        scaledSize: {},
        size: {},
        url: '/assets/topshop/images/store-marker-icon.svg?version=2',
      })
      global.window = savedWindow
    })

    it('should set store markers for Hermes stores', () => {
      const savedWindow = global.window
      global.window.markers = [{}, { setIcon: jest.fn() }]

      StoreLocatorActions.setMarkerIcon(1)(dispatchMock, getStateMock)
      expect(global.window.markers[1].setIcon).toHaveBeenCalledWith({
        anchor: {},
        scaledSize: {},
        size: {},
        url: '/assets/topshop/images/parcelshop-marker-icon.svg?version=2',
      })
      global.window = savedWindow
    })
  })

  describe('getCountries', () => {
    it('fetches countries', async () => {
      const store = createStore({
        config: { siteId: 12556 },
        features: { status: { FEATURE_CFSI: true } },
      })
      const country = ['United Kingdom']
      const url = '/api/stores-countries?brandPrimaryEStoreId=12556&cfsi=true'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(200, country)

      await store.dispatch(StoreLocatorActions.getCountries())

      expect(scope.isDone()).toBe(true)
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'SET_COUNTRIES',
            countries: country,
          }),
        ])
      )
    })
    it('handles a 500 error', async () => {
      const store = createStore({
        config: { siteId: 12556 },
        features: { status: { FEATURE_CFSI: true } },
      })

      const url = '/api/stores-countries?brandPrimaryEStoreId=12556&cfsi=true'
      const scope = nock('http://localhost:3000')
        .get(url)
        .reply(500)

      await store.dispatch(StoreLocatorActions.getCountries())

      expect(scope.isDone()).toBe(true)
    })
  })

  describe('signStaticMapsUrl()', () => {
    it('on success it should pass url and signature to cb function', async () => {
      const cb = jest.fn()
      const store = createStore()
      const args = {
        currentLat: 50,
      }
      const response = {
        url: 'test.url',
        signature: 'test.signature',
      }
      const scope = nock('http://localhost:3000')
        .post('/api/static-map', args)
        .reply(200, response)

      await store.dispatch(StoreLocatorActions.signStaticMapsUrl(args, cb))

      expect(scope.isDone()).toBe(true)
      expect(cb).toHaveBeenCalledWith(response)
    })
    it('on api error should fallback to unsigned url', async () => {
      const cb = jest.fn()
      const store = createStore()
      const params = {
        currentLat: 1,
        currentLng: 2,
        markers: [],
        dimensions: { width: 362, height: 650 },
        iconDomain: 'static.topshop.com',
        zoom: 1,
      }
      const response = {}
      const scope = nock('http://localhost:3000')
        .post('/api/static-map', params)
        .reply(500, response)

      await store.dispatch(StoreLocatorActions.signStaticMapsUrl(params, cb))

      expect(scope.isDone()).toBe(true)
      expect(cb).toHaveBeenCalledWith({
        url: 'test.static.url',
        signature: '',
      })
    })
  })

  describe('initMapWhenGoogleMapsAvailable', () => {
    beforeEach(() => {
      window.map = undefined
    })

    let google
    const setupTest = () => {
      const store = createStore()
      google = window.google
      window.google = undefined
      window.loadScript = jest.fn()
      window.GOOGLE_API_KEY = '__GOOGLE_API_KEY__'
      const googleMapsKey = window.GOOGLE_API_KEY
      const lang = getLang(store.getState())
      const region = getRegion(store.getState())

      return {
        store,
        lang,
        region,
        googleMapsKey,
      }
    }

    const mockLoadGoogleMapsLib = ({ error } = { error: false }) => {
      window.google = google
      if (error) {
        window.loadScript.mock.calls[0][0].onerror()
      } else {
        window.loadScript.mock.calls[0][0].onload()
      }
    }

    it('should not run in a server context', () => {
      const store = createStore()
      const browser = process.browser
      process.browser = false

      const result = store.dispatch(
        StoreLocatorActions.initMapWhenGoogleMapsAvailable()
      )

      expect(result).toBeUndefined()

      process.browser = browser
    })

    it('should fail if Google Maps library is not available', async () => {
      const { store } = setupTest()

      const promise = store.dispatch(
        StoreLocatorActions.initMapWhenGoogleMapsAvailable()
      )

      mockLoadGoogleMapsLib({ error: true })

      await expect(() => promise).rejects.toBe(
        'Unfortunately, we were unable to load the map.'
      )

      window.google = google
    })

    it('should fetch the Google Maps lib if not already loaded', async () => {
      const { store, lang, region, googleMapsKey } = setupTest()

      const promise = store.dispatch(StoreLocatorActions.loadGoogleMapScript())

      expect(window.loadScript).toHaveBeenCalledWith({
        id: 'googleMapsScript',
        defer: true,
        isAsync: true,
        src: `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places&language=${lang}&region=${region}`,
        onload: expect.any(Function),
        onerror: expect.any(Function),
      })

      mockLoadGoogleMapsLib()

      await promise
    })

    it('should return the created map if Google Maps is available', async () => {
      const store = createStore()
      const google = window.google.maps.Map
      function MockGoogleMap() {}
      window.google.maps.Map = MockGoogleMap
      // const mockInitMapWhenGoogleMapsAvailable = jest.fn()
      const result = await store.dispatch(
        StoreLocatorActions.initMapWhenGoogleMapsAvailable()
      )

      expect(result).toBeInstanceOf(MockGoogleMap)

      window.google.maps.Map = google
    })
  })
})
