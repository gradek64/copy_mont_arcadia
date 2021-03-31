import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import { getSiteOptions } from '../siteOptionsActions'
import { get } from '../../../lib/api-service'

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
}))

describe('getSiteOptions', () => {
  const initialState = {
    USStates: [],
    expiryYears: [],
    expiryMonths: [],
    peakService: false,
    billingCountries: [],
    titles: [],
    currencyCode: '',
    version: '',
    title: '',
    keyword: '',
    description: '',
  }
  const store = mockStoreCreator(initialState)

  beforeEach(() => {
    const getMock = () => {
      const p = Promise.resolve({ body: {} })
      p.type = 'siteOps'
      return p
    }
    get.mockImplementationOnce(getMock)
    jest.clearAllMocks()
    store.clearActions()
  })

  it('should call `setSiteOptions` on success', () => {
    return store.dispatch(getSiteOptions()).then(() => {
      const expectedActions = [
        {
          type: 'SET_SITE_OPTIONS',
          siteOptions: {},
        },
      ]
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })
  })
})
