import reducerWithStorage, { reducer } from '../shippingDestinationReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import mockdate from 'mockdate'

describe('Shipping Destination Reducer', () => {
  beforeAll(() => {
    mockdate.set('1/1/2019')
  })

  afterAll(() => {
    mockdate.reset()
  })

  describe('decorated reducer withStorage', () => {
    it('should set destination with lastPersistTime', () => {
      expect(
        reducerWithStorage(
          { destination: 'USA' },
          {
            type: 'SET_SHIPPING_DESTINATION',
            destination: 'Poland',
          }
        )
      ).toEqual({
        destination: 'Poland',
        lastPersistTime: 1546300800000,
      })
    })

    it('should set language with lastPersistTime', () => {
      expect(
        reducerWithStorage(
          { language: 'English' },
          {
            type: 'SET_LANGUAGE',
            language: 'French',
          }
        )
      ).toEqual({
        language: 'French',
        lastPersistTime: 1546300800000,
      })
    })
  })

  describe('reducer', () => {
    it('Default values', () => {
      const state = configureMockStore().getState()
      expect(state.shippingDestination.destination).toBe('')
      expect(state.shippingDestination.language).toBe('')
    })
    describe('SET_SHIPPING_DESTINATION', () => {
      it('should set destination', () => {
        expect(
          reducer(
            { destination: 'USA' },
            {
              type: 'SET_SHIPPING_DESTINATION',
              destination: 'Poland',
            }
          )
        ).toEqual({
          destination: 'Poland',
        })
      })
    })

    describe('SET_LANGUAGE', () => {
      it('should set language', () => {
        expect(
          reducer(
            { language: 'english' },
            {
              type: 'SET_LANGUAGE',
              language: 'polish',
            }
          )
        ).toEqual({
          language: 'polish',
        })
      })
    })
  })
})
