import testReducer from '../siteOptionsReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import deepFreeze from 'deep-freeze'

describe('Site Options Reducer', () => {
  it('Default values', () => {
    const state = configureMockStore().getState()
    expect(state.siteOptions.USStates).toEqual([])
    expect(state.siteOptions.expiryYears).toEqual([])
    expect(state.siteOptions.expiryMonths).toEqual([])
    expect(state.siteOptions.peakService).toBe(false)
    expect(state.siteOptions.billingCountries).toEqual([])
    expect(state.siteOptions.titles).toEqual([])
    expect(state.siteOptions.currencyCode).toBe('')
    expect(state.siteOptions.version).toBe('')
    expect(state.siteOptions.title).toBe('')
    expect(state.siteOptions.keyword).toBe('')
    expect(state.siteOptions.description).toBe('')
  })
  describe('SET_SITE_OPTIONS', () => {
    it('should set title and description', () => {
      const siteOps = deepFreeze({
        title: 'title',
        description: 'description',
      })
      expect(
        testReducer(
          {},
          {
            type: 'SET_SITE_OPTIONS',
            siteOptions: {
              title: 'title',
              description: 'description',
            },
          }
        )
      ).toEqual(siteOps)
    })
    it('should omit deliveryCountries and creditCardOptions', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_SITE_OPTIONS',
            siteOptions: {
              deliveryCountries: [],
              creditCardOptions: [],
            },
          }
        )
      ).toEqual({})
    })
  })
})
