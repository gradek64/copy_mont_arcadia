import storeLocatorCountriesMock from '../../mocks/store-locator-countries.json'
import storeLocatorDeliveryStoresRawMock from '../../mocks/store-locator-delivery-stores-raw'
import storeLocatorDeliveryStoresMock from '../../mocks/store-locator-delivery-stores.json'
import storeLocatorDeliveryStoresStockRawMock from '../../mocks/store-locator-delivery-stores-stock-raw'
import storeLocatorDeliveryStoresStockMock from '../../mocks/store-locator-delivery-stores-stock.json'
import storeLocatorStoresMock from '../../mocks/store-locator-stores.json'
import storeLocatorStoresRawMock from '../../mocks/store-locator-stores-raw'
import storeLocatorSingleStoreMock from '../../mocks/store-locator-store.json'
import storeLocatorSingleStoreRawMock from '../../mocks/store-locator-store-raw'
import * as storeLocatorService from '../store-locator-service'
import superagent from '../../../../shared/lib/superagent'
import ramda from 'ramda'
import * as configUtils from '../../../config'

const { getCountries, getStores } = storeLocatorService

jest.mock('../../../../shared/lib/superagent', () => ({
  get: jest.fn(),
}))

jest.mock('../../../config')

const mockCountries = [
  'Australia',
  'United Kingdom',
  'United States',
  'Vietname',
]

