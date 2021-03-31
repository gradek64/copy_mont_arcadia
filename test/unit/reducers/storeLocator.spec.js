import assert from 'assert'
import nock from 'nock'
import { uniq } from 'ramda'

import configureMockStore from '../lib/configure-mock-store'
import configureStore from '../../../src/shared/lib/configure-store'

import { browserHistory } from 'react-router'
import * as actions from '../../../src/shared/actions/components/StoreLocatorActions'

import countriesMock from '../../mocks/countriesWithStores'

const { storeSearch, selectStore, deselectStore } = actions

const fakeStore = {
  storeId: '123',
  name: 'Megastore',
  distance: '0.82',
  latitude: '51.5157',
  longitude: '-0.141396',
  address: {
    line1: '214 Oxford Street',
    line2: 'Oxford Circus',
    city: 'Greater London',
    postcode: 'W1W 8LG',
  },
  openingHours: {
    monday: '10:00-21:00',
    tuesday: '10:00-21:00',
    wednesday: '10:00-21:00',
    thursday: '10:00-21:00',
    friday: '10:00-21:00',
    saturday: '11:00-21:00',
    sunday: '12:00-18:00',
  },
  telephoneNumber: '03448 487487',
}

let originalBrowser

describe('storeLocatorActions', () => {
  beforeAll(() => {
    originalBrowser = process.browser
    Object.defineProperty(process, 'browser', {
      value: true,
    })
  })

  afterAll(() => {
    Object.defineProperty(process, 'browser', {
      value: originalBrowser,
    })
  })

  it('storeSearch fetches and saves stores', (done) => {
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
      },
    })
    nock('http://localhost:3000')
      .get('/api/store-locator?brand=12556&latitude=12&longitude=22&cfsi=false')
      .reply(200, [fakeStore])

    store.dispatch(
      storeSearch({ search: '?brand=12556&latitude=12&longitude=22' })
    )

    store.subscribeUntilPasses(() => {
      assert.deepEqual(store.getState().storeLocator.stores, [fakeStore])
      done()
    })
  })

  it('selectStore saves selected index', () => {
    const store = configureStore({
      config: {
        brandCode: 'tsuk',
        brandName: 'topshop',
      },
      storeLocator: {
        mapExpanded: true,
        selectedStoreIndex: 1,
        stores: [
          fakeStore,
          { ...fakeStore, storeId: 124 },
          { ...fakeStore, storeId: 125 },
        ],
      },
    })
    const selectedStore = 2
    const fakeMarker = {
      getPosition() {},
      setMap() {},
      setIcon() {},
      setZIndex() {},
    }
    global.window.markers = [fakeMarker, fakeMarker, fakeMarker]
    store.dispatch(selectStore(selectedStore))
    expect(store.getState().storeLocator.selectedStoreIndex).toEqual(
      selectedStore
    )
    expect(store.getState().storeLocator.mapExpanded).toBeFalsy()
  })

  it('deselectStore deselects selected store', (done) => {
    const store = configureMockStore({
      storeLocator: {
        selectedStoreIndex: 1,
        stores: [fakeStore, fakeStore, fakeStore],
      },
      config: {
        brandName: 'topshop',
      },
    })
    store.subscribeUntilPasses(() => {
      assert.equal(store.getState().storeLocator.selectedStoreIndex, undefined)
      done()
    })
    store.dispatch(deselectStore())
  })

  it('storeSearch fetches and sets no stores found when empty store list returned', (done) => {
    // actions.__Rewire__('trackStoreLocatorSearch', () => ({ type: 'NOOP' }))
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
      },
    })
    nock('http://localhost:3000')
      .get(
        '/api/store-locator?brand=topshop&latitude=12&longitude=22&cfsi=false'
      )
      .reply(200, [])

    store.dispatch(
      storeSearch({ search: '?brand=topshop&latitude=12&longitude=22' })
    )

    store.subscribeUntilPasses(() => {
      assert.deepEqual(store.getState().storeLocator.stores, [])
      assert.deepEqual(store.getState().storeLocator.noStoresFound, true)
      done()
    })
  })

  it('hideFiltersError hides error', (done) => {
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
      },
      storeLocator: {
        filtersErrorDisplayed: true,
      },
    })
    store.subscribeUntilPasses(() => {
      assert.deepEqual(
        store.getState().storeLocator.filtersErrorDisplayed,
        false
      )
      done()
    })
    store.dispatch(actions.hideFiltersError())
  })

  it('showFiltersError shows error', (done) => {
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
      },
      storeLocator: {
        filtersErrorDisplayed: false,
      },
    })
    store.subscribeUntilPasses(() => {
      assert.deepEqual(
        store.getState().storeLocator.filtersErrorDisplayed,
        true
      )
      done()
    })
    store.dispatch(actions.showFiltersError())
  })

  it('resizeMap triggers resize', () => {
    global.window.google.maps = { event: { trigger: jest.fn() } }
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
      },
    })
    store.dispatch(actions.resizeMap())
    expect(global.window.google.maps.event.trigger).toHaveBeenCalledWith(
      global.window.map,
      'resize'
    )
  })

  it('setFilterSelected selects a filter', (done) => {
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
      },
      storeLocator: {
        filters: {
          fakeFilter: {
            selected: false,
          },
        },
      },
    })
    store.subscribeUntilPasses(() => {
      assert.deepEqual(
        store.getState().storeLocator.filters.fakeFilter.selected,
        true
      )
      done()
    })
    store.dispatch(actions.setFilterSelected('fakeFilter', true))
  })

  it('applySelectedFilters applies selected filters', (done) => {
    jest.spyOn(browserHistory, 'push').mockImplementation(() => {})
    const store = configureMockStore({
      config: {
        brandCode: 'tsuk',
        brandName: 'topshop',
      },
      storeLocator: {
        filters: {
          fakeFilter: {
            selected: false,
            applied: false,
          },
          fakeFilter2: {
            selected: true,
            applied: false,
          },
        },
        stores: [],
      },
    })
    store.subscribeUntilPasses(() => {
      assert.deepEqual(
        store.getState().storeLocator.filters.fakeFilter.applied,
        false
      )
      assert.deepEqual(
        store.getState().storeLocator.filters.fakeFilter2.applied,
        true
      )
      done()
    })
    store.dispatch(actions.applySelectedFilters())
  })

  it('setStoreLocatorQuery() saves the query', () => {
    const store = configureMockStore({
      storeLocator: {
        filters: {},
        stores: [],
        query: undefined,
      },
    })
    const query = {
      types: 'brand,other,parcel',
      latitude: 1.39,
      longitude: 75.34,
    }
    store.dispatch(actions.setStoreLocatorQuery(query))
    expect(store.getState().storeLocator.query).toEqual(query)
  })

  it('SET_COUNTRIES', () => {
    const store = configureMockStore()
    store.dispatch(actions.setCountries(countriesMock))
    expect(store.getState().storeLocator.countries.length).toBe(
      countriesMock.length
    )
  })

  it('getCountries action dispatches setCountries action', async () => {
    const store = configureMockStore()
    nock('http://localhost:3000')
      .get(/\/api\/stores-countries\?brandPrimaryEStoreId=(.*)/)
      .reply(200, countriesMock)

    await store.dispatch(actions.getCountries())

    expect(store.getState().storeLocator.countries).toEqual(uniq(countriesMock))
  })

  it('selectCountry saves country', (done) => {
    const store = configureMockStore()
    store.subscribeUntilPasses(() => {
      assert.deepEqual(store.getState().storeLocator.selectedCountry, 'Spain')
      done()
    })
    store.dispatch(actions.selectCountry('Spain'))
  })
})
