import { getStoresHandler, getCountriesHandler } from '../store-locator-handler'
import { getStores, getCountries } from '../lib/store-locator-service'

jest.mock('../lib/store-locator-service')

describe('store-locator-handler', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('@getStoresHandler', () => {
    it('reply with stores in UK (200)', async () => {
      const stores = [
        {
          name: 'mockedStore1',
          distance: 1,
        },
        {
          name: 'mockedStore2',
          distance: 1.6,
        },
      ]
      const convertedStores = [
        {
          name: 'mockedStore1',
          distance: '0.62',
        },
        {
          name: 'mockedStore2',
          distance: '0.99',
        },
      ]
      const request = {
        query: {
          region: 'uk',
        },
      }
      const code = jest.fn()
      const reply = jest.fn(() => ({ code }))

      getStores.mockImplementation(jest.fn(() => Promise.resolve(stores)))

      expect(reply).toHaveBeenCalledTimes(0)
      expect(code).toHaveBeenCalledTimes(0)
      await getStoresHandler(request, reply)
      expect(reply).toHaveBeenCalledTimes(1)
      expect(reply).toHaveBeenCalledWith(convertedStores)
      expect(code).toHaveBeenCalledTimes(1)
      expect(code).toHaveBeenCalledWith(200)
    })

    it('reply with stores (200)', async () => {
      const stores = 'mockedStores'
      const request = {
        query: {
          region: 'international',
        },
      }
      const code = jest.fn()
      const reply = jest.fn(() => ({ code }))

      getStores.mockImplementation(jest.fn(() => Promise.resolve(stores)))

      expect(reply).toHaveBeenCalledTimes(0)
      expect(code).toHaveBeenCalledTimes(0)
      await getStoresHandler(request, reply)
      expect(reply).toHaveBeenCalledTimes(1)
      expect(reply).toHaveBeenCalledWith(stores)
      expect(code).toHaveBeenCalledTimes(1)
      expect(code).toHaveBeenCalledWith(200)
    })

    it('reply with error (400)', async () => {
      const error = 'mockedError'
      const code = jest.fn()
      const request = {
        query: {},
      }
      const reply = jest.fn(() => ({ code }))

      getStores.mockImplementation(jest.fn(() => Promise.reject(error)))

      expect(reply).toHaveBeenCalledTimes(0)
      expect(code).toHaveBeenCalledTimes(0)
      await getStoresHandler(request, reply)
      expect(reply).toHaveBeenCalledTimes(1)
      expect(reply).toHaveBeenCalledWith({ error })
      expect(code).toHaveBeenCalledTimes(1)
      expect(code).toHaveBeenCalledWith(400)
    })

    it('reply with error code from response', async () => {
      const error = { message: 'foo', statusCode: 500 }
      const code = jest.fn()
      const request = {
        query: {},
      }
      const reply = jest.fn(() => ({ code }))
      getStores.mockImplementation(jest.fn(() => Promise.reject(error)))

      await getStoresHandler(request, reply)

      expect(reply).toHaveBeenCalledWith({ error: error.message })
      expect(code).toHaveBeenCalledWith(error.statusCode)
    })

    describe('StoresHandler query validation', () => {
      const mockedError = { error: 'Invalid store-locator query' }
      const mockedStores = [{ storeId: 'TS0003' }]

      const cases = [
        [{ brand: '12345' }, 200],
        [{ brand: '123' }, 400],
        [{ brandPrimaryEStoreId: '56789' }, 200],
        [{ brandPrimaryEStoreId: 'Topshop' }, 400],
        [{ latitude: '90.0', longitude: '-90.0' }, 200],
        [{ latitude: 'north', longitude: '-90.0' }, 400],
        [{ country: 'United Kingdom' }, 200],
        [{ country: 'Number 1' }, 400],
        [{ sku: '123456' }, 200],
        [{ sku: '123456A' }, 400],
        [{ skuList: '12345678,456786787865' }, 200],
        [{ skuList: '1234A5678, AU20029' }, 400],
        [{ basketDetails: '123456789:12, 2345236456:1,56567855:8' }, 200],
        [{ basketDetails: '123456789:, 2345236456:1' }, 400],
        [{ deliverToStore: 'true' }, 200],
        [{ deliverToStore: 'test' }, 400],
        [{ storeIds: 'TS2345, S12345' }, 200],
        [{ storeIds: 'TS2345, SP2312345' }, 400],
        [{ types: 'today,brand,parcel' }, 200],
        [{ types: 'today,brand,parcel, other, other' }, 400],
        [{ cfsi: 'true' }, 200],
        [{ cfsi: '' }, 400],
        [
          {
            latitude: '51.50732',
            longitude: '-0.12764746',
            brandPrimaryEStoreId: '12556',
            deliverToStore: 'true',
            types: 'brand,other',
            cfsi: 'true',
            basketDetails: '602017001149787:1',
          },
          200,
        ],
        [
          {
            latitude: '51.50732',
            longitude: '-0.12764746',
            brandPrimaryEStoreId: '12556',
            deliverToStore: 'true',
            types: 'brand,other',
            cfsi: 'true',
            basketDetails: '602017001149787:1000000000000000',
          },
          400,
        ],
      ]

      test.each(cases)('query %j expects %j', async (query, statusCode) => {
        const code = jest.fn()
        const reply = jest.fn(() => ({ code }))
        getStores.mockImplementation(
          jest.fn(() => Promise.resolve(mockedStores))
        )

        await getStoresHandler({ query }, reply)

        expect(code).toHaveBeenCalledWith(statusCode)
        if (statusCode === 400) expect(reply).toHaveBeenCalledWith(mockedError)
        else expect(reply).toHaveBeenCalledWith(mockedStores)
      })
    })
  })

  describe('@getCountriesHandler', () => {
    it('reply with countries', async () => {
      const countries = 'mockedCountries'
      const request = { query: {} }
      const code = jest.fn()
      const reply = jest.fn(() => ({ code }))

      getCountries.mockImplementation(jest.fn(() => Promise.resolve(countries)))

      expect(reply).toHaveBeenCalledTimes(0)
      expect(code).toHaveBeenCalledTimes(0)
      await getCountriesHandler(request, reply)
      expect(reply).toHaveBeenCalledTimes(1)
      expect(reply).toHaveBeenCalledWith(countries)
      expect(code).toHaveBeenCalledTimes(1)
      expect(code).toHaveBeenCalledWith(200)
    })

    it('reply with error (400)', async () => {
      const error = 'mockedError'
      const code = jest.fn()
      const request = {
        query: {},
      }
      const reply = jest.fn(() => ({ code }))

      getCountries.mockImplementation(jest.fn(() => Promise.reject(error)))

      expect(reply).toHaveBeenCalledTimes(0)
      expect(code).toHaveBeenCalledTimes(0)
      await getCountriesHandler(request, reply)
      expect(reply).toHaveBeenCalledTimes(1)
      expect(reply).toHaveBeenCalledWith({ error })
      expect(code).toHaveBeenCalledTimes(1)
      expect(code).toHaveBeenCalledWith(400)
    })

    it('reply with error code from response', async () => {
      const error = { message: 'foo', statusCode: 500 }
      const code = jest.fn()
      const request = {
        query: {},
      }
      const reply = jest.fn(() => ({ code }))
      getCountries.mockImplementation(jest.fn(() => Promise.reject(error)))

      await getCountriesHandler(request, reply)

      expect(reply).toHaveBeenCalledWith({ error: error.message })
      expect(code).toHaveBeenCalledWith(error.statusCode)
    })
  })
})
