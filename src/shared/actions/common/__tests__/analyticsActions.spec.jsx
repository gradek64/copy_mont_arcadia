import * as acc from '../analyticsActions'
import * as checkoutSelectors from '../../../selectors/checkoutSelectors'

describe('Analytics Actions and Reducers', () => {
  const isReturningCustomerSpy = jest.spyOn(
    checkoutSelectors,
    'isReturningCustomer'
  )

  beforeAll(() => {
    global.s = {
      Util: {
        cookieWrite: jest.fn(),
      },
    }
  })

  afterEach(() => {
    isReturningCustomerSpy.mockReset()
  })

  afterAll(() => {
    isReturningCustomerSpy.mockRestore()
  })

  describe('pageLoaded', () => {
    const dispatchMock = jest.fn()
    const getStateMock = jest.fn(() => ({
      debug: {
        buildInfo: 'HELLO',
      },
      routing: {
        visited: ['/', '/another/page'],
      },
    }))

    afterEach(() => {
      dispatchMock.mockClear()
    })

    it('should dispatch `PAGE_LOADED` action, with `page` and `loadTime`', () => {
      const pageLoadedAction = acc.pageLoaded('home', 2431, true)
      pageLoadedAction(dispatchMock, getStateMock)
      const { type, payload } = dispatchMock.mock.calls[0][0]
      expect(type).toBe('PAGE_LOADED')
      expect(payload).toEqual(
        expect.objectContaining({
          pageName: 'home',
          loadTime: 2431,
        })
      )
    })
  })
})
