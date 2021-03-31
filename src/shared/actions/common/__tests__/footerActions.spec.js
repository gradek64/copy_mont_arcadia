import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import { getFooterContent } from '../footerActions'
import { setGenericError, setApiError } from '../errorMessageActions'
import { get } from '../../../lib/api-service'

// import footerCategoriesMock from '../../../../../test/mocks/footerCategories.json'
import { footer, wrongFooter } from '../../../../../test/mocks/footer'

// Note: we should only mock specific methods we need
jest.mock('../errorMessageActions', () => ({
  setGenericError: jest.fn(),
  setApiError: jest.fn(),
}))
jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
}))

describe('Navigation Actions', () => {
  const initialState = {
    viewport: {
      media: 'desktop',
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
        case '/footers':
          return Promise.resolve({
            type: 'MOCK_get_footerCategories',
            body: footer,
          })
        default:
          return Promise.resolve({})
      }
    })
    jest.clearAllMocks()
    // important to clearActions to avoid concatenation
    store.clearActions()
  })

  describe('`getFooterContent`', () => {
    it('should call SET_FOOTER_CATEGORIES and SET_FOOTER_NEWSLETTER when success', () => {
      return store.dispatch(getFooterContent()).then(() => {
        const expectedActions = [
          {
            type: 'SET_FOOTER_CATEGORIES',
            footerCategories: footer.pageData[0].data.categories,
          },
          {
            type: 'SET_FOOTER_NEWSLETTER',
            newsletter: footer.pageData[0].data.newsletter,
          },
        ]
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    // NOTE: we can't check the error until scrapi is active
    xit('should return a error if the template is not well formatter', () => {
      get.mockImplementationOnce(() => () =>
        Promise.resolve({
          type: 'MOCK_get_footerCategories',
          body: wrongFooter,
        })
      )
      return store.dispatch(getFooterContent()).then(() => {
        expect(store.getActions()).toEqual([{ type: 'MOCK_setGenericError' }])
      })
    })

    // DEPRECATED, ON SERVER SIDE IS NEVER MOBILE
    it('should not call SET_FOOTER_CATEGORIES when is mobile', () => {
      const initialState = {
        viewport: {
          media: 'mobile',
        },
      }
      const store = mockStoreCreator(initialState)
      return store.dispatch(getFooterContent()).then(() => {
        expect(store.getActions().length).toBe(0)
      })
    })
  })
})
