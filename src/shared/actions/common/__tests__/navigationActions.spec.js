import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import {
  getMegaNav,
  setMegaNavSelectedCategory,
  setMegaNavHeight,
} from '../navigationActions'
import { setNavigationEspots } from '../espotActions'

import TSMegaNavMock from '../../../../../test/mocks/TS-MegaNav-Mock.json'

import { setGenericError, setApiError } from '../errorMessageActions'
import { get } from '../../../lib/api-service'

// Note: we should only mock specific methods we need
jest.mock('../errorMessageActions', () => ({
  setGenericError: jest.fn(),
  setApiError: jest.fn(),
}))
jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
}))

jest.mock('../espotActions', () => ({
  setNavigationEspots: jest.fn(),
}))
describe('Navigation Actions', () => {
  const initialState = {
    viewport: {
      media: 'desktop',
    },
    espot: {
      identifiers: {
        navigation: ['some-global-espot'],
      },
    },
  }
  const store = mockStoreCreator(initialState)
  beforeEach(() => {
    // action creators mocks
    // for those external functions which don't return a plain action creator
    // best idea is to mock them all returning a valid action creator { type: 'xxx' }
    setGenericError.mockImplementation(() => ({ type: 'MOCK_setGenericError' }))
    setApiError.mockImplementation(() => ({ type: 'MOCK_setApiError' }))
    // that's default post implementation,
    // if we need to reject then implement then use jest.mockImplementationOnce in that specific test
    get.mockImplementation((url) => () => {
      switch (url) {
        case '/desktop/navigation':
          return Promise.resolve({
            type: 'MOCK_get_MegaNav',
            body: TSMegaNavMock,
          })
        default:
          return Promise.resolve({})
      }
    })
    jest.clearAllMocks()
    // important to clearActions to avoid concatenation
    store.clearActions()
  })

  describe('`getMegaNav`', () => {
    it('should call SET_MEGA_NAV when success', () => {
      return store.dispatch(getMegaNav()).then(() => {
        const expectedAction = [
          {
            type: 'SET_MEGA_NAV',
            megaNav: TSMegaNavMock,
          },
        ]
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
      })
    })
    it('should call SET_MEGA_NAV when is mobile', () => {
      const initialState = {
        viewport: {
          media: 'mobile',
        },
      }
      const store = mockStoreCreator(initialState)
      return store.dispatch(getMegaNav()).then(() => {
        expect(store.getActions().length).toBe(0)
      })
    })

    it('sets global espot', () => {
      get.mockImplementation(() => () =>
        Promise.resolve({ body: 'response body' })
      )
      return store.dispatch(getMegaNav()).then(() => {
        expect(setNavigationEspots).toHaveBeenCalledTimes(1)
        expect(setNavigationEspots).toHaveBeenCalledWith('response body')
      })
    })

    describe('On Failure', () => {
      it('should set Error Form when error message', () => {
        get.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )
        return store.dispatch(getMegaNav()).then(() => {
          const expectedAction = [{ type: 'MOCK_setGenericError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
      it('should set API Error if failure when not error message', () => {
        get.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {},
          })
        )
        return store.dispatch(getMegaNav()).then(() => {
          const expectedAction = [{ type: 'MOCK_setApiError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
    })
  })
  describe('setMegaNavSelectedCategory', () => {
    it('should return action object', () => {
      const megaNavSelectedCategory = true
      expect(setMegaNavSelectedCategory(megaNavSelectedCategory)).toEqual({
        type: 'SET_MEGA_NAV_SELECTED_CATEGORY',
        megaNavSelectedCategory,
      })
    })
  })
  describe('setMegaNavHeight', () => {
    it('should return an action object', () => {
      const megaNavHeight = 0
      expect(setMegaNavHeight(megaNavHeight)).toEqual({
        type: 'SET_MEGA_NAV_HEIGHT',
        megaNavHeight,
      })
    })
  })
})
