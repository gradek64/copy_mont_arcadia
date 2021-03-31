import reducer, {
  getSelectedBrandFulfilmentStore,
} from '../selectedBrandFulfilmentStore'
import { setSelectedBrandFulfilmentStore } from '../../../actions/common/selectedBrandFulfilmentStoreActions'

const store = {
  storeId: 'TS0723',
  brandPrimaryEStoreId: 12556,
  brandName: 'Topshop',
  name: 'Birmingham Bullring',
  distance: 0.59,
  latitude: 52.477851,
  longitude: -1.892896,
  address: {
    line1: 'Unit Msu2b',
    line2: 'New Bull Ring Centre',
    city: 'Birmingham',
    postcode: 'B5 4BF',
  },
  openingHours: {
    monday: '10:00-20:00',
    tuesday: '10:00-20:00',
    wednesday: '10:00-20:00',
    thursday: '10:00-20:00',
    friday: '10:00-20:00',
    saturday: '09:00-20:00',
    sunday: '10:30-17:00',
  },
  telephoneNumber: '01216 430348',
  collectFromStore: {
    standard: {
      dates: [
        {
          availableUntil: '2018-01-15 11:30:00',
          collectFrom: '2018-01-18',
        },
        {
          availableUntil: '2018-01-16 11:30:00',
          collectFrom: '2018-01-19',
        },
        {
          availableUntil: '2018-01-17 11:30:00',
          collectFrom: '2018-01-20',
        },
      ],
      price: 0,
    },
    express: {
      dates: [
        {
          availableUntil: '2018-01-15 20:30:00',
          collectFrom: '2018-01-16',
        },
        {
          availableUntil: '2018-01-16 20:30:00',
          collectFrom: '2018-01-17',
        },
        {
          availableUntil: '2018-01-17 20:30:00',
          collectFrom: '2018-01-18',
        },
      ],
      price: 3,
    },
  },
  cfsiAvailableOn: '',
  ffsAvailableOn: '',
  cfsiPickCutOffTime: '15:00:00',
  stockList: [
    {
      sku: '602017001185035',
      stock: 0,
      stockSymbol: 'O',
    },
  ],
  basketInStock: false,
}

describe('selectedFulfilmentStore reducer', () => {
  it('defaults to empty object', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('sets a fulfilment brand store', () => {
    const newState = reducer(undefined, setSelectedBrandFulfilmentStore(store))
    expect(newState).toEqual(store)
    expect(newState).not.toBe(store)
  })

  describe('getSelectedBrandFulfilmentStore', () => {
    it('returns the selectedBrandFulfilmentStore', () => {
      expect(
        getSelectedBrandFulfilmentStore({ selectedBrandFulfilmentStore: store })
      ).toEqual(store)
    })
  })
})