describe('store-locator-service', () => {
  beforeAll(() => {
    global.process.env.API_URL_COUNTRIES = 'https://countriesMockUrl/'
    global.process.env.API_URL_STORE_LOCATOR_V2 = 'https://storesMockUrl/'
  })

  beforeEach(() => {
    global.process.env.CMS_TEST_MODE = false
    configUtils.getSiteConfigs.mockReturnValue([
      {
        siteId: 12556,
        storeId: 'TS3131',
        brandName: 'Topshop',
        region: 'uk',
      },
      {
        siteId: 12556,
        storeId: 'TS3131',
        brandName: 'Topshop',
        region: 'eu',
      },
    ])
  })

  afterAll(() => {
    delete global.process.env.CMS_TEST_MODE
    delete global.process.env.API_URL_COUNTRIES
    delete global.process.env.API_URL_STORE_LOCATOR_V2
    jest.resetAllMocks()
  })

  describe('@getStores', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('return only one store', async () => {
      const params = {
        brand: 12556,
        country: 'Peru',
        types: 'brand,other,parcel',
        cfsi: 'true',
      }

      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve(storeLocatorSingleStoreRawMock))
      )

      await expect(getStores(params)).resolves.toEqual(
        storeLocatorSingleStoreMock
      )
      expect(superagent.get).toHaveBeenCalledWith(
        `${
          global.process.env.API_URL_STORE_LOCATOR_V2
        }?dist=50&res=15&country=${params.country}&brandPrimaryEStoreId=${
          params.brand
        }&jsonp_callback=`
      )
    })

    it('return multiple stores', async () => {
      const params = {
        brand: 12556,
        latitude: 51.5073509,
        longitude: -0.12775829999998223,
        types: 'brand,other,parcel',
        cfsi: 'true',
      }

      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve(storeLocatorStoresRawMock))
      )

      await expect(getStores(params)).resolves.toEqual(storeLocatorStoresMock)
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_STORE_LOCATOR_V2}?lat=${
          params.latitude
        }&long=${params.longitude}&dist=50&res=15&brandPrimaryEStoreId=${
          params.brand
        }&jsonp_callback=`
      )
    })

    it('return multiple stores (brand array)', async () => {
      const params = {
        brand: [12556, 12556],
        latitude: 51.5073509,
        longitude: -0.12775829999998223,
        types: 'brand,other,parcel',
        cfsi: 'true',
      }

      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve(storeLocatorStoresRawMock))
      )

      await expect(getStores(params)).resolves.toEqual(storeLocatorStoresMock)
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_STORE_LOCATOR_V2}?lat=${
          params.latitude
        }&long=${params.longitude}&dist=50&res=15&brandPrimaryEStoreId=${
          params.brand[0]
        }&jsonp_callback=`
      )
    })

    it('return multiple stores (deliverToStore)', async () => {
      const params = {
        brand: 12556,
        latitude: 51.5073509,
        longitude: -0.12775829999998223,
        types: 'brand,other',
        deliverToStore: true,
        dts: true,
        colNow: false,
        colBrand: true,
        colOther: true,
        colHermes: false,
        cfsi: 'true',
      }

      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve(storeLocatorDeliveryStoresRawMock))
      )

      await expect(getStores(params)).resolves.toEqual(
        storeLocatorDeliveryStoresMock
      )
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_STORE_LOCATOR_V2}?lat=${
          params.latitude
        }&long=${params.longitude}&dist=50&res=15&brandPrimaryEStoreId=${
          params.brand
        }&jsonp_callback=&dts=${params.dts}&colBrand=${
          params.colBrand
        }&colOther=${params.colOther}&colHermes=${params.colHermes}&colNow=${
          params.colNow
        }`
      )
    })

    it('return multiple stores (deliverToStore) with basketInStock & stockList props', async () => {
      const params = {
        brand: 12556,
        latitude: 51.5073509,
        longitude: -0.12775829999998223,
        types: 'brand,other',
        deliverToStore: true,
        dts: true,
        colNow: false,
        colBrand: true,
        colOther: true,
        colHermes: false,
        cfsi: 'true',
        basketDetails: '602015000885582:1,602014000798296:1',
      }

      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve(storeLocatorDeliveryStoresStockRawMock))
      )

      await expect(getStores(params)).resolves.toEqual(
        storeLocatorDeliveryStoresStockMock
      )
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_STORE_LOCATOR_V2}?lat=${
          params.latitude
        }&long=${
          params.longitude
        }&dist=50&res=15&basketDetails=${encodeURIComponent(
          params.basketDetails
        )}&brandPrimaryEStoreId=${params.brand}&jsonp_callback=&dts=${
          params.dts
        }&colBrand=${params.colBrand}&colOther=${params.colOther}&colHermes=${
          params.colHermes
        }&colNow=${params.colNow}`
      )
    })

    it('return single store with', async () => {
      const params = {
        brand: 12556,
        storeIds: 'T32712',
        skuList: 298342938429384,
        cfsi: 'true',
      }

      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve(storeLocatorStoresRawMock))
      )

      await expect(getStores(params)).resolves.toEqual(storeLocatorStoresMock)
      expect(superagent.get).toHaveBeenCalledWith(
        `${
          global.process.env.API_URL_STORE_LOCATOR_V2
        }?dist=50&res=15&storeIds=${params.storeIds}&skuList=${
          params.skuList
        }&brandPrimaryEStoreId=${params.brand}&jsonp_callback=`
      )
    })

    const params = {
      brand: 12556,
      longitude: 'invalid',
      latitude: 'invalid',
      types: 'brand,other,parcel',
      cfsi: 'true',
    }
    it('responds ok but error message in JSON should return 400', async () => {
      const mockError = 'mockError'

      superagent.get.mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            text: `({"error":{"message":"${mockError}"}});`,
          })
        )
      )

      await expect(getStores(params)).rejects.toEqual({
        statusCode: 400,
        message: mockError,
      })
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_STORE_LOCATOR_V2}?lat=${
          params.latitude
        }&long=${params.longitude}&dist=50&res=15&brandPrimaryEStoreId=${
          params.brand
        }&jsonp_callback=`
      )
    })

    it('responds ok but invalid response should return 500', async () => {
      superagent.get.mockImplementation(() =>
        Promise.resolve('.asdoh@£$%sjdfoiuwjfwfqd@£R{}We;f{£:')
      )

      await expect(getStores(params)).rejects.toEqual({
        statusCode: 500,
        message: 'Invalid response from server',
      })
    })

    it('return mockStores with CMS_TEST_MODE on', async () => {
      global.process.env.CMS_TEST_MODE = 'true'

      await expect(getStores({})).resolves.toEqual(storeLocatorStoresMock)
    })
  })

  describe('@getCountries', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    const brand = 12556
    const params = { brand }

    it('return countries', async () => {
      superagent.get.mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            text: `({"countries":{"country":["${mockCountries.reduce(
              (acc, val) => `${acc}","${val}`
            )}"]}});`,
          })
        )
      )

      await expect(getCountries({ brand })).resolves.toEqual(mockCountries)
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_COUNTRIES}?brand=${brand}&jsonp_callback=`
      )
    })

    it('throw error', async () => {
      const mockError = 'mockError'
      superagent.get.mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            text: `({"error":{"message":"${mockError}"}});`,
          })
        )
      )

      await expect(getCountries(params)).rejects.toHaveProperty(
        'message',
        mockError
      )
      expect(superagent.get).toHaveBeenCalledWith(
        `${global.process.env.API_URL_COUNTRIES}?brand=${brand}&jsonp_callback=`
      )
    })

    it('responds ok but error message in JSON should return 400', async () => {
      const mockError = 'mockError'

      superagent.get.mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            text: `({"error":{"message":"${mockError}"}});`,
          })
        )
      )

      await expect(getCountries(params)).rejects.toEqual({
        statusCode: 400,
        message: mockError,
      })
    })

    it('responds ok but invalid response should return 500', async () => {
      superagent.get.mockImplementation(() =>
        Promise.resolve('.asdoh@£$%sjdfoiuwjfwfqd@£R{}We;f{£:')
      )

      await expect(getCountries(params)).rejects.toEqual({
        statusCode: 500,
        message: 'Invalid response from server',
      })
    })

    it('return mockCountries with CMS_TEST_MODE on', async () => {
      global.process.env.CMS_TEST_MODE = 'true'

      await expect(getCountries({})).resolves.toBe(storeLocatorCountriesMock)
    })

    it('converts the result from JSONP to JSON', async () => {
      superagent.get.mockImplementation(
        jest.fn(() => Promise.resolve({ text: '{"test": "test"}' }))
      )
      jest.spyOn(ramda, 'path').mockImplementation(
        jest.fn((x, y) => {
          return y
        })
      )

      await expect(getCountries(params)).resolves.toEqual({ test: 'test' })
    })
  })
})
